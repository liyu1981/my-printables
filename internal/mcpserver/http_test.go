package mcpserver

import (
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/modelcontextprotocol/go-sdk/mcp"

	"myprintables/internal/auth"
	"myprintables/internal/config"
	"myprintables/internal/store"
)

type bearerTransport struct {
	token string
	base  http.RoundTripper
}

func (t bearerTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	r := req.Clone(req.Context())
	r.Header.Set("Authorization", "Bearer "+t.token)
	return t.base.RoundTrip(r)
}

func TestHTTPMCP(t *testing.T) {
	cfg := config.Config{DataDir: t.TempDir(), AppURL: "http://example.test", MCPEnabled: true, MCPToken: "test-token"}
	st, err := store.Open(cfg)
	if err != nil {
		t.Fatal(err)
	}
	defer st.Close()
	if err := st.Migrate(); err != nil {
		t.Fatal(err)
	}
	now := time.Now().Unix()
	u := store.User{ID: store.NewID(), Email: "mcp@example.com", Username: "mcp", DisplayName: "MCP", Role: "user", IsActive: true, EmailVerifiedAt: &now}
	if err := st.CreateUser(context.Background(), u, "not-used"); err != nil {
		t.Fatal(err)
	}
	m := store.Model{OwnerID: u.ID, Title: "MCP Test Model", Visibility: "public", Status: "published"}
	if err := st.CreateModel(context.Background(), &m, []string{"mcp"}); err != nil {
		t.Fatal(err)
	}

	log := slog.New(slog.NewTextHandler(io.Discard, nil))
	handler := NewHTTP(cfg, st, log)
	if handler == nil {
		t.Fatal("nil MCP handler")
	}
	server := httptest.NewServer(handler)
	defer server.Close()

	unauth, err := http.Post(server.URL, "application/json", strings.NewReader(`{}`))
	if err != nil {
		t.Fatal(err)
	}
	unauth.Body.Close()
	if unauth.StatusCode != http.StatusUnauthorized {
		t.Fatalf("unauth status = %d, want 401", unauth.StatusCode)
	}

	client := mcp.NewClient(&mcp.Implementation{Name: "test", Version: "1"}, nil)
	transport := &mcp.StreamableClientTransport{
		Endpoint:             server.URL,
		HTTPClient:           &http.Client{Transport: bearerTransport{token: "test-token", base: http.DefaultTransport}},
		DisableStandaloneSSE: true,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	session, err := client.Connect(ctx, transport, nil)
	if err != nil {
		t.Fatal(err)
	}
	defer session.Close()

	res, err := session.CallTool(ctx, &mcp.CallToolParams{Name: "search_models", Arguments: map[string]any{"query": "MCP"}})
	if err != nil {
		t.Fatal(err)
	}
	if res.IsError {
		t.Fatalf("tool error: %+v", res.Content)
	}
	b, _ := json.Marshal(res.StructuredContent)
	if !strings.Contains(string(b), "MCP Test Model") {
		t.Fatalf("search result = %s", b)
	}

	if err := st.CreateUser(context.Background(), u, "unused"); err != nil {
		_ = err
	}

	tools, err := session.ListTools(ctx, nil)
	if err != nil {
		t.Fatal(err)
	}
	for _, tool := range tools.Tools {
		if tool.Name == "create_model" {
			t.Fatal("global token must be read-only")
		}
	}

	// API key auth enables scoped write tools, but never model deletion.
	keyToken, err := auth.NewToken(32)
	if err != nil {
		t.Fatal(err)
	}
	keyToken = "myp_" + keyToken
	if _, err := st.CreateAPIKey(context.Background(), u.ID, "test", auth.TokenHash(keyToken), keyToken[:12]); err != nil {
		t.Fatal(err)
	}
	userClient := mcp.NewClient(&mcp.Implementation{Name: "test-user", Version: "1"}, nil)
	userTransport := &mcp.StreamableClientTransport{
		Endpoint:             server.URL,
		HTTPClient:           &http.Client{Transport: bearerTransport{token: keyToken, base: http.DefaultTransport}},
		DisableStandaloneSSE: true,
	}
	userSession, err := userClient.Connect(ctx, userTransport, nil)
	if err != nil {
		t.Fatal(err)
	}
	defer userSession.Close()
	tools, err = userSession.ListTools(ctx, nil)
	if err != nil {
		t.Fatal(err)
	}
	hasCreate, hasDelete := false, false
	for _, tool := range tools.Tools {
		if tool.Name == "create_model" {
			hasCreate = true
		}
		if tool.Name == "delete_model" {
			hasDelete = true
		}
	}
	if !hasCreate {
		t.Fatal("API key session is missing create_model")
	}
	if hasDelete {
		t.Fatal("MCP must not expose delete_model")
	}
	created, err := userSession.CallTool(ctx, &mcp.CallToolParams{Name: "create_model", Arguments: map[string]any{"title": "Created by MCP"}})
	if err != nil {
		t.Fatal(err)
	}
	if created.IsError {
		t.Fatalf("create_model error: %+v", created.Content)
	}
	b, _ = json.Marshal(created.StructuredContent)
	if !strings.Contains(string(b), "Created by MCP") {
		t.Fatalf("create result = %s", b)
	}
}
