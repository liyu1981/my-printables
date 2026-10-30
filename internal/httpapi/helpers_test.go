package httpapi

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestDecodeJSON(t *testing.T) {
	t.Run("valid", func(t *testing.T) {
		var dst struct {
			Name string `json:"name"`
		}
		req := httptest.NewRequest("POST", "/", strings.NewReader(`{"name":"cube"}`))
		if err := decodeJSON(req, &dst); err != nil {
			t.Fatal(err)
		}
		if dst.Name != "cube" {
			t.Fatalf("name = %q", dst.Name)
		}
	})

	t.Run("trailing data", func(t *testing.T) {
		var dst struct {
			Name string `json:"name"`
		}
		req := httptest.NewRequest("POST", "/", strings.NewReader(`{"name":"cube"}{"name":"other"}`))
		if err := decodeJSON(req, &dst); err == nil {
			t.Fatal("expected trailing data error")
		}
	})
}
