package store

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"
)

type Comment struct {
	ID          string    `json:"id"`
	ModelID     string    `json:"modelId"`
	ParentID    string    `json:"parentId,omitempty"`
	Body        string    `json:"body"`
	UserID      string    `json:"userId"`
	Username    string    `json:"username"`
	DisplayName string    `json:"displayName"`
	CreatedAt   int64     `json:"createdAt"`
	UpdatedAt   int64     `json:"updatedAt"`
	Deleted     bool      `json:"deleted"`
	Replies     []Comment `json:"replies,omitempty"`
}

type CommentPage struct {
	Items      []Comment `json:"items"`
	Page       int       `json:"page"`
	PerPage    int       `json:"perPage"`
	Total      int       `json:"total"`
	TotalPages int       `json:"totalPages"`
}

type RatingSummary struct {
	Avg   float64 `json:"ratingAvg"`
	Count int64   `json:"ratingCount"`
	My    int     `json:"myRating"`
}

type CollectionCover struct {
	ModelID string `json:"modelId"`
	ImageID string `json:"imageId"`
}

type Collection struct {
	ID            string            `json:"id"`
	OwnerID       string            `json:"ownerId"`
	OwnerUsername string            `json:"ownerUsername"`
	OwnerName     string            `json:"ownerName"`
	Name          string            `json:"name"`
	Slug          string            `json:"slug"`
	Description   string            `json:"description"`
	Visibility    string            `json:"visibility"`
	ModelCount    int64             `json:"modelCount"`
	CreatedAt     int64             `json:"createdAt"`
	UpdatedAt     int64             `json:"updatedAt"`
	Covers        []CollectionCover `json:"covers"`
}

type CollectionPage struct {
	Items      []Collection `json:"items"`
	Page       int          `json:"page"`
	PerPage    int          `json:"perPage"`
	Total      int          `json:"total"`
	TotalPages int          `json:"totalPages"`
}

func (s *Store) Comments(ctx context.Context, modelID string, page, perPage int, sort string) (CommentPage, error) {
	if page < 1 {
		page = 1
	}
	if perPage < 1 || perPage > 50 {
		perPage = 20
	}
	order := "DESC"
	if sort == "old" {
		order = "ASC"
	}
	var total int
	if err := s.DB.QueryRowContext(ctx, `SELECT COUNT(*) FROM comments WHERE model_id = ? AND parent_id IS NULL AND deleted_at IS NULL`, modelID).Scan(&total); err != nil {
		return CommentPage{}, err
	}
	rows, err := s.DB.QueryContext(ctx, `SELECT c.id,c.model_id,COALESCE(c.parent_id,''),c.body,c.created_at,c.updated_at,
		c.deleted_at,u.id,u.username,u.display_name
		FROM comments c JOIN users u ON u.id=c.user_id
		WHERE c.model_id = ? AND c.parent_id IS NULL AND c.deleted_at IS NULL
		ORDER BY c.created_at `+order+` LIMIT ? OFFSET ?`, modelID, perPage, (page-1)*perPage)
	if err != nil {
		return CommentPage{}, err
	}
	defer rows.Close()
	var items []Comment
	var ids []any
	var placeholders []string
	for rows.Next() {
		c, err := scanComment(rows)
		if err != nil {
			return CommentPage{}, err
		}
		items = append(items, c)
		ids = append(ids, c.ID)
		placeholders = append(placeholders, "?")
	}
	if err := rows.Err(); err != nil {
		return CommentPage{}, err
	}
	if len(ids) > 0 {
		q := `SELECT c.id,c.model_id,COALESCE(c.parent_id,''),c.body,c.created_at,c.updated_at,
			c.deleted_at,u.id,u.username,u.display_name
			FROM comments c JOIN users u ON u.id=c.user_id
			WHERE c.parent_id IN (` + strings.Join(placeholders, ",") + `) AND c.deleted_at IS NULL
			ORDER BY c.created_at ASC`
		rrows, err := s.DB.QueryContext(ctx, q, ids...)
		if err != nil {
			return CommentPage{}, err
		}
		defer rrows.Close()
		byParent := map[string][]Comment{}
		for rrows.Next() {
			c, err := scanComment(rrows)
			if err != nil {
				return CommentPage{}, err
			}
			byParent[c.ParentID] = append(byParent[c.ParentID], c)
		}
		for i := range items {
			items[i].Replies = byParent[items[i].ID]
			if items[i].Replies == nil {
				items[i].Replies = []Comment{}
			}
		}
	}
	if items == nil {
		items = []Comment{}
	}
	pages := 0
	if total > 0 {
		pages = (total + perPage - 1) / perPage
	}
	return CommentPage{Items: items, Page: page, PerPage: perPage, Total: total, TotalPages: pages}, nil
}

func scanComment(row scanner) (Comment, error) {
	var c Comment
	var deleted sql.NullInt64
	err := row.Scan(&c.ID, &c.ModelID, &c.ParentID, &c.Body, &c.CreatedAt, &c.UpdatedAt, &deleted,
		&c.UserID, &c.Username, &c.DisplayName)
	if err != nil {
		return c, err
	}
	if deleted.Valid {
		c.Deleted = true
		c.Body = ""
	}
	return c, nil
}

func (s *Store) CreateComment(ctx context.Context, c *Comment) error {
	now := time.Now().Unix()
	c.ID = NewID()
	c.CreatedAt, c.UpdatedAt = now, now
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	_, err = tx.ExecContext(ctx, `INSERT INTO comments(id,model_id,user_id,parent_id,body,created_at,updated_at)
		VALUES(?,?,?,?,?,?,?)`, c.ID, c.ModelID, c.UserID, nullIfEmpty(c.ParentID), c.Body, now, now)
	if err != nil {
		return err
	}
	if _, err := tx.ExecContext(ctx, `UPDATE models SET comment_count = comment_count + 1, updated_at = ? WHERE id = ?`, now, c.ModelID); err != nil {
		return err
	}
	return tx.Commit()
}

func (s *Store) CommentByID(ctx context.Context, id string) (Comment, error) {
	row := s.DB.QueryRowContext(ctx, `SELECT c.id,c.model_id,COALESCE(c.parent_id,''),c.body,c.created_at,c.updated_at,
		c.deleted_at,u.id,u.username,u.display_name
		FROM comments c JOIN users u ON u.id=c.user_id WHERE c.id = ?`, id)
	var c Comment
	var deleted sql.NullInt64
	if err := row.Scan(&c.ID, &c.ModelID, &c.ParentID, &c.Body, &c.CreatedAt, &c.UpdatedAt, &deleted, &c.UserID, &c.Username, &c.DisplayName); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return c, ErrNotFound
		}
		return c, err
	}
	c.Deleted = deleted.Valid
	if c.Deleted {
		c.Body = ""
	}
	return c, nil
}

func (s *Store) UpdateComment(ctx context.Context, id, userID, body string) error {
	now := time.Now().Unix()
	res, err := s.DB.ExecContext(ctx, `UPDATE comments SET body=?, updated_at=? WHERE id=? AND user_id=? AND deleted_at IS NULL`, body, now, id, userID)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return ErrNotFound
	}
	return nil
}

func (s *Store) DeleteComment(ctx context.Context, id string) error {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	var modelID string
	var deleted sql.NullInt64
	if err := tx.QueryRowContext(ctx, `SELECT model_id,deleted_at FROM comments WHERE id=?`, id).Scan(&modelID, &deleted); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrNotFound
		}
		return err
	}
	if !deleted.Valid {
		now := time.Now().Unix()
		if _, err := tx.ExecContext(ctx, `UPDATE comments SET deleted_at=?, updated_at=? WHERE id=?`, now, now, id); err != nil {
			return err
		}
		if _, err := tx.ExecContext(ctx, `UPDATE models SET comment_count = MAX(0, comment_count - 1) WHERE id=?`, modelID); err != nil {
			return err
		}
	}
	return tx.Commit()
}

func (s *Store) RateModel(ctx context.Context, userID, modelID string, score int) (RatingSummary, error) {
	if score < 1 || score > 5 {
		return RatingSummary{}, fmt.Errorf("rating must be 1–5")
	}
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return RatingSummary{}, err
	}
	defer tx.Rollback()
	now := time.Now().Unix()
	if _, err := tx.ExecContext(ctx, `INSERT INTO ratings(user_id,model_id,score,created_at,updated_at)
		VALUES(?,?,?,?,?) ON CONFLICT(user_id,model_id) DO UPDATE SET score=excluded.score, updated_at=excluded.updated_at`,
		userID, modelID, score, now, now); err != nil {
		return RatingSummary{}, err
	}
	summary, err := recalcRatingTx(ctx, tx, modelID, userID)
	if err != nil {
		return RatingSummary{}, err
	}
	if err := tx.Commit(); err != nil {
		return RatingSummary{}, err
	}
	return summary, nil
}

func (s *Store) UnrateModel(ctx context.Context, userID, modelID string) (RatingSummary, error) {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return RatingSummary{}, err
	}
	defer tx.Rollback()
	if _, err := tx.ExecContext(ctx, `DELETE FROM ratings WHERE user_id=? AND model_id=?`, userID, modelID); err != nil {
		return RatingSummary{}, err
	}
	summary, err := recalcRatingTx(ctx, tx, modelID, userID)
	if err != nil {
		return RatingSummary{}, err
	}
	if err := tx.Commit(); err != nil {
		return RatingSummary{}, err
	}
	return summary, nil
}

func recalcRatingTx(ctx context.Context, tx *sql.Tx, modelID, userID string) (RatingSummary, error) {
	var avg sql.NullFloat64
	var count int64
	if err := tx.QueryRowContext(ctx, `SELECT AVG(score), COUNT(*) FROM ratings WHERE model_id=?`, modelID).Scan(&avg, &count); err != nil {
		return RatingSummary{}, err
	}
	a := 0.0
	if avg.Valid {
		a = avg.Float64
	}
	if _, err := tx.ExecContext(ctx, `UPDATE models SET rating_avg=?, rating_count=? WHERE id=?`, a, count, modelID); err != nil {
		return RatingSummary{}, err
	}
	var mine int
	if err := tx.QueryRowContext(ctx, `SELECT COALESCE((SELECT score FROM ratings WHERE user_id=? AND model_id=?),0)`, userID, modelID).Scan(&mine); err != nil {
		return RatingSummary{}, err
	}
	return RatingSummary{Avg: a, Count: count, My: mine}, nil
}

func (s *Store) ListCollections(ctx context.Context, owner, viewerID, q, visibility string, page, perPage int, admin bool) (CollectionPage, error) {
	if page < 1 {
		page = 1
	}
	if perPage < 1 || perPage > 100 {
		perPage = 24
	}
	var where []string
	var args []any
	if admin {
		// administrators see every collection
	} else if viewerID != "" {
		where = append(where, "(c.visibility IN ('public','members') OR c.owner_id=?)")
		args = append(args, viewerID)
	} else {
		where = append(where, "c.visibility='public'")
	}
	if owner != "" {
		where = append(where, "u.username=?")
		args = append(args, owner)
	}
	if q != "" {
		where = append(where, "(c.name LIKE ? OR c.description LIKE ?)")
		like := "%" + q + "%"
		args = append(args, like, like)
	}
	if visibility != "" {
		where = append(where, "c.visibility=?")
		args = append(args, visibility)
	}
	w := ""
	if len(where) > 0 {
		w = " WHERE " + strings.Join(where, " AND ")
	}
	var total int
	if err := s.DB.QueryRowContext(ctx, `SELECT COUNT(*) FROM collections c JOIN users u ON u.id=c.owner_id`+w, args...).Scan(&total); err != nil {
		return CollectionPage{}, err
	}
	rows, err := s.DB.QueryContext(ctx, `SELECT c.id,c.owner_id,u.username,u.display_name,c.name,c.slug,c.description,
		c.visibility,c.model_count,c.created_at,c.updated_at FROM collections c JOIN users u ON u.id=c.owner_id`+w+`
		ORDER BY c.updated_at DESC LIMIT ? OFFSET ?`, append(args, perPage, (page-1)*perPage)...)
	if err != nil {
		return CollectionPage{}, err
	}
	defer rows.Close()
	var items []Collection
	for rows.Next() {
		c, err := scanCollection(rows)
		if err != nil {
			return CollectionPage{}, err
		}
		c.Covers, _ = s.collectionCovers(ctx, c.ID, viewerID, admin)
		items = append(items, c)
	}
	if items == nil {
		items = []Collection{}
	}
	pages := 0
	if total > 0 {
		pages = (total + perPage - 1) / perPage
	}
	return CollectionPage{Items: items, Page: page, PerPage: perPage, Total: total, TotalPages: pages}, rows.Err()
}

func scanCollection(row scanner) (Collection, error) {
	var c Collection
	err := row.Scan(&c.ID, &c.OwnerID, &c.OwnerUsername, &c.OwnerName, &c.Name, &c.Slug, &c.Description,
		&c.Visibility, &c.ModelCount, &c.CreatedAt, &c.UpdatedAt)
	return c, err
}

func (s *Store) CollectionByID(ctx context.Context, id, viewerID string, admin bool) (Collection, error) {
	row := s.DB.QueryRowContext(ctx, `SELECT c.id,c.owner_id,u.username,u.display_name,c.name,c.slug,c.description,
		c.visibility,c.model_count,c.created_at,c.updated_at FROM collections c JOIN users u ON u.id=c.owner_id
		WHERE c.id=?`, id)
	c, err := scanCollection(row)
	if errors.Is(err, sql.ErrNoRows) {
		return c, ErrNotFound
	}
	if err != nil {
		return c, err
	}
	c.Covers, _ = s.collectionCovers(ctx, c.ID, viewerID, admin)
	return c, nil
}

func (s *Store) collectionCovers(ctx context.Context, collectionID, viewerID string, admin bool) ([]CollectionCover, error) {
	q := `SELECT cm.model_id, COALESCE((SELECT mi.id FROM model_images mi WHERE mi.model_id=cm.model_id ORDER BY mi.sort_order, mi.created_at LIMIT 1),'')
		FROM collection_models cm JOIN models m ON m.id=cm.model_id
		WHERE cm.collection_id=? AND m.status='published'`
	args := []any{collectionID}
	if !admin {
		if viewerID != "" {
			q += ` AND (m.visibility IN ('public','members') OR m.owner_id=?)`
			args = append(args, viewerID)
		} else {
			q += ` AND m.visibility='public'`
		}
	}
	q += ` ORDER BY cm.sort_order, cm.added_at LIMIT 4`
	rows, err := s.DB.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []CollectionCover
	for rows.Next() {
		var c CollectionCover
		if err := rows.Scan(&c.ModelID, &c.ImageID); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	if out == nil {
		out = []CollectionCover{}
	}
	return out, rows.Err()
}

func (s *Store) CreateCollection(ctx context.Context, c *Collection) error {
	now := time.Now().Unix()
	c.ID = NewID()
	c.CreatedAt, c.UpdatedAt = now, now
	c.Slug = Slugify(c.Name) + "-" + strings.ToLower(c.ID[len(c.ID)-5:])
	_, err := s.DB.ExecContext(ctx, `INSERT INTO collections(id,owner_id,name,slug,description,visibility,
		model_count,created_at,updated_at) VALUES(?,?,?,?,?,?,0,?,?)`,
		c.ID, c.OwnerID, c.Name, c.Slug, c.Description, c.Visibility, now, now)
	return err
}

func (s *Store) UpdateCollection(ctx context.Context, id string, fields map[string]any) error {
	allowed := map[string]bool{"name": true, "description": true, "visibility": true}
	var sets []string
	var args []any
	for k, v := range fields {
		if !allowed[k] {
			return fmt.Errorf("invalid collection field %q", k)
		}
		sets = append(sets, k+"=?")
		args = append(args, v)
	}
	if len(sets) == 0 {
		return nil
	}
	sets = append(sets, "updated_at=?")
	args = append(args, time.Now().Unix(), id)
	res, err := s.DB.ExecContext(ctx, `UPDATE collections SET `+strings.Join(sets, ", ")+` WHERE id=?`, args...)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return ErrNotFound
	}
	return nil
}

func (s *Store) DeleteCollection(ctx context.Context, id string) error {
	_, err := s.DB.ExecContext(ctx, `DELETE FROM collections WHERE id=?`, id)
	return err
}

func (s *Store) AddToCollection(ctx context.Context, collectionID, modelID string) error {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	var count int
	if err := tx.QueryRowContext(ctx, `SELECT COUNT(*) FROM collection_models WHERE collection_id=?`, collectionID).Scan(&count); err != nil {
		return err
	}
	res, err := tx.ExecContext(ctx, `INSERT OR IGNORE INTO collection_models(collection_id,model_id,added_at,sort_order)
		VALUES(?,?,?,?)`, collectionID, modelID, time.Now().Unix(), count)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n > 0 {
		if _, err := tx.ExecContext(ctx, `UPDATE collections SET model_count=model_count+1, updated_at=? WHERE id=?`, time.Now().Unix(), collectionID); err != nil {
			return err
		}
		if _, err := tx.ExecContext(ctx, `UPDATE models SET collection_count=collection_count+1 WHERE id=?`, modelID); err != nil {
			return err
		}
	}
	return tx.Commit()
}

func (s *Store) RemoveFromCollection(ctx context.Context, collectionID, modelID string) error {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	res, err := tx.ExecContext(ctx, `DELETE FROM collection_models WHERE collection_id=? AND model_id=?`, collectionID, modelID)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n > 0 {
		if _, err := tx.ExecContext(ctx, `UPDATE collections SET model_count=MAX(0, model_count-1), updated_at=? WHERE id=?`, time.Now().Unix(), collectionID); err != nil {
			return err
		}
		if _, err := tx.ExecContext(ctx, `UPDATE models SET collection_count=MAX(0, collection_count-1) WHERE id=?`, modelID); err != nil {
			return err
		}
	}
	return tx.Commit()
}

func (s *Store) CollectionModelIDs(ctx context.Context, collectionID, viewerID string, admin bool) ([]string, error) {
	q := `SELECT cm.model_id FROM collection_models cm JOIN models m ON m.id=cm.model_id
		WHERE cm.collection_id=? AND m.status='published'`
	args := []any{collectionID}
	if !admin {
		if viewerID != "" {
			q += ` AND (m.visibility IN ('public','members') OR m.owner_id=?)`
			args = append(args, viewerID)
		} else {
			q += ` AND m.visibility='public'`
		}
	}
	q += ` ORDER BY cm.sort_order, cm.added_at`
	rows, err := s.DB.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var ids []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}
	return ids, rows.Err()
}

func (s *Store) CollectionsForModel(ctx context.Context, modelID, viewerID string, admin bool) ([]Collection, error) {
	q := `SELECT c.id,c.owner_id,u.username,u.display_name,c.name,c.slug,c.description,c.visibility,
		c.model_count,c.created_at,c.updated_at FROM collection_models cm
		JOIN collections c ON c.id=cm.collection_id JOIN users u ON u.id=c.owner_id
		WHERE cm.model_id=?`
	args := []any{modelID}
	if !admin {
		if viewerID != "" {
			q += ` AND (c.visibility IN ('public','members') OR c.owner_id=?)`
			args = append(args, viewerID)
		} else {
			q += ` AND c.visibility='public'`
		}
	}
	q += ` ORDER BY c.updated_at DESC`
	rows, err := s.DB.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Collection
	for rows.Next() {
		c, err := scanCollection(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	if out == nil {
		out = []Collection{}
	}
	return out, rows.Err()
}

func (s *Store) ReorderCollection(ctx context.Context, collectionID string, modelIDs []string) error {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	for i, id := range modelIDs {
		if _, err := tx.ExecContext(ctx, `UPDATE collection_models SET sort_order=? WHERE collection_id=? AND model_id=?`, i, collectionID, id); err != nil {
			return err
		}
	}
	if _, err := tx.ExecContext(ctx, `UPDATE collections SET updated_at=? WHERE id=?`, time.Now().Unix(), collectionID); err != nil {
		return err
	}
	return tx.Commit()
}
