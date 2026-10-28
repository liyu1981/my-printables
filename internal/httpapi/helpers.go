package httpapi

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"io"
	"errors"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"strings"

	"github.com/go-chi/chi/v5"
	"sync"
	"time"

	"myprintables/internal/auth"
	"myprintables/internal/store"
)

type ctxKey string

const sessionKey ctxKey = "session"

const sessionCookie = "myp_session"
const sessionTTL = 30 * 24 * time.Hour

func (s *Server) optionalAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := r.Cookie(sessionCookie)
		if err != nil || c.Value == "" {
			next.ServeHTTP(w, r)
			return
		}
		sess, err := s.st.SessionByToken(r.Context(), auth.TokenHash(c.Value))
		if err == nil && sess.User.IsActive {
			ctx := context.WithValue(r.Context(), sessionKey, &sess)
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *Server) requireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if currentSession(r) == nil {
			writeErr(w, http.StatusUnauthorized, "unauthorized", "Sign in required.")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *Server) requireAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sess := currentSession(r)
		if sess == nil {
			writeErr(w, http.StatusUnauthorized, "unauthorized", "Sign in required.")
			return
		}
		if sess.User.Role != "admin" {
			writeErr(w, http.StatusForbidden, "forbidden", "Administrator access required.")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *Server) csrf(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet || r.Method == http.MethodHead || r.Method == http.MethodOptions {
			next.ServeHTTP(w, r)
			return
		}
		sess := currentSession(r)
		if sess == nil {
			writeErr(w, http.StatusUnauthorized, "unauthorized", "Sign in required.")
			return
		}
		got := r.Header.Get("X-CSRF-Token")
		if got == "" || subtleCompare(got, sess.CSRFToken) == false {
			writeErr(w, http.StatusForbidden, "csrf", "Invalid CSRF token.")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *Server) sameOrigin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet || r.Method == http.MethodHead || r.Method == http.MethodOptions {
			next.ServeHTTP(w, r)
			return
		}
		origin := r.Header.Get("Origin")
		if origin == "" {
			next.ServeHTTP(w, r)
			return
		}
		u, err := url.Parse(origin)
		if err != nil || u.Host == "" {
			writeErr(w, http.StatusForbidden, "origin", "Invalid origin.")
			return
		}
		if !sameHost(u.Host, r.Host) && !sameHost(u.Host, hostFromURL(s.cfg.AppURL)) {
			writeErr(w, http.StatusForbidden, "origin", "Cross-origin request blocked.")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func subtleCompare(a, b string) bool {
	if len(a) != len(b) {
		return false
	}
	var v byte
	for i := 0; i < len(a); i++ {
		v |= a[i] ^ b[i]
	}
	return v == 0
}

func sameHost(a, b string) bool {
	return strings.EqualFold(stripPort(a), stripPort(b))
}

func stripPort(h string) string {
	host, _, err := net.SplitHostPort(h)
	if err == nil {
		return host
	}
	return h
}

func hostFromURL(s string) string {
	u, err := url.Parse(s)
	if err != nil {
		return ""
	}
	return u.Host
}

func currentSession(r *http.Request) *store.Session {
	v, _ := r.Context().Value(sessionKey).(*store.Session)
	return v
}

func currentUser(r *http.Request) *store.User {
	if sess := currentSession(r); sess != nil {
		return &sess.User
	}
	return nil
}

func (s *Server) setSessionCookie(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     sessionCookie,
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   s.cfg.SecureCookies,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   int(sessionTTL.Seconds()),
	})
}

func (s *Server) clearSessionCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name: sessionCookie, Value: "", Path: "/", HttpOnly: true,
		Secure: s.cfg.SecureCookies, SameSite: http.SameSiteLaxMode, MaxAge: -1,
	})
}

func (s *Server) newSession(w http.ResponseWriter, r *http.Request, user store.User) (string, error) {
	token, err := auth.NewToken(32)
	if err != nil {
		return "", err
	}
	csrf, err := auth.NewToken(24)
	if err != nil {
		return "", err
	}
	expires := time.Now().Add(sessionTTL).Unix()
	if err := s.st.CreateSession(r.Context(), user.ID, auth.TokenHash(token), csrf, r.UserAgent(),
		auth.IPHash(clientIP(r, s.cfg.TrustedProxy)), expires); err != nil {
		return "", err
	}
	s.st.MarkLogin(r.Context(), user.ID)
	s.setSessionCookie(w, token)
	return csrf, nil
}

func (s *Server) publicSettings() map[string]any {
	settings := s.st.Settings()
	return map[string]any{
		"siteName":                 fallback(settings["site_name"], s.cfg.SiteName),
		"registrationEnabled":      settings["registration_enabled"] == "true",
		"emailVerificationEnabled": settings["email_verification_enabled"] == "true",
		"requireLoginToBrowse":     settings["require_login_to_browse"] == "true",
		"maxUploadMB":              auth.ParseUint(settings["max_upload_mb"]),
		"allowedFormats":           settings["allowed_formats"],
		"footerText":               settings["footer_text"],
		"version":                  Version,
	}
}

func fallback(v, f string) string {
	if v == "" {
		return f
	}
	return v
}

func decodeJSON(r *http.Request, dst any) error {
	defer r.Body.Close()
	dec := json.NewDecoder(io.LimitReader(r.Body, 1<<20))
	dec.DisallowUnknownFields()
	if err := dec.Decode(dst); err != nil {
		return err
	}
	if dec.More() {
		return errors.New("unexpected trailing data")
	}
	return nil
}

func isUnique(err error) bool {
	return errors.Is(err, store.ErrConflict)
}

func verifyPassword(password string) bool {
	return len(password) >= 10
}

func tokenValue() (string, error) {
	b := make([]byte, 24)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

// rateLimiter is deliberately small and in-memory; it is a LAN app, not a
// multi-instance service.
type rateLimiter struct {
	mu      sync.Mutex
	entries map[string]rateEntry
}

type rateEntry struct {
	windowStart int64
	count       int
}

func newRateLimiter() *rateLimiter {
	return &rateLimiter{entries: make(map[string]rateEntry)}
}

func (l *rateLimiter) Allow(key string, limit int, window time.Duration) bool {
	now := time.Now().Unix()
	l.mu.Lock()
	defer l.mu.Unlock()
	e := l.entries[key]
	if now-e.windowStart >= int64(window.Seconds()) {
		e = rateEntry{windowStart: now}
	}
	e.count++
	l.entries[key] = e
	return e.count <= limit
}

func (l *rateLimiter) Reset(key string) {
	l.mu.Lock()
	delete(l.entries, key)
	l.mu.Unlock()
}

func (s *Server) audit(r *http.Request, actorID, action, targetType, targetID, meta string) {
	ip := auth.IPHash(clientIP(r, s.cfg.TrustedProxy))
	_, _ = s.st.DB.ExecContext(r.Context(), `INSERT INTO audit_log
		(id, actor_id, action, target_type, target_id, meta_json, ip_hash, created_at)
		VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
		store.NewID(), nullIfEmpty(actorID), action, targetType, targetID, meta, ip, time.Now().Unix())
}

func nullIfEmpty(s string) any {
	if s == "" {
		return nil
	}
	return s
}

func parseID(w http.ResponseWriter, r *http.Request, key string) (string, bool) {
	id := chi.URLParam(r, key)
	if id == "" {
		writeErr(w, http.StatusBadRequest, "bad_request", "Missing identifier.")
		return "", false
	}
	return id, true
}

func existsDB(db *sql.DB) bool { return db != nil }

func fieldMessage(field, message string) map[string]any {
	return map[string]any{"field": field, "message": message}
}

func jsonMap(v any) string {
	b, _ := json.Marshal(v)
	return string(b)
}

func fmtErr(format string, args ...any) error {
	return fmt.Errorf(format, args...)
}
