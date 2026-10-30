package store

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

func (s *Store) CreateSession(ctx context.Context, userID, tokenHash, csrf, ua, ipHash string, expiresAt int64) error {
	now := time.Now().Unix()
	_, err := s.DB.ExecContext(ctx, `INSERT INTO sessions
		(id, user_id, token_hash, csrf_token, user_agent, ip_hash, created_at, last_seen_at, expires_at)
		VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		NewID(), userID, tokenHash, csrf, ua, ipHash, now, now, expiresAt)
	return err
}

func (s *Store) SessionByToken(ctx context.Context, tokenHash string) (Session, error) {
	var sess Session
	var active int
	var verified *int64
	err := s.DB.QueryRowContext(ctx, `SELECT s.id, s.user_id, s.csrf_token, s.expires_at,
		u.id, u.email, u.username, u.display_name, u.role, u.bio, u.avatar_path, u.is_active,
		u.email_verified_at, u.created_at, u.updated_at, u.last_login_at
		FROM sessions s JOIN users u ON u.id = s.user_id
		WHERE s.token_hash = ? AND s.expires_at > ?`, tokenHash, time.Now().Unix()).Scan(
		&sess.ID, &sess.UserID, &sess.CSRFToken, &sess.ExpiresAt,
		&sess.User.ID, &sess.User.Email, &sess.User.Username, &sess.User.DisplayName, &sess.User.Role,
		&sess.User.Bio, &sess.User.AvatarPath, &active, &verified, &sess.User.CreatedAt,
		&sess.User.UpdatedAt, &sess.User.LastLoginAt)
	if errors.Is(err, sql.ErrNoRows) {
		return sess, ErrNotFound
	}
	if err != nil {
		return sess, err
	}
	sess.User.IsActive = active == 1
	sess.User.EmailVerifiedAt = verified
	return sess, nil
}

func (s *Store) TouchSession(ctx context.Context, id string) {
	_, _ = s.DB.ExecContext(ctx, `UPDATE sessions SET last_seen_at = ? WHERE id = ?`, time.Now().Unix(), id)
}

func (s *Store) DeleteSession(ctx context.Context, tokenHash string) error {
	_, err := s.DB.ExecContext(ctx, `DELETE FROM sessions WHERE token_hash = ?`, tokenHash)
	return err
}

func (s *Store) DeleteUserSessions(ctx context.Context, userID string) error {
	_, err := s.DB.ExecContext(ctx, `DELETE FROM sessions WHERE user_id = ?`, userID)
	return err
}

func (s *Store) DeleteOtherSessions(ctx context.Context, userID, keepTokenHash string) error {
	_, err := s.DB.ExecContext(ctx, `DELETE FROM sessions WHERE user_id = ? AND token_hash <> ?`, userID, keepTokenHash)
	return err
}

func (s *Store) CreateEmailToken(ctx context.Context, userID, tokenHash string, expiresAt int64) error {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	if _, err := tx.ExecContext(ctx, `DELETE FROM email_verification_tokens WHERE user_id = ?`, userID); err != nil {
		return err
	}
	_, err = tx.ExecContext(ctx, `INSERT INTO email_verification_tokens(id, user_id, token_hash, expires_at, created_at)
		VALUES(?, ?, ?, ?, ?)`, NewID(), userID, tokenHash, expiresAt, time.Now().Unix())
	if err != nil {
		return err
	}
	return tx.Commit()
}

func (s *Store) ConsumeEmailToken(ctx context.Context, tokenHash string) (string, error) {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return "", err
	}
	defer tx.Rollback()
	var id, userID string
	var expires int64
	var used *int64
	err = tx.QueryRowContext(ctx, `SELECT id, user_id, expires_at, used_at FROM email_verification_tokens WHERE token_hash = ?`, tokenHash).
		Scan(&id, &userID, &expires, &used)
	if errors.Is(err, sql.ErrNoRows) {
		return "", ErrNotFound
	}
	if err != nil {
		return "", err
	}
	if used != nil || expires < time.Now().Unix() {
		return "", ErrNotFound
	}
	now := time.Now().Unix()
	if _, err := tx.ExecContext(ctx, `UPDATE email_verification_tokens SET used_at = ? WHERE id = ?`, now, id); err != nil {
		return "", err
	}
	if _, err := tx.ExecContext(ctx, `UPDATE users SET email_verified_at = ?, updated_at = ? WHERE id = ?`, now, now, userID); err != nil {
		return "", err
	}
	return userID, tx.Commit()
}

func (s *Store) SetEmailVerified(ctx context.Context, userID string) error {
	now := time.Now().Unix()
	_, err := s.DB.ExecContext(ctx, `UPDATE users SET email_verified_at = ?, updated_at = ? WHERE id = ?`, now, now, userID)
	return err
}

func (s *Store) MarkLogin(ctx context.Context, userID string) {
	now := time.Now().Unix()
	_, _ = s.DB.ExecContext(ctx, `UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?`, now, now, userID)
}
