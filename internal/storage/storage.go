package storage

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Store struct {
	Root string
}

func New(root string) *Store { return &Store{Root: root} }

func (s *Store) Rel(parts ...string) string {
	all := append([]string{}, parts...)
	return filepath.ToSlash(filepath.Join(all...))
}

func (s *Store) Abs(rel string) (string, error) {
	rel = filepath.FromSlash(rel)
	clean := filepath.Clean(rel)
	if clean == "." || strings.HasPrefix(clean, "..") || filepath.IsAbs(clean) {
		return "", fmt.Errorf("invalid storage path")
	}
	abs := filepath.Join(s.Root, clean)
	rootClean := filepath.Clean(s.Root)
	if abs != rootClean && !strings.HasPrefix(abs, rootClean+string(os.PathSeparator)) {
		return "", fmt.Errorf("path escapes data directory")
	}
	return abs, nil
}

func (s *Store) TempFile(prefix string) (*os.File, error) {
	dir := filepath.Join(s.Root, "tmp")
	if err := os.MkdirAll(dir, 0o750); err != nil {
		return nil, err
	}
	return os.CreateTemp(dir, prefix+"-*")
}

func (s *Store) EnsureDir(rel string) error {
	abs, err := s.Abs(rel)
	if err != nil {
		return err
	}
	return os.MkdirAll(abs, 0o750)
}

func (s *Store) Remove(rel string) {
	if rel == "" {
		return
	}
	abs, err := s.Abs(rel)
	if err != nil {
		return
	}
	_ = os.Remove(abs)
}
