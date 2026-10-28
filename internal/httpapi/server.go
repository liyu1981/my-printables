package httpapi

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"runtime/debug"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"

	"myprintables/internal/config"
	"myprintables/internal/email"
	"myprintables/internal/store"
	"myprintables/internal/web"
)

type Server struct {
	cfg     *config.Config
	st      *store.Store
	log     *slog.Logger
	mail    email.Sender
	limiter *rateLimiter
}

func New(cfg *config.Config, st *store.Store, log *slog.Logger) *Server {
	return &Server{cfg: cfg, st: st, log: log, mail: email.New(*cfg, log), limiter: newRateLimiter()}
}

func (s *Server) Handler() http.Handler {
	r := chi.NewRouter()
	r.Use(s.securityHeaders)
	r.Use(s.requestLogger)
	r.Use(s.recoverer)
	r.Use(s.sameOrigin)
	r.Use(s.optionalAuth)
	r.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		if err := s.st.DB.PingContext(r.Context()); err != nil {
			writeErr(w, http.StatusServiceUnavailable, "db_unavailable", "database unavailable")
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"ok": true})
	})
	r.Route("/api", func(api chi.Router) {
		api.Get("/site", s.handleSite)
		s.mountAuth(api)
		api.NotFound(func(w http.ResponseWriter, r *http.Request) {
			writeErr(w, http.StatusNotFound, "not_found", "not found")
		})
	})
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/") || strings.HasPrefix(r.URL.Path, "/media/") {
			writeErr(w, http.StatusNotFound, "not_found", "not found")
			return
		}
		web.Handler().ServeHTTP(w, r)
	})
	r.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		web.Handler().ServeHTTP(w, r)
	})
	r.Head("/*", func(w http.ResponseWriter, r *http.Request) {
		web.Handler().ServeHTTP(w, r)
	})
	return r
}

func (s *Server) handleSite(w http.ResponseWriter, r *http.Request) {
	settings := s.st.Settings()
	writeJSON(w, http.StatusOK, map[string]any{
		"siteName":                 settings["site_name"],
		"registrationEnabled":      settings["registration_enabled"] == "true",
		"emailVerificationEnabled": settings["email_verification_enabled"] == "true",
		"version":                  Version,
	})
}

// Version is set by the CLI at startup.
var Version = "dev"

func (s *Server) requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		ww := &statusWriter{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(ww, r)
		if strings.HasPrefix(r.URL.Path, "/assets/") {
			return
		}
		s.log.Info("request",
			"method", r.Method,
			"path", r.URL.Path,
			"status", ww.status,
			"duration_ms", time.Since(start).Milliseconds(),
			"ip", clientIP(r, s.cfg.TrustedProxy),
		)
	})
}

func (s *Server) recoverer(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				s.log.Error("panic", "error", fmt.Sprint(rec), "stack", string(debug.Stack()))
				writeErr(w, http.StatusInternalServerError, "internal", "internal server error")
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func (s *Server) securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		h.Set("X-Content-Type-Options", "nosniff")
		h.Set("X-Frame-Options", "DENY")
		h.Set("Referrer-Policy", "same-origin")
		h.Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
		h.Set("Content-Security-Policy",
			"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'")
		if s.cfg.SecureCookies {
			h.Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		}
		next.ServeHTTP(w, r)
	})
}

type statusWriter struct {
	http.ResponseWriter
	status int
}

func (w *statusWriter) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}

func clientIP(r *http.Request, trustedProxy string) string {
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		ip = r.RemoteAddr
	}
	if trustedProxy != "" {
		if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
			// Only trust a proxy range is a deployment concern; in v1 we take the
			// first value when a trusted proxy is configured.
			first := strings.TrimSpace(strings.Split(xff, ",")[0])
			if first != "" {
				return first
			}
		}
	}
	return ip
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeErr(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, map[string]any{"error": map[string]any{
		"code":    code,
		"message": message,
	}})
}
