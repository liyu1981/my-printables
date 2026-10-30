package store

import (
	"context"
	"testing"
	"time"

	"myprintables/internal/config"
)

func testStore(t *testing.T) *Store {
	t.Helper()
	cfg := config.Config{DataDir: t.TempDir(), SiteName: "Test"}
	st, err := Open(cfg)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { st.Close() })
	if err := st.Migrate(); err != nil {
		t.Fatal(err)
	}
	return st
}

func makeUser(t *testing.T, st *Store, username string) User {
	t.Helper()
	now := time.Now().Unix()
	u := User{ID: NewID(), Email: username + "@example.com", Username: username, DisplayName: username, Role: "user", IsActive: true, EmailVerifiedAt: &now}
	if err := st.CreateUser(context.Background(), u, "not-a-real-hash"); err != nil {
		t.Fatal(err)
	}
	u, _, err := st.UserByEmail(context.Background(), u.Email)
	if err != nil {
		t.Fatal(err)
	}
	return u
}

func TestVisibilityFiltering(t *testing.T) {
	st := testStore(t)
	owner := makeUser(t, st, "owner")
	viewer := makeUser(t, st, "viewer")
	ctx := context.Background()
	for _, visibility := range []string{"public", "members", "private"} {
		m := Model{OwnerID: owner.ID, Title: "A " + visibility + " model", Visibility: visibility, Status: "published"}
		if err := st.CreateModel(ctx, &m, []string{"test"}); err != nil {
			t.Fatal(err)
		}
	}
	anon, err := st.ListModels(ctx, ModelFilter{ViewerID: "", Page: 1, PerPage: 20})
	if err != nil {
		t.Fatal(err)
	}
	if anon.Total != 1 {
		t.Fatalf("anonymous sees %d models, want 1", anon.Total)
	}
	auth, err := st.ListModels(ctx, ModelFilter{ViewerID: viewer.ID, Page: 1, PerPage: 20})
	if err != nil {
		t.Fatal(err)
	}
	if auth.Total != 2 {
		t.Fatalf("signed-in user sees %d models, want 2", auth.Total)
	}
	own, err := st.ListModels(ctx, ModelFilter{ViewerID: owner.ID, Page: 1, PerPage: 20})
	if err != nil {
		t.Fatal(err)
	}
	if own.Total != 3 {
		t.Fatalf("owner sees %d models, want 3", own.Total)
	}
}

func TestSlugify(t *testing.T) {
	cases := map[string]string{
		"Hello, World!":          "hello-world",
		"  Under Desk / Cable  ": "under-desk-cable",
		"!!!":                    "model",
	}
	for in, want := range cases {
		if got := Slugify(in); got != want {
			t.Errorf("Slugify(%q) = %q, want %q", in, got, want)
		}
	}
}
