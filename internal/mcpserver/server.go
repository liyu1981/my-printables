package mcpserver

import (
	"context"
	"crypto/subtle"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/modelcontextprotocol/go-sdk/mcp"

	"myprintables/internal/auth"
	"myprintables/internal/config"
	"myprintables/internal/store"
)

type Server struct {
	cfg    config.Config
	st     *store.Store
	viewer *store.User
}

type viewerKey struct{}

func withViewer(ctx context.Context, u *store.User) context.Context {
	return context.WithValue(ctx, viewerKey{}, u)
}

func viewerFrom(ctx context.Context) *store.User {
	u, _ := ctx.Value(viewerKey{}).(*store.User)
	return u
}

func NewServer(cfg config.Config, st *store.Store, log *slog.Logger, viewer *store.User) *mcp.Server {
	s := &Server{cfg: cfg, st: st, viewer: viewer}
	server := mcp.NewServer(&mcp.Implementation{Name: "myprintables", Version: "1.0.0"}, nil)
	s.addTools(server)
	return server
}

func NewHTTP(cfg config.Config, st *store.Store, log *slog.Logger) http.Handler {
	if !cfg.MCPEnabled {
		return nil
	}
	if strings.TrimSpace(cfg.MCPToken) == "" {
		log.Info("MCP enabled; global token disabled, user API keys required")
	}
	handler := mcp.NewStreamableHTTPHandler(func(r *http.Request) *mcp.Server {
		return NewServer(cfg, st, log, viewerFrom(r.Context()))
	}, &mcp.StreamableHTTPOptions{
		Logger:         log,
		SessionTimeout: 30 * time.Minute,
	})
	return authenticate(cfg, st, handler)
}

func authenticate(cfg config.Config, st *store.Store, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authz := r.Header.Get("Authorization")
		if !strings.HasPrefix(authz, "Bearer ") {
			w.Header().Set("WWW-Authenticate", `Bearer realm="myprintables"`)
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		token := strings.TrimSpace(strings.TrimPrefix(authz, "Bearer "))
		if token == "" {
			w.Header().Set("WWW-Authenticate", `Bearer realm="myprintables"`)
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		if cfg.MCPToken != "" && subtle.ConstantTimeCompare([]byte(token), []byte(cfg.MCPToken)) == 1 {
			next.ServeHTTP(w, r)
			return
		}
		key, user, err := st.APIKeyByHash(r.Context(), auth.TokenHash(token))
		if err != nil {
			w.Header().Set("WWW-Authenticate", `Bearer realm="myprintables"`)
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		st.TouchAPIKey(r.Context(), key.ID)
		next.ServeHTTP(w, r.WithContext(withViewer(r.Context(), &user)))
	})
}

type searchModelsArgs struct {
	Query    string `json:"query,omitempty" jsonschema:"Search text for model titles, descriptions, or tags"`
	Category string `json:"category,omitempty" jsonschema:"Category slug, e.g. toys-games"`
	Tag      string `json:"tag,omitempty" jsonschema:"Tag slug, e.g. organizer"`
	Sort     string `json:"sort,omitempty" jsonschema:"Sort order: trending, newest, downloads, likes, rating"`
	Limit    int    `json:"limit,omitempty" jsonschema:"Maximum number of models to return (1-50, default 10)"`
}

type modelSummary struct {
	ID            string   `json:"id"`
	Title         string   `json:"title"`
	URL           string   `json:"url"`
	Owner         string   `json:"owner"`
	Category      string   `json:"category"`
	Tags          []string `json:"tags,omitempty"`
	Description   string   `json:"description,omitempty"`
	FileFormats   string   `json:"fileFormats"`
	LikeCount     int64    `json:"likeCount"`
	DownloadCount int64    `json:"downloadCount"`
	RatingAvg     float64  `json:"ratingAvg"`
	RatingCount   int64    `json:"ratingCount"`
}

type searchModelsResult struct {
	Models []modelSummary `json:"models"`
	Total  int            `json:"total"`
}

type getModelArgs struct {
	ID string `json:"id" jsonschema:"The model ID from search_models or a model URL"`
}

type fileInfo struct {
	ID          string `json:"id"`
	Filename    string `json:"filename"`
	Format      string `json:"format"`
	SizeBytes   int64  `json:"sizeBytes"`
	DownloadURL string `json:"downloadUrl"`
}

type imageInfo struct {
	ID       string `json:"id"`
	URL      string `json:"url"`
	LargeURL string `json:"largeUrl"`
	ThumbURL string `json:"thumbUrl"`
}

type attachmentInfo struct {
	ID          string `json:"id"`
	Filename    string `json:"filename"`
	MimeType    string `json:"mimeType"`
	SizeBytes   int64  `json:"sizeBytes"`
	URL         string `json:"url"`
	DownloadURL string `json:"downloadUrl"`
}

type getModelResult struct {
	ID            string           `json:"id"`
	Title         string           `json:"title"`
	URL           string           `json:"url"`
	Description   string           `json:"description"`
	Owner         string           `json:"owner"`
	OwnerUsername string           `json:"ownerUsername"`
	Category      string           `json:"category"`
	CategorySlug  string           `json:"categorySlug"`
	Tags          []string         `json:"tags,omitempty"`
	License       string           `json:"license,omitempty"`
	SourceURL     string           `json:"sourceUrl,omitempty"`
	Visibility    string           `json:"visibility"`
	DownloadCount int64            `json:"downloadCount"`
	LikeCount     int64            `json:"likeCount"`
	RatingAvg     float64          `json:"ratingAvg"`
	RatingCount   int64            `json:"ratingCount"`
	Files         []fileInfo       `json:"files"`
	Images        []imageInfo      `json:"images"`
	Attachments   []attachmentInfo `json:"attachments"`
}

type listTagsArgs struct {
	Query string `json:"query,omitempty" jsonschema:"Optional tag name filter"`
	Limit int    `json:"limit,omitempty" jsonschema:"Maximum tags to return (1-200, default 100)"`
}

type tagsResult struct {
	Tags []store.Tag `json:"tags"`
}

type categoriesResult struct {
	Categories []store.Category `json:"categories"`
}

type statsResult struct {
	Models    int64 `json:"models"`
	Users     int64 `json:"users"`
	Downloads int64 `json:"downloads"`
	Files     int64 `json:"files"`
}

type createModelArgs struct {
	Title       string   `json:"title" jsonschema:"Model title (3-120 characters)"`
	Description string   `json:"description,omitempty" jsonschema:"Markdown description"`
	CategoryID  string   `json:"categoryId,omitempty" jsonschema:"Category ID from list_categories"`
	License     string   `json:"license,omitempty" jsonschema:"License label, e.g. CC BY-NC 4.0"`
	SourceURL   string   `json:"sourceUrl,omitempty" jsonschema:"Original/source URL"`
	Visibility  string   `json:"visibility,omitempty" jsonschema:"public, members, or private (defaults to site default)"`
	Status      string   `json:"status,omitempty" jsonschema:"draft or published (defaults to draft)"`
	Tags        []string `json:"tags,omitempty" jsonschema:"Tags, max 15"`
}

type updateModelArgs struct {
	ID          string   `json:"id" jsonschema:"Model ID"`
	Title       string   `json:"title,omitempty" jsonschema:"New title"`
	Description string   `json:"description,omitempty" jsonschema:"New Markdown description"`
	CategoryID  string   `json:"categoryId,omitempty" jsonschema:"New category ID"`
	License     string   `json:"license,omitempty" jsonschema:"New license label"`
	SourceURL   string   `json:"sourceUrl,omitempty" jsonschema:"New source URL"`
	Visibility  string   `json:"visibility,omitempty" jsonschema:"public, members, or private"`
	Status      string   `json:"status,omitempty" jsonschema:"draft or published"`
	Tags        []string `json:"tags,omitempty" jsonschema:"Replacement tags (max 15)"`
}

type idArgs struct {
	ID string `json:"id" jsonschema:"Model ID"`
}

type commentArgs struct {
	ID       string `json:"id" jsonschema:"Model ID"`
	Body     string `json:"body" jsonschema:"Comment text (1-5000 characters)"`
	ParentID string `json:"parentId,omitempty" jsonschema:"Optional top-level comment ID for a reply"`
}

type ratingArgs struct {
	ID    string `json:"id" jsonschema:"Model ID"`
	Score int    `json:"score" jsonschema:"Rating from 1 to 5"`
}

type collectionArgs struct {
	Name        string `json:"name" jsonschema:"Collection name"`
	Description string `json:"description,omitempty" jsonschema:"Collection description"`
	Visibility  string `json:"visibility,omitempty" jsonschema:"public, members, or private"`
}

type collectionModelArgs struct {
	CollectionID string `json:"collectionId" jsonschema:"Collection ID"`
	ModelID      string `json:"modelId" jsonschema:"Model ID"`
}

func (s *Server) addTools(server *mcp.Server) {
	mcp.AddTool(server, &mcp.Tool{
		Name:        "search_models",
		Description: "Search models visible to this credential. With an API key, includes members-only and owned models.",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in searchModelsArgs) (*mcp.CallToolResult, searchModelsResult, error) {
		limit := in.Limit
		if limit < 1 || limit > 50 {
			limit = 10
		}
		page, err := s.st.ListModels(ctx, store.ModelFilter{
			Q: strings.TrimSpace(in.Query), Category: strings.TrimSpace(in.Category), Tag: strings.TrimSpace(in.Tag),
			Sort: in.Sort, Page: 1, PerPage: limit, ViewerID: s.viewerID(), ViewerAdmin: s.isAdmin(), RequireLogin: false,
		})
		if err != nil {
			return nil, searchModelsResult{}, err
		}
		out := searchModelsResult{Total: page.Total, Models: make([]modelSummary, 0, len(page.Items))}
		for _, m := range page.Items {
			out.Models = append(out.Models, s.summary(m))
		}
		return nil, out, nil
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "get_model",
		Description: "Get metadata for a model visible to this credential, including 3D file, image, and attachment URLs.",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in getModelArgs) (*mcp.CallToolResult, getModelResult, error) {
		m, err := s.st.ModelByID(ctx, strings.TrimSpace(in.ID), s.viewerID())
		if err != nil || !s.canView(m) {
			return nil, getModelResult{}, fmt.Errorf("model not found")
		}
		out := getModelResult{
			ID: m.ID, Title: m.Title, URL: s.modelURL(m), Description: m.Description,
			Owner: m.OwnerName, OwnerUsername: m.OwnerUsername, Category: m.CategoryName,
			CategorySlug: m.CategorySlug, License: m.License, SourceURL: m.SourceURL, Visibility: m.Visibility,
			DownloadCount: m.DownloadCount, LikeCount: m.LikeCount, RatingAvg: m.RatingAvg, RatingCount: m.RatingCount,
			Files: make([]fileInfo, 0, len(m.Files)), Images: make([]imageInfo, 0, len(m.Images)),
			Attachments: make([]attachmentInfo, 0, len(m.Attachments)),
		}
		for _, t := range m.Tags {
			out.Tags = append(out.Tags, t.Name)
		}
		for _, f := range m.Files {
			out.Files = append(out.Files, fileInfo{
				ID: f.ID, Filename: f.Filename, Format: f.Format, SizeBytes: f.SizeBytes,
				DownloadURL: s.baseURL() + "/api/models/" + m.ID + "/files/" + f.ID + "/content?download=1",
			})
		}
		for _, im := range m.Images {
			out.Images = append(out.Images, imageInfo{
				ID:       im.ID,
				URL:      s.baseURL() + "/api/models/" + m.ID + "/images/" + im.ID + "/large",
				LargeURL: s.baseURL() + "/api/models/" + m.ID + "/images/" + im.ID + "/large",
				ThumbURL: s.baseURL() + "/api/models/" + m.ID + "/images/" + im.ID + "/thumb",
			})
		}
		for _, a := range m.Attachments {
			out.Attachments = append(out.Attachments, attachmentInfo{
				ID: a.ID, Filename: a.Filename, MimeType: a.MimeType, SizeBytes: a.SizeBytes,
				URL:         s.baseURL() + "/api/models/" + m.ID + "/attachments/" + a.ID + "/content",
				DownloadURL: s.baseURL() + "/api/models/" + m.ID + "/attachments/" + a.ID + "/content?download=1",
			})
		}
		return nil, out, nil
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "list_categories",
		Description: "List public MyPrintables categories with model counts.",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, _ struct{}) (*mcp.CallToolResult, categoriesResult, error) {
		items, err := s.st.Categories(ctx)
		if err != nil {
			return nil, categoriesResult{}, err
		}
		return nil, categoriesResult{Categories: items}, nil
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "list_tags",
		Description: "List public tags, optionally filtered by name.",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in listTagsArgs) (*mcp.CallToolResult, tagsResult, error) {
		limit := in.Limit
		if limit < 1 || limit > 200 {
			limit = 100
		}
		items, err := s.st.ListTags(ctx, strings.TrimSpace(in.Query), limit)
		if err != nil {
			return nil, tagsResult{}, err
		}
		return nil, tagsResult{Tags: items}, nil
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "get_library_stats",
		Description: "Get public library statistics: published models, active users, downloads, and files.",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, _ struct{}) (*mcp.CallToolResult, statsResult, error) {
		models, users, downloads, files := s.st.Stats(ctx)
		return nil, statsResult{Models: models, Users: users, Downloads: downloads, Files: files}, nil
	})

	if s.viewer != nil {
		s.addWriteTools(server)
	}
}

func (s *Server) addWriteTools(server *mcp.Server) {
	mcp.AddTool(server, &mcp.Tool{
		Name:        "create_model",
		Description: "Create a model owned by the API key user. Metadata only; upload 3D files through the web UI.",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in createModelArgs) (*mcp.CallToolResult, modelSummary, error) {
		title := strings.TrimSpace(in.Title)
		if len(title) < 3 || len(title) > 120 {
			return nil, modelSummary{}, fmt.Errorf("title must be 3–120 characters")
		}
		visibility := strings.TrimSpace(in.Visibility)
		if visibility == "" {
			visibility = s.st.Setting("default_visibility", "public")
		}
		if visibility != "public" && visibility != "members" && visibility != "private" {
			return nil, modelSummary{}, fmt.Errorf("invalid visibility")
		}
		status := strings.TrimSpace(in.Status)
		if status == "" {
			status = "draft"
		}
		if status != "draft" && status != "published" {
			return nil, modelSummary{}, fmt.Errorf("invalid status")
		}
		var published *int64
		if status == "published" {
			now := time.Now().Unix()
			published = &now
		}
		m := store.Model{
			ID: store.NewID(), OwnerID: s.viewer.ID, Title: title, Description: in.Description,
			CategoryID: strings.TrimSpace(in.CategoryID), License: strings.TrimSpace(in.License),
			SourceURL: strings.TrimSpace(in.SourceURL), Visibility: visibility, Status: status, PublishedAt: published,
		}
		if err := s.st.CreateModel(ctx, &m, in.Tags); err != nil {
			return nil, modelSummary{}, err
		}
		created, err := s.st.ModelByID(ctx, m.ID, s.viewerID())
		if err != nil {
			return nil, modelSummary{}, err
		}
		return nil, s.summary(created), nil
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "update_model",
		Description: "Update metadata for a model owned by the API key user (or any model for admins).",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in updateModelArgs) (*mcp.CallToolResult, modelSummary, error) {
		m, err := s.st.ModelByID(ctx, strings.TrimSpace(in.ID), s.viewerID())
		if err != nil || !s.canEdit(m) {
			return nil, modelSummary{}, fmt.Errorf("model not found")
		}
		fields := map[string]any{}
		if v := strings.TrimSpace(in.Title); v != "" {
			if len(v) < 3 || len(v) > 120 {
				return nil, modelSummary{}, fmt.Errorf("title must be 3–120 characters")
			}
			fields["title"] = v
		}
		if in.Description != "" {
			fields["description"] = in.Description
		}
		if in.CategoryID != "" {
			fields["category_id"] = in.CategoryID
		}
		if in.License != "" {
			fields["license"] = strings.TrimSpace(in.License)
		}
		if in.SourceURL != "" {
			fields["source_url"] = strings.TrimSpace(in.SourceURL)
		}
		if in.Visibility != "" {
			if in.Visibility != "public" && in.Visibility != "members" && in.Visibility != "private" {
				return nil, modelSummary{}, fmt.Errorf("invalid visibility")
			}
			fields["visibility"] = in.Visibility
		}
		if in.Status != "" {
			if in.Status != "draft" && in.Status != "published" {
				return nil, modelSummary{}, fmt.Errorf("invalid status")
			}
			fields["status"] = in.Status
			if in.Status == "published" && m.PublishedAt == nil {
				fields["published_at"] = time.Now().Unix()
			}
		}
		var tags *[]string
		if len(in.Tags) > 0 {
			tags = &in.Tags
		}
		if err := s.st.UpdateModel(ctx, m.ID, fields, tags); err != nil {
			return nil, modelSummary{}, err
		}
		updated, err := s.st.ModelByID(ctx, m.ID, s.viewerID())
		if err != nil {
			return nil, modelSummary{}, err
		}
		return nil, s.summary(updated), nil
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "add_comment",
		Description: "Add a comment or one-level reply to a visible model.",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in commentArgs) (*mcp.CallToolResult, any, error) {
		m, err := s.st.ModelByID(ctx, strings.TrimSpace(in.ID), s.viewerID())
		if err != nil || !s.canView(m) {
			return nil, nil, fmt.Errorf("model not found")
		}
		body := strings.TrimSpace(in.Body)
		if len(body) < 1 || len(body) > 5000 {
			return nil, nil, fmt.Errorf("comment must be 1–5000 characters")
		}
		if in.ParentID != "" {
			parent, err := s.st.CommentByID(ctx, in.ParentID)
			if err != nil || parent.ModelID != m.ID || parent.ParentID != "" || parent.Deleted {
				return nil, nil, fmt.Errorf("invalid reply target")
			}
		}
		c := store.Comment{ModelID: m.ID, UserID: s.viewer.ID, ParentID: in.ParentID, Body: body}
		if err := s.st.CreateComment(ctx, &c); err != nil {
			return nil, nil, err
		}
		c.Username, c.DisplayName = s.viewer.Username, s.viewer.DisplayName
		return nil, c, nil
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "set_rating",
		Description: "Set a 1–5 star rating on a visible model.",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in ratingArgs) (*mcp.CallToolResult, store.RatingSummary, error) {
		m, err := s.st.ModelByID(ctx, strings.TrimSpace(in.ID), s.viewerID())
		if err != nil || !s.canView(m) {
			return nil, store.RatingSummary{}, fmt.Errorf("model not found")
		}
		if in.Score < 1 || in.Score > 5 {
			return nil, store.RatingSummary{}, fmt.Errorf("rating must be 1–5")
		}
		summary, err := s.st.RateModel(ctx, s.viewer.ID, m.ID, in.Score)
		return nil, summary, err
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "remove_rating",
		Description: "Remove the API key user's rating from a visible model.",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in idArgs) (*mcp.CallToolResult, store.RatingSummary, error) {
		m, err := s.st.ModelByID(ctx, strings.TrimSpace(in.ID), s.viewerID())
		if err != nil || !s.canView(m) {
			return nil, store.RatingSummary{}, fmt.Errorf("model not found")
		}
		summary, err := s.st.UnrateModel(ctx, s.viewer.ID, m.ID)
		return nil, summary, err
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "toggle_like",
		Description: "Toggle the API key user's like on a visible model.",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in idArgs) (*mcp.CallToolResult, any, error) {
		m, err := s.st.ModelByID(ctx, strings.TrimSpace(in.ID), s.viewerID())
		if err != nil || !s.canView(m) {
			return nil, nil, fmt.Errorf("model not found")
		}
		liked, count, err := s.st.ToggleLike(ctx, s.viewer.ID, m.ID)
		return nil, map[string]any{"liked": liked, "likeCount": count}, err
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "toggle_bookmark",
		Description: "Toggle the API key user's bookmark on a visible model.",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in idArgs) (*mcp.CallToolResult, any, error) {
		m, err := s.st.ModelByID(ctx, strings.TrimSpace(in.ID), s.viewerID())
		if err != nil || !s.canView(m) {
			return nil, nil, fmt.Errorf("model not found")
		}
		bookmarked, count, err := s.st.ToggleBookmark(ctx, s.viewer.ID, m.ID)
		return nil, map[string]any{"bookmarked": bookmarked, "bookmarkCount": count}, err
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "create_collection",
		Description: "Create a collection owned by the API key user.",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in collectionArgs) (*mcp.CallToolResult, store.Collection, error) {
		name := strings.TrimSpace(in.Name)
		if len(name) < 1 || len(name) > 80 {
			return nil, store.Collection{}, fmt.Errorf("collection name must be 1–80 characters")
		}
		visibility := in.Visibility
		if visibility == "" {
			visibility = "public"
		}
		if visibility != "public" && visibility != "members" && visibility != "private" {
			return nil, store.Collection{}, fmt.Errorf("invalid visibility")
		}
		c := store.Collection{OwnerID: s.viewer.ID, Name: name, Description: in.Description, Visibility: visibility}
		if err := s.st.CreateCollection(ctx, &c); err != nil {
			return nil, store.Collection{}, err
		}
		c.OwnerUsername, c.OwnerName = s.viewer.Username, s.viewer.DisplayName
		return nil, c, nil
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "add_to_collection",
		Description: "Add a visible model to a collection owned by the API key user (or any collection for admins).",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in collectionModelArgs) (*mcp.CallToolResult, any, error) {
		c, err := s.st.CollectionByID(ctx, in.CollectionID, s.viewerID(), s.isAdmin())
		if err != nil || !s.canEditCollection(c) {
			return nil, nil, fmt.Errorf("collection not found")
		}
		m, err := s.st.ModelByID(ctx, in.ModelID, s.viewerID())
		if err != nil || !s.canView(m) {
			return nil, nil, fmt.Errorf("model not found")
		}
		if err := s.st.AddToCollection(ctx, c.ID, m.ID); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{"ok": true}, nil
	})

	mcp.AddTool(server, &mcp.Tool{
		Name:        "remove_from_collection",
		Description: "Remove a model from a collection owned by the API key user (or any collection for admins).",
	}, func(ctx context.Context, _ *mcp.CallToolRequest, in collectionModelArgs) (*mcp.CallToolResult, any, error) {
		c, err := s.st.CollectionByID(ctx, in.CollectionID, s.viewerID(), s.isAdmin())
		if err != nil || !s.canEditCollection(c) {
			return nil, nil, fmt.Errorf("collection not found")
		}
		if err := s.st.RemoveFromCollection(ctx, c.ID, in.ModelID); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{"ok": true}, nil
	})
}

func (s *Server) viewerID() string {
	if s.viewer == nil {
		return ""
	}
	return s.viewer.ID
}

func (s *Server) isAdmin() bool {
	return s.viewer != nil && s.viewer.Role == "admin"
}

func (s *Server) canView(m store.Model) bool {
	if s.viewer != nil && (s.viewer.Role == "admin" || s.viewer.ID == m.OwnerID) {
		return true
	}
	if m.Status != "published" {
		return false
	}
	switch m.Visibility {
	case "public":
		return true
	case "members":
		return s.viewer != nil
	default:
		return false
	}
}

func (s *Server) canEdit(m store.Model) bool {
	return s.viewer != nil && (s.viewer.Role == "admin" || s.viewer.ID == m.OwnerID)
}

func (s *Server) summary(m store.Model) modelSummary {
	tags := make([]string, 0, len(m.Tags))
	for _, t := range m.Tags {
		tags = append(tags, t.Name)
	}
	return modelSummary{
		ID: m.ID, Title: m.Title, URL: s.modelURL(m), Owner: m.OwnerName, Category: m.CategoryName,
		Tags: tags, Description: truncate(m.Description, 500), FileFormats: m.FileFormats,
		LikeCount: m.LikeCount, DownloadCount: m.DownloadCount, RatingAvg: m.RatingAvg, RatingCount: m.RatingCount,
	}
}

func (s *Server) canEditCollection(c store.Collection) bool {
	return s.viewer != nil && (s.viewer.Role == "admin" || s.viewer.ID == c.OwnerID)
}

func (s *Server) baseURL() string {
	base := strings.TrimRight(strings.TrimSpace(s.cfg.AppURL), "/")
	if base == "" {
		return "http://localhost:8200"
	}
	return base
}

func (s *Server) modelURL(m store.Model) string {
	return s.baseURL() + "/model/" + m.ID + "/" + m.Slug
}

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}
