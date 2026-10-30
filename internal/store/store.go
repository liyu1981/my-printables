package store

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/pressly/goose/v3"
	_ "modernc.org/sqlite"

	"myprintables/internal/config"
	"myprintables/migrations"
)

type Store struct {
	DB *sql.DB
}

func Open(cfg config.Config) (*Store, error) {
	if err := os.MkdirAll(cfg.DataDir, 0o750); err != nil {
		return nil, fmt.Errorf("create data dir: %w", err)
	}
	for _, dir := range []string{cfg.Path("media"), cfg.Path("tmp"), cfg.Path("backups")} {
		if err := os.MkdirAll(dir, 0o750); err != nil {
			return nil, fmt.Errorf("create data directory %s: %w", dir, err)
		}
	}

	dsn := fmt.Sprintf("file:%s?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)&_pragma=foreign_keys(1)&_pragma=synchronous(NORMAL)",
		filepath.ToSlash(cfg.DatabasePath()))
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(8)
	db.SetMaxIdleConns(8)
	db.SetConnMaxLifetime(0)
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("open database: %w", err)
	}
	return &Store{DB: db}, nil
}

func (s *Store) Close() error { return s.DB.Close() }

func (s *Store) Migrate() error {
	goose.SetBaseFS(migrations.FS)
	if err := goose.SetDialect("sqlite3"); err != nil {
		return err
	}
	if err := goose.Up(s.DB, "."); err != nil {
		return fmt.Errorf("migrate: %w", err)
	}
	return nil
}

func (s *Store) MigrationStatus() error {
	goose.SetBaseFS(migrations.FS)
	if err := goose.SetDialect("sqlite3"); err != nil {
		return err
	}
	return goose.Status(s.DB, ".")
}

// Setting returns a settings value, or fallback when it is missing.
func (s *Store) Setting(key, fallback string) string {
	var v string
	err := s.DB.QueryRow(`SELECT value FROM settings WHERE key = ?`, key).Scan(&v)
	if err != nil {
		return fallback
	}
	return v
}

func (s *Store) SetSetting(key, value, actorID string) error {
	_, err := s.DB.Exec(`INSERT INTO settings(key, value, updated_at, updated_by) VALUES(?, ?, ?, ?)
		ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at, updated_by=excluded.updated_by`,
		key, value, time.Now().Unix(), nullString(actorID))
	return err
}

func (s *Store) Settings() map[string]string {
	out := map[string]string{}
	rows, err := s.DB.Query(`SELECT key, value FROM settings`)
	if err != nil {
		return out
	}
	defer rows.Close()
	for rows.Next() {
		var k, v string
		if rows.Scan(&k, &v) == nil {
			out[k] = v
		}
	}
	return out
}

func (s *Store) VacuumInto(path string) error {
	_, err := s.DB.Exec(`VACUUM INTO ?`, path)
	return err
}

func nullString(v string) any {
	if v == "" {
		return nil
	}
	return v
}
