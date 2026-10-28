# MyPrintables

Self-hosted, Printables-inspired 3D model library. One Go binary embeds the API, React SPA, migrations,
and the administrative CLI.

## Features (v1)

- Open registration with optional email verification (SMTP, off by default)
- Admin and user roles, sessions, password reset via admin UI/CLI
- Models with multiple STL / 3MF / OBJ / PLY / GLB / GLTF files
- Public, members-only, and private visibility
- Image uploads with automatic resizing and client-generated 3D covers
- Fullscreen 3D preview with orbit/zoom/pan, file switching, screenshots
- Search, category/tag filters, likes, bookmarks, downloads
- 1–5 star ratings, comments with one reply level, tags, and collections
- Admin dashboard with users, content moderation, storage, audit, and settings
- SQLite + plain files in one local data directory
- Single binary with a full CLI

## Development

```sh
make build
./bin/myprintables serve --data-dir ./data
```

Open <http://localhost:8080>.

- `doc/PLAN.md` — implementation plan and decisions
- `doc/DESIGN.md` — design language and component specs
- `doc/DEPLOY.md` — single-binary deployment
- `doc/BACKUP.md` — backup and restore
- `AGENTS.md` — repository agent rules

## CLI

```sh
myprintables serve
myprintables migrate status
myprintables migrate up
myprintables admin list
myprintables admin create --email you@example.com --username you --generate
myprintables admin verify-email --email you@example.com
myprintables admin reset-password --email you@example.com
myprintables backup --out ./data/backups/app.db
myprintables version
```
