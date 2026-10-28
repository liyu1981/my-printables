package email

import (
	"context"
	"fmt"
	"log/slog"
	"strings"

	"github.com/wneessen/go-mail"

	"myprintables/internal/config"
)

type Sender interface {
	SendVerification(ctx context.Context, to, username, link string) error
	SendTest(ctx context.Context, to string) error
}

type SMTPSender struct {
	cfg config.Config
	log *slog.Logger
}

func New(cfg config.Config, log *slog.Logger) Sender {
	return &SMTPSender{cfg: cfg, log: log}
}

func (s *SMTPSender) SendVerification(ctx context.Context, to, username, link string) error {
	body := fmt.Sprintf("Hi %s,\n\nVerify your email address for MyPrintables:\n\n%s\n\nThis link expires in 24 hours. If you did not create an account, ignore this email.\n", username, link)
	return s.send(ctx, to, "Verify your MyPrintables email", body)
}

func (s *SMTPSender) SendTest(ctx context.Context, to string) error {
	return s.send(ctx, to, "MyPrintables SMTP test", "Your MyPrintables SMTP configuration works.\n")
}

func (s *SMTPSender) send(ctx context.Context, to, subject, body string) error {
	if !s.cfg.SMTPConfigured() {
		return fmt.Errorf("SMTP is not configured")
	}
	msg := mail.NewMsg()
	if err := msg.FromFormat("MyPrintables", extractAddress(s.cfg.SMTPFrom)); err != nil {
		return err
	}
	if err := msg.To(to); err != nil {
		return err
	}
	msg.Subject(subject)
	msg.SetBodyString(mail.TypeTextPlain, body)

	opts := []mail.Option{mail.WithPort(s.cfg.SMTPPort), mail.WithSMTPAuth(mail.SMTPAuthAutoDiscover)}
	if s.cfg.SMTPUsername != "" {
		opts = append(opts, mail.WithUsername(s.cfg.SMTPUsername), mail.WithPassword(s.cfg.SMTPPassword))
	}
	if s.cfg.SMTPTLS {
		opts = append(opts, mail.WithTLSPolicy(mail.TLSMandatory))
	} else {
		opts = append(opts, mail.WithTLSPolicy(mail.NoTLS))
	}
	client, err := mail.NewClient(s.cfg.SMTPHost, opts...)
	if err != nil {
		return err
	}
	if err := client.DialAndSendWithContext(ctx, msg); err != nil {
		s.log.Warn("smtp send failed", "to", to, "error", err)
		return err
	}
	s.log.Info("email sent", "to", to, "subject", subject)
	return nil
}

func extractAddress(from string) string {
	from = strings.TrimSpace(from)
	if i := strings.LastIndex(from, "<"); i >= 0 {
		return strings.Trim(strings.TrimSpace(from[i+1:]), ">")
	}
	return from
}
