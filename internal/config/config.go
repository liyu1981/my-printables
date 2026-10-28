package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

type Config struct {
	Port                     int
	DataDir                  string
	SiteName                 string
	AppURL                   string
	SecureCookies            bool
	TrustedProxy             string
	RegistrationEnabled      bool
	EmailVerificationEnabled bool
	MaxUploadMB              int64
	AdminEmail               string
	AdminPassword            string
	AutoMigrate              bool
	LogLevel                 string

	SMTPHost     string
	SMTPPort     int
	SMTPUsername string
	SMTPPassword string
	SMTPFrom     string
	SMTPTLS      bool

	JSON bool
}

func Load() (Config, error) {
	c := Config{
		Port:                     getInt("PORT", 8080),
		DataDir:                  getString("DATA_DIR", "./data"),
		SiteName:                 getString("SITE_NAME", "MyPrintables"),
		AppURL:                   getString("APP_URL", "http://localhost:8080"),
		SecureCookies:            getBool("SECURE_COOKIES", false),
		TrustedProxy:             getString("TRUSTED_PROXY", ""),
		RegistrationEnabled:      getBool("REGISTRATION_ENABLED", true),
		EmailVerificationEnabled: getBool("EMAIL_VERIFICATION_ENABLED", false),
		MaxUploadMB:              int64(getInt("MAX_UPLOAD_MB", 1024)),
		AdminEmail:               getString("ADMIN_EMAIL", ""),
		AdminPassword:            getString("ADMIN_PASSWORD", ""),
		AutoMigrate:              getBool("AUTO_MIGRATE", true),
		LogLevel:                 getString("LOG_LEVEL", "info"),
		SMTPHost:                 getString("SMTP_HOST", ""),
		SMTPPort:                 getInt("SMTP_PORT", 587),
		SMTPUsername:             getString("SMTP_USERNAME", ""),
		SMTPPassword:             getString("SMTP_PASSWORD", ""),
		SMTPFrom:                 getString("SMTP_FROM", "MyPrintables <no-reply@localhost>"),
		SMTPTLS:                  getBool("SMTP_TLS", true),
	}
	if c.DataDir == "" {
		c.DataDir = "./data"
	}
	abs, err := filepath.Abs(c.DataDir)
	if err != nil {
		return c, fmt.Errorf("resolve data dir: %w", err)
	}
	c.DataDir = abs
	if c.Port < 1 || c.Port > 65535 {
		return c, fmt.Errorf("invalid PORT %d", c.Port)
	}
	if c.MaxUploadMB < 1 {
		c.MaxUploadMB = 1024
	}
	return c, nil
}

func (c Config) DatabasePath() string { return filepath.Join(c.DataDir, "app.db") }

func (c Config) Path(parts ...string) string {
	all := append([]string{c.DataDir}, parts...)
	return filepath.Join(all...)
}

func (c Config) SMTPConfigured() bool {
	return strings.TrimSpace(c.SMTPHost) != "" && strings.TrimSpace(c.SMTPFrom) != ""
}

func getString(key, fallback string) string {
	v, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}
	return strings.TrimSpace(v)
}

func getInt(key string, fallback int) int {
	v, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}
	n, err := strconv.Atoi(strings.TrimSpace(v))
	if err != nil {
		return fallback
	}
	return n
}

func getBool(key string, fallback bool) bool {
	v, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}
	switch strings.ToLower(strings.TrimSpace(v)) {
	case "1", "true", "yes", "on":
		return true
	case "0", "false", "no", "off":
		return false
	default:
		return fallback
	}
}
