package imaging

import (
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/disintegration/imaging"
	_ "golang.org/x/image/webp"
)

type Result struct {
	OriginalPath string
	LargePath    string
	ThumbPath    string
	Width        int
	Height       int
}

const maxPixels = 50_000_000

func Process(srcPath, destDir, imageID string) (Result, error) {
	var res Result
	f, err := os.Open(srcPath)
	if err != nil {
		return res, err
	}
	cfg, _, err := image.DecodeConfig(f)
	f.Close()
	if err != nil {
		return res, fmt.Errorf("decode image: %w", err)
	}
	if cfg.Width < 1 || cfg.Height < 1 || cfg.Width*cfg.Height > maxPixels {
		return res, fmt.Errorf("image dimensions are too large")
	}
	ext := strings.ToLower(filepath.Ext(srcPath))
	if ext == "" {
		ext = ".jpg"
	}
	switch ext {
	case ".jpg", ".jpeg", ".png", ".webp":
	default:
		ext = ".jpg"
	}
	if err := os.MkdirAll(destDir, 0o750); err != nil {
		return res, err
	}
	origName := imageID + ext
	origPath := filepath.Join(destDir, origName)
	if err := copyFile(srcPath, origPath); err != nil {
		return res, err
	}

	f, err = os.Open(srcPath)
	if err != nil {
		return res, err
	}
	src, err := imaging.Decode(f, imaging.AutoOrientation(true))
	f.Close()
	if err != nil {
		os.Remove(origPath)
		return res, fmt.Errorf("decode image: %w", err)
	}
	large := imaging.Fit(src, 1600, 1600, imaging.Lanczos)
	if large.Bounds().Dx() == 0 || large.Bounds().Dy() == 0 {
		large = imaging.Clone(src)
	}
	largeName := "large.jpg"
	thumbName := "thumb.jpg"
	largePath := filepath.Join(destDir, largeName)
	thumbPath := filepath.Join(destDir, thumbName)
	if err := imaging.Save(large, largePath, imaging.JPEGQuality(85)); err != nil {
		os.Remove(origPath)
		return res, err
	}
	thumb := imaging.Fit(src, 480, 480, imaging.Lanczos)
	if thumb.Bounds().Dx() == 0 || thumb.Bounds().Dy() == 0 {
		thumb = imaging.Clone(large)
	}
	if err := imaging.Save(thumb, thumbPath, imaging.JPEGQuality(82)); err != nil {
		os.Remove(origPath)
		os.Remove(largePath)
		return res, err
	}
	return Result{
		OriginalPath: origPath,
		LargePath:    largePath,
		ThumbPath:    thumbPath,
		Width:        src.Bounds().Dx(),
		Height:       src.Bounds().Dy(),
	}, nil
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()
	out, err := os.OpenFile(dst, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o640)
	if err != nil {
		return err
	}
	if _, err := io.Copy(out, in); err != nil {
		out.Close()
		os.Remove(dst)
		return err
	}
	if err := out.Close(); err != nil {
		os.Remove(dst)
		return err
	}
	return nil
}
