package httpapi

import (
	"archive/zip"
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"

	"myprintables/internal/auth"
	imgproc "myprintables/internal/imaging"
	"myprintables/internal/store"
)

var gcodeCommand = regexp.MustCompile(`(?m)^\s*G0?[0-3](\s|[A-Z]|$)`)

var attachmentMime = map[string]string{
	".pdf": "application/pdf",
	".txt": "text/plain; charset=utf-8",
	".md":  "text/markdown; charset=utf-8",
	".zip": "application/zip",
}

var formatByExt = map[string]string{
	".stl": "stl", ".3mf": "3mf", ".obj": "obj", ".ply": "ply", ".glb": "glb", ".gltf": "gltf",
	".gcode": "gcode", ".gco": "gcode", ".g": "gcode",
	".step": "step", ".stp": "step",
}

func (s *Server) allowedFormats() map[string]bool {
	raw := s.st.Setting("allowed_formats", "stl,3mf,obj,ply,glb,gltf,gcode,step")
	out := map[string]bool{}
	for _, f := range strings.Split(raw, ",") {
		if f = strings.TrimSpace(strings.ToLower(f)); f != "" {
			out[f] = true
		}
	}
	if len(out) == 0 {
		out = map[string]bool{"stl": true, "3mf": true, "obj": true, "ply": true, "glb": true, "gltf": true, "gcode": true, "step": true}
	}
	return out
}

func (s *Server) maxUploadBytes() int64 {
	mb, _ := strconv.ParseInt(s.st.Setting("max_upload_mb", "1024"), 10, 64)
	if mb < 1 {
		mb = 1024
	}
	return mb * 1024 * 1024
}

func (s *Server) handleUploadFile(w http.ResponseWriter, r *http.Request) {
	modelID := chi.URLParam(r, "id")
	m, err := s.st.ModelByID(r.Context(), modelID, currentUser(r).ID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Model not found.")
		return
	}
	if !s.canEditModel(r, m) {
		writeErr(w, http.StatusForbidden, "forbidden", "You cannot upload to this model.")
		return
	}
	tmpPath, filename, size, sum, err := s.receiveUpload(r, s.maxUploadBytes())
	if err != nil {
		writeErr(w, http.StatusBadRequest, "upload_failed", err.Error())
		return
	}
	defer os.Remove(tmpPath)

	ext := strings.ToLower(filepath.Ext(filename))
	format, ok := formatByExt[ext]
	if !ok || !s.allowedFormats()[format] {
		writeErr(w, http.StatusBadRequest, "unsupported_format", "Unsupported model format. Use STL, 3MF, OBJ, PLY, GLB, GLTF, G-code, or STEP.")
		return
	}
	if err := validate3DFile(tmpPath, format); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_file", err.Error())
		return
	}
	fileID := store.NewID()
	rel := s.fs.Rel("media", "models", modelID, "files", fileID+ext)
	if err := s.fs.EnsureDir(s.fs.Rel("media", "models", modelID, "files")); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not prepare storage.")
		return
	}
	abs, err := s.fs.Abs(rel)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Invalid storage path.")
		return
	}
	if err := os.Rename(tmpPath, abs); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not store file.")
		return
	}
	var count int
	_ = s.st.DB.QueryRowContext(r.Context(), `SELECT COUNT(*) FROM model_files WHERE model_id = ?`, modelID).Scan(&count)
	f := store.ModelFile{
		ID: fileID, ModelID: modelID, Filename: cleanFilename(filename), Format: format, SizeBytes: size,
		SHA256: sum, IsPreview: count == 0, SortOrder: count, StorageRel: rel,
	}
	if err := s.st.AddFile(r.Context(), f); err != nil {
		s.fs.Remove(rel)
		writeErr(w, http.StatusInternalServerError, "internal", "Could not save file metadata.")
		return
	}
	_, _ = s.st.DB.ExecContext(r.Context(), `UPDATE models SET updated_at = ? WHERE id = ?`, time.Now().Unix(), modelID)
	s.audit(r, currentUser(r).ID, "model.file_uploaded", "model", modelID, jsonMap(map[string]any{"file": filename, "format": format}))
	writeJSON(w, http.StatusCreated, map[string]any{"file": f})
}

func (s *Server) handleDeleteFile(w http.ResponseWriter, r *http.Request) {
	modelID, fileID := chi.URLParam(r, "id"), chi.URLParam(r, "fileID")
	m, err := s.st.ModelByID(r.Context(), modelID, currentUser(r).ID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Model not found.")
		return
	}
	if !s.canEditModel(r, m) {
		writeErr(w, http.StatusForbidden, "forbidden", "You cannot edit this model.")
		return
	}
	path, err := s.st.DeleteFile(r.Context(), modelID, fileID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "File not found.")
		return
	}
	s.fs.Remove(path)
	_, _ = s.st.DB.ExecContext(r.Context(), `UPDATE model_files SET is_preview = 1 WHERE model_id = ? AND id = (
		SELECT id FROM model_files WHERE model_id = ? ORDER BY sort_order, created_at LIMIT 1)`, modelID, modelID)
	s.audit(r, currentUser(r).ID, "model.file_deleted", "model", modelID, jsonMap(map[string]string{"fileId": fileID}))
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleUploadImage(w http.ResponseWriter, r *http.Request) {
	modelID := chi.URLParam(r, "id")
	m, err := s.st.ModelByID(r.Context(), modelID, currentUser(r).ID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Model not found.")
		return
	}
	if !s.canEditModel(r, m) {
		writeErr(w, http.StatusForbidden, "forbidden", "You cannot upload to this model.")
		return
	}
	tmpPath, filename, _, _, err := s.receiveUpload(r, 20*1024*1024)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "upload_failed", err.Error())
		return
	}
	defer os.Remove(tmpPath)
	imgExt := strings.ToLower(filepath.Ext(filename))
	if imgExt != ".jpg" && imgExt != ".jpeg" && imgExt != ".png" && imgExt != ".webp" {
		writeErr(w, http.StatusBadRequest, "invalid_image", "Images must be JPEG, PNG, or WebP.")
		return
	}
	imageID := store.NewID()
	destRel := s.fs.Rel("media", "models", modelID, "images", imageID)
	destAbs, err := s.fs.Abs(destRel)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Invalid storage path.")
		return
	}
	res, err := imgproc.Process(tmpPath, destAbs, imageID)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_image", "Could not read this image. Use JPEG, PNG, or WebP.")
		return
	}
	rel := func(p string) string {
		r, _ := filepath.Rel(s.cfg.DataDir, p)
		return filepath.ToSlash(r)
	}
	kind := r.URL.Query().Get("kind")
	if kind != "render" {
		kind = "upload"
	}
	var count int
	_ = s.st.DB.QueryRowContext(r.Context(), `SELECT COUNT(*) FROM model_images WHERE model_id = ?`, modelID).Scan(&count)
	im := store.ModelImage{
		ID: imageID, ModelID: modelID, OriginalPath: rel(res.OriginalPath), LargePath: rel(res.LargePath),
		ThumbPath: rel(res.ThumbPath), Width: res.Width, Height: res.Height, Kind: kind, SortOrder: count,
	}
	if err := s.st.AddImage(r.Context(), im); err != nil {
		s.fs.Remove(im.OriginalPath)
		s.fs.Remove(im.LargePath)
		s.fs.Remove(im.ThumbPath)
		writeErr(w, http.StatusInternalServerError, "internal", "Could not save image metadata.")
		return
	}
	_, _ = s.st.DB.ExecContext(r.Context(), `UPDATE models SET updated_at = ? WHERE id = ?`, time.Now().Unix(), modelID)
	s.audit(r, currentUser(r).ID, "model.image_uploaded", "model", modelID, jsonMap(map[string]any{"image": filename}))
	writeJSON(w, http.StatusCreated, map[string]any{"image": im})
}

func (s *Server) handleDeleteImage(w http.ResponseWriter, r *http.Request) {
	modelID, imageID := chi.URLParam(r, "id"), chi.URLParam(r, "imageID")
	m, err := s.st.ModelByID(r.Context(), modelID, currentUser(r).ID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Model not found.")
		return
	}
	if !s.canEditModel(r, m) {
		writeErr(w, http.StatusForbidden, "forbidden", "You cannot edit this model.")
		return
	}
	paths, err := s.st.DeleteImage(r.Context(), modelID, imageID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Image not found.")
		return
	}
	for _, p := range paths {
		s.fs.Remove(p)
	}
	s.audit(r, currentUser(r).ID, "model.image_deleted", "model", modelID, jsonMap(map[string]string{"imageId": imageID}))
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) receiveUpload(r *http.Request, max int64) (tmpPath, filename string, size int64, sum string, err error) {
	mr, err := r.MultipartReader()
	if err != nil {
		return "", "", 0, "", fmt.Errorf("expected a multipart upload")
	}
	for {
		part, e := mr.NextPart()
		if errors.Is(e, io.EOF) {
			break
		}
		if e != nil {
			return "", "", 0, "", fmt.Errorf("could not read upload")
		}
		if part.FormName() != "file" && part.FileName() == "" {
			part.Close()
			continue
		}
		filename = cleanFilename(part.FileName())
		if filename == "" {
			part.Close()
			continue
		}
		ext := strings.ToLower(filepath.Ext(filename))
		tmp, e := s.fs.TempFile("upload-*" + ext)
		if e != nil {
			part.Close()
			return "", "", 0, "", fmt.Errorf("could not create temporary file")
		}
		h := sha256.New()
		n, e := io.Copy(io.MultiWriter(tmp, h), io.LimitReader(part, max+1))
		part.Close()
		tmp.Close()
		if e != nil {
			os.Remove(tmp.Name())
			return "", "", 0, "", fmt.Errorf("upload failed")
		}
		if n > max {
			os.Remove(tmp.Name())
			return "", "", 0, "", fmt.Errorf("file exceeds the configured upload limit")
		}
		if n == 0 {
			os.Remove(tmp.Name())
			return "", "", 0, "", fmt.Errorf("empty file")
		}
		return tmp.Name(), filename, n, hex.EncodeToString(h.Sum(nil)), nil
	}
	return "", "", 0, "", fmt.Errorf("no file was provided")
}

func cleanFilename(s string) string {
	s = strings.ReplaceAll(s, "\\", "/")
	s = filepath.Base(s)
	s = strings.Map(func(r rune) rune {
		if r < 32 || r == 127 {
			return -1
		}
		return r
	}, s)
	if len(s) > 200 {
		s = s[len(s)-200:]
	}
	if s == "." || s == "/" {
		return ""
	}
	return s
}

func (s *Server) handleUploadAttachment(w http.ResponseWriter, r *http.Request) {
	modelID := chi.URLParam(r, "id")
	m, err := s.st.ModelByID(r.Context(), modelID, currentUser(r).ID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Model not found.")
		return
	}
	if !s.canEditModel(r, m) {
		writeErr(w, http.StatusForbidden, "forbidden", "You cannot upload to this model.")
		return
	}
	tmpPath, filename, size, sum, err := s.receiveUpload(r, 50*1024*1024)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "upload_failed", err.Error())
		return
	}
	defer os.Remove(tmpPath)
	ext := strings.ToLower(filepath.Ext(filename))
	mimeType, ok := attachmentMime[ext]
	if !ok {
		writeErr(w, http.StatusBadRequest, "unsupported_attachment", "Attachments must be PDF, TXT, Markdown, or ZIP.")
		return
	}
	if err := validateAttachment(tmpPath, ext); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_attachment", err.Error())
		return
	}
	attachmentID := store.NewID()
	rel := s.fs.Rel("media", "models", modelID, "attachments", attachmentID+ext)
	if err := s.fs.EnsureDir(s.fs.Rel("media", "models", modelID, "attachments")); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not prepare storage.")
		return
	}
	abs, err := s.fs.Abs(rel)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Invalid storage path.")
		return
	}
	if err := os.Rename(tmpPath, abs); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not store attachment.")
		return
	}
	var count int
	_ = s.st.DB.QueryRowContext(r.Context(), `SELECT COUNT(*) FROM model_attachments WHERE model_id = ?`, modelID).Scan(&count)
	a := store.ModelAttachment{
		ID: attachmentID, ModelID: modelID, Filename: cleanFilename(filename), MimeType: mimeType,
		SizeBytes: size, SHA256: sum, SortOrder: count, StorageRel: rel,
	}
	if err := s.st.AddAttachment(r.Context(), a); err != nil {
		s.fs.Remove(rel)
		writeErr(w, http.StatusInternalServerError, "internal", "Could not save attachment metadata.")
		return
	}
	s.audit(r, currentUser(r).ID, "model.attachment_uploaded", "model", modelID, jsonMap(map[string]any{"file": filename}))
	writeJSON(w, http.StatusCreated, map[string]any{"attachment": a})
}

func (s *Server) handleDeleteAttachment(w http.ResponseWriter, r *http.Request) {
	modelID, attachmentID := chi.URLParam(r, "id"), chi.URLParam(r, "attachmentID")
	m, err := s.st.ModelByID(r.Context(), modelID, currentUser(r).ID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Model not found.")
		return
	}
	if !s.canEditModel(r, m) {
		writeErr(w, http.StatusForbidden, "forbidden", "You cannot edit this model.")
		return
	}
	path, err := s.st.DeleteAttachment(r.Context(), modelID, attachmentID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Attachment not found.")
		return
	}
	s.fs.Remove(path)
	s.audit(r, currentUser(r).ID, "model.attachment_deleted", "model", modelID, `{}`)
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleAttachmentContent(w http.ResponseWriter, r *http.Request) {
	modelID, attachmentID := chi.URLParam(r, "id"), chi.URLParam(r, "attachmentID")
	m, ok := s.loadViewableModel(w, r, modelID)
	if !ok {
		return
	}
	a, err := s.st.AttachmentByID(r.Context(), modelID, attachmentID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Attachment not found.")
		return
	}
	abs, err := s.fs.Abs(a.StorageRel)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Invalid storage path.")
		return
	}
	fh, err := os.Open(abs)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Attachment not found.")
		return
	}
	defer fh.Close()
	stat, err := fh.Stat()
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Attachment not found.")
		return
	}
	ct := a.MimeType
	if ct == "" {
		ct = mime.TypeByExtension(filepath.Ext(a.Filename))
	}
	w.Header().Set("Content-Type", ct)
	w.Header().Set("ETag", `"`+a.SHA256+`"`)
	w.Header().Set("Cache-Control", cacheFor(m.Visibility)+", immutable")
	disposition := "inline"
	if r.URL.Query().Get("download") == "1" || strings.EqualFold(filepath.Ext(a.Filename), ".zip") {
		disposition = "attachment"
	}
	w.Header().Set("Content-Disposition", mime.FormatMediaType(disposition, map[string]string{"filename": a.Filename}))
	http.ServeContent(w, r, a.Filename, stat.ModTime(), fh)
}

func validateAttachment(path, ext string) error {
	if ext == ".pdf" {
		f, err := os.Open(path)
		if err != nil {
			return errors.New("attachment is unreadable")
		}
		defer f.Close()
		buf := make([]byte, 5)
		_, _ = io.ReadFull(f, buf)
		if string(buf) != "%PDF-" {
			return errors.New("PDF file has an invalid header")
		}
	}
	if ext == ".zip" {
		f, err := os.Open(path)
		if err != nil {
			return errors.New("attachment is unreadable")
		}
		defer f.Close()
		buf := make([]byte, 4)
		_, _ = io.ReadFull(f, buf)
		if len(buf) < 2 || string(buf[:2]) != "PK" {
			return errors.New("ZIP file has an invalid header")
		}
	}
	return nil
}

func validate3DFile(path, format string) error {
	info, err := os.Stat(path)
	if err != nil {
		return errors.New("file not readable")
	}
	if info.Size() == 0 {
		return errors.New("file is empty")
	}
	switch format {
	case "3mf":
		zr, err := zip.OpenReader(path)
		if err != nil {
			return errors.New("3MF file is not a valid ZIP archive")
		}
		defer zr.Close()
		if len(zr.File) > 10000 {
			return errors.New("3MF archive has too many entries")
		}
		var hasModel bool
		for _, f := range zr.File {
			name := strings.ToLower(f.Name)
			if strings.Contains(name, "..") || strings.HasPrefix(name, "/") {
				return errors.New("3MF archive contains an unsafe path")
			}
			if name == "3d/3dmodel.model" {
				hasModel = true
			}
			if f.UncompressedSize64 > 2<<30 {
				return errors.New("3MF archive expands beyond the size limit")
			}
		}
		if !hasModel {
			return errors.New("3MF archive is missing 3D/3dmodel.model")
		}
	case "gltf":
		b, err := os.ReadFile(path)
		if err != nil || len(b) > 16<<20 {
			return errors.New("GLTF file is too large or unreadable")
		}
		var doc struct {
			Buffers []struct {
				URI string `json:"uri"`
			} `json:"buffers"`
			Images []struct {
				URI string `json:"uri"`
			} `json:"images"`
		}
		if err := json.Unmarshal(b, &doc); err != nil {
			return errors.New("GLTF file is not valid JSON")
		}
		for _, x := range append(doc.Buffers, doc.Images...) {
			if x.URI != "" && !strings.HasPrefix(x.URI, "data:") {
				return errors.New("GLTF with external resources is not supported")
			}
		}
	case "glb":
		f, err := os.Open(path)
		if err != nil {
			return errors.New("GLB file is unreadable")
		}
		defer f.Close()
		var magic [4]byte
		_, _ = io.ReadFull(f, magic[:])
		if string(magic[:]) != "glTF" {
			return errors.New("GLB file has an invalid header")
		}
	case "ply":
		f, err := os.Open(path)
		if err != nil {
			return errors.New("PLY file is unreadable")
		}
		defer f.Close()
		buf := make([]byte, 3)
		_, _ = io.ReadFull(f, buf)
		if !bytes.Equal(buf, []byte("ply")) {
			return errors.New("PLY file has an invalid header")
		}
	case "gcode":
		f, err := os.Open(path)
		if err != nil {
			return errors.New("the G-code file is unreadable")
		}
		defer f.Close()
		b, err := io.ReadAll(io.LimitReader(f, 2<<20))
		if err != nil || len(b) == 0 {
			return errors.New("the G-code file is empty or unreadable")
		}
		if bytes.IndexByte(b, 0) >= 0 {
			return errors.New("the G-code file appears to be binary")
		}
		if !gcodeCommand.Match(b) {
			return errors.New("the G-code file does not contain any movement commands")
		}
	case "step":
		f, err := os.Open(path)
		if err != nil {
			return errors.New("STEP file is unreadable")
		}
		defer f.Close()
		b, err := io.ReadAll(io.LimitReader(f, 1<<20))
		if err != nil || len(b) == 0 {
			return errors.New("STEP file is empty or unreadable")
		}
		if !bytes.Contains(b, []byte("ISO-10303-21;")) {
			return errors.New("STEP file has an invalid header")
		}
	case "stl", "obj":
		// STL can be binary or ASCII; OBJ is text. The 3D loader will provide
		// a clear error if the geometry is malformed.
	}
	return nil
}

func (s *Server) handleFileContent(w http.ResponseWriter, r *http.Request) {
	modelID, fileID := chi.URLParam(r, "id"), chi.URLParam(r, "fileID")
	m, ok := s.loadViewableModel(w, r, modelID)
	if !ok {
		return
	}
	f, err := s.st.FileByID(r.Context(), modelID, fileID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "File not found.")
		return
	}
	abs, err := s.fs.Abs(f.StorageRel)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Invalid storage path.")
		return
	}
	fh, err := os.Open(abs)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "File not found.")
		return
	}
	defer fh.Close()
	stat, err := fh.Stat()
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "File not found.")
		return
	}
	w.Header().Set("Content-Type", contentTypeForFormat(f.Format))
	w.Header().Set("ETag", `"`+f.SHA256+`"`)
	w.Header().Set("Cache-Control", cacheFor(m.Visibility)+", immutable")
	disposition := "inline"
	if r.URL.Query().Get("download") == "1" {
		disposition = "attachment"
		userID := ""
		if u := currentUser(r); u != nil {
			userID = u.ID
		}
		s.st.RecordDownload(r.Context(), m.ID, f.ID, userID, auth.IPHash(clientIP(r, s.cfg.TrustedProxy)))
	}
	w.Header().Set("Content-Disposition", mime.FormatMediaType(disposition, map[string]string{"filename": f.Filename}))
	http.ServeContent(w, r, f.Filename, stat.ModTime(), fh)
}

func (s *Server) handleImageContent(w http.ResponseWriter, r *http.Request) {
	modelID, imageID, variant := chi.URLParam(r, "id"), chi.URLParam(r, "imageID"), chi.URLParam(r, "variant")
	m, ok := s.loadViewableModel(w, r, modelID)
	if !ok {
		return
	}
	im, err := s.st.ImageByID(r.Context(), modelID, imageID)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Image not found.")
		return
	}
	var path string
	switch variant {
	case "original":
		path = im.OriginalPath
	case "large":
		path = im.LargePath
	case "thumb":
		path = im.ThumbPath
	default:
		writeErr(w, http.StatusNotFound, "not_found", "Image variant not found.")
		return
	}
	abs, err := s.fs.Abs(path)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Invalid storage path.")
		return
	}
	fh, err := os.Open(abs)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Image not found.")
		return
	}
	defer fh.Close()
	stat, err := fh.Stat()
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "Image not found.")
		return
	}
	w.Header().Set("Content-Type", mime.TypeByExtension(filepath.Ext(path)))
	w.Header().Set("Cache-Control", cacheFor(m.Visibility)+", immutable")
	w.Header().Set("Content-Disposition", "inline")
	http.ServeContent(w, r, filepath.Base(path), stat.ModTime(), fh)
}

func contentTypeForFormat(format string) string {
	switch format {
	case "stl":
		return "model/stl"
	case "3mf":
		return "model/3mf"
	case "obj":
		return "model/obj"
	case "ply":
		return "model/ply"
	case "glb":
		return "model/gltf-binary"
	case "gltf":
		return "model/gltf+json"
	case "gcode":
		return "text/plain; charset=utf-8"
	case "step":
		return "model/step"
	default:
		return "application/octet-stream"
	}
}

func cacheFor(visibility string) string {
	if visibility == "public" {
		return "public, max-age=31536000"
	}
	return "private, max-age=3600"
}
