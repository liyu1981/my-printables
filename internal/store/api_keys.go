package store

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type APIKey struct {
	ID         string `json:"id"`
	UserID     string `json:"-"`
	Name       string `json:"name"`
	Prefix     string `json:"prefix"`
	CreatedAt  int64  `json:"createdAt"`
	LastUsedAt *int64 `json:"lastUsedAt"`
}

func (s *Store) CreateAPIKey(ctx context.Context, userID, name, keyHash, prefix string) (APIKey, error) {
	k := APIKey{ID: NewID(), UserID: userID, Name: name, Prefix: prefix, CreatedAt: time.Now().Unix()}
	_, err := s.DB.ExecContext(ctx, `INSERT INTO api_keys(id,user_id,name,key_hash,prefix,created_at)
		VALUES(?,?,?,?,?,?)`, k.ID, userID, name, keyHash, prefix, k.CreatedAt)
	return k, err
}

func (s *Store) ListAPIKeys(ctx context.Context, userID string) ([]APIKey, error) {
	rows, err := s.DB.QueryContext(ctx, `SELECT id,name,prefix,created_at,last_used_at FROM api_keys
		WHERE user_id = ? ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []APIKey
	for rows.Next() {
		var k APIKey
		if err := rows.Scan(&k.ID, &k.Name, &k.Prefix, &k.CreatedAt, &k.LastUsedAt); err != nil {
			return nil, err
		}
		k.UserID = userID
		out = append(out, k)
	}
	if out == nil {
		out = []APIKey{}
	}
	return out, rows.Err()
}

func (s *Store) APIKeyByHash(ctx context.Context, keyHash string) (APIKey, User, error) {
	var k APIKey
	var u User
	var active int
	var verified *int64
	err := s.DB.QueryRowContext(ctx, `SELECT k.id,k.user_id,k.name,k.prefix,k.created_at,k.last_used_at,
		u.id,u.email,u.username,u.display_name,u.role,u.bio,u.avatar_path,u.is_active,u.email_verified_at,
		u.created_at,u.updated_at,u.last_login_at
		FROM api_keys k JOIN users u ON u.id=k.user_id WHERE k.key_hash = ?`, keyHash).Scan(
		&k.ID, &k.UserID, &k.Name, &k.Prefix, &k.CreatedAt, &k.LastUsedAt,
		&u.ID, &u.Email, &u.Username, &u.DisplayName, &u.Role, &u.Bio, &u.AvatarPath, &active,
		&verified, &u.CreatedAt, &u.UpdatedAt, &u.LastLoginAt)
	if errors.Is(err, sql.ErrNoRows) {
		return k, u, ErrNotFound
	}
	if err != nil {
		return k, u, err
	}
	u.IsActive = active == 1
	u.EmailVerifiedAt = verified
	if !u.IsActive {
		return k, u, ErrNotFound
	}
	return k, u, nil
}

func (s *Store) TouchAPIKey(ctx context.Context, id string) {
	_, _ = s.DB.ExecContext(ctx, `UPDATE api_keys SET last_used_at = ? WHERE id = ?`, time.Now().Unix(), id)
}

func (s *Store) DeleteAPIKey(ctx context.Context, id, userID string) error {
	res, err := s.DB.ExecContext(ctx, `DELETE FROM api_keys WHERE id = ? AND user_id = ?`, id, userID)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return ErrNotFound
	}
	return nil
}
