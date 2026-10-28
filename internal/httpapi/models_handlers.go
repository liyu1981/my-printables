package httpapi

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"

	"myprintables/internal/store"
)

func (s *Server) mountModels(api chi.Router) {
	api.Get("/models", s.handleListModels)
	api.Get("/models/{id}", s.handleGetModel)
	api.Get("/models/{id}/related", s.handleRelated)
	api.Get("/categories", s.handleCategories)
	api.Get("/tags", s.handleTags)
	api.Get("/tags/{slug}", s.handleTag)
	api.Get("/tags/{slug}/models", s.handleTagModels)
	api.Get("/users/{username}", s.handleProfile)
	api.Get("/users/{username}/models", s.handleProfileModels)
	api.Get("/stats", s.handleStats)

	api.Group(func(p chi.Router) {
		p.Use(s.requireAuth)
		p.Use(s.csrf)
		p.Post("/models", s.handleCreateModel)
		p.Patch("/models/{id}", s.handleUpdateModel)
		p.Delete("/models/{id}", s.handleDeleteModel)
		p.Post("/models/{id}/files", s.handleUploadFile)
		p.Delete("/models/{id}/files/{fileID}", s.handleDeleteFile)
		p.Post("/models/{id}/images", s.handleUploadImage)
		p.Delete("/models/{id}/images/{imageID}", s.handleDeleteImage)
		p.Post("/models/{id}/like", s.handleLike)
		p.Delete("/models/{id}/like", s.handleLike)
		p.Post("/models/{id}/bookmark", s.handleBookmark)
		p.Delete("/models/{id}/bookmark", s.handleBookmark)
	})

	// Media content is checked separately, not by the CSRF group.
	api.Get("/models/{id}/files/{fileID}/content", s.handleFileContent)
	api.Get("/models/{id}/images/{imageID}/{variant}", s.handleImageContent)
}

func (s *Server) viewer(r *http.Request) (string, bool) {
	u := currentUser(r)
	if u == nil {
		return "", false
	}
	return u.ID, u.Role == "admin"
}

func (s *Server) canViewModel(r *http.Request, m store.Model) bool {
	u := currentUser(r)
	if u != nil && u.Role == "admin" {
		return true
	}
	if u != nil && u.ID == m.OwnerID {
		return true
	}
	if s.st.Setting("require_login_to_browse", "false") == "true" && u == nil {
		return false
	}
	if m.Status != "published" {
		return false
	}
	switch m.Visibility {
	case "public":
		return true
	case "members":
		return u != nil
	default:
		return false
	}
}

func (s *Server) loadViewableModel(w http.ResponseWriter, r *http.Request, id string) (store.Model, bool) {
	viewer, _ := s.viewer(r)
	m, err := s.st.ModelByID(r.Context(), id, viewer)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Model not found.")
		return m, false
	}
	if !s.canViewModel(r, m) {
		writeErr(w, http.StatusNotFound, "not_found", "Model not found.")
		return m, false
	}
	return m, true
}

func (s *Server) handleListModels(w http.ResponseWriter, r *http.Request) {
	viewer, admin := s.viewer(r)
	q := r.URL.Query()
	page := intQuery(q.Get("page"), 1)
	perPage := intQuery(q.Get("perPage"), 24)
	f := store.ModelFilter{
		Q: q.Get("q"), Category: q.Get("category"), Tag: q.Get("tag"), FileType: q.Get("fileType"),
		Owner: q.Get("owner"), Sort: q.Get("sort"), Page: page, PerPage: perPage,
		ViewerID: viewer, ViewerAdmin: admin,
		RequireLogin: s.st.Setting("require_login_to_browse", "false") == "true",
		Featured: q.Get("featured") == "1" || q.Get("featured") == "true",
		Mine: q.Get("mine") == "1" || q.Get("mine") == "true",
	}
	if f.Mine && viewer == "" {
		writeErr(w, http.StatusUnauthorized, "unauthorized", "Sign in required.")
		return
	}
	res, err := s.st.ListModels(r.Context(), f)
	if err != nil {
		s.log.Error("list models", "error", err)
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load models.")
		return
	}
	writeJSON(w, http.StatusOK, res)
}

func (s *Server) handleGetModel(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	m, ok := s.loadViewableModel(w, r, id)
	if !ok {
		return
	}
	s.st.IncrementView(r.Context(), m.ID)
	u := currentUser(r)
	writeJSON(w, http.StatusOK, map[string]any{
		"model":   m,
		"canEdit": u != nil && (u.ID == m.OwnerID || u.Role == "admin"),
	})
}

func (s *Server) handleRelated(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if _, ok := s.loadViewableModel(w, r, id); !ok {
		return
	}
	viewer, _ := s.viewer(r)
	items, err := s.st.RelatedModels(r.Context(), id, viewer, 8)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load related models.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"items": items})
}

func (s *Server) handleCreateModel(w http.ResponseWriter, r *http.Request) {
	var in struct {
		Title       string   `json:"title"`
		Description string   `json:"description"`
		CategoryID  string   `json:"categoryId"`
		License     string   `json:"license"`
		SourceURL   string   `json:"sourceUrl"`
		Visibility  string   `json:"visibility"`
		Status      string   `json:"status"`
		Tags        []string `json:"tags"`
	}
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	if msg := validateModelFields(in.Title, in.Description, in.Visibility, in.Status); msg != "" {
		writeErr(w, http.StatusBadRequest, "validation", msg)
		return
	}
	u := currentUser(r)
	visibility := in.Visibility
	if visibility == "" {
		visibility = s.st.Setting("default_visibility", "public")
	}
	if visibility != "public" && visibility != "members" && visibility != "private" {
		writeErr(w, http.StatusBadRequest, "validation", "Invalid visibility.")
		return
	}
	status := in.Status
	if status == "" {
		status = "draft"
	}
	if status != "draft" && status != "published" {
		writeErr(w, http.StatusBadRequest, "validation", "Invalid status.")
		return
	}
	var published *int64
	if status == "published" {
		now := time.Now().Unix()
		published = &now
	}
	m := store.Model{
		ID: store.NewID(), OwnerID: u.ID, Title: strings.TrimSpace(in.Title), Description: in.Description,
		CategoryID: in.CategoryID, License: strings.TrimSpace(in.License), SourceURL: strings.TrimSpace(in.SourceURL),
		Visibility: visibility, Status: status, PublishedAt: published,
	}
	if err := s.st.CreateModel(r.Context(), &m, in.Tags); err != nil {
		s.log.Error("create model", "error", err)
		writeErr(w, http.StatusInternalServerError, "internal", "Could not create model.")
		return
	}
	s.audit(r, u.ID, "model.created", "model", m.ID, `{}`)
	created, err := s.st.ModelByID(r.Context(), m.ID, u.ID)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Model was created, but could not be reloaded.")
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{"model": created, "canEdit": true})
}

func (s *Server) handleUpdateModel(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	m, err := s.st.ModelByID(r.Context(), id, currentUser(r).ID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Model not found.")
		return
	}
	if !s.canEditModel(r, m) {
		writeErr(w, http.StatusForbidden, "forbidden", "You cannot edit this model.")
		return
	}
	var in struct {
		Title       *string   `json:"title"`
		Description *string   `json:"description"`
		CategoryID  *string   `json:"categoryId"`
		License     *string   `json:"license"`
		SourceURL   *string   `json:"sourceUrl"`
		Visibility  *string   `json:"visibility"`
		Status      *string   `json:"status"`
		Featured    *bool     `json:"featured"`
		Tags        *[]string `json:"tags"`
	}
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	fields := map[string]any{}
	title, desc, vis, status := m.Title, m.Description, m.Visibility, m.Status
	if in.Title != nil {
		title = strings.TrimSpace(*in.Title)
		fields["title"] = title
	}
	if in.Description != nil {
		desc = *in.Description
		fields["description"] = desc
	}
	if in.CategoryID != nil {
		fields["category_id"] = nullIfEmpty(*in.CategoryID)
	}
	if in.License != nil {
		fields["license"] = strings.TrimSpace(*in.License)
	}
	if in.SourceURL != nil {
		fields["source_url"] = strings.TrimSpace(*in.SourceURL)
	}
	if in.Visibility != nil {
		vis = *in.Visibility
		fields["visibility"] = vis
	}
	if in.Status != nil {
		status = *in.Status
		fields["status"] = status
		if status == "published" && m.PublishedAt == nil {
			fields["published_at"] = time.Now().Unix()
		}
	}
	if in.Featured != nil && currentUser(r).Role == "admin" {
		fields["featured"] = boolInt(*in.Featured)
	}
	if msg := validateModelFields(title, desc, vis, status); msg != "" {
		writeErr(w, http.StatusBadRequest, "validation", msg)
		return
	}
	if len(fields) == 0 && in.Tags == nil {
		writeJSON(w, http.StatusOK, map[string]any{"model": m})
		return
	}
	if err := s.st.UpdateModel(r.Context(), id, fields, in.Tags); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not update model.")
		return
	}
	s.audit(r, currentUser(r).ID, "model.updated", "model", id, jsonMap(in))
	updated, _ := s.st.ModelByID(r.Context(), id, currentUser(r).ID)
	writeJSON(w, http.StatusOK, map[string]any{"model": updated, "canEdit": true})
}

func (s *Server) handleDeleteModel(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	m, err := s.st.ModelByID(r.Context(), id, currentUser(r).ID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Model not found.")
		return
	}
	if !s.canEditModel(r, m) {
		writeErr(w, http.StatusForbidden, "forbidden", "You cannot delete this model.")
		return
	}
	paths, err := s.st.DeleteModel(r.Context(), id)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not delete model.")
		return
	}
	for _, p := range paths {
		s.fs.Remove(p)
	}
	s.audit(r, currentUser(r).ID, "model.deleted", "model", id, jsonMap(map[string]string{"title": m.Title}))
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) canEditModel(r *http.Request, m store.Model) bool {
	u := currentUser(r)
	return u != nil && (u.ID == m.OwnerID || u.Role == "admin")
}

func (s *Server) handleLike(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	m, ok := s.loadViewableModel(w, r, id)
	if !ok {
		return
	}
	liked, count, err := s.st.ToggleLike(r.Context(), currentUser(r).ID, m.ID)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not update like.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"liked": liked, "likeCount": count})
}

func (s *Server) handleBookmark(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	m, ok := s.loadViewableModel(w, r, id)
	if !ok {
		return
	}
	bookmarked, count, err := s.st.ToggleBookmark(r.Context(), currentUser(r).ID, m.ID)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not update bookmark.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"bookmarked": bookmarked, "bookmarkCount": count})
}

func (s *Server) handleCategories(w http.ResponseWriter, r *http.Request) {
	items, err := s.st.Categories(r.Context())
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load categories.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"items": items})
}

func (s *Server) handleTags(w http.ResponseWriter, r *http.Request) {
	items, err := s.st.ListTags(r.Context(), strings.TrimSpace(r.URL.Query().Get("q")), intQuery(r.URL.Query().Get("limit"), 200))
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load tags.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"items": items})
}

func (s *Server) handleTag(w http.ResponseWriter, r *http.Request) {
	t, err := s.st.TagBySlug(r.Context(), chi.URLParam(r, "slug"))
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Tag not found.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"tag": t})
}

func (s *Server) handleTagModels(w http.ResponseWriter, r *http.Request) {
	viewer, admin := s.viewer(r)
	res, err := s.st.ListModels(r.Context(), store.ModelFilter{
		Tag: chi.URLParam(r, "slug"), Page: intQuery(r.URL.Query().Get("page"), 1),
		PerPage: intQuery(r.URL.Query().Get("perPage"), 24), Sort: r.URL.Query().Get("sort"),
		ViewerID: viewer, ViewerAdmin: admin,
		RequireLogin: s.st.Setting("require_login_to_browse", "false") == "true",
	})
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load tag models.")
		return
	}
	writeJSON(w, http.StatusOK, res)
}

func (s *Server) handleProfile(w http.ResponseWriter, r *http.Request) {
	u, err := s.st.UserByUsername(r.Context(), chi.URLParam(r, "username"))
	if err != nil || !u.IsActive {
		writeErr(w, http.StatusNotFound, "not_found", "User not found.")
		return
	}
	models, downloads, likes := s.st.UserStats(r.Context(), u.ID)
	writeJSON(w, http.StatusOK, map[string]any{
		"user": map[string]any{
			"id": u.ID, "username": u.Username, "displayName": u.DisplayName, "bio": u.Bio,
			"role": u.Role, "createdAt": u.CreatedAt,
		},
		"stats": map[string]any{"models": models, "downloads": downloads, "likes": likes},
	})
}

func (s *Server) handleProfileModels(w http.ResponseWriter, r *http.Request) {
	viewer, admin := s.viewer(r)
	res, err := s.st.ListModels(r.Context(), store.ModelFilter{
		Owner: chi.URLParam(r, "username"), Page: intQuery(r.URL.Query().Get("page"), 1),
		PerPage: intQuery(r.URL.Query().Get("perPage"), 24), Sort: r.URL.Query().Get("sort"),
		ViewerID: viewer, ViewerAdmin: admin,
		RequireLogin: s.st.Setting("require_login_to_browse", "false") == "true",
	})
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load user models.")
		return
	}
	writeJSON(w, http.StatusOK, res)
}

func (s *Server) handleStats(w http.ResponseWriter, r *http.Request) {
	models, users, downloads, files := s.st.Stats(r.Context())
	writeJSON(w, http.StatusOK, map[string]any{
		"models": models, "users": users, "downloads": downloads, "files": files,
	})
}

func validateModelFields(title, description, visibility, status string) string {
	title = strings.TrimSpace(title)
	if len(title) < 3 || len(title) > 120 {
		return "Title must be 3–120 characters."
	}
	if len(description) > 20000 {
		return "Description is too long."
	}
	if visibility != "" && visibility != "public" && visibility != "members" && visibility != "private" {
		return "Invalid visibility."
	}
	if status != "" && status != "draft" && status != "published" {
		return "Invalid status."
	}
	return ""
}

func intQuery(s string, fallback int) int {
	n, err := strconv.Atoi(s)
	if err != nil {
		return fallback
	}
	return n
}

var _ = errors.Is
var _ = fmt.Sprint
var _ = sql.ErrNoRows
