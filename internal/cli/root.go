package cli

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/spf13/cobra"

	"myprintables/internal/config"
	"myprintables/internal/httpapi"
	"myprintables/internal/logging"
	"myprintables/internal/store"
)

var (
	version   = "dev"
	commit    = "none"
	buildDate = "unknown"

	dataDirFlag string
	logLevel    string
	jsonOutput  bool
	portFlag    int
)

func Execute() {
	root := newRoot()
	if err := root.Execute(); err != nil {
		os.Exit(1)
	}
}

func newRoot() *cobra.Command {
	root := &cobra.Command{
		Use:           "myprintables",
		Short:         "Self-hosted 3D model library",
		SilenceUsage:  true,
		SilenceErrors: true,
		RunE:          runServe,
		Args:          cobra.NoArgs,
	}
	root.PersistentFlags().StringVar(&dataDirFlag, "data-dir", "", "data directory (default: $DATA_DIR or ./data)")
	root.PersistentFlags().StringVar(&logLevel, "log-level", "", "log level: debug|info|warn|error")
	root.PersistentFlags().BoolVar(&jsonOutput, "json", false, "machine-readable output where supported")
	root.AddCommand(newServeCmd(), newMigrateCmd(), newAdminCmd(), newBackupCmd(), newVersionCmd())
	return root
}

func loadConfig() (config.Config, error) {
	cfg, err := config.Load()
	if err != nil {
		return cfg, err
	}
	if dataDirFlag != "" {
		abs, err := filepath.Abs(dataDirFlag)
		if err != nil {
			return cfg, err
		}
		cfg.DataDir = abs
	}
	if logLevel != "" {
		cfg.LogLevel = logLevel
	}
	if portFlag != 0 {
		cfg.Port = portFlag
	}
	cfg.JSON = jsonOutput
	return cfg, nil
}

func openStore() (*store.Store, config.Config, *slog.Logger, error) {
	cfg, err := loadConfig()
	if err != nil {
		return nil, cfg, nil, err
	}
	log := logging.Setup(cfg.LogLevel)
	st, err := store.Open(cfg)
	if err != nil {
		return nil, cfg, log, err
	}
	return st, cfg, log, nil
}

func newServeCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "serve",
		Short: "Start the HTTP server",
		RunE:  runServe,
		Args:  cobra.NoArgs,
	}
	cmd.Flags().IntVarP(&portFlag, "port", "p", 0, "HTTP port (default: $PORT or 8080)")
	return cmd
}

func runServe(cmd *cobra.Command, args []string) error {
	st, cfg, log, err := openStore()
	if err != nil {
		return err
	}
	defer st.Close()
	if cfg.AutoMigrate {
		if err := st.Migrate(); err != nil {
			return err
		}
	}
	if cfg.AdminEmail != "" && cfg.AdminPassword != "" {
		if err := ensureAdmin(st, cfg, cfg.AdminEmail, cfg.AdminPassword); err != nil {
			log.Warn("bootstrap admin failed", "error", err)
		}
	}

	httpapi.Version = version
	srv := httpapi.New(&cfg, st, log)
	httpServer := &http.Server{
		Addr:              fmt.Sprintf(":%d", cfg.Port),
		Handler:           srv.Handler(),
		ReadHeaderTimeout: 10 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()
	errCh := make(chan error, 1)
	go func() {
		log.Info("server listening", "url", fmt.Sprintf("http://localhost:%d", cfg.Port), "data_dir", cfg.DataDir, "version", version)
		errCh <- httpServer.ListenAndServe()
	}()
	select {
	case err := <-errCh:
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return err
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return httpServer.Shutdown(shutdownCtx)
	}
}

func ensureAdmin(st *store.Store, cfg config.Config, email, password string) error {
	// Implemented in M1. Keeping this hook in M0 means an unattended start does
	// not crash before the accounts migration exists.
	return nil
}

func newMigrateCmd() *cobra.Command {
	cmd := &cobra.Command{Use: "migrate", Short: "Manage database migrations"}
	cmd.AddCommand(&cobra.Command{
		Use:   "status",
		Short: "Show applied and pending migrations",
		RunE: func(cmd *cobra.Command, args []string) error {
			st, _, log, err := openStore()
			if err != nil {
				return err
			}
			defer st.Close()
			log.Info("migration status")
			return st.MigrationStatus()
		},
	})
	cmd.AddCommand(&cobra.Command{
		Use:   "up",
		Short: "Apply all pending migrations",
		RunE: func(cmd *cobra.Command, args []string) error {
			st, _, _, err := openStore()
			if err != nil {
				return err
			}
			defer st.Close()
			if err := st.Migrate(); err != nil {
				return err
			}
			fmt.Fprintln(cmd.OutOrStdout(), "migrations applied")
			return nil
		},
	})
	return cmd
}

func newAdminCmd() *cobra.Command {
	cmd := &cobra.Command{Use: "admin", Short: "Administrative account commands"}
	for _, name := range []string{"create", "list", "verify-email", "reset-password"} {
		name := name
		sub := &cobra.Command{
			Use:   name,
			Short: "admin " + name,
			RunE: func(cmd *cobra.Command, args []string) error {
				return fmt.Errorf("admin %s is not available until the accounts milestone", name)
			},
		}
		cmd.AddCommand(sub)
	}
	return cmd
}

func newBackupCmd() *cobra.Command {
	var out string
	cmd := &cobra.Command{
		Use:   "backup",
		Short: "Create a consistent SQLite snapshot",
		RunE: func(cmd *cobra.Command, args []string) error {
			st, cfg, _, err := openStore()
			if err != nil {
				return err
			}
			defer st.Close()
			if out == "" {
				out = filepath.Join(cfg.DataDir, "backups", fmt.Sprintf("app-%s.db", time.Now().Format("20060102-150405")))
			}
			if err := os.MkdirAll(filepath.Dir(out), 0o750); err != nil {
				return err
			}
			_ = os.Remove(out)
			if err := st.VacuumInto(out); err != nil {
				return err
			}
			if jsonOutput {
				return json.NewEncoder(cmd.OutOrStdout()).Encode(map[string]string{"path": out})
			}
			fmt.Fprintln(cmd.OutOrStdout(), out)
			return nil
		},
	}
	cmd.Flags().StringVar(&out, "out", "", "output path (default: $DATA_DIR/backups/app-<timestamp>.db)")
	return cmd
}

func newVersionCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "version",
		Short: "Print version information",
		RunE: func(cmd *cobra.Command, args []string) error {
			if jsonOutput {
				return json.NewEncoder(cmd.OutOrStdout()).Encode(map[string]string{
					"version": version, "commit": commit, "buildDate": buildDate,
				})
			}
			fmt.Fprintf(cmd.OutOrStdout(), "myprintables %s (commit %s, built %s)\n", version, commit, buildDate)
			return nil
		},
	}
}
