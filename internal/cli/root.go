package cli

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"text/tabwriter"
	"time"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/spf13/cobra"
	"golang.org/x/term"

	"myprintables/internal/auth"
	"myprintables/internal/config"
	"myprintables/internal/httpapi"
	"myprintables/internal/logging"
	"myprintables/internal/mcpserver"
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
	root.AddCommand(newServeCmd(), newMigrateCmd(), newAdminCmd(), newBackupCmd(), newMCPCmd(), newVersionCmd())
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
	cmd.Flags().IntVarP(&portFlag, "port", "p", 0, "HTTP port (default: $PORT or 8200)")
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
	ctx := context.Background()
	n, err := st.CountUsers(ctx)
	if err != nil {
		return err
	}
	if n > 0 {
		return nil
	}
	if msg := auth.PasswordProblem(password); msg != "" {
		return fmt.Errorf("%s", msg)
	}
	hash, err := auth.HashPassword(password)
	if err != nil {
		return err
	}
	verified := time.Now().Unix()
	u := store.User{
		ID: store.NewID(), Email: strings.ToLower(strings.TrimSpace(email)), Username: "admin",
		DisplayName: "Administrator", Role: "admin", IsActive: true, EmailVerifiedAt: &verified,
	}
	if err := st.CreateUser(ctx, u, hash); err != nil {
		return err
	}
	fmt.Fprintf(os.Stderr, "bootstrap admin created: %s\n", u.Email)
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

func newMCPCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "mcp",
		Short: "Run an MCP server over stdio",
		Long:  "Serve the public MyPrintables library to an MCP client over stdio. Logs are written to stderr.",
		RunE: func(cmd *cobra.Command, args []string) error {
			cfg, err := loadConfig()
			if err != nil {
				return err
			}
			log := logging.SetupTo(cfg.LogLevel, os.Stderr)
			st, err := store.Open(cfg)
			if err != nil {
				return err
			}
			defer st.Close()
			if cfg.AutoMigrate {
				if err := st.Migrate(); err != nil {
					return err
				}
			}
			srv := mcpserver.NewServer(cfg, st, log, nil)
			return srv.Run(context.Background(), &mcp.StdioTransport{})
		},
	}
}

func newAdminCmd() *cobra.Command {
	cmd := &cobra.Command{Use: "admin", Short: "Administrative account commands"}
	cmd.AddCommand(newAdminCreateCmd(), newAdminListCmd(), newAdminVerifyCmd(), newAdminResetCmd())
	return cmd
}

func newAdminCreateCmd() *cobra.Command {
	var email, username, displayName, role, password string
	var stdin, generate bool
	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create an account",
		RunE: func(cmd *cobra.Command, args []string) error {
			st, _, _, err := openStore()
			if err != nil {
				return err
			}
			defer st.Close()
			password, err = readPassword(password, stdin, generate)
			if err != nil {
				return err
			}
			if msg := auth.PasswordProblem(password); msg != "" {
				return fmt.Errorf("%s", msg)
			}
			if role != "admin" && role != "user" {
				return fmt.Errorf("role must be admin or user")
			}
			hash, err := auth.HashPassword(password)
			if err != nil {
				return err
			}
			verified := time.Now().Unix()
			u := store.User{
				ID: store.NewID(), Email: strings.ToLower(strings.TrimSpace(email)),
				Username: strings.TrimSpace(username), DisplayName: strings.TrimSpace(displayName),
				Role: role, IsActive: true, EmailVerifiedAt: &verified,
			}
			if u.DisplayName == "" {
				u.DisplayName = u.Username
			}
			if err := st.CreateUser(cmd.Context(), u, hash); err != nil {
				return err
			}
			if jsonOutput {
				return json.NewEncoder(cmd.OutOrStdout()).Encode(map[string]any{"user": u, "password": generatedPassword(password, generate)})
			}
			fmt.Fprintf(cmd.OutOrStdout(), "created %s (%s)\n", u.Email, u.Role)
			if generate {
				fmt.Fprintf(cmd.OutOrStdout(), "password: %s\n", password)
			}
			return nil
		},
	}
	cmd.Flags().StringVar(&email, "email", "", "email address")
	cmd.Flags().StringVar(&username, "username", "", "username")
	cmd.Flags().StringVar(&displayName, "display-name", "", "display name")
	cmd.Flags().StringVar(&role, "role", "user", "role: admin|user")
	cmd.Flags().BoolVar(&stdin, "password-stdin", false, "read password from stdin")
	cmd.Flags().BoolVar(&generate, "generate", false, "generate a random password and print it once")
	_ = cmd.MarkFlagRequired("email")
	_ = cmd.MarkFlagRequired("username")
	return cmd
}

func newAdminListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List accounts",
		RunE: func(cmd *cobra.Command, args []string) error {
			st, _, _, err := openStore()
			if err != nil {
				return err
			}
			defer st.Close()
			users, err := st.ListUsers(cmd.Context(), "", 200)
			if err != nil {
				return err
			}
			if jsonOutput {
				return json.NewEncoder(cmd.OutOrStdout()).Encode(map[string]any{"items": users})
			}
			tw := tabwriter.NewWriter(cmd.OutOrStdout(), 0, 0, 2, ' ', 0)
			fmt.Fprintln(tw, "EMAIL\tUSERNAME\tROLE\tACTIVE\tVERIFIED")
			for _, u := range users {
				verified := "no"
				if u.EmailVerifiedAt != nil {
					verified = "yes"
				}
				active := "no"
				if u.IsActive {
					active = "yes"
				}
				fmt.Fprintf(tw, "%s\t%s\t%s\t%s\t%s\n", u.Email, u.Username, u.Role, active, verified)
			}
			return tw.Flush()
		},
	}
}

func newAdminVerifyCmd() *cobra.Command {
	var email string
	cmd := &cobra.Command{
		Use:   "verify-email",
		Short: "Mark an account's email as verified",
		RunE: func(cmd *cobra.Command, args []string) error {
			st, _, _, err := openStore()
			if err != nil {
				return err
			}
			defer st.Close()
			u, _, err := st.UserByEmail(cmd.Context(), email)
			if err != nil {
				return err
			}
			if err := st.SetEmailVerified(cmd.Context(), u.ID); err != nil {
				return err
			}
			fmt.Fprintf(cmd.OutOrStdout(), "verified %s\n", u.Email)
			return nil
		},
	}
	cmd.Flags().StringVar(&email, "email", "", "email address")
	_ = cmd.MarkFlagRequired("email")
	return cmd
}

func newAdminResetCmd() *cobra.Command {
	var email, password string
	var stdin, generate bool
	cmd := &cobra.Command{
		Use:   "reset-password",
		Short: "Reset an account password and revoke its sessions",
		RunE: func(cmd *cobra.Command, args []string) error {
			st, _, _, err := openStore()
			if err != nil {
				return err
			}
			defer st.Close()
			u, _, err := st.UserByEmail(cmd.Context(), email)
			if err != nil {
				return err
			}
			password, err = readPassword(password, stdin, generate)
			if err != nil {
				return err
			}
			if msg := auth.PasswordProblem(password); msg != "" {
				return fmt.Errorf("%s", msg)
			}
			hash, err := auth.HashPassword(password)
			if err != nil {
				return err
			}
			if err := st.UpdateUser(cmd.Context(), u.ID, map[string]any{"password_hash": hash}); err != nil {
				return err
			}
			_ = st.DeleteUserSessions(cmd.Context(), u.ID)
			fmt.Fprintf(cmd.OutOrStdout(), "password reset for %s; all sessions revoked\n", u.Email)
			if generate {
				fmt.Fprintf(cmd.OutOrStdout(), "password: %s\n", password)
			}
			return nil
		},
	}
	cmd.Flags().StringVar(&email, "email", "", "email address")
	cmd.Flags().BoolVar(&stdin, "password-stdin", false, "read password from stdin")
	cmd.Flags().BoolVar(&generate, "generate", false, "generate a random password and print it once")
	_ = cmd.MarkFlagRequired("email")
	return cmd
}

func readPassword(given string, stdin, generate bool) (string, error) {
	if given != "" {
		return given, nil
	}
	if generate {
		token, err := auth.NewToken(12)
		if err != nil {
			return "", err
		}
		return token, nil
	}
	if stdin {
		line, err := bufio.NewReader(os.Stdin).ReadString('\n')
		if err != nil && strings.TrimSpace(line) == "" {
			return "", err
		}
		return strings.TrimSpace(line), nil
	}
	if !term.IsTerminal(int(os.Stdin.Fd())) {
		return "", fmt.Errorf("no TTY; use --password-stdin or --generate")
	}
	fmt.Fprint(os.Stderr, "Password: ")
	first, err := term.ReadPassword(int(os.Stdin.Fd()))
	fmt.Fprintln(os.Stderr)
	if err != nil {
		return "", err
	}
	fmt.Fprint(os.Stderr, "Confirm password: ")
	second, err := term.ReadPassword(int(os.Stdin.Fd()))
	fmt.Fprintln(os.Stderr)
	if err != nil {
		return "", err
	}
	if string(first) != string(second) {
		return "", fmt.Errorf("passwords do not match")
	}
	return string(first), nil
}

func generatedPassword(password string, generate bool) string {
	if generate {
		return password
	}
	return ""
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
