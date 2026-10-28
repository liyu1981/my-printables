package httpapi

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"net/mail"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"

	"myprintables/internal/auth"
	"myprintables/internal/store"
)

var usernameRE = regexp.MustCompile(`^[A-Za-z0-9_.-]{3,32}$`)

type userDTO struct {
	ID              string `json:"id"`
	Email           string `json:"email,omitempty"`
	Username        string `json:"username"`
	DisplayName     string `json:"displayName"`
	Role            string `json:"role"`
	Bio             string `json:"bio"`
	IsActive        bool   `json:"isActive"`
	EmailVerifiedAt *int64 `json:"emailVerifiedAt"`
	CreatedAt       int64  `json:"createdAt"`
	LastLoginAt     *int64 `json:"lastLoginAt,omitempty"`
}

func toUserDTO(u store.User, withEmail bool) userDTO {
	d := userDTO{
		ID: u.ID, Username: u.Username, DisplayName: u.DisplayName, Role: u.Role, Bio: u.Bio,
		IsActive: u.IsActive, EmailVerifiedAt: u.EmailVerifiedAt, CreatedAt: u.CreatedAt,
		LastLoginAt: u.LastLoginAt,
	}
	if withEmail {
		d.Email = u.Email
	}
	return d
}

func (s *Server) mountAuth(api chi.Router) {
	api.Get("/setup/status", s.handleSetupStatus)
	api.Post("/setup", s.handleSetup)
	api.Post("/auth/login", s.handleLogin)
	api.Post("/auth/register", s.handleRegister)
	api.Get("/auth/me", s.handleMe)
	api.Post("/auth/verify-email", s.handleVerifyEmail)
	api.Post("/auth/resend-verification", s.handleResendVerification)

	api.Group(func(p chi.Router) {
		p.Use(s.requireAuth)
		p.Use(s.csrf)
		p.Post("/auth/logout", s.handleLogout)
		p.Patch("/auth/me", s.handlePatchMe)
		p.Post("/auth/password", s.handlePassword)
	})

	api.Group(func(a chi.Router) {
		a.Use(s.requireAuth)
		a.Use(s.csrf)
		a.Use(s.requireAdmin)
		a.Get("/admin/users", s.handleAdminUsers)
		a.Patch("/admin/users/{id}", s.handleAdminPatchUser)
		a.Delete("/admin/users/{id}", s.handleAdminDeleteUser)
		a.Get("/admin/settings", s.handleAdminSettings)
		a.Patch("/admin/settings", s.handleAdminUpdateSettings)
		a.Post("/admin/smtp/test", s.handleAdminSMTPTest)
		a.Get("/admin/stats", s.handleAdminStats)
	})
}

func (s *Server) handleSetupStatus(w http.ResponseWriter, r *http.Request) {
	n, err := s.st.CountUsers(r.Context())
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not check setup state.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"needsSetup": n == 0})
}

func (s *Server) handleSetup(w http.ResponseWriter, r *http.Request) {
	n, err := s.st.CountUsers(r.Context())
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not check setup state.")
		return
	}
	if n > 0 {
		writeErr(w, http.StatusConflict, "already_setup", "Setup has already been completed.")
		return
	}
	var in struct {
		Email       string `json:"email"`
		Username    string `json:"username"`
		DisplayName string `json:"displayName"`
		Password    string `json:"password"`
	}
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	if msg := validateAccount(in.Email, in.Username, in.Password); msg != "" {
		writeErr(w, http.StatusBadRequest, "validation", msg)
		return
	}
	hash, err := auth.HashPassword(in.Password)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not create account.")
		return
	}
	now := time.Now().Unix()
	u := store.User{
		ID: store.NewID(), Email: strings.ToLower(in.Email), Username: in.Username,
		DisplayName: strings.TrimSpace(in.DisplayName), Role: "admin", IsActive: true,
		EmailVerifiedAt: &now,
	}
	if u.DisplayName == "" {
		u.DisplayName = in.Username
	}
	if err := s.st.CreateUser(r.Context(), u, hash); err != nil {
		if isUnique(err) {
			writeErr(w, http.StatusConflict, "conflict", "Email or username already exists.")
			return
		}
		writeErr(w, http.StatusInternalServerError, "internal", "Could not create account.")
		return
	}
	u, _, _ = s.st.UserByEmail(r.Context(), u.Email)
	csrf, err := s.newSession(w, r, u)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not start session.")
		return
	}
	s.audit(r, u.ID, "setup.admin_created", "user", u.ID, `{}`)
	writeJSON(w, http.StatusCreated, map[string]any{"user": toUserDTO(u, true), "csrf": csrf, "settings": s.publicSettings()})
}

func (s *Server) handleLogin(w http.ResponseWriter, r *http.Request) {
	ip := clientIP(r, s.cfg.TrustedProxy)
	if !s.limiter.Allow("login:"+ip, 10, time.Minute) {
		writeErr(w, http.StatusTooManyRequests, "rate_limited", "Too many login attempts. Try again shortly.")
		return
	}
	var in struct {
		Login    string `json:"login"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	login := in.Login
	if login == "" {
		login = in.Email
	}
	u, hash, err := s.st.UserByLogin(r.Context(), strings.TrimSpace(login))
	if err != nil || !auth.VerifyPassword(in.Password, hash) {
		s.audit(r, "", "auth.login_failed", "user", "", `{}`)
		writeErr(w, http.StatusUnauthorized, "invalid_credentials", "Invalid email or password.")
		return
	}
	if !u.IsActive {
		writeErr(w, http.StatusForbidden, "inactive", "This account is deactivated.")
		return
	}
	if s.st.Setting("email_verification_enabled", "false") == "true" && u.EmailVerifiedAt == nil {
		writeErr(w, http.StatusForbidden, "email_unverified", "Verify your email before signing in.")
		return
	}
	csrf, err := s.newSession(w, r, u)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not start session.")
		return
	}
	s.limiter.Reset("login:" + ip)
	s.audit(r, u.ID, "auth.login", "user", u.ID, `{}`)
	writeJSON(w, http.StatusOK, map[string]any{"user": toUserDTO(u, true), "csrf": csrf, "settings": s.publicSettings()})
}

func (s *Server) handleRegister(w http.ResponseWriter, r *http.Request) {
	if s.st.Setting("registration_enabled", "true") != "true" {
		writeErr(w, http.StatusForbidden, "registration_closed", "Registration is disabled.")
		return
	}
	ip := clientIP(r, s.cfg.TrustedProxy)
	if !s.limiter.Allow("register:"+ip, 5, time.Hour) {
		writeErr(w, http.StatusTooManyRequests, "rate_limited", "Too many registration attempts.")
		return
	}
	var in struct {
		Email       string `json:"email"`
		Username    string `json:"username"`
		DisplayName string `json:"displayName"`
		Password    string `json:"password"`
	}
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	if msg := validateAccount(in.Email, in.Username, in.Password); msg != "" {
		writeErr(w, http.StatusBadRequest, "validation", msg)
		return
	}
	verification := s.st.Setting("email_verification_enabled", "false") == "true"
	if verification && !s.cfg.SMTPConfigured() {
		writeErr(w, http.StatusServiceUnavailable, "smtp_unavailable", "Email verification is enabled but SMTP is not configured.")
		return
	}
	hash, err := auth.HashPassword(in.Password)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not create account.")
		return
	}
	var verified *int64
	if !verification {
		now := time.Now().Unix()
		verified = &now
	}
	u := store.User{
		ID: store.NewID(), Email: strings.ToLower(in.Email), Username: in.Username,
		DisplayName: strings.TrimSpace(in.DisplayName), Role: "user", IsActive: true, EmailVerifiedAt: verified,
	}
	if u.DisplayName == "" {
		u.DisplayName = in.Username
	}
	if err := s.st.CreateUser(r.Context(), u, hash); err != nil {
		if isUnique(err) {
			writeErr(w, http.StatusConflict, "conflict", "Email or username already exists.")
			return
		}
		writeErr(w, http.StatusInternalServerError, "internal", "Could not create account.")
		return
	}
	u, _, _ = s.st.UserByEmail(r.Context(), u.Email)
	if verification {
		if err := s.sendVerification(r.Context(), u); err != nil {
			writeErr(w, http.StatusServiceUnavailable, "smtp_unavailable", "Account created, but the verification email could not be sent. Ask an admin to resend or verify it.")
			return
		}
		s.audit(r, u.ID, "auth.register_pending", "user", u.ID, `{}`)
		writeJSON(w, http.StatusCreated, map[string]any{"requiresVerification": true, "user": toUserDTO(u, true), "settings": s.publicSettings()})
		return
	}
	csrf, err := s.newSession(w, r, u)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not start session.")
		return
	}
	s.audit(r, u.ID, "auth.register", "user", u.ID, `{}`)
	writeJSON(w, http.StatusCreated, map[string]any{"user": toUserDTO(u, true), "csrf": csrf, "settings": s.publicSettings()})
}

func (s *Server) handleMe(w http.ResponseWriter, r *http.Request) {
	if sess := currentSession(r); sess != nil {
		s.st.TouchSession(r.Context(), sess.ID)
		writeJSON(w, http.StatusOK, map[string]any{
			"user": toUserDTO(sess.User, true), "csrf": sess.CSRFToken, "settings": s.publicSettings(),
		})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"user": nil, "csrf": "", "settings": s.publicSettings()})
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	if c, err := r.Cookie(sessionCookie); err == nil && c.Value != "" {
		_ = s.st.DeleteSession(r.Context(), auth.TokenHash(c.Value))
	}
	s.clearSessionCookie(w)
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleVerifyEmail(w http.ResponseWriter, r *http.Request) {
	var in struct {
		Token string `json:"token"`
	}
	if err := decodeJSON(r, &in); err != nil || len(in.Token) < 10 {
		writeErr(w, http.StatusBadRequest, "invalid_token", "This verification link is invalid or expired.")
		return
	}
	userID, err := s.st.ConsumeEmailToken(r.Context(), auth.TokenHash(in.Token))
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_token", "This verification link is invalid or expired.")
		return
	}
	u, err := s.st.UserByID(r.Context(), userID)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load account.")
		return
	}
	csrf, err := s.newSession(w, r, u)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not start session.")
		return
	}
	s.audit(r, u.ID, "auth.email_verified", "user", u.ID, `{}`)
	writeJSON(w, http.StatusOK, map[string]any{"user": toUserDTO(u, true), "csrf": csrf, "settings": s.publicSettings()})
}

func (s *Server) handleResendVerification(w http.ResponseWriter, r *http.Request) {
	ip := clientIP(r, s.cfg.TrustedProxy)
	if !s.limiter.Allow("resend:"+ip, 5, time.Hour) {
		writeErr(w, http.StatusTooManyRequests, "rate_limited", "Too many requests.")
		return
	}
	var in struct {
		Email string `json:"email"`
	}
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	if !s.cfg.SMTPConfigured() {
		writeErr(w, http.StatusServiceUnavailable, "smtp_unavailable", "SMTP is not configured.")
		return
	}
	u, _, err := s.st.UserByEmail(r.Context(), strings.TrimSpace(in.Email))
	if err == nil && u.EmailVerifiedAt == nil && u.IsActive {
		_ = s.sendVerification(r.Context(), u)
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handlePatchMe(w http.ResponseWriter, r *http.Request) {
	sess := currentSession(r)
	var in struct {
		DisplayName *string `json:"displayName"`
		Bio         *string `json:"bio"`
		Username    *string `json:"username"`
		Email       *string `json:"email"`
	}
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	fields := map[string]any{}
	if in.DisplayName != nil {
		v := strings.TrimSpace(*in.DisplayName)
		if len(v) > 80 {
			writeErr(w, http.StatusBadRequest, "validation", "Display name is too long.")
			return
		}
		fields["display_name"] = v
	}
	if in.Bio != nil {
		if len(*in.Bio) > 2000 {
			writeErr(w, http.StatusBadRequest, "validation", "Bio is too long.")
			return
		}
		fields["bio"] = strings.TrimSpace(*in.Bio)
	}
	if in.Username != nil {
		v := strings.TrimSpace(*in.Username)
		if !usernameRE.MatchString(v) {
			writeErr(w, http.StatusBadRequest, "validation", "Username must be 3–32 characters using letters, numbers, dot, dash, or underscore.")
			return
		}
		fields["username"] = v
	}
	emailChanged := false
	if in.Email != nil {
		v := strings.ToLower(strings.TrimSpace(*in.Email))
		if _, err := mail.ParseAddress(v); err != nil || !strings.Contains(v, "@") {
			writeErr(w, http.StatusBadRequest, "validation", "Enter a valid email address.")
			return
		}
		if v != sess.User.Email {
			if s.st.Setting("email_verification_enabled", "false") == "true" && !s.cfg.SMTPConfigured() {
				writeErr(w, http.StatusServiceUnavailable, "smtp_unavailable", "Email verification is enabled but SMTP is not configured.")
				return
			}
			fields["email"] = v
			fields["email_verified_at"] = nil
			emailChanged = true
		}
	}
	if len(fields) == 0 {
		writeJSON(w, http.StatusOK, map[string]any{"user": toUserDTO(sess.User, true)})
		return
	}
	if err := s.st.UpdateUser(r.Context(), sess.User.ID, fields); err != nil {
		if isUnique(err) {
			writeErr(w, http.StatusConflict, "conflict", "Email or username already exists.")
			return
		}
		writeErr(w, http.StatusInternalServerError, "internal", "Could not update profile.")
		return
	}
	u, err := s.st.UserByID(r.Context(), sess.User.ID)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load profile.")
		return
	}
	if emailChanged && s.st.Setting("email_verification_enabled", "false") == "true" {
		_ = s.st.DeleteUserSessions(r.Context(), u.ID)
		s.clearSessionCookie(w)
		_ = s.sendVerification(r.Context(), u)
		writeJSON(w, http.StatusOK, map[string]any{"requiresVerification": true})
		return
	}
	s.audit(r, u.ID, "user.profile_updated", "user", u.ID, `{}`)
	writeJSON(w, http.StatusOK, map[string]any{"user": toUserDTO(u, true)})
}

func (s *Server) handlePassword(w http.ResponseWriter, r *http.Request) {
	sess := currentSession(r)
	var in struct {
		Current string `json:"currentPassword"`
		New     string `json:"newPassword"`
	}
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	_, hash, err := s.st.UserByEmail(r.Context(), sess.User.Email)
	if err != nil || !auth.VerifyPassword(in.Current, hash) {
		writeErr(w, http.StatusBadRequest, "invalid_password", "Current password is incorrect.")
		return
	}
	if msg := auth.PasswordProblem(in.New); msg != "" {
		writeErr(w, http.StatusBadRequest, "validation", msg)
		return
	}
	newHash, err := auth.HashPassword(in.New)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not update password.")
		return
	}
	if err := s.st.UpdateUser(r.Context(), sess.User.ID, map[string]any{"password_hash": newHash}); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not update password.")
		return
	}
	c, _ := r.Cookie(sessionCookie)
	if c != nil {
		_ = s.st.DeleteOtherSessions(r.Context(), sess.User.ID, auth.TokenHash(c.Value))
	}
	s.audit(r, sess.User.ID, "user.password_changed", "user", sess.User.ID, `{}`)
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleAdminUsers(w http.ResponseWriter, r *http.Request) {
	users, err := s.st.ListUsers(r.Context(), strings.TrimSpace(r.URL.Query().Get("q")), 200)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not load users.")
		return
	}
	out := make([]userDTO, 0, len(users))
	for _, u := range users {
		out = append(out, toUserDTO(u, true))
	}
	writeJSON(w, http.StatusOK, map[string]any{"items": out})
}

func (s *Server) handleAdminPatchUser(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r, "id")
	if !ok {
		return
	}
	target, err := s.st.UserByID(r.Context(), id)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "User not found.")
		return
	}
	self := currentSession(r).User
	var in struct {
		Role          *string `json:"role"`
		IsActive      *bool   `json:"isActive"`
		EmailVerified *bool   `json:"emailVerified"`
		DisplayName   *string `json:"displayName"`
		Password      *string `json:"password"`
	}
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	fields := map[string]any{}
	if in.Role != nil {
		if *in.Role != "admin" && *in.Role != "user" {
			writeErr(w, http.StatusBadRequest, "validation", "Invalid role.")
			return
		}
		if target.ID == self.ID && *in.Role != "admin" {
			writeErr(w, http.StatusBadRequest, "validation", "You cannot remove your own admin role.")
			return
		}
		fields["role"] = *in.Role
	}
	if in.IsActive != nil {
		if target.ID == self.ID && !*in.IsActive {
			writeErr(w, http.StatusBadRequest, "validation", "You cannot deactivate yourself.")
			return
		}
		fields["is_active"] = boolInt(*in.IsActive)
	}
	if in.EmailVerified != nil {
		if *in.EmailVerified {
			fields["email_verified_at"] = time.Now().Unix()
		} else {
			fields["email_verified_at"] = nil
		}
	}
	if in.DisplayName != nil {
		fields["display_name"] = strings.TrimSpace(*in.DisplayName)
	}
	if in.Password != nil {
		if msg := auth.PasswordProblem(*in.Password); msg != "" {
			writeErr(w, http.StatusBadRequest, "validation", msg)
			return
		}
		h, err := auth.HashPassword(*in.Password)
		if err != nil {
			writeErr(w, http.StatusInternalServerError, "internal", "Could not update password.")
			return
		}
		fields["password_hash"] = h
		_ = s.st.DeleteUserSessions(r.Context(), target.ID)
	}
	if err := s.st.UpdateUser(r.Context(), target.ID, fields); err != nil {
		if isUnique(err) {
			writeErr(w, http.StatusConflict, "conflict", "Email or username already exists.")
			return
		}
		writeErr(w, http.StatusInternalServerError, "internal", "Could not update user.")
		return
	}
	s.audit(r, self.ID, "admin.user_updated", "user", target.ID, jsonMap(safeAuditFields(fields)))
	u, _ := s.st.UserByID(r.Context(), target.ID)
	writeJSON(w, http.StatusOK, map[string]any{"user": toUserDTO(u, true)})
}

func (s *Server) handleAdminDeleteUser(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r, "id")
	if !ok {
		return
	}
	self := currentSession(r).User
	if id == self.ID {
		writeErr(w, http.StatusBadRequest, "validation", "You cannot delete yourself.")
		return
	}
	target, err := s.st.UserByID(r.Context(), id)
	if err != nil {
		writeErr(w, http.StatusNotFound, "not_found", "User not found.")
		return
	}
	if target.Role == "admin" {
		var admins int
		_ = s.st.DB.QueryRow(`SELECT COUNT(*) FROM users WHERE role = 'admin'`).Scan(&admins)
		if admins <= 1 {
			writeErr(w, http.StatusBadRequest, "validation", "You cannot delete the last administrator.")
			return
		}
	}
	if err := s.st.DeleteUser(r.Context(), id); err != nil {
		writeErr(w, http.StatusInternalServerError, "internal", "Could not delete user.")
		return
	}
	s.audit(r, self.ID, "admin.user_deleted", "user", id, `{}`)
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleAdminSettings(w http.ResponseWriter, r *http.Request) {
	settings := s.st.Settings()
	writeJSON(w, http.StatusOK, map[string]any{
		"settings":       settings,
		"smtpConfigured": s.cfg.SMTPConfigured(),
		"smtpFrom":       s.cfg.SMTPFrom,
	})
}

func (s *Server) handleAdminUpdateSettings(w http.ResponseWriter, r *http.Request) {
	var in map[string]any
	if err := decodeJSON(r, &in); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_request", "Invalid request.")
		return
	}
	allowed := map[string]bool{
		"site_name": true, "registration_enabled": true, "email_verification_enabled": true,
		"default_visibility": true, "require_login_to_browse": true, "max_upload_mb": true,
		"allowed_formats": true, "featured_model_ids": true, "footer_text": true,
	}
	for k, raw := range in {
		if !allowed[k] {
			writeErr(w, http.StatusBadRequest, "validation", fmt.Sprintf("Unknown setting %q.", k))
			return
		}
		value := settingString(raw)
		switch k {
		case "default_visibility":
			if value != "public" && value != "members" && value != "private" {
				writeErr(w, http.StatusBadRequest, "validation", "default_visibility must be public, members, or private.")
				return
			}
		case "email_verification_enabled":
			if value == "true" && !s.cfg.SMTPConfigured() {
				writeErr(w, http.StatusBadRequest, "smtp_required", "Configure SMTP before enabling email verification.")
				return
			}
		case "max_upload_mb":
			n, err := strconv.ParseInt(value, 10, 64)
			if err != nil || n < 1 || n > 102400 {
				writeErr(w, http.StatusBadRequest, "validation", "max_upload_mb must be between 1 and 102400.")
				return
			}
			value = strconv.FormatInt(n, 10)
		case "allowed_formats":
			value = strings.ToLower(strings.TrimSpace(value))
		}
		if err := s.st.SetSetting(k, value, currentSession(r).User.ID); err != nil {
			writeErr(w, http.StatusInternalServerError, "internal", "Could not save settings.")
			return
		}
	}
	s.audit(r, currentSession(r).User.ID, "admin.settings_updated", "settings", "", jsonMap(in))
	writeJSON(w, http.StatusOK, map[string]any{"settings": s.st.Settings()})
}

func (s *Server) handleAdminSMTPTest(w http.ResponseWriter, r *http.Request) {
	if !s.cfg.SMTPConfigured() {
		writeErr(w, http.StatusBadRequest, "smtp_required", "SMTP is not configured.")
		return
	}
	sess := currentSession(r)
	if err := s.mail.SendTest(r.Context(), sess.User.Email); err != nil {
		writeErr(w, http.StatusBadGateway, "smtp_error", "SMTP test failed.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleAdminStats(w http.ResponseWriter, r *http.Request) {
	var users, models int64
	var mediaBytes sql.NullInt64
	_ = s.st.DB.QueryRow(`SELECT COUNT(*) FROM users`).Scan(&users)
	_ = s.st.DB.QueryRow(`SELECT COUNT(*) FROM models`).Scan(&models)
	_ = s.st.DB.QueryRow(`SELECT COALESCE(SUM(size_bytes),0) FROM model_files`).Scan(&mediaBytes)
	writeJSON(w, http.StatusOK, map[string]any{
		"users": users, "models": models, "mediaBytes": mediaBytes.Int64,
	})
}

func (s *Server) sendVerification(ctx context.Context, u store.User) error {
	token, err := auth.NewToken(32)
	if err != nil {
		return err
	}
	if err := s.st.CreateEmailToken(ctx, u.ID, auth.TokenHash(token), time.Now().Add(24*time.Hour).Unix()); err != nil {
		return err
	}
	link := strings.TrimRight(s.cfg.AppURL, "/") + "/verify-email?token=" + token
	s.auditRaw(ctx, u.ID, "auth.verification_sent", "user", u.ID)
	return s.mail.SendVerification(ctx, u.Email, u.DisplayName, link)
}

func (s *Server) auditRaw(ctx context.Context, actorID, action, targetType, targetID string) {
	_, _ = s.st.DB.ExecContext(ctx, `INSERT INTO audit_log
		(id, actor_id, action, target_type, target_id, meta_json, ip_hash, created_at)
		VALUES(?, ?, ?, ?, ?, '{}', '', ?)`, store.NewID(), nullIfEmpty(actorID), action, targetType, targetID, time.Now().Unix())
}

func validateAccount(email, username, password string) string {
	email = strings.TrimSpace(email)
	if _, err := mail.ParseAddress(email); err != nil || !strings.Contains(email, "@") {
		return "Enter a valid email address."
	}
	if !usernameRE.MatchString(strings.TrimSpace(username)) {
		return "Username must be 3–32 characters using letters, numbers, dot, dash, or underscore."
	}
	if msg := auth.PasswordProblem(password); msg != "" {
		return msg
	}
	return ""
}

func safeAuditFields(fields map[string]any) map[string]any {
	out := make(map[string]any, len(fields))
	for k, v := range fields {
		if k == "password_hash" {
			out[k] = "changed"
			continue
		}
		out[k] = v
	}
	return out
}

func settingString(v any) string {
	switch x := v.(type) {
	case string:
		return x
	case bool:
		if x {
			return "true"
		}
		return "false"
	case float64:
		return strconv.FormatInt(int64(x), 10)
	default:
		return fmt.Sprint(x)
	}
}

func boolInt(v bool) int {
	if v {
		return 1
	}
	return 0
}

var _ = errors.Is
