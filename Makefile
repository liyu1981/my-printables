SHELL := /bin/sh
VERSION ?= 0.1.0
COMMIT ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo none)
DATE ?= $(shell date -u +%Y-%m-%dT%H:%M:%SZ)
LDFLAGS := -s -w -X myprintables/internal/cli.version=$(VERSION) -X myprintables/internal/cli.commit=$(COMMIT) -X myprintables/internal/cli.buildDate=$(DATE)

.PHONY: build web go test typecheck dev-backend dev-web clean

build: web go

web:
	cd web && npm install --no-audit --no-fund && npm run build

go:
	CGO_ENABLED=0 go build -trimpath -ldflags "$(LDFLAGS)" -o bin/myprintables ./cmd/myprintables

test:
	go test ./...
	cd web && npm run typecheck

dev-backend:
	go run ./cmd/myprintables serve --data-dir ./data

dev-web:
	cd web && npm run dev

clean:
	rm -rf bin web/node_modules internal/web/dist
