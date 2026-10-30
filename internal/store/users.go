package store

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/oklog/ulid/v2"
	"modernc.org/sqlite"
	sqlite3 "modernc.org/sqlite/lib"
)

var ErrNotFound = errors.New("not found")
var ErrConflict = errors.New("conflict")

type User struct {
	ID              string `json:"id"`
	Email           string `json:"email"`
	Username        string `json:"username"`
	DisplayName     string `json:"displayName"`
	Role            string `json:"role"`
	Bio             string `json:"bio"`
	AvatarPath      string `json:"-"`
	IsActive        bool   `json:"isActive"`
	EmailVerifiedAt *int64 `json:"emailVerifiedAt"`
	CreatedAt       int64  `json:"createdAt"`
	UpdatedAt       int64  `json:"updatedAt"`
	LastLoginAt     *int64 `json:"lastLoginAt"`
}

type Session struct {
	ID        string
	UserID    string
	CSRFToken string
	ExpiresAt int64
	User      User
}

func NewID() string {
	return ulid.Make().String()
}

func (s *Store) CountUsers(ctx context.Context) (int, error) {
	var n int
	err := s.DB.QueryRowContext(ctx, `SELECT COUNT(*) FROM users`).Scan(&n)
	return n, err
}

func (s *Store) CreateUser(ctx context.Context, u User, passwordHash string) error {
	now := time.Now().Unix()
	if u.ID == "" {
		u.ID = NewID()
	}
	verified := u.EmailVerifiedAt
	_, err := s.DB.ExecContext(ctx, `INSERT INTO users
		(id, email, username, display_name, password_hash, role, bio, is_active, email_verified_at, created_at, updated_at)
		VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		u.ID, strings.ToLower(u.Email), u.Username, u.DisplayName, passwordHash, u.Role, u.Bio,
		boolInt(u.IsActive), verified, now, now)
	if err != nil {
		if isUniqueViolation(err) {
			return ErrConflict
		}
		return err
	}
	return nil
}

func (s *Store) UserByEmail(ctx context.Context, email string) (User, string, error) {
	return s.scanUserWithHash(ctx, `SELECT id,email,username,display_name,role,bio,avatar_path,is_active,
		email_verified_at,created_at,updated_at,last_login_at,password_hash FROM users WHERE email = ?`, strings.ToLower(email))
}

func (s *Store) UserByLogin(ctx context.Context, login string) (User, string, error) {
	return s.scanUserWithHash(ctx, `SELECT id,email,username,display_name,role,bio,avatar_path,is_active,
		email_verified_at,created_at,updated_at,last_login_at,password_hash FROM users
		WHERE email = ? OR username = ?`, strings.ToLower(login), login)
}

func (s *Store) UserByID(ctx context.Context, id string) (User, error) {
	u, _, err := s.scanUserWithHash(ctx, `SELECT id,email,username,display_name,role,bio,avatar_path,is_active,
		email_verified_at,created_at,updated_at,last_login_at,password_hash FROM users WHERE id = ?`, id)
	return u, err
}

func (s *Store) UserByUsername(ctx context.Context, username string) (User, error) {
	u, _, err := s.scanUserWithHash(ctx, `SELECT id,email,username,display_name,role,bio,avatar_path,is_active,
		email_verified_at,created_at,updated_at,last_login_at,password_hash FROM users WHERE username = ?`, username)
	return u, err
}

func (s *Store) scanUserWithHash(ctx context.Context, query string, args ...any) (User, string, error) {
	var u User
	var hash string
	var active int
	err := s.DB.QueryRowContext(ctx, query, args...).Scan(
		&u.ID, &u.Email, &u.Username, &u.DisplayName, &u.Role, &u.Bio, &u.AvatarPath, &active,
		&u.EmailVerifiedAt, &u.CreatedAt, &u.UpdatedAt, &u.LastLoginAt, &hash)
	if errors.Is(err, sql.ErrNoRows) {
		return u, "", ErrNotFound
	}
	if err != nil {
		return u, "", err
	}
	u.IsActive = active == 1
	return u, hash, nil
}

func (s *Store) UpdateUser(ctx context.Context, id string, fields map[string]any) error {
	if len(fields) == 0 {
		return nil
	}
	allowed := map[string]bool{
		"email": true, "username": true, "display_name": true, "bio": true, "role": true,
		"is_active": true, "email_verified_at": true, "password_hash": true,
	}
	sets := make([]string, 0, len(fields)+1)
	args := make([]any, 0, len(fields)+2)
	for k, v := range fields {
		if !allowed[k] {
			return fmt.Errorf("invalid user field %q", k)
		}
		sets = append(sets, k+" = ?")
		args = append(args, v)
	}
	sets = append(sets, "updated_at = ?")
	args = append(args, time.Now().Unix(), id)
	res, err := s.DB.ExecContext(ctx, `UPDATE users SET `+strings.Join(sets, ", ")+` WHERE id = ?`, args...)
	if err != nil {
		if isUniqueViolation(err) {
			return ErrConflict
		}
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return ErrNotFound
	}
	return nil
}

func (s *Store) ListUsers(ctx context.Context, q string, limit int) ([]User, error) {
	if limit <= 0 || limit > 200 {
		limit = 100
	}
	query := `SELECT id,email,username,display_name,role,bio,avatar_path,is_active,email_verified_at,
		created_at,updated_at,last_login_at FROM users`
	args := []any{}
	if q != "" {
		query += ` WHERE email LIKE ? OR username LIKE ? OR display_name LIKE ?`
		like := "%" + q + "%"
		args = append(args, like, like, like)
	}
	query += ` ORDER BY created_at DESC LIMIT ?`
	args = append(args, limit)
	rows, err := s.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []User
	for rows.Next() {
		var u User
		var active int
		if err := rows.Scan(&u.ID, &u.Email, &u.Username, &u.DisplayName, &u.Role, &u.Bio, &u.AvatarPath,
			&active, &u.EmailVerifiedAt, &u.CreatedAt, &u.UpdatedAt, &u.LastLoginAt); err != nil {
			return nil, err
		}
		u.IsActive = active == 1
		out = append(out, u)
	}
	if out == nil {
		out = []User{}
	}
	return out, rows.Err()
}

func (s *Store) DeleteUser(ctx context.Context, id string) error {
	res, err := s.DB.ExecContext(ctx, `DELETE FROM users WHERE id = ?`, id)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return ErrNotFound
	}
	return nil
}

func isUniqueViolation(err error) bool {
	var sqliteErr *sqlite.Error
	if errors.As(err, &sqliteErr) {
		switch sqliteErr.Code() {
		case sqlite3.SQLITE_CONSTRAINT_UNIQUE, sqlite3.SQLITE_CONSTRAINT_PRIMARYKEY:
			return true
		}
	}
	return strings.Contains(strings.ToLower(err.Error()), "unique")
}

func boolInt(v bool) int {
	if v {
		return 1
	}
	return 0
}
