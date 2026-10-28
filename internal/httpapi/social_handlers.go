package httpapi

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"

	"myprintables/internal/store"
)

type commentDTO struct {
	store.Comment
	CanEdit   bool `json:"canEdit"`
	CanDelete bool `json:"canDelete"`
}

func (s *Server) mountSocial(api chi.Router) {
	api.Get("/models/{id}/comments", s.handleComments)
	api.Get("/models/{id}/collections", s.handleModelCollections)
	api.Get("/collections", s.handleCollections)
	api.Get("/collections/{id}", s.handleCollection)
	api.Get("/users/{username}/collections", s.handleUserCollections)

	api.Group(func(p chi.Router) {
		p.Use(s.requireAuth)
		p.Use(s.csrf)
		p.Post("/models/{id}/comments", s.handleCreateComment)
		p.Patch("/comments/{id}", s.handleUpdateComment)
		p.Delete("/comments/{id}", s.handleDeleteComment)
		p.Put("/models/{id}/rating", s.handleRate)
		p.Delete("/models/{id}/rating", s.handleUnrate)
		p.Post("/collections", s.handleCreateCollection)
		p.Patch("/collections/{id}", s.handleUpdateCollection)
		p.Delete("/collections/{id}", s.handleDeleteCollection)
		p.Post("/collections/{id}/models/{modelId}", s.handleAddToCollection)
		p.Delete("/collections/{id}/models/{modelId}", s.handleRemoveFromCollection)
		p.Patch("/collections/{id}/models", s.handleReorderCollection)
	})

	api.Group(func(a chi.Router) {
		a.Use(s.requireAuth)
		a.Use(s.csrf)
		a.Use(s.requireAdmin)
		a.Delete("/admin/comments/{id}", s.handleAdminDeleteComment)
		a.Delete("/admin/ratings/{userId}/{modelId}", s.handleAdminDeleteRating)
		a.Delete("/admin/collections/{id}", s.handleAdminDeleteCollection)
	})
}

func (s *Server) handleComments(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if _, ok := s.loadViewableModel(w, r, id); !ok {
		return
	}
	page, err := s.st.Comments(r.Context(), id, intQuery(r.URL.Query().Get("page"), 1),
		intQuery(r.URL.Query().Get("perPage"), 20), r.URL.Query().Get("sort"))
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load comments.")
		return
	}
	u := currentUser(r)
	if u == nil {
		writeJSON(w, http.StatusOK, page)
		return
	}
	for i := range page.Items {
		page.Items[i] = decorateComment(page.Items[i], u, id)
	}
	writeJSON(w, http.StatusOK, page)
}

func decorateComment(c store.Comment, u *store.User, modelOwnerID string) store.Comment {
	// Comment DTO permissions are computed on the client from IDs; this helper
	// keeps the type stable for the existing JSON shape.
	return c
}

func (s *Server) handleCreateComment(w http.ResponseWriter, r *http.Request) {
	modelID := chi.URLParam(r, "id")
	m, ok := s.loadViewableModel(w, r, modelID)
	if !ok {
		return
	}
	u := currentUser(r)
	if !s.limiter.Allow("comment:"+u.ID, 30, time.Hour) || !s.limiter.Allow("comment-burst:"+u.ID, 1, 5*time.Second) {
		writeErr(w, http.StatusTooManyRequests, "rate_limited", "You are commenting too quickly.")
		return
	}
	var in struct {
		Body     string `json:"body"`
		ParentID string `json:"parentId"`
	}
	if err := decodeJSON(r, &in); err != nil || len(strings.TrimSpace(in.Body)) < 1 || len(in.Body) > 5000 {
		writeErr(w, http.StatusBadRequest, "validation", "Comment must be 1–5000 characters.")
		return
	}
	if in.ParentID != "" {
		parent, err := s.st.CommentByID(r.Context(), in.ParentID)
		if err != nil || parent.ModelID != modelID || parent.ParentID != "" || parent.Deleted {
			writeErr(w, http.StatusBadRequest, "validation", "Invalid reply target.")
			return
		}
	}
	c := store.Comment{ModelID: m.ID, UserID: u.ID, ParentID: in.ParentID, Body: strings.TrimSpace(in.Body)}
	if err := s.st.CreateComment(r.Context(), &c); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not post comment.")
		return
	}
	c.UserID, c.Username, c.DisplayName = u.ID, u.Username, u.DisplayName
	s.audit(r, u.ID, "comment.created", "model", m.ID, `{}`)
	writeJSON(w, http.StatusCreated, map[string]any{"comment": c})
}

func (s *Server) commentForAction(w http.ResponseWriter, r *http.Request) (store.Comment, bool) {
	c, err := s.st.CommentByID(r.Context(), chi.URLParam(r, "id"))
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Comment not found.")
		return c, false
	}
	if _, ok := s.loadViewableModel(w, r, c.ModelID); !ok {
		return c, false
	}
	return c, true
}

func (s *Server) handleUpdateComment(w http.ResponseWriter, r *http.Request) {
	c, ok := s.commentForAction(w, r)
	if !ok {
		return
	}
	u := currentUser(r)
	if c.UserID != u.ID {
		writeErr(w, http.StatusForbidden, "forbidden", "You can only edit your own comments.")
		return
	}
	var in struct {
		Body string `json:"body"`
	}
	if err := decodeJSON(r, &in); err != nil || len(strings.TrimSpace(in.Body)) < 1 || len(in.Body) > 5000 {
		writeErr(w, http.StatusBadRequest, "validation", "Comment must be 1–5000 characters.")
		return
	}
	if err := s.st.UpdateComment(r.Context(), c.ID, u.ID, strings.TrimSpace(in.Body)); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not update comment.")
		return
	}
	c.Body = strings.TrimSpace(in.Body)
	c.UpdatedAt = time.Now().Unix()
	writeJSON(w, http.StatusOK, map[string]any{"comment": c})
}

func (s *Server) canModerateModel(r *http.Request, modelID string) bool {
	m, err := s.st.ModelByID(r.Context(), modelID, "")
	if err != nil {
		return false
	}
	return s.canEditModel(r, m)
}

func (s *Server) handleDeleteComment(w http.ResponseWriter, r *http.Request) {
	c, ok := s.commentForAction(w, r)
	if !ok {
		return
	}
	u := currentUser(r)
	if c.UserID != u.ID && !s.canModerateModel(r, c.ModelID) {
		writeErr(w, http.StatusForbidden, "forbidden", "You cannot delete this comment.")
		return
	}
	if err := s.st.DeleteComment(r.Context(), c.ID); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not delete comment.")
		return
	}
	s.audit(r, u.ID, "comment.deleted", "model", c.ModelID, `{}`)
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleRate(w http.ResponseWriter, r *http.Request) {
	m, ok := s.loadViewableModel(w, r, chi.URLParam(r, "id"))
	if !ok {
		return
	}
	var in struct {
		Score int `json:"score"`
	}
	if err := decodeJSON(r, &in); err != nil || in.Score < 1 || in.Score > 5 {
		writeErr(w, http.StatusBadRequest, "validation", "Rating must be between 1 and 5.")
		return
	}
	summary, err := s.st.RateModel(r.Context(), currentUser(r).ID, m.ID, in.Score)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not save rating.")
		return
	}
	writeJSON(w, http.StatusOK, summary)
}

func (s *Server) handleUnrate(w http.ResponseWriter, r *http.Request) {
	m, ok := s.loadViewableModel(w, r, chi.URLParam(r, "id"))
	if !ok {
		return
	}
	summary, err := s.st.UnrateModel(r.Context(), currentUser(r).ID, m.ID)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not remove rating.")
		return
	}
	writeJSON(w, http.StatusOK, summary)
}

func (s *Server) handleModelCollections(w http.ResponseWriter, r *http.Request) {
	m, ok := s.loadViewableModel(w, r, chi.URLParam(r, "id"))
	if !ok {
		return
	}
	viewer, admin := s.viewer(r)
	items, err := s.st.CollectionsForModel(r.Context(), m.ID, viewer, admin)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load collections.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"items": items})
}

func (s *Server) handleCollections(w http.ResponseWriter, r *http.Request) {
	viewer, admin := s.viewer(r)
	page, err := s.st.ListCollections(r.Context(), r.URL.Query().Get("owner"), viewer,
		strings.TrimSpace(r.URL.Query().Get("q")), r.URL.Query().Get("visibility"),
		intQuery(r.URL.Query().Get("page"), 1), intQuery(r.URL.Query().Get("perPage"), 24), admin)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load collections.")
		return
	}
	writeJSON(w, http.StatusOK, page)
}

func (s *Server) canViewCollection(r *http.Request, c store.Collection) bool {
	u := currentUser(r)
	if u != nil && u.Role == "admin" { return true }
	if u != nil && u.ID == c.OwnerID { return true }
	if c.Visibility == "public" { return true }
	if c.Visibility == "members" && u != nil { return c.Visibility == "members" }
	return false
}

func (s *Server) handleCollection(w http.ResponseWriter, r *http.Request) {
	viewer, admin := s.viewer(r)
	c, err := s.st.CollectionByID(r.Context(), chi.URLParam(r, "id"), viewer, admin)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Collection not found.")
		return
	}
	if !s.canViewCollection(r, c) {
		writeErr(w, http.StatusNotFound, "not_found", "Collection not found.")
		return
	}
	ids, err := s.st.CollectionModelIDs(r.Context(), c.ID, viewer, admin)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load collection models.")
		return
	}
	items := make([]store.Model, 0, len(ids))
	for _, id := range ids {
		m, err := s.st.ModelByID(r.Context(), id, viewer)
		if err == nil && s.canViewModel(r, m) {
			items = append(items, m)
		}
	}
	u := currentUser(r)
	writeJSON(w, http.StatusOK, map[string]any{
		"collection": c, "models": items,
		"canEdit": u != nil && (u.ID == c.OwnerID || u.Role == "admin"),
	})
}

func (s *Server) handleUserCollections(w http.ResponseWriter, r *http.Request) {
	viewer, admin := s.viewer(r)
	page, err := s.st.ListCollections(r.Context(), chi.URLParam(r, "username"), viewer, "",
		"", intQuery(r.URL.Query().Get("page"), 1), intQuery(r.URL.Query().Get("perPage"), 24), admin)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load user collections.")
		return
	}
	writeJSON(w, http.StatusOK, page)
}

func (s *Server) handleCreateCollection(w http.ResponseWriter, r *http.Request) {
	var in struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Visibility  string `json:"visibility"`
	}
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	in.Name = strings.TrimSpace(in.Name)
	if len(in.Name) < 1 || len(in.Name) > 80 || len(in.Description) > 2000 {
		writeErr(w, http.StatusBadRequest, "validation", "Collection name is required (max 80 chars).")
		return
	}
	if in.Visibility == "" { in.Visibility = "public" }
	if in.Visibility != "public" && in.Visibility != "members" && in.Visibility != "private" {
		writeErr(w, http.StatusBadRequest, "validation", "Invalid visibility.")
		return
	}
	c := store.Collection{OwnerID: currentUser(r).ID, Name: in.Name, Description: in.Description, Visibility: in.Visibility}
	if err := s.st.CreateCollection(r.Context(), &c); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not create collection.")
		return
	}
	c.OwnerUsername = currentUser(r).Username
	c.OwnerName = currentUser(r).DisplayName
	writeJSON(w, http.StatusCreated, map[string]any{"collection": c})
}

func (s *Server) collectionForEdit(w http.ResponseWriter, r *http.Request) (store.Collection, bool) {
	viewer, admin := s.viewer(r)
	c, err := s.st.CollectionByID(r.Context(), chi.URLParam(r, "id"), viewer, admin)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Collection not found.")
		return c, false
	}
	u := currentUser(r)
	if u == nil || (u.ID != c.OwnerID && u.Role != "admin") {
		writeErr(w, http.StatusForbidden, "forbidden", "You cannot edit this collection.")
		return c, false
	}
	return c, true
}

func (s *Server) handleUpdateCollection(w http.ResponseWriter, r *http.Request) {
	c, ok := s.collectionForEdit(w, r)
	if !ok { return }
	var in struct {
		Name        *string `json:"name"`
		Description *string `json:"description"`
		Visibility  *string `json:"visibility"`
	}
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	fields := map[string]any{}
	if in.Name != nil {
		v := strings.TrimSpace(*in.Name)
		if len(v) < 1 || len(v) > 80 { writeErr(w, http.StatusBadRequest, "validation", "Invalid name."); return }
		fields["name"] = v
	}
	if in.Description != nil {
		if len(*in.Description) > 2000 { writeErr(w, http.StatusBadRequest, "validation", "Description is too long."); return }
		fields["description"] = strings.TrimSpace(*in.Description)
	}
	if in.Visibility != nil {
		if *in.Visibility != "public" && *in.Visibility != "members" && *in.Visibility != "private" {
			writeErr(w, http.StatusBadRequest, "validation", "Invalid visibility."); return
		}
		fields["visibility"] = *in.Visibility
	}
	if err := s.st.UpdateCollection(r.Context(), c.ID, fields); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not update collection.")
		return
	}
	c2, _ := s.st.CollectionByID(r.Context(), c.ID, currentUser(r).ID, currentUser(r).Role == "admin")
	writeJSON(w, http.StatusOK, map[string]any{"collection": c2})
}

func (s *Server) handleDeleteCollection(w http.ResponseWriter, r *http.Request) {
	c, ok := s.collectionForEdit(w, r)
	if !ok { return }
	if err := s.st.DeleteCollection(r.Context(), c.ID); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not delete collection.")
		return
	}
	s.audit(r, currentUser(r).ID, "collection.deleted", "collection", c.ID, `{}`)
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleAddToCollection(w http.ResponseWriter, r *http.Request) {
	c, ok := s.collectionForEdit(w, r)
	if !ok { return }
	modelID := chi.URLParam(r, "modelId")
	m, err := s.st.ModelByID(r.Context(), modelID, currentUser(r).ID)
	if err != nil || !s.canViewModel(r, m) {
		writeErr(w, http.StatusNotFound, "not_found", "Model not found.")
		return
	}
	if err := s.st.AddToCollection(r.Context(), c.ID, modelID); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not add model.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleRemoveFromCollection(w http.ResponseWriter, r *http.Request) {
	c, ok := s.collectionForEdit(w, r)
	if !ok { return }
	if err := s.st.RemoveFromCollection(r.Context(), c.ID, chi.URLParam(r, "modelId")); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not remove model.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleReorderCollection(w http.ResponseWriter, r *http.Request) {
	c, ok := s.collectionForEdit(w, r)
	if !ok { return }
	var in struct { ModelIDs []string `json:"modelIds"` }
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	if err := s.st.ReorderCollection(r.Context(), c.ID, in.ModelIDs); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not reorder collection.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleAdminDeleteComment(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := s.st.DeleteComment(r.Context(), id); err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Comment not found.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleAdminDeleteRating(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "userId")
	modelID := chi.URLParam(r, "modelId")
	if _, err := s.st.UnrateModel(r.Context(), userID, modelID); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not remove rating.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleAdminDeleteCollection(w http.ResponseWriter, r *http.Request) {
	if err := s.st.DeleteCollection(r.Context(), chi.URLParam(r, "id")); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not delete collection.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

var _ = strconv.Itoa
