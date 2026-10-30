package web

import (
	"embed"
	"io/fs"
	"mime"
	"net/http"
	"path"
	"strings"
)

//go:embed all:dist
var dist embed.FS

//go:embed all:slicer
var slicerFS embed.FS

// Handler serves the embedded single-page application with a fallback to
// index.html for client-side routes. API and media routes are registered
// before this handler.
func Handler() http.Handler {
	sub, err := fs.Sub(dist, "dist")
	if err != nil {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.Error(w, "frontend not built", http.StatusInternalServerError)
		})
	}
	files := http.FileServer(http.FS(sub))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		p := strings.TrimPrefix(path.Clean(r.URL.Path), "/")
		if p == "" || p == "." || isSPAPath(p) {
			serveIndex(w, r, sub)
			return
		}
		f, err := sub.Open(p)
		if err != nil {
			http.NotFound(w, r)
			return
		}
		f.Close()
		if strings.Contains(p, "/assets/") || strings.HasPrefix(p, "assets/") {
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		} else if ext := path.Ext(p); ext != "" {
			if mt := mime.TypeByExtension(ext); mt != "" {
				w.Header().Set("Content-Type", mt)
			}
			w.Header().Set("Cache-Control", "public, max-age=3600")
		}
		files.ServeHTTP(w, r)
	})
}

func isSPAPath(p string) bool {
	if strings.HasPrefix(p, "api/") || strings.HasPrefix(p, "healthz") {
		return false
	}
	// A path without an extension is a client-side route.
	return path.Ext(p) == ""
}

func serveIndex(w http.ResponseWriter, r *http.Request, sub fs.FS) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	b, err := fs.ReadFile(sub, "index.html")
	if err != nil {
		http.Error(w, "frontend not built", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache")
	if r.Method == http.MethodHead {
		return
	}
	_, _ = w.Write(b)
}

// SlicerHandler serves the optional CubbySlicer static build under /slicer/.
// CubbySlicer needs cross-origin isolation and a relaxed worker/WASM CSP.
func SlicerHandler() http.Handler {
	sub, err := fs.Sub(slicerFS, "slicer")
	if err != nil {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.Error(w, "slicer not built", http.StatusServiceUnavailable)
		})
	}
	files := http.FileServer(http.FS(sub))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		h.Set("Cross-Origin-Opener-Policy", "same-origin")
		h.Set("Cross-Origin-Embedder-Policy", "require-corp")
		h.Set("Cross-Origin-Resource-Policy", "same-origin")
		h.Set("Content-Security-Policy",
			"default-src 'self'; script-src 'self' 'wasm-unsafe-eval' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' blob:; worker-src 'self' blob:; child-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'self'")

		rel := strings.TrimPrefix(path.Clean(r.URL.Path), "/")
		rel = strings.TrimPrefix(rel, "slicer")
		rel = strings.TrimPrefix(rel, "/")
		if rel == "" || rel == "." || path.Ext(rel) == "" {
			serveSlicerIndex(w, r, sub)
			return
		}
		f, err := sub.Open(rel)
		if err != nil {
			if path.Ext(rel) == "" {
				serveSlicerIndex(w, r, sub)
			} else {
				http.NotFound(w, r)
			}
			return
		}
		_ = f.Close()
		switch path.Ext(rel) {
		case ".wasm":
			h.Set("Content-Type", "application/wasm")
		case ".mjs":
			h.Set("Content-Type", "text/javascript; charset=utf-8")
		}
		if strings.HasPrefix(rel, "assets/") || strings.HasSuffix(rel, ".wasm") {
			h.Set("Cache-Control", "public, max-age=31536000, immutable")
		} else {
			h.Set("Cache-Control", "public, max-age=3600")
		}
		// The file server expects a path relative to the slicer FS.
		r2 := r.Clone(r.Context())
		r2.URL.Path = "/" + rel
		files.ServeHTTP(w, r2)
	})
}

func serveSlicerIndex(w http.ResponseWriter, r *http.Request, sub fs.FS) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	b, err := fs.ReadFile(sub, "index.html")
	if err != nil {
		http.Error(w, "slicer not built; run pnpm build:slicer", http.StatusServiceUnavailable)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache")
	if r.Method == http.MethodHead {
		return
	}
	_, _ = w.Write(b)
}
