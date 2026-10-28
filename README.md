# MyPrintables

Self-hosted, Printables-inspired 3D model library. One Go binary embeds the API, React SPA, migrations,
and the administrative CLI.

## Features (v1)

- Open registration with optional email verification (SMTP, off by default)
- Admin and user roles, sessions, password reset via admin UI/CLI
- Models with multiple STL / 3MF / OBJ / PLY / GLB / GLTF files
- Public, members-only, and private visibility
- Image uploads with automatic resizing and client-generated 3D covers
- Fullscreen 3D preview with orbit/zoom/pan, file switching, screenshots, and region-crop captures saved to the gallery
- Search, category/tag filters, likes, bookmarks, downloads
- 1–5 star ratings, comments with one reply level, tags, and collections
- Admin dashboard with users, content moderation, storage, audit, and settings
- SQLite + plain files in one local data directory
- Single binary with a full CLI

## Build & run

Requires Go 1.27+, Node 22+, and pnpm.

```sh
pnpm install
pnpm build
pnpm start
```

Open <http://localhost:8200>.

## Docker

```sh
docker build -t myprintables .
docker run -d --name myprintables -p 8200:8200 -v myprintables_data:/data myprintables
```

The image runs as UID/GID `10001` and stores everything under `/data`. For a bind mount, prepare ownership:

```sh
mkdir -p ./data
sudo chown -R 10001:10001 ./data
docker run -d --name myprintables -p 8200:8200 -v "$PWD/data:/data" myprintables
```

GitHub Actions publishes `ghcr.io/<owner>/<repo>` images for `v*` tags.

## Development

```sh
pnpm install
pnpm dev
```

`pnpm dev` runs [Air](https://github.com/air-verse/air). It watches Go, SQL, and frontend source files;
on every change it rebuilds the frontend in development mode, rebuilds the server with debug symbols, and
restarts it. Development frontend builds are unminified and include inline source maps. Release builds
(`pnpm build`) minify the SPA and omit source maps, so browser debug symbols are not shipped.

To run only the Vite dev server: `pnpm dev:web`.

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
