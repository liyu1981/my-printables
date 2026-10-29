package logging

import (
	"io"
	"log/slog"
	"os"
	"strings"
)

func Setup(level string) *slog.Logger {
	return SetupTo(level, os.Stdout)
}

func SetupTo(level string, w io.Writer) *slog.Logger {
	var l slog.Level
	switch strings.ToLower(strings.TrimSpace(level)) {
	case "debug":
		l = slog.LevelDebug
	case "warn", "warning":
		l = slog.LevelWarn
	case "error":
		l = slog.LevelError
	default:
		l = slog.LevelInfo
	}
	h := slog.NewJSONHandler(w, &slog.HandlerOptions{Level: l})
	logger := slog.New(h)
	slog.SetDefault(logger)
	return logger
}
