package store

import (
	"context"
	"database/sql"
	"time"
)

type AdminComment struct {
	Comment
	ModelTitle string `json:"modelTitle"`
}

type AuditEntry struct {
	ID         string `json:"id"`
	ActorID    string `json:"actorId,omitempty"`
	ActorName  string `json:"actorName,omitempty"`
	Action     string `json:"action"`
	TargetType string `json:"targetType"`
	TargetID   string `json:"targetId"`
	MetaJSON   string `json:"metaJson"`
	IPHash     string `json:"ipHash"`
	CreatedAt  int64  `json:"createdAt"`
}

func (s *Store) AdminComments(ctx context.Context, limit int) ([]AdminComment, error) {
	if limit < 1 || limit > 500 {
		limit = 200
	}
	rows, err := s.DB.QueryContext(ctx, `SELECT c.id,c.model_id,COALESCE(c.parent_id,''),c.body,c.created_at,c.updated_at,
		c.deleted_at,u.id,u.username,u.display_name,m.title
		FROM comments c JOIN users u ON u.id=c.user_id JOIN models m ON m.id=c.model_id
		ORDER BY c.created_at DESC LIMIT ?`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []AdminComment
	for rows.Next() {
		var c AdminComment
		var deleted sql.NullInt64
		if err := rows.Scan(&c.ID, &c.ModelID, &c.ParentID, &c.Body, &c.CreatedAt, &c.UpdatedAt, &deleted,
			&c.UserID, &c.Username, &c.DisplayName, &c.ModelTitle); err != nil {
			return nil, err
		}
		c.Deleted = deleted.Valid
		out = append(out, c)
	}
	if out == nil {
		out = []AdminComment{}
	}
	return out, rows.Err()
}

func (s *Store) AuditLog(ctx context.Context, limit int) ([]AuditEntry, error) {
	if limit < 1 || limit > 500 {
		limit = 200
	}
	rows, err := s.DB.QueryContext(ctx, `SELECT a.id,COALESCE(a.actor_id,''),COALESCE(u.display_name,''),a.action,
		a.target_type,a.target_id,a.meta_json,a.ip_hash,a.created_at
		FROM audit_log a LEFT JOIN users u ON u.id=a.actor_id ORDER BY a.created_at DESC LIMIT ?`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []AuditEntry
	for rows.Next() {
		var e AuditEntry
		if err := rows.Scan(&e.ID, &e.ActorID, &e.ActorName, &e.Action, &e.TargetType, &e.TargetID, &e.MetaJSON, &e.IPHash, &e.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, e)
	}
	if out == nil {
		out = []AuditEntry{}
	}
	return out, rows.Err()
}

func (s *Store) UserMediaPaths(ctx context.Context, userID string) ([]string, error) {
	var paths []string
	rows, err := s.DB.QueryContext(ctx, `SELECT storage_path FROM model_files WHERE model_id IN (SELECT id FROM models WHERE owner_id=?)`, userID)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var p string
		if err := rows.Scan(&p); err == nil {
			paths = append(paths, p)
		}
	}
	rows.Close()
	irows, err := s.DB.QueryContext(ctx, `SELECT original_path,large_path,thumb_path FROM model_images WHERE model_id IN (SELECT id FROM models WHERE owner_id=?)`, userID)
	if err != nil {
		return paths, err
	}
	defer irows.Close()
	for irows.Next() {
		var a, b, c string
		if err := irows.Scan(&a, &b, &c); err == nil {
			paths = append(paths, a, b, c)
		}
	}
	return paths, irows.Err()
}

func (s *Store) StorageStats(ctx context.Context) (files, mediaBytes int64) {
	_ = s.DB.QueryRowContext(ctx, `SELECT COUNT(*), COALESCE(SUM(size_bytes),0) FROM model_files`).Scan(&files, &mediaBytes)
	return
}

func (s *Store) RecentDownloads(ctx context.Context, limit int) (int64, error) {
	if limit < 1 {
		limit = 1000
	}
	var n int64
	err := s.DB.QueryRowContext(ctx, `SELECT COUNT(*) FROM downloads WHERE created_at > ?`, time.Now().Add(-24*time.Hour).Unix()).Scan(&n)
	return n, err
}
