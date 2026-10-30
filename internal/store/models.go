package store

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"
)

type Category struct {
	ID        string `json:"id"`
	Slug      string `json:"slug"`
	Name      string `json:"name"`
	Icon      string `json:"icon"`
	Count     int    `json:"count"`
	SortOrder int    `json:"sortOrder"`
}

type ModelFile struct {
	ID         string `json:"id"`
	ModelID    string `json:"-"`
	Filename   string `json:"filename"`
	Format     string `json:"format"`
	SizeBytes  int64  `json:"sizeBytes"`
	SHA256     string `json:"sha256"`
	IsPreview  bool   `json:"isPreview"`
	SortOrder  int    `json:"sortOrder"`
	CreatedAt  int64  `json:"createdAt"`
	StorageRel string `json:"-"`
}

type ModelImage struct {
	ID           string `json:"id"`
	ModelID      string `json:"-"`
	OriginalPath string `json:"-"`
	LargePath    string `json:"-"`
	ThumbPath    string `json:"-"`
	Width        int    `json:"width"`
	Height       int    `json:"height"`
	Kind         string `json:"kind"`
	SortOrder    int    `json:"sortOrder"`
	CreatedAt    int64  `json:"createdAt"`
}

type Tag struct {
	ID    string `json:"id"`
	Slug  string `json:"slug"`
	Name  string `json:"name"`
	Count int    `json:"count"`
}

type ModelAttachment struct {
	ID         string `json:"id"`
	ModelID    string `json:"-"`
	Filename   string `json:"filename"`
	MimeType   string `json:"mimeType"`
	SizeBytes  int64  `json:"sizeBytes"`
	SHA256     string `json:"sha256"`
	SortOrder  int    `json:"sortOrder"`
	CreatedAt  int64  `json:"createdAt"`
	StorageRel string `json:"-"`
}

type Model struct {
	ID              string            `json:"id"`
	OwnerID         string            `json:"ownerId"`
	OwnerUsername   string            `json:"ownerUsername"`
	OwnerName       string            `json:"ownerName"`
	Title           string            `json:"title"`
	Slug            string            `json:"slug"`
	Description     string            `json:"description"`
	CategoryID      string            `json:"categoryId"`
	CategoryName    string            `json:"categoryName"`
	CategorySlug    string            `json:"categorySlug"`
	License         string            `json:"license"`
	SourceURL       string            `json:"sourceUrl"`
	Visibility      string            `json:"visibility"`
	Status          string            `json:"status"`
	Featured        bool              `json:"featured"`
	DownloadCount   int64             `json:"downloadCount"`
	LikeCount       int64             `json:"likeCount"`
	BookmarkCount   int64             `json:"bookmarkCount"`
	ViewCount       int64             `json:"viewCount"`
	CommentCount    int64             `json:"commentCount"`
	RatingCount     int64             `json:"ratingCount"`
	RatingAvg       float64           `json:"ratingAvg"`
	CollectionCount int64             `json:"collectionCount"`
	CoverImageID    string            `json:"coverImageId"`
	ImageCount      int               `json:"imageCount"`
	FileFormats     string            `json:"fileFormats"`
	FileCount       int               `json:"fileCount"`
	Liked           bool              `json:"liked"`
	Bookmarked      bool              `json:"bookmarked"`
	MyRating        int               `json:"myRating"`
	CreatedAt       int64             `json:"createdAt"`
	UpdatedAt       int64             `json:"updatedAt"`
	PublishedAt     *int64            `json:"publishedAt"`
	Files           []ModelFile       `json:"files,omitempty"`
	Images          []ModelImage      `json:"images,omitempty"`
	Attachments     []ModelAttachment `json:"attachments,omitempty"`
	Tags            []Tag             `json:"tags,omitempty"`
}

type ModelFilter struct {
	Q             string
	Category      string
	Tag           string
	FileType      string
	Owner         string
	Sort          string
	Featured      bool
	Mine          bool
	IncludeDrafts bool
	Page          int
	PerPage       int
	ViewerID      string
	ViewerAdmin   bool
	RequireLogin  bool
}

type ModelPage struct {
	Items      []Model `json:"items"`
	Page       int     `json:"page"`
	PerPage    int     `json:"perPage"`
	Total      int     `json:"total"`
	TotalPages int     `json:"totalPages"`
}

const modelSelect = `SELECT m.id,m.owner_id,m.title,m.slug,m.description,COALESCE(m.category_id,''),
	COALESCE(c.name,''),COALESCE(c.slug,''),m.license,m.source_url,m.visibility,m.status,m.featured,
	m.download_count,m.like_count,m.bookmark_count,m.view_count,m.comment_count,m.rating_count,m.rating_avg,
	m.collection_count,m.created_at,m.updated_at,m.published_at,u.username,u.display_name,
	COALESCE((SELECT mi.id FROM model_images mi WHERE mi.model_id=m.id ORDER BY mi.sort_order,mi.created_at LIMIT 1),''),
	(SELECT COUNT(*) FROM model_images mi WHERE mi.model_id=m.id),
	COALESCE((SELECT group_concat(DISTINCT mf.format) FROM model_files mf WHERE mf.model_id=m.id),''),
	(SELECT COUNT(*) FROM model_files mf WHERE mf.model_id=m.id),
	EXISTS(SELECT 1 FROM likes l WHERE l.model_id=m.id AND l.user_id=?) AS liked,
	EXISTS(SELECT 1 FROM bookmarks b WHERE b.model_id=m.id AND b.user_id=?) AS bookmarked,
	COALESCE((SELECT score FROM ratings r WHERE r.model_id=m.id AND r.user_id=?),0) AS my_rating
	FROM models m
	JOIN users u ON u.id=m.owner_id
	LEFT JOIN categories c ON c.id=m.category_id`

func (s *Store) ListModels(ctx context.Context, f ModelFilter) (ModelPage, error) {
	if f.Page < 1 {
		f.Page = 1
	}
	if f.PerPage < 1 || f.PerPage > 100 {
		f.PerPage = 24
	}
	where, args := modelWhere(f)
	baseArgs := []any{f.ViewerID, f.ViewerID, f.ViewerID}
	query := modelSelect + where + " " + modelOrder(f.Sort) + " LIMIT ? OFFSET ?"
	allArgs := append(append([]any{}, baseArgs...), args...)
	allArgs = append(allArgs, f.PerPage, (f.Page-1)*f.PerPage)
	rows, err := s.DB.QueryContext(ctx, query, allArgs...)
	if err != nil {
		return ModelPage{}, err
	}
	defer rows.Close()
	var items []Model
	for rows.Next() {
		m, err := scanModel(rows)
		if err != nil {
			return ModelPage{}, err
		}
		items = append(items, m)
	}
	if err := rows.Err(); err != nil {
		return ModelPage{}, err
	}
	countQuery := `SELECT COUNT(*) FROM models m JOIN users u ON u.id=m.owner_id LEFT JOIN categories c ON c.id=m.category_id ` + where
	var total int
	if err := s.DB.QueryRowContext(ctx, countQuery, args...).Scan(&total); err != nil {
		return ModelPage{}, err
	}
	pages := 0
	if total > 0 {
		pages = (total + f.PerPage - 1) / f.PerPage
	}
	if items == nil {
		items = []Model{}
	}
	return ModelPage{Items: items, Page: f.Page, PerPage: f.PerPage, Total: total, TotalPages: pages}, nil
}

func modelWhere(f ModelFilter) (string, []any) {
	var parts []string
	var args []any
	if f.RequireLogin && f.ViewerID == "" {
		parts = append(parts, "1=0")
	}
	if f.Mine {
		if f.ViewerID == "" {
			parts = append(parts, "1=0")
		} else {
			parts = append(parts, "m.owner_id = ?")
			args = append(args, f.ViewerID)
		}
	} else if f.ViewerAdmin {
		if !f.IncludeDrafts {
			parts = append(parts, "m.status = 'published'")
		}
	} else if f.ViewerID != "" {
		parts = append(parts, "m.status = 'published'", "(m.visibility IN ('public','members') OR m.owner_id = ?)")
		args = append(args, f.ViewerID)
	} else {
		parts = append(parts, "m.status = 'published'", "m.visibility = 'public'")
	}
	if f.Q != "" {
		like := "%" + strings.TrimSpace(f.Q) + "%"
		parts = append(parts, "(m.title LIKE ? OR m.description LIKE ? OR EXISTS(SELECT 1 FROM model_tags mt JOIN tags t ON t.id=mt.tag_id WHERE mt.model_id=m.id AND t.name LIKE ?))")
		args = append(args, like, like, like)
	}
	if f.Category != "" {
		parts = append(parts, "c.slug = ?")
		args = append(args, f.Category)
	}
	if f.Tag != "" {
		parts = append(parts, "EXISTS(SELECT 1 FROM model_tags mt JOIN tags t ON t.id=mt.tag_id WHERE mt.model_id=m.id AND t.slug = ?)")
		args = append(args, f.Tag)
	}
	if f.FileType != "" {
		parts = append(parts, "EXISTS(SELECT 1 FROM model_files mf WHERE mf.model_id=m.id AND mf.format = ?)")
		args = append(args, f.FileType)
	}
	if f.Owner != "" {
		parts = append(parts, "u.username = ?")
		args = append(args, f.Owner)
	}
	if f.Featured {
		parts = append(parts, "m.featured = 1")
	}
	if len(parts) == 0 {
		return "", args
	}
	return " WHERE " + strings.Join(parts, " AND "), args
}

func modelOrder(sort string) string {
	switch sort {
	case "downloads":
		return "ORDER BY m.download_count DESC, m.created_at DESC"
	case "likes":
		return "ORDER BY m.like_count DESC, m.created_at DESC"
	case "rating":
		return "ORDER BY (m.rating_count > 0) DESC, m.rating_avg DESC, m.rating_count DESC, m.created_at DESC"
	case "trending":
		return "ORDER BY (m.like_count * 3 + m.download_count + m.view_count / 10) DESC, m.published_at DESC"
	case "oldest":
		return "ORDER BY m.created_at ASC"
	case "random":
		return "ORDER BY RANDOM()"
	default:
		return "ORDER BY m.published_at DESC, m.created_at DESC"
	}
}

type scanner interface{ Scan(dest ...any) error }

func scanModel(row scanner) (Model, error) {
	var m Model
	var featured int
	var published sql.NullInt64
	var liked, bookmarked int
	err := row.Scan(&m.ID, &m.OwnerID, &m.Title, &m.Slug, &m.Description, &m.CategoryID,
		&m.CategoryName, &m.CategorySlug, &m.License, &m.SourceURL, &m.Visibility, &m.Status, &featured,
		&m.DownloadCount, &m.LikeCount, &m.BookmarkCount, &m.ViewCount, &m.CommentCount, &m.RatingCount,
		&m.RatingAvg, &m.CollectionCount, &m.CreatedAt, &m.UpdatedAt, &published, &m.OwnerUsername,
		&m.OwnerName, &m.CoverImageID, &m.ImageCount, &m.FileFormats, &m.FileCount, &liked, &bookmarked, &m.MyRating)
	if err != nil {
		return m, err
	}
	m.Featured = featured == 1
	m.Liked = liked == 1
	m.Bookmarked = bookmarked == 1
	if published.Valid {
		m.PublishedAt = &published.Int64
	}
	return m, nil
}

func (s *Store) ModelByID(ctx context.Context, id, viewerID string) (Model, error) {
	row := s.DB.QueryRowContext(ctx, modelSelect+` WHERE m.id = ?`, viewerID, viewerID, viewerID, id)
	m, err := scanModel(row)
	if errors.Is(err, sql.ErrNoRows) {
		return m, ErrNotFound
	}
	if err != nil {
		return m, err
	}
	if m.Files, err = s.FilesByModel(ctx, m.ID); err != nil {
		return m, err
	}
	if m.Images, err = s.ImagesByModel(ctx, m.ID); err != nil {
		return m, err
	}
	if m.Tags, err = s.TagsByModel(ctx, m.ID); err != nil {
		return m, err
	}
	if m.Attachments, err = s.AttachmentsByModel(ctx, m.ID); err != nil {
		return m, err
	}
	return m, nil
}

func (s *Store) FilesByModel(ctx context.Context, modelID string) ([]ModelFile, error) {
	rows, err := s.DB.QueryContext(ctx, `SELECT id,model_id,filename,storage_path,format,size_bytes,sha256,
		is_preview,sort_order,created_at FROM model_files WHERE model_id = ? ORDER BY sort_order, created_at`, modelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []ModelFile
	for rows.Next() {
		var f ModelFile
		var preview int
		if err := rows.Scan(&f.ID, &f.ModelID, &f.Filename, &f.StorageRel, &f.Format, &f.SizeBytes, &f.SHA256,
			&preview, &f.SortOrder, &f.CreatedAt); err != nil {
			return nil, err
		}
		f.IsPreview = preview == 1
		out = append(out, f)
	}
	if out == nil {
		out = []ModelFile{}
	}
	return out, rows.Err()
}

func (s *Store) ImagesByModel(ctx context.Context, modelID string) ([]ModelImage, error) {
	rows, err := s.DB.QueryContext(ctx, `SELECT id,model_id,original_path,large_path,thumb_path,width,height,
		kind,sort_order,created_at FROM model_images WHERE model_id = ? ORDER BY sort_order, created_at`, modelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []ModelImage
	for rows.Next() {
		var im ModelImage
		if err := rows.Scan(&im.ID, &im.ModelID, &im.OriginalPath, &im.LargePath, &im.ThumbPath, &im.Width,
			&im.Height, &im.Kind, &im.SortOrder, &im.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, im)
	}
	if out == nil {
		out = []ModelImage{}
	}
	return out, rows.Err()
}

func (s *Store) TagsByModel(ctx context.Context, modelID string) ([]Tag, error) {
	rows, err := s.DB.QueryContext(ctx, `SELECT t.id,t.slug,t.name FROM tags t JOIN model_tags mt ON mt.tag_id=t.id
		WHERE mt.model_id = ? ORDER BY t.name`, modelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Tag
	for rows.Next() {
		var t Tag
		if err := rows.Scan(&t.ID, &t.Slug, &t.Name); err != nil {
			return nil, err
		}
		out = append(out, t)
	}
	if out == nil {
		out = []Tag{}
	}
	return out, rows.Err()
}

func (s *Store) CreateModel(ctx context.Context, m *Model, tagNames []string) error {
	now := time.Now().Unix()
	if m.ID == "" {
		m.ID = NewID()
	}
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	if m.Slug == "" {
		m.Slug = Slugify(m.Title) + "-" + strings.ToLower(m.ID[len(m.ID)-6:])
	}
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	_, err = tx.ExecContext(ctx, `INSERT INTO models(id,owner_id,title,slug,description,category_id,license,source_url,
		visibility,status,featured,created_at,updated_at,published_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
		m.ID, m.OwnerID, m.Title, m.Slug, m.Description, nullIfEmpty(m.CategoryID), m.License, m.SourceURL,
		m.Visibility, m.Status, boolInt(m.Featured), m.CreatedAt, m.UpdatedAt, m.PublishedAt)
	if err != nil {
		return err
	}
	if err := setTagsTx(ctx, tx, m.ID, tagNames); err != nil {
		return err
	}
	return tx.Commit()
}

func (s *Store) UpdateModel(ctx context.Context, id string, fields map[string]any, tagNames *[]string) error {
	allowed := map[string]bool{"title": true, "description": true, "category_id": true, "license": true,
		"source_url": true, "visibility": true, "status": true, "featured": true, "published_at": true}
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	if len(fields) > 0 {
		var sets []string
		var args []any
		for k, v := range fields {
			if !allowed[k] {
				return fmt.Errorf("invalid model field %q", k)
			}
			sets = append(sets, k+" = ?")
			args = append(args, v)
		}
		sets = append(sets, "updated_at = ?")
		args = append(args, time.Now().Unix(), id)
		res, err := tx.ExecContext(ctx, `UPDATE models SET `+strings.Join(sets, ", ")+` WHERE id = ?`, args...)
		if err != nil {
			return err
		}
		n, _ := res.RowsAffected()
		if n == 0 {
			return ErrNotFound
		}
	}
	if tagNames != nil {
		if _, err := tx.ExecContext(ctx, `DELETE FROM model_tags WHERE model_id = ?`, id); err != nil {
			return err
		}
		if err := setTagsTx(ctx, tx, id, *tagNames); err != nil {
			return err
		}
	}
	return tx.Commit()
}

func setTagsTx(ctx context.Context, tx *sql.Tx, modelID string, names []string) error {
	seen := map[string]bool{}
	for _, name := range names {
		name = strings.TrimSpace(name)
		if name == "" {
			continue
		}
		slug := Slugify(name)
		if slug == "" || seen[slug] {
			continue
		}
		seen[slug] = true
		var id string
		err := tx.QueryRowContext(ctx, `SELECT id FROM tags WHERE slug = ?`, slug).Scan(&id)
		if errors.Is(err, sql.ErrNoRows) {
			id = NewID()
			if _, err := tx.ExecContext(ctx, `INSERT INTO tags(id,slug,name) VALUES(?,?,?)`, id, slug, name); err != nil {
				return err
			}
		} else if err != nil {
			return err
		}
		if _, err := tx.ExecContext(ctx, `INSERT OR IGNORE INTO model_tags(model_id,tag_id) VALUES(?,?)`, modelID, id); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) DeleteModel(ctx context.Context, id string) ([]string, error) {
	m, err := s.ModelByID(ctx, id, "")
	if err != nil {
		return nil, err
	}
	var paths []string
	for _, f := range m.Files {
		paths = append(paths, f.StorageRel)
	}
	for _, im := range m.Images {
		paths = append(paths, im.OriginalPath, im.LargePath, im.ThumbPath)
	}
	for _, a := range m.Attachments {
		paths = append(paths, a.StorageRel)
	}
	_, _ = s.DB.ExecContext(ctx, `UPDATE collections SET model_count = MAX(0, model_count - 1) WHERE id IN (SELECT collection_id FROM collection_models WHERE model_id = ?)`, id)
	_, err = s.DB.ExecContext(ctx, `DELETE FROM models WHERE id = ?`, id)
	return paths, err
}

func (s *Store) AttachmentsByModel(ctx context.Context, modelID string) ([]ModelAttachment, error) {
	rows, err := s.DB.QueryContext(ctx, `SELECT id,model_id,filename,storage_path,mime_type,size_bytes,sha256,
		sort_order,created_at FROM model_attachments WHERE model_id = ? ORDER BY sort_order, created_at`, modelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []ModelAttachment
	for rows.Next() {
		var a ModelAttachment
		if err := rows.Scan(&a.ID, &a.ModelID, &a.Filename, &a.StorageRel, &a.MimeType, &a.SizeBytes,
			&a.SHA256, &a.SortOrder, &a.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, a)
	}
	if out == nil {
		out = []ModelAttachment{}
	}
	return out, rows.Err()
}

func (s *Store) AddAttachment(ctx context.Context, a ModelAttachment) error {
	_, err := s.DB.ExecContext(ctx, `INSERT INTO model_attachments(id,model_id,filename,storage_path,mime_type,
		size_bytes,sha256,sort_order,created_at) VALUES(?,?,?,?,?,?,?,?,?)`,
		a.ID, a.ModelID, a.Filename, a.StorageRel, a.MimeType, a.SizeBytes, a.SHA256, a.SortOrder, time.Now().Unix())
	return err
}

func (s *Store) AttachmentByID(ctx context.Context, modelID, attachmentID string) (ModelAttachment, error) {
	var a ModelAttachment
	err := s.DB.QueryRowContext(ctx, `SELECT id,model_id,filename,storage_path,mime_type,size_bytes,sha256,
		sort_order,created_at FROM model_attachments WHERE id = ? AND model_id = ?`, attachmentID, modelID).Scan(
		&a.ID, &a.ModelID, &a.Filename, &a.StorageRel, &a.MimeType, &a.SizeBytes, &a.SHA256, &a.SortOrder, &a.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return a, ErrNotFound
	}
	return a, err
}

func (s *Store) DeleteAttachment(ctx context.Context, modelID, attachmentID string) (string, error) {
	var path string
	err := s.DB.QueryRowContext(ctx, `SELECT storage_path FROM model_attachments WHERE id = ? AND model_id = ?`, attachmentID, modelID).Scan(&path)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", ErrNotFound
		}
		return "", err
	}
	_, err = s.DB.ExecContext(ctx, `DELETE FROM model_attachments WHERE id = ?`, attachmentID)
	return path, err
}

func (s *Store) AddFile(ctx context.Context, f ModelFile) error {
	_, err := s.DB.ExecContext(ctx, `INSERT INTO model_files(id,model_id,filename,storage_path,format,size_bytes,
		sha256,is_preview,sort_order,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)`,
		f.ID, f.ModelID, f.Filename, f.StorageRel, f.Format, f.SizeBytes, f.SHA256, boolInt(f.IsPreview), f.SortOrder, time.Now().Unix())
	return err
}

func (s *Store) DeleteFile(ctx context.Context, modelID, fileID string) (string, error) {
	var path string
	err := s.DB.QueryRowContext(ctx, `SELECT storage_path FROM model_files WHERE id = ? AND model_id = ?`, fileID, modelID).Scan(&path)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", ErrNotFound
		}
		return "", err
	}
	_, err = s.DB.ExecContext(ctx, `DELETE FROM model_files WHERE id = ?`, fileID)
	return path, err
}

func (s *Store) FileByID(ctx context.Context, modelID, fileID string) (ModelFile, error) {
	var f ModelFile
	var preview int
	err := s.DB.QueryRowContext(ctx, `SELECT id,model_id,filename,storage_path,format,size_bytes,sha256,is_preview,
		sort_order,created_at FROM model_files WHERE id = ? AND model_id = ?`, fileID, modelID).Scan(
		&f.ID, &f.ModelID, &f.Filename, &f.StorageRel, &f.Format, &f.SizeBytes, &f.SHA256, &preview, &f.SortOrder, &f.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return f, ErrNotFound
	}
	f.IsPreview = preview == 1
	return f, err
}

func (s *Store) AddImage(ctx context.Context, im ModelImage) error {
	_, err := s.DB.ExecContext(ctx, `INSERT INTO model_images(id,model_id,original_path,large_path,thumb_path,width,
		height,kind,sort_order,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)`,
		im.ID, im.ModelID, im.OriginalPath, im.LargePath, im.ThumbPath, im.Width, im.Height, im.Kind, im.SortOrder, time.Now().Unix())
	return err
}

func (s *Store) ImageByID(ctx context.Context, modelID, imageID string) (ModelImage, error) {
	var im ModelImage
	err := s.DB.QueryRowContext(ctx, `SELECT id,model_id,original_path,large_path,thumb_path,width,height,kind,
		sort_order,created_at FROM model_images WHERE id = ? AND model_id = ?`, imageID, modelID).Scan(
		&im.ID, &im.ModelID, &im.OriginalPath, &im.LargePath, &im.ThumbPath, &im.Width, &im.Height,
		&im.Kind, &im.SortOrder, &im.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return im, ErrNotFound
	}
	return im, err
}

func (s *Store) DeleteImage(ctx context.Context, modelID, imageID string) ([]string, error) {
	im, err := s.ImageByID(ctx, modelID, imageID)
	if err != nil {
		return nil, err
	}
	_, err = s.DB.ExecContext(ctx, `DELETE FROM model_images WHERE id = ?`, imageID)
	return []string{im.OriginalPath, im.LargePath, im.ThumbPath}, err
}

func (s *Store) ToggleLike(ctx context.Context, userID, modelID string) (bool, int64, error) {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return false, 0, err
	}
	defer tx.Rollback()
	res, err := tx.ExecContext(ctx, `DELETE FROM likes WHERE user_id = ? AND model_id = ?`, userID, modelID)
	if err != nil {
		return false, 0, err
	}
	n, _ := res.RowsAffected()
	liked := n == 0
	if liked {
		if _, err := tx.ExecContext(ctx, `INSERT INTO likes(user_id,model_id,created_at) VALUES(?,?,?)`, userID, modelID, time.Now().Unix()); err != nil {
			return false, 0, err
		}
		if _, err := tx.ExecContext(ctx, `UPDATE models SET like_count = like_count + 1 WHERE id = ?`, modelID); err != nil {
			return false, 0, err
		}
	} else {
		if _, err := tx.ExecContext(ctx, `UPDATE models SET like_count = MAX(0, like_count - 1) WHERE id = ?`, modelID); err != nil {
			return false, 0, err
		}
	}
	var count int64
	if err := tx.QueryRowContext(ctx, `SELECT like_count FROM models WHERE id = ?`, modelID).Scan(&count); err != nil {
		return false, 0, err
	}
	return liked, count, tx.Commit()
}

func (s *Store) ToggleBookmark(ctx context.Context, userID, modelID string) (bool, int64, error) {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return false, 0, err
	}
	defer tx.Rollback()
	res, err := tx.ExecContext(ctx, `DELETE FROM bookmarks WHERE user_id = ? AND model_id = ?`, userID, modelID)
	if err != nil {
		return false, 0, err
	}
	n, _ := res.RowsAffected()
	bookmarked := n == 0
	if bookmarked {
		if _, err := tx.ExecContext(ctx, `INSERT INTO bookmarks(user_id,model_id,created_at) VALUES(?,?,?)`, userID, modelID, time.Now().Unix()); err != nil {
			return false, 0, err
		}
		if _, err := tx.ExecContext(ctx, `UPDATE models SET bookmark_count = bookmark_count + 1 WHERE id = ?`, modelID); err != nil {
			return false, 0, err
		}
	} else {
		if _, err := tx.ExecContext(ctx, `UPDATE models SET bookmark_count = MAX(0, bookmark_count - 1) WHERE id = ?`, modelID); err != nil {
			return false, 0, err
		}
	}
	var count int64
	if err := tx.QueryRowContext(ctx, `SELECT bookmark_count FROM models WHERE id = ?`, modelID).Scan(&count); err != nil {
		return false, 0, err
	}
	return bookmarked, count, tx.Commit()
}

func (s *Store) RecordDownload(ctx context.Context, modelID, fileID, userID, ipHash string) {
	_, _ = s.DB.ExecContext(ctx, `INSERT INTO downloads(id,model_id,file_id,user_id,ip_hash,created_at)
		VALUES(?,?,?,?,?,?)`, NewID(), modelID, fileID, nullIfEmpty(userID), ipHash, time.Now().Unix())
	_, _ = s.DB.ExecContext(ctx, `UPDATE models SET download_count = download_count + 1 WHERE id = ?`, modelID)
}

func (s *Store) Categories(ctx context.Context) ([]Category, error) {
	rows, err := s.DB.QueryContext(ctx, `SELECT c.id,c.slug,c.name,c.icon,c.sort_order,
		(SELECT COUNT(*) FROM models m WHERE m.category_id=c.id AND m.status='published' AND m.visibility='public') AS cnt
		FROM categories c ORDER BY c.sort_order,c.name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Category
	for rows.Next() {
		var c Category
		if err := rows.Scan(&c.ID, &c.Slug, &c.Name, &c.Icon, &c.SortOrder, &c.Count); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	if out == nil {
		out = []Category{}
	}
	return out, rows.Err()
}

func (s *Store) ListTags(ctx context.Context, q string, limit int) ([]Tag, error) {
	if limit < 1 || limit > 500 {
		limit = 200
	}
	query := `SELECT t.id,t.slug,t.name,(SELECT COUNT(*) FROM model_tags mt JOIN models m ON m.id=mt.model_id
		WHERE mt.tag_id=t.id AND m.status='published' AND m.visibility='public') AS cnt FROM tags t`
	args := []any{}
	if q != "" {
		query += ` WHERE t.name LIKE ? OR t.slug LIKE ?`
		like := "%" + q + "%"
		args = append(args, like, like)
	}
	query += ` ORDER BY t.name LIMIT ?`
	args = append(args, limit)
	rows, err := s.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Tag
	for rows.Next() {
		var t Tag
		if err := rows.Scan(&t.ID, &t.Slug, &t.Name, &t.Count); err != nil {
			return nil, err
		}
		out = append(out, t)
	}
	if out == nil {
		out = []Tag{}
	}
	return out, rows.Err()
}

func (s *Store) TagBySlug(ctx context.Context, slug string) (Tag, error) {
	var t Tag
	err := s.DB.QueryRowContext(ctx, `SELECT t.id,t.slug,t.name,(SELECT COUNT(*) FROM model_tags mt JOIN models m ON m.id=mt.model_id
		WHERE mt.tag_id=t.id AND m.status='published' AND m.visibility='public') FROM tags t WHERE t.slug = ?`, slug).
		Scan(&t.ID, &t.Slug, &t.Name, &t.Count)
	if errors.Is(err, sql.ErrNoRows) {
		return t, ErrNotFound
	}
	return t, err
}

func (s *Store) UserStats(ctx context.Context, userID string) (models int, downloads int64, likes int64) {
	_ = s.DB.QueryRowContext(ctx, `SELECT COUNT(*) FROM models WHERE owner_id = ? AND status='published'`, userID).Scan(&models)
	_ = s.DB.QueryRowContext(ctx, `SELECT COALESCE(SUM(download_count),0) FROM models WHERE owner_id = ?`, userID).Scan(&downloads)
	_ = s.DB.QueryRowContext(ctx, `SELECT COALESCE(SUM(like_count),0) FROM models WHERE owner_id = ?`, userID).Scan(&likes)
	return
}

func (s *Store) RelatedModels(ctx context.Context, modelID, viewerID string, limit int) ([]Model, error) {
	if limit < 1 || limit > 24 {
		limit = 8
	}
	rows, err := s.DB.QueryContext(ctx, modelSelect+`
		WHERE m.id <> ? AND m.status='published' AND (m.visibility='public' OR (m.visibility='members' AND ? <> ''))
		AND (m.category_id = (SELECT category_id FROM models WHERE id = ?)
			OR EXISTS(SELECT 1 FROM model_tags mt JOIN model_tags mine ON mine.tag_id=mt.tag_id
				WHERE mt.model_id=m.id AND mine.model_id=?))
		ORDER BY m.like_count DESC, m.created_at DESC LIMIT ?`,
		viewerID, viewerID, viewerID, modelID, viewerID, modelID, modelID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Model
	for rows.Next() {
		m, err := scanModel(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, m)
	}
	if out == nil {
		out = []Model{}
	}
	return out, rows.Err()
}

func (s *Store) IncrementView(ctx context.Context, id string) {
	_, _ = s.DB.ExecContext(ctx, `UPDATE models SET view_count = view_count + 1 WHERE id = ?`, id)
}

func (s *Store) Stats(ctx context.Context) (models, users int64, downloads int64, files int64) {
	_ = s.DB.QueryRowContext(ctx, `SELECT COUNT(*) FROM models WHERE status='published' AND visibility='public'`).Scan(&models)
	_ = s.DB.QueryRowContext(ctx, `SELECT COUNT(*) FROM users WHERE is_active=1`).Scan(&users)
	_ = s.DB.QueryRowContext(ctx, `SELECT COALESCE(SUM(download_count),0) FROM models`).Scan(&downloads)
	_ = s.DB.QueryRowContext(ctx, `SELECT COUNT(*) FROM model_files`).Scan(&files)
	return
}

func Slugify(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	var b strings.Builder
	lastDash := false
	for _, r := range s {
		switch {
		case r >= 'a' && r <= 'z', r >= '0' && r <= '9':
			b.WriteRune(r)
			lastDash = false
		case r == ' ' || r == '-' || r == '_' || r == '.' || r == '/':
			if !lastDash && b.Len() > 0 {
				b.WriteByte('-')
				lastDash = true
			}
		}
	}
	out := strings.Trim(b.String(), "-")
	if len(out) > 64 {
		out = out[:64]
		out = strings.Trim(out, "-")
	}
	if out == "" {
		out = "model"
	}
	return out
}

func nullIfEmpty(s string) any {
	if s == "" {
		return nil
	}
	return s
}

type Creator struct {
	Username    string `json:"username"`
	DisplayName string `json:"displayName"`
	Bio         string `json:"bio"`
	ModelCount  int64  `json:"modelCount"`
	Downloads   int64  `json:"downloads"`
	Likes       int64  `json:"likes"`
}

func (s *Store) TopCreators(ctx context.Context, limit int) ([]Creator, error) {
	if limit < 1 || limit > 24 {
		limit = 6
	}
	rows, err := s.DB.QueryContext(ctx, `SELECT u.username,u.display_name,u.bio,COUNT(m.id),
		COALESCE(SUM(m.download_count),0),COALESCE(SUM(m.like_count),0)
		FROM users u JOIN models m ON m.owner_id=u.id
		WHERE u.is_active=1 AND m.status='published' AND m.visibility='public'
		GROUP BY u.id ORDER BY COUNT(m.id) DESC, SUM(m.like_count) DESC LIMIT ?`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Creator
	for rows.Next() {
		var c Creator
		if err := rows.Scan(&c.Username, &c.DisplayName, &c.Bio, &c.ModelCount, &c.Downloads, &c.Likes); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	if out == nil {
		out = []Creator{}
	}
	return out, rows.Err()
}
