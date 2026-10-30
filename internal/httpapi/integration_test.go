package httpapi

import (
	"bytes"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"testing"

	"myprintables/internal/config"
	"myprintables/internal/store"
)

type testClient struct {
	t      *testing.T
	client *http.Client
	base   string
	csrf   string
}

func newTestClient(t *testing.T, base string) *testClient {
	jar, _ := cookiejar.New(nil)
	return &testClient{t: t, client: &http.Client{Jar: jar}, base: base}
}

func (c *testClient) request(method, path string, body any) (int, map[string]any) {
	c.t.Helper()
	var reader io.Reader
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			c.t.Fatal(err)
		}
		reader = bytes.NewReader(b)
	}
	req, err := http.NewRequest(method, c.base+path, reader)
	if err != nil {
		c.t.Fatal(err)
	}
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	if c.csrf != "" {
		req.Header.Set("X-CSRF-Token", c.csrf)
	}
	res, err := c.client.Do(req)
	if err != nil {
		c.t.Fatal(err)
	}
	defer res.Body.Close()
	var out map[string]any
	_ = json.NewDecoder(res.Body).Decode(&out)
	return res.StatusCode, out
}

func TestCoreFlow(t *testing.T) {
	cfg := config.Config{DataDir: t.TempDir(), SiteName: "Test", AppURL: "http://localhost", Port: 8200, AutoMigrate: true}
	st, err := store.Open(cfg)
	if err != nil {
		t.Fatal(err)
	}
	defer st.Close()
	if err := st.Migrate(); err != nil {
		t.Fatal(err)
	}
	log := slog.New(slog.NewTextHandler(io.Discard, nil))
	server := httptest.NewServer(New(&cfg, st, log).Handler())
	defer server.Close()

	admin := newTestClient(t, server.URL)
	status, body := admin.request(http.MethodPost, "/api/setup", map[string]any{
		"email": "admin@example.com", "username": "admin", "displayName": "Admin", "password": "correct-horse-battery",
	})
	if status != http.StatusCreated {
		t.Fatalf("setup status %d: %v", status, body)
	}
	admin.csrf = body["csrf"].(string)

	status, body = admin.request(http.MethodPost, "/api/models", map[string]any{
		"title": "Public model", "description": "Hello", "visibility": "public", "status": "published", "tags": []string{"test"},
	})
	if status != http.StatusCreated {
		t.Fatalf("create public status %d: %v", status, body)
	}
	publicID := body["model"].(map[string]any)["id"].(string)

	status, body = admin.request(http.MethodPost, "/api/models", map[string]any{
		"title": "Private model", "description": "Secret", "visibility": "private", "status": "published",
	})
	if status != http.StatusCreated {
		t.Fatalf("create private status %d: %v", status, body)
	}
	privateID := body["model"].(map[string]any)["id"].(string)

	anon := newTestClient(t, server.URL)
	status, body = anon.request(http.MethodGet, "/api/models", nil)
	if status != http.StatusOK {
		t.Fatalf("anon list status %d", status)
	}
	if int(body["total"].(float64)) != 1 {
		t.Fatalf("anon total = %v, want 1", body["total"])
	}
	status, _ = anon.request(http.MethodGet, "/api/models/"+privateID, nil)
	if status != http.StatusNotFound {
		t.Fatalf("anon private detail status %d, want 404", status)
	}

	status, body = admin.request(http.MethodPost, "/api/models/"+publicID+"/comments", map[string]any{"body": "Nice model"})
	if status != http.StatusCreated {
		t.Fatalf("comment status %d: %v", status, body)
	}
	status, body = admin.request(http.MethodPut, "/api/models/"+publicID+"/rating", map[string]any{"score": 5})
	if status != http.StatusOK {
		t.Fatalf("rating status %d: %v", status, body)
	}
	if body["ratingCount"].(float64) != 1 {
		t.Fatalf("rating count = %v", body["ratingCount"])
	}

	status, body = admin.request(http.MethodPost, "/api/collections", map[string]any{"name": "Favorites", "visibility": "public"})
	if status != http.StatusCreated {
		t.Fatalf("collection status %d: %v", status, body)
	}
	collectionID := body["collection"].(map[string]any)["id"].(string)
	status, body = admin.request(http.MethodPost, "/api/collections/"+collectionID+"/models/"+publicID, nil)
	if status != http.StatusOK {
		t.Fatalf("add collection status %d: %v", status, body)
	}
	status, body = anon.request(http.MethodGet, "/api/collections/"+collectionID, nil)
	if status != http.StatusOK {
		t.Fatalf("collection read status %d: %v", status, body)
	}
	if len(body["models"].([]any)) != 1 {
		t.Fatalf("collection models = %v", body["models"])
	}

	status, body = admin.request(http.MethodGet, "/api/admin/models", nil)
	if status != http.StatusOK {
		t.Fatalf("admin models status %d", status)
	}
	if int(body["total"].(float64)) != 2 {
		t.Fatalf("admin total = %v, want 2", body["total"])
	}
}
