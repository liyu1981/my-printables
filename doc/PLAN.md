# MyPrintables — Implementation Plan

Status: **Draft v1 — awaiting approval**
Goal: a self-hosted, Printables-inspired 3D model library for a home NAS.
Working name: **MyPrintables** (configurable). The layout is inspired by Printables; no proprietary
logos, fonts, CSS, or icons from printables.com will be copied. See `doc/DESIGN.md`.

---

## 1. Product goal & principles

One executable (`myprintables`) containing the Go API, the embedded React SPA, migrations, and admin
CLI tooling. It lets a household:

- Create accounts (email/password), with one or more admins.
- Upload and manage 3D models and their files (`STL`, `3MF`, `OBJ`, `PLY`, `GLB`/`GLTF`; `STEP` download-only).
- Browse, search, filter, like, bookmark, and download models.
- Preview models in the browser with rotate/zoom/pan, file switching, and fullscreen.
- Keep models public by default, or restrict to signed-in users, or keep private.
- Persist everything in a single Docker volume (`/data`) on the NAS.

Principles:

1. **NAS-first**: one container, one data volume, offline-capable, no external CDN or SaaS dependency.
2. **Boring and durable**: SQLite WAL, plain files on disk, forward-only migrations, documented backups.
3. **One artifact**: the server, SPA, migrations, and operational commands are a single self-contained
   binary; no Node/npm, shell scripts, or external asset directory at runtime.
4. **Fast enough on a LAN**: thumbnails, lazy-loaded 3D viewer, streamed uploads/downloads, HTTP Range.
5. **Safe by default**: authorization on every file byte, upload validation, CSRF, rate limits.
6. **Visual fidelity**: match Printables' information density and design language, not its assets.

---

## 2. Scope

### In scope (v1)

- First-run setup, local accounts, sessions, roles (`admin`, `user`).
- Registration toggle, admin-created users, admin password reset, deactivate users.
- Model CRUD (draft/published), multiple files per model, multiple images, tags, category.
- Visibility: `public` (anonymous allowed), `members` (signed-in only), `private` (owner/admin only).
- Public browse/search/filter/sort, model detail page, author profile page.
- Likes, bookmarks, download counts.
- 3D preview for STL / 3MF / OBJ / PLY / GLB / GLTF; client-side auto cover render.
- Image upload with resized derivatives; auto cover fallback if no images.
- Admin dashboard: users, storage, settings, audit log, DB backup download.
- First-class CLI in the same binary: `serve`, `migrate status|up`, `admin create|list|reset-password`,
  `backup`, and `version`.
- Docker Compose deployment for x86_64 and arm64 NAS.
- Tests, docs, backup/restore guide.

### Explicit non-goals (v1)

- Marketplace, payments, "Support creator", Prusa Eshop, brands, contests, clubs, events, community feed.
- Email delivery (SMTP), email verification, self-service password reset.
- Social graph / follows, comments, makes, remixes, ratings. (Design leaves room; later phases.)
- STEP/IGES server-side conversion, G-code preview, multi-tenant, S3/object storage, OIDC/LDAP.
- Native mobile apps.

---

## 3. Stack & versions (verified in this environment)

| Layer | Choice | Version / note |
|---|---|---|
| Language | Go | 1.27.1 |
| Router | `chi` v5 | Small, stdlib-compatible middleware |
| CLI | `spf13/cobra` + `golang.org/x/term` | Subcommands, completions, hidden password prompt |
| DB | SQLite | `modernc.org/sqlite` (pure Go, `CGO_ENABLED=0`) |
| Migrations | `pressly/goose` | SQL embedded in the binary; exposed as `migrate status|up` |
| IDs | ULID | `github.com/oklog/ulid/v2` |
| Auth | Argon2id + opaque sessions | `golang.org/x/crypto/argon2` |
| Images | `disintegration/imaging` + `x/image/webp` | JPEG/PNG/WebP, EXIF auto-orient |
| Frontend | React | 19.3.x |
| Language | TypeScript | **7.0.2 stable** (8.x is not published; pin 7.0.2 strict, upgrade later) |
| Build | Vite | 8.3.x |
| CSS | Tailwind CSS | 4.3.x via `@tailwindcss/vite` |
| State | Jotai | 3.0.x |
| Router | React Router | 8.x |
| 3D | three.js + `three-stdlib` + `fflate` | three 0.186.x, lazy-loaded |
| Icons | `lucide-react` | Original icon set |
| UI primitives | Radix UI + CVA + tailwind-merge | Accessible dialogs, menus, tabs |
| Forms | React Hook Form + Zod | Client validation mirrors Go validation |
| Markdown | react-markdown + remark-gfm + rehype-sanitize | Descriptions |
| Tests | Go testing + Vitest/RTL + Playwright | MSW for API mocks |
| Deploy | Multi-stage Docker, distroless/static:nonroot | Volume `/data`, port `8080` |

No Tailwind component library, no CSS-in-JS, no state library beyond Jotai, no external font/CDN at runtime.

---

## 4. Architecture

```
Browser (React 19 SPA, Jotai, Tailwind 4)
   │  fetch/JSON + multipart, HttpOnly session cookie, CSRF header
   ▼
Go single binary: `myprintables`
   ├── CLI dispatcher: serve, migrate, admin, backup, version (same binary, no shell)
   ├── chi router + middleware: recover, request ID, logging, auth, CSRF, rate limit, security headers
   ├── API handlers (/api/*) ── domain services ── SQLite (WAL)
   ├── media handlers (/media/*) ── authz ── streamed files with Range/ETag
   ├── embedded SPA (web/dist) + SPA fallback + per-model OG meta
   └── jobs: image variants, cleanup, FTS, backups (in-process, DB-backed)
   │
   ▼
/data  (Docker volume; must be local disk, not NFS/SMB)
   ├── app.db (+ WAL/SHM)
   ├── media/models/... (immutable, UUID-addressed)
   ├── media/avatars/...
   ├── tmp/
   └── backups/
```

Key decisions:

- **One process / one instance.** SQLite permits one writer; this is intentional. No horizontal scaling.
- **Files on disk, metadata in DB.** DB stores *relative* paths; the volume is relocatable.
- **Immutable media paths.** Every upload gets a new ULID; replacing an image/file never overwrites an old
  path, so `Cache-Control: immutable` is safe.
- **Authz before bytes.** No static file server for model media. Every media request checks the model's
  visibility and the session, then streams with `http.ServeContent`.
- **Frontend embedded** into the Go binary (`web/dist` → `internal/web/dist`) for a single deployable artifact.
  Dev mode runs Vite on 5173 with `/api` proxied to 8080.
- **Migrations embedded too.** No runtime migration directory is shipped; the same binary can run them.
- **One executable, many verbs.** `serve` is the long-running mode; `migrate`, `admin`, `backup`, and
  `version` are short-lived commands sharing the same config, DB, and storage code.

### 4.1 Single binary & command-line contract

The build produces exactly one executable, `myprintables`. It embeds the SPA, migrations, and all
operational tooling. There are no runtime scripts, Node/npm, or external migration files.

```
myprintables [serve]                    # start HTTP server (no subcommand = serve)
myprintables serve                      # explicit form
myprintables migrate status             # current schema version + pending migrations
myprintables migrate up                 # apply all pending migrations, then exit
myprintables admin create --email ... --username ... [--password-stdin | --generate]
myprintables admin list
myprintables admin reset-password --email ... [--password-stdin | --generate]
myprintables backup --out /data/backups/app-YYYYMMDD.db
myprintables version
myprintables completion bash|zsh|fish
```

Rules:

- Global flags: `--data-dir`, `--log-level`, `--json`. Precedence: flags > env > defaults.
- `serve` opens the DB, checks/applies migrations (`--auto-migrate`, default on), starts the HTTP server,
  and shuts down gracefully on SIGINT/SIGTERM. `--no-auto-migrate` turns a schema mismatch into a startup
  error instead of silently changing the DB.
- `migrate` uses migrations embedded in the binary; it is forward-only. `status` is read-only and safe
  while serving. `up` is idempotent and exits nonzero on failure.
- `admin reset-password` accepts an email or username, prompts twice with hidden input, or reads one line
  from stdin with `--password-stdin`; `--generate` prints a random password once. It revokes all sessions
  for that user and writes an audit record. There is deliberately **no** `--password` flag (shell history).
- `admin create` is the headless alternative to `/setup`; it refuses duplicate email/username.
- `backup` runs `VACUUM INTO` against the live DB; safe while serving. `--out -` streams to stdout.
- `--json` gives machine-readable output for scripts; human output otherwise. Exit codes: `0` success,
  `1` runtime failure, `2` usage error.
- CLI output never prints password hashes or session tokens. Admin commands require filesystem access to
  the data volume; they are not exposed over the network.

---

## 5. Repository layout

```
my-printables/
├── cmd/myprintables/main.go   # single entrypoint; CLI dispatch
├── internal/
│   ├── cli/               root, serve, migrate, admin, backup, version (Cobra)
│   ├── config/            env parsing, defaults, validation
│   ├── logging/           slog setup, request middleware
│   ├── httpapi/           router, handlers, DTOs, error mapping
│   ├── middleware/        auth, csrf, rate limit, security headers
│   ├── auth/              password hashing, session tokens, permissions
│   ├── store/             SQLite queries, transactions, migrations runner
│   ├── domain/            models, users, files, validation, services
│   ├── storage/           paths, atomic writes, streaming, media serving
│   ├── imaging/           image decode/limit/resize/auto-orient
│   ├── preview3d/         format validation, 3MF zip inspection (server-side)
│   ├── jobs/              worker + job store
│   └── web/               go:embed dist + index handler + OG injection
├── migrations/            *.sql + embed.go (goose, compiled into the binary)
├── web/                   Vite app
│   ├── src/app/           router, providers, layouts
│   ├── src/components/    ui/, model/, viewer/, admin/
│   ├── src/pages/         home, browse, detail, upload, auth, profile, admin
│   ├── src/atoms/         session, models, viewer, toasts, preferences
│   ├── src/lib/           api client, csrf, formatters, 3d loaders
│   ├── src/styles/        app.css, @theme tokens
│   └── public/fonts/      self-hosted woff2
├── testdata/              tiny CC0 STL/3MF/OBJ/PLY/GLB fixtures
├── doc/                   PLAN.md, DESIGN.md, API.md, DEPLOY.md, BACKUP.md
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── .env.example
├── AGENTS.md
├── go.mod
└── web/package.json
```

---

## 6. Data model (SQLite)

All timestamps are Unix seconds (UTC). All IDs are ULIDs except sessions (random) and tags/categories
(human slugs). Foreign keys ON. Counters are denormalized and updated in the same transaction.

### users
`id`, `email` (unique, lowercased), `username` (unique, case-insensitive), `display_name`,
`password_hash`, `role` (`admin|user`), `bio`, `avatar_path`, `is_active`, `created_at`, `updated_at`,
`last_login_at`.

### sessions
`id`, `user_id`, `token_hash` (SHA-256 of opaque token, unique), `csrf_token`, `user_agent`, `ip_hash`,
`created_at`, `last_seen_at`, `expires_at`. Multiple devices per user; rotate on login; logout deletes.

### settings
`key` PK, `value` TEXT (JSON where needed), `updated_at`, `updated_by`.
Keys: `site_name`, `registration_enabled`, `default_visibility`, `require_login_to_browse`,
`max_upload_mb`, `allowed_formats`, `featured_model_ids`, `footer_text`.

### categories
`id`, `slug` unique, `name`, `parent_id`, `icon`, `sort_order`. Seeded: 3D Printers, Art & Design,
Costumes & Accessories, Fashion, Gadgets, Healthcare, Hobby & Makers, Household, Learning, Seasonal
designs, Sports & Outdoor, Tabletop Miniatures, Toys & Games, World & Scans (Printables-inspired taxonomy).

### models
`id`, `owner_id`, `title`, `slug`, `description` (Markdown), `category_id`, `license`, `source_url`,
`visibility` (`public|members|private`), `status` (`draft|published`), `featured`,
`download_count`, `like_count`, `bookmark_count`, `view_count`, `comment_count` (reserved),
`created_at`, `updated_at`, `published_at`.
Indexes: `(status, visibility, published_at DESC)`, `(owner_id, created_at DESC)`, `(category_id)`,
`(download_count DESC)`, `(like_count DESC)`.

### model_files
`id`, `model_id`, `filename` (original, sanitized for display), `storage_path` (relative),
`format` (`stl|3mf|obj|ply|glb|gltf|step|stp`), `size_bytes`, `sha256`, `is_preview`, `sort_order`,
`created_at`.

### model_images
`id`, `model_id`, `storage_path` (relative original), `large_path`, `thumb_path`, `width`, `height`,
`kind` (`upload|render`), `sort_order`, `created_at`. Exactly one cover (first by `sort_order`).

### tags / model_tags
`tags(id, slug unique, name)`; `model_tags(model_id, tag_id, PK)`. Normalize to lowercase slug.

### likes / bookmarks
`(user_id, model_id, created_at)` composite PK each; counters maintained transactionally.

### downloads
`id`, `model_id`, `file_id`, `user_id NULL`, `ip_hash`, `created_at`; index `(model_id, created_at)`.
Used for stats and trending.

### audit_log
`id`, `actor_id NULL`, `action`, `target_type`, `target_id`, `meta_json`, `ip_hash`, `created_at`.
Retention: 90 days (cleanup job).

### jobs
`id`, `kind`, `payload_json`, `status` (`queued|running|done|failed`), `attempts`, `run_at`,
`locked_at`, `last_error`, `created_at`. Used for image variants, cleanup, FTS rebuild, optional
server-side thumbnails. Claimed with `UPDATE ... RETURNING`.

### FTS5
`models_fts(title, description, tags)` external-content FTS5 table, kept in sync by triggers
(title/description) and by the tag service (tags column). Search uses `MATCH` + `bm25()`; fall back to
`LIKE` if FTS is unavailable. Escape user input; support prefix queries.

### Future tables (not v1)
`comments`, `ratings`, `collections`, `collection_models`, `makes`, `remixes`, `model_versions`.

---

## 7. Permissions

| Action | Anonymous | User | Owner | Admin |
|---|---|---|---|---|
| View/search **public** model + images + download | ✅ | ✅ | ✅ | ✅ |
| View **members** model | ❌ | ✅ | ✅ | ✅ |
| View **private** model | ❌ | ❌ | ✅ | ✅ |
| View **draft** | ❌ | ❌ | ✅ | ✅ |
| Upload / edit own model | ❌ | ✅ | ✅ | ✅ |
| Edit/delete any model | ❌ | ❌ | own | ✅ |
| Like/bookmark | ❌ | ✅ | ✅ | ✅ |
| Admin pages, users, settings, audit, backup | ❌ | ❌ | ❌ | ✅ |
| Reset another user's password | ❌ | ❌ | ❌ | ✅ |

Rules:

- Private/unauthorized model lookups return **404** (not 403) to avoid existence leaks.
- `require_login_to_browse` (admin setting) hides even public content from anonymous users.
- Every media byte goes through the same policy as the model metadata.
- Admins can transfer ownership before deleting a user; default is "delete models" with typed confirmation.

---

## 8. API design

Base: `/api`. JSON errors: `{"error":{"code","message","fields":{},"requestId"}}`.
Pagination: `?page=1&perPage=24` → `{items, page, perPage, total, totalPages}` (max 100).
All mutating requests require `X-CSRF-Token` and a same-origin `Origin` check.

### Auth & account
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/setup/status` | `{needsSetup}` (no users yet) |
| POST | `/api/setup` | Create first admin; disabled once a user exists |
| POST | `/api/auth/login` | Set session cookie, return user + CSRF token |
| POST | `/api/auth/logout` | Delete session |
| GET | `/api/auth/me` | Current user, CSRF token, effective settings |
| PATCH | `/api/auth/me` | Display name, bio, email, username |
| POST | `/api/auth/password` | Change own password; revoke other sessions |
| POST | `/api/auth/register` | Register (if enabled) |

### Models
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/models` | Browse/search: `q, category, tags, sort, fileType, page, perPage, owner, featured` |
| GET | `/api/models/{id}` | Detail + files + images + tags + viewer state |
| POST | `/api/models` | Create draft metadata |
| PATCH | `/api/models/{id}` | Update metadata, visibility, status, cover/order |
| DELETE | `/api/models/{id}` | Soft/hard delete + async file cleanup |
| POST | `/api/models/{id}/files` | Stream one file (multipart), validate, hash |
| DELETE | `/api/models/{id}/files/{fileId}` | Remove file |
| PATCH | `/api/models/{id}/files` | Reorder / set default preview file |
| POST | `/api/models/{id}/images` | Upload image; generate large/thumb |
| DELETE | `/api/models/{id}/images/{imageId}` | Remove image |
| PATCH | `/api/models/{id}/images` | Reorder / set cover |
| GET | `/api/models/{id}/files/{fileId}/content` | Stream inline or `?download=1` |
| GET | `/api/models/{id}/images/{imageId}/{variant}` | `original|large|thumb` with authz + cache |
| POST/DELETE | `/api/models/{id}/like` | Toggle like (idempotent) |
| POST/DELETE | `/api/models/{id}/bookmark` | Toggle bookmark (idempotent) |
| GET | `/api/models/{id}/related` | Same category/tags, public, limit 8 |
| GET | `/api/models/{id}/downloads` | Owner/admin stats (optional v1) |

### Discovery & users
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/categories` | Category tree + model counts |
| GET | `/api/tags?q=` | Autocomplete |
| GET | `/api/users/{username}` | Public profile + counts |
| GET | `/api/users/{username}/models` | Public/member-filtered models |
| GET | `/api/stats` | Home counters (models, users, downloads) |

### Admin
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/stats` | Users, models, storage, disk free, recent activity |
| GET | `/api/admin/users` | List/search/filter |
| PATCH | `/api/admin/users/{id}` | Role, active, display name, reset password |
| DELETE | `/api/admin/users/{id}` | Transfer or delete content |
| GET/PATCH | `/api/admin/settings` | Typed site settings |
| GET | `/api/admin/audit` | Paginated audit log |
| GET | `/api/admin/jobs` | Job queue health |
| POST | `/api/admin/backup` | `VACUUM INTO` snapshot + download |
| POST | `/api/admin/cleanup` | Orphaned temp/media cleanup |

### Upload flow (two-phase, resumable-friendly)

1. `POST /api/models` → draft model with metadata.
2. `POST /api/models/{id}/files` one file at a time (streamed to `data/tmp`, hashed, validated, atomically
   renamed). Frontend uses `XMLHttpRequest` for upload progress.
3. `POST /api/models/{id}/images` for uploads **and** the client-rendered cover PNG.
4. `PATCH /api/models/{id}` with `status=published` → appears in browse.
5. Orphan drafts (no files, older than 7 days) are cleaned by a job.

Rationale: no giant combined multipart request, retries per file, clear progress, easy future chunking/tus.

### Media responses
- `Content-Type` from allowlist, `X-Content-Type-Options: nosniff`.
- `Content-Disposition: inline` for viewer, `attachment; filename*=UTF-8''…` for downloads.
- ETag from SHA-256; `Last-Modified`; `Accept-Ranges: bytes`; 304 support.
- Images: `Cache-Control: public, max-age=31536000, immutable` for public, `private` for gated content.
- 3D files fetched as `ArrayBuffer` with credentials by the viewer; loaders never fetch external URLs.

---

## 9. Auth & account details

- **Password hashing**: Argon2id, per-user 16-byte salt, 64 MiB / t=3 / p=2, 32-byte key, versioned
  string format (`$argon2id$v=19$m=65536,t=3,p=2$…`). Rehash on login if parameters change. Password
  policy: min 10 characters, max 200 bytes, reject common passwords and email/username similarity.
- **Sessions**: 32 random bytes, base64url in cookie `myp_session` (`__Host-` prefix when HTTPS),
  `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` when configured, 30-day sliding expiry. Store only a
  SHA-256 hash. Revoke all on password change (except current).
- **CSRF**: per-session token returned by `/api/auth/me`, sent as `X-CSRF-Token`; compare in constant
  time. Mutations also require same-origin `Origin`/`Referer`. SameSite is defense in depth, not the only
  defense.
- **First run**: `/setup` page creates the first admin. If `ADMIN_EMAIL` + `ADMIN_PASSWORD` are set and no
  users exist, create on boot for unattended Docker installs. Setup endpoint is permanently disabled after
  the first user.
- **Registration**: enabled by default (admin toggle). New users are `user`. Admin can deactivate,
  promote, reset password.
- **No email dependency**: email is a login identifier only. Password reset is admin-initiated in v1.
- **Rate limits** (in-memory, per instance; trusted-proxy aware): login 5/min/IP + 20/hour/account,
  register 3/hour/IP, upload 20/hour/user, general API 300/min/IP. Constant-time failure responses.
- **Audit**: login success/failure, logout, password changes, user admin actions, model visibility changes,
  deletes, settings changes, backups.

---

## 10. Storage & uploads

### Volume layout
```
/data/
  app.db
  media/
    models/<modelULID>/files/<fileULID>.<ext>
    models/<modelULID>/images/<imageULID>/original.<ext>
    models/<modelULID>/images/<imageULID>/large.jpg
    models/<modelULID>/images/<imageULID>/thumb.jpg
    avatars/<userULID>.jpg
  tmp/
  backups/
```

- Atomic writes: stream to `data/tmp/<random>`, `fsync`, then `rename` into place; then DB transaction.
  Failures leave only temp files, cleaned by a job.
- Path safety: DB paths are relative; resolve with `filepath.Join(dataDir, rel)`, clean, and verify the
  result is still under `dataDir`. Never trust uploaded filenames for paths.
- Limits (configurable): default max file 1 GiB, max images 24/model, image 20 MiB / 50 MP, 3MF expansion
  max 4 GiB / 10k entries / 100:1 ratio, max filename 200 chars.
- Hash every upload (SHA-256) for ETag, integrity, and duplicate detection (dedupe is future work).
- Deletion: remove DB rows first, then delete files via job; a failed delete is retried. No destructive
  "rm -rf" of user-supplied paths.

### Image pipeline
- Accept JPEG, PNG, WebP. Decode config first (dims/pixels), auto-orient from EXIF, strip metadata.
- Generate `large` (max 1600px) and `thumb` (max 480px), preserving aspect ratio; JPEG q85 (alpha → PNG).
- Avatar: center-crop 256×256.
- Client-generated 3D cover: 800×600 PNG with the same orange material/lighting as the viewer; uploaded as
  `kind=render`, can be reordered/removed. If absent, cards show a branded placeholder with format badge.
- Optional later: software-rendered server-side thumbnails for API-only uploads, BlurHash placeholders.

### Visibility gating
- Browse/search SQL always constrained by the requester's access level.
- Media handler re-checks model visibility + owner + role on every request; no signed URLs for v1.
- Files are never exposed via a generic static handler.

---

## 11. 3D preview

### Format support

| Format | Extensions | v1 preview | Notes |
|---|---|---|---|
| STL | `.stl` | ✅ | Binary + ASCII; unitless, assume mm; fit to view |
| 3MF | `.3mf`, `.p3mf`? | ✅ | Core spec via ZIP + XML; colors/materials, multiple build items/plates |
| OBJ | `.obj` | ✅ | Geometry only v1; MTL/textures later |
| PLY | `.ply` | ✅ | ASCII + binary |
| GLB | `.glb` | ✅ | Self-contained only |
| GLTF | `.gltf` | ⚠️ | Only embedded buffers; external/texture URIs blocked |
| STEP | `.step`, `.stp` | ❌ | Accepted, download-only, "Preview not supported" card |
| Others | — | ❌ | Reject with clear message |

`STEP` and other CAD formats are stored and downloadable; preview conversion is a later phase (sidecar).

### Viewer stack
- `three` + `three-stdlib` loaders (`STLLoader`, `ThreeMFLoader`, `OBJLoader`, `PLYLoader`, `GLTFLoader`),
  `fflate` for 3MF ZIP. The whole viewer chunk is `React.lazy`-loaded only on model detail/viewer routes.
- Scene: white background, ACES filmic tone mapping, sRGB, pixel ratio capped at 2. Lights: hemisphere +
  2 directional lights. Material: `MeshStandardMaterial` brand orange `#FA6831`, roughness 0.55, metalness
  0.05. Optional wireframe, grid, background switch (white / light gray / dark), auto-rotate.
- Normalization: Z-up → Y-up for STL/3MF/OBJ/PLY; compute bounding box; center at origin; ground grid at
  `minY`; camera fit; display dimensions in mm; 3MF unit respected.
- Controls: OrbitControls with damping, pan, zoom limits, reset/home; touch gestures; keyboard shortcuts.
- UI mirrors the reference: top-left floating control pad (reset/home, rotate, zoom, grid, wireframe,
  background, screenshot), top-right close, left/right prev-next, bottom-left thumbnails, bottom-right
  file selector + size + prev/next; fullscreen overlay; `Esc` closes.
- Loading/error states: progress, cancel, "This file could not be previewed" with download fallback.
- Memory: dispose geometries, materials, textures, renderer; abort fetch and stop RAF on close.
- Screenshot: `preserveDrawingBuffer` + `toBlob` download.
- Client auto-cover: after parsing the default preview file, render an isometric 800×600 PNG and attach it
  to the upload form.

### Server-side validation
- Magic/format sniffing, size checks, quick parse sanity.
- 3MF: open ZIP, require `[Content_Types].xml` + `3D/3dmodel.model`, reject encrypted entries, absolute
  paths, `..`, too many entries, oversized expansion, suspicious compression ratio.
- GLTF/GLB: reject external buffer/image URIs; the viewer also installs a `LoadingManager` URL modifier
  that fails any non-`data:`/`blob:` external resource.
- Viewer never evaluates shaders/scripts from uploaded files.

### Performance guardrails
- Max file size configurable; warn above 150 MB; show progress.
- Cache parsed geometry per file while the viewer stays open; release on close.
- Serve with Range; use `ETag` so repeat views are cheap.
- Future: mesh decimation/LOD for huge STLs, Draco-compressed GLB generation.

---

## 12. Frontend architecture

### Routes
| Route | Page |
|---|---|
| `/` | Home: hero carousel, featured models, latest, categories, top creators, stats |
| `/models` | Browse: filter rail, sort tabs, grid, pagination/infinite scroll |
| `/model/:id/:slug` | Model detail: gallery, metadata, tabs (Details / Files / Comments reserved) |
| `/upload` | Upload wizard: files → images/cover → details → visibility → publish |
| `/login`, `/register`, `/setup` | Auth / first-run |
| `/u/:username` | Public profile + their visible models |
| `/settings` | Profile, password, sessions |
| `/admin` | Admin dashboard (users, storage, settings, audit, jobs) |
| `*` | 404 |

### State (Jotai)
- `sessionAtom`: user, CSRF token, capabilities; loaded once at boot.
- `settingsAtom`: public site settings.
- `modelListAtomFamily(params)`: cached browse results + refresh/invalidate.
- `modelDetailAtomFamily(id)`: detail cache.
- `likesAtomFamily` / `bookmarksAtomFamily`: optimistic toggles with rollback.
- `viewerPrefsAtom` (`atomWithStorage`): material color, wireframe, grid, background, autorotate.
- `uploadQueueAtom`: files, progress, errors, staged cover.
- `toastsAtom`.
- `browseFiltersAtom`: URL-synced filter state (search params are the source of truth).
- No Redux/TanStack Query; a small `resource` helper wraps `atomWithRefresh` + abortable fetch.

### Components (design system)
- `AppShell`, `UtilityBar`, `MainNav`, `SearchPill`, `MobileNav`, `Footer`.
- `ModelCard`, `ModelCardSkeleton`, `ModelGrid`, `CategoryPill`, `StatBar`, `LikeButton`, `BookmarkButton`.
- `Gallery`, `ImageLightbox`, `Tabs`, `TagChips`, `DownloadButton`, `ActionBar`, `VisibilityBadge`.
- `ModelViewer` + `ViewerControls` + `ViewerFileBar` + `ViewerThumbnails`, lazy-loaded.
- `UploadDropzone`, `FileList`, `ImageManager`, `CoverPicker`, `VisibilityRadio`, `TagInput`.
- Radix-based `Dialog`, `DropdownMenu`, `Tabs`, `Tooltip`, `Select`, `Switch`; styled with Tailwind.
- `AdminUserTable`, `AdminStats`, `AdminSettingsForm`, `AuditTable`, `StorageBar`.

### Data fetching
- `lib/api.ts`: typed fetch wrapper, credentials include, CSRF header for mutations, AbortController,
  normalized errors, 401 → clear session atom and redirect to login preserving `next`.
- Route-level code splitting; `three` only inside the viewer chunk.
- Image `srcset` with `thumb`/`large`, `loading=lazy`, `decoding=async`, fixed aspect ratio to prevent CLS.
- Markdown rendering sanitized; links `rel="nofollow noopener noreferrer"`, `target="_blank"`.
- Optimistic likes/bookmarks, disabled while pending, revert on error.
- Toasts for success/failure; inline field errors from API.

### Home adaptation (NAS, not marketplace)
- Hero carousel of admin-featured models using their covers, dark gradient overlay, title, short
  description, "View model" CTA (orange).
- "Featured models" 4-up; "Latest uploads"; "Browse by category" tiles; "Top creators"; library stats.
- No store/contest/club banners. Nav: 3D Models, Categories, Collections (reserved), Upload (+ Create).

---

## 13. Admin

- **First run** `/setup`: create admin (email, username, display name, password). Headless installs can
  use `myprintables admin create --email ... --username ...` instead.
- **Dashboard**: users/models/files counts, DB size, media bytes, disk free, recent uploads/downloads,
  failed jobs, quick links.
- **Users**: search, role badge, active toggle, reset password (show once), revoke sessions, delete with
  content transfer/delete. The same reset is available offline via
  `myprintables admin reset-password --email ...`.
- **Settings**: site name, registration enabled, require login to browse, default visibility, max upload
  MB, allowed formats, featured model IDs, footer text.
- **Content moderation**: all models table with owner/visibility/status, feature toggle, force private,
  delete.
- **Storage**: per-model usage, orphaned media, temp cleanup, "recompute counters", "rebuild FTS".
- **Audit log**: filterable by actor/action/date.
- **Backup**: download `.db` snapshot (`VACUUM INTO`) or run `myprintables backup --out ...`; full backup
  guide (DB + media) in `doc/BACKUP.md`.

Admin UI reuses the same design language: white surface, 1px borders, orange active tabs, dense tables.

---

## 14. Security

- Argon2id + constant-time verification; no user enumeration on login ("Invalid email or password").
- Session cookie HttpOnly/SameSite/Secure; hashed tokens; rotation; revoke all.
- CSRF header + Origin check; JSON content type for JSON endpoints.
- Strict CSP: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'
  data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; object-src 'none';
  frame-ancestors 'none'; base-uri 'self'; form-action 'self'`.
- `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS when HTTPS.
- Upload validation: extension + magic + parser sanity; zip bomb / decompression bomb limits; no SVG
  uploads; image re-encode; path traversal impossible by design.
- 3D/GLTF external resource blocking; no HTML injection from descriptions (sanitized Markdown).
- Rate limits; request body limits; multipart limits; slowloris timeouts; graceful shutdown.
- CLI admin actions require local filesystem access (or `docker exec`), use hidden password prompts or
  stdin, revoke sessions, and are audit-logged; `--password` is intentionally unsupported.
- Trusted proxy config for real client IP; never blindly trust `X-Forwarded-For`.
- Secrets only via env; no secrets in DB/logs; passwords never logged.
- `govulncheck`, `npm audit`, dependency pinning; optional ClamAV scan hook later.
- Local-disk volume requirement documented (SQLite on NFS/SMB is unsafe).

---

## 15. Deployment

### Env vars
```
PORT=8080
DATA_DIR=/data
SITE_NAME=MyPrintables
APP_URL=https://models.home.lan
SECURE_COOKIES=true            # false for plain HTTP on LAN
TRUSTED_PROXY=                 # e.g. 172.16.0.0/12
REGISTRATION_ENABLED=true
MAX_UPLOAD_MB=1024
ADMIN_EMAIL=                   # optional unattended bootstrap
ADMIN_PASSWORD=                # optional; use setup page otherwise
AUTO_MIGRATE=true              # serve applies embedded migrations on boot by default
LOG_LEVEL=info
```

### Build

```sh
CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o bin/myprintables ./cmd/myprintables
./bin/myprintables version
./bin/myprintables migrate status
./bin/myprintables serve
```

`make build` wraps this. The result is the only runtime artifact: it contains the API, SPA, and migrations.

### Docker
- Multi-stage: node build → Go build (`CGO_ENABLED=0`, `-trimpath`, `-ldflags="-s -w"`) → distroless
  static nonroot. The final image contains only `/myprintables`.
- `ENTRYPOINT ["/myprintables"]`, `CMD ["serve"]`; no shell or Node in the runtime image.
- `VOLUME /data`, `EXPOSE 8080`, `HEALTHCHECK` on `/healthz`.
- `docker-compose.yml` example maps a NAS path to `/data`, sets `user: "1000:1000"`, restart policy,
  healthcheck, and `read_only` root filesystem with `/tmp` tmpfs.
- Operational commands run in the same image:
  ```sh
  docker exec -it myprintables /myprintables migrate status
  docker exec -it myprintables /myprintables admin reset-password --email me@example.com
  docker run --rm -v /nas/myprintables:/data myprintables migrate up
  ```
- Multi-arch builds (`linux/amd64`, `linux/arm64`) for Synology/QNAP/TrueNAS/Raspberry Pi.
- Reverse proxy: Nginx/Caddy sample with `client_max_body_size 1g`, TLS, and forwarded headers.

### Backup & restore
- Media files are immutable; DB snapshot via `myprintables backup --out ...` (`VACUUM INTO`).
- Full backup: snapshot DB, then rsync media (preferably during quiet hours or from a filesystem snapshot).
- Restore: stop container, restore `/data`, start; embedded migrations are forward-only and run on boot
  (or explicitly with `myprintables migrate up`).
- Document "do not put `/data` on an SMB/NFS share"; use a local NAS volume.

---

## 16. Testing

### Go
- Unit: password hash/verify, session tokens, visibility matrix, slug/username validation, path safety,
  image limits, 3MF ZIP validation, format sniffing, rate limiter, CSRF.
- Integration (`httptest` + temp SQLite + temp data dir): setup, login, register, CRUD, upload, download,
  media authz, likes/bookmarks, search/filter/pagination, admin actions, backup.
- `go test -race ./...`, `go vet`, `golangci-lint`, `govulncheck`.

### Frontend
- Vitest + React Testing Library: atoms, API client, ModelCard, filters, auth guard, upload queue.
- MSW for API mocks; Playwright e2e: setup → upload STL/3MF → public view → members-only gate →
  search → viewer canvas → restart persistence → admin reset.
- Accessibility: axe checks on main routes; keyboard-only pass.
- Visual regression optional (Playwright screenshots) after design stabilizes.

### Fixtures
- Programmatically generated tiny cube STL, 3MF, OBJ, PLY, GLB (CC0) under `testdata/`; plus one malformed
  zip and one external-URI GLTF for negative tests.

---

## 17. Milestones

Estimates are dev-days for one developer; they are indicative, not commitments.

### M0 — Foundation (2 d)
Single entrypoint + Cobra CLI skeleton, `go.mod`, config/logging, `/healthz`, embedded migrations, embedded
SPA, Vite + Tailwind + TS strict, design tokens, app shell/header/footer, home skeleton, Makefile,
Dockerfile, docker-compose, CI.
**Done when**: one `go build ./cmd/myprintables` binary embeds the UI and supports `version`, `migrate
status`, `serve`, and `admin reset-password --help`; `make dev` runs Go+Vite; the production image serves
the SPA; `go test`/`tsc` pass.

### M1 — Accounts & admin (3 d)
Users/sessions/settings migrations; `/setup` (or `admin create`); login/register/logout/me; CSRF; rate
limits; profile; route guards; admin user management; registration toggle; audit for auth events.
**Done when**: fresh install → admin → second user → visibility of admin pages → session survives restart;
`admin reset-password` revokes old sessions.

### M2 — Models, files, browse (6 d)
Schema + storage; upload flow; image derivatives; tags/categories; model CRUD; visibility; browse/search/
filter/sort; detail page; author profile; likes/bookmarks/downloads; admin content table.
**Done when**: an anonymous visitor can browse public models and download; members-only content is blocked
for anonymous users; owner/admin rules hold; counters and pagination are correct.

### M3 — 3D preview (5 d)
Viewer with STL/3MF/OBJ/PLY/GLB; controls, fullscreen, file switching, thumbnails; loading/error states;
client-generated cover; format validation; memory cleanup; mobile.
**Done when**: sample files render and fit correctly; switching files works; 150 MB STL is usable; closing
releases memory; unsupported formats show download fallback.

### M4 — Design polish & home (4 d)
Hero carousel, featured/latest/categories/creators, skeletons, empty states, image srcset, markdown,
responsive header/drawer, detail page fidelity, OG meta injection, 404/500, toasts, focus states.
**Done when**: home/browse/detail/viewer visually match the reference language; mobile pass; axe clean.

### M5 — Admin, hardening & release (4 d)
Admin dashboard/storage/settings/audit/backup; CLI backup; cleanup jobs; security headers; upload limits;
backup docs; compose samples; multi-arch; Playwright + race tests; seed data; release checklist.
**Done when**: a fresh NAS deploy passes the end-to-end acceptance list below and a documented backup can
be restored.

### Later (optional, prioritized with you)
Comments + ratings; collections; makes/remixes; SMTP + self-service reset; OIDC; resumable uploads;
bulk import CLI (`myp import ./folder --owner …`); server-side STEP→GLB sidecar; S3 storage; ClamAV;
Draco/LOD; dark mode; Prometheus metrics.

---

## 18. Acceptance checklist (v1)

- [ ] `docker compose up -d` on a clean volume; open browser; complete `/setup`.
- [ ] One `go build` artifact serves both API and SPA with no external asset directory; `myprintables
      version`, `migrate status`, `migrate up`, and `admin reset-password` work as documented.
- [ ] CLI commands work via `docker exec` in the distroless image (no shell required).
- [ ] Admin creates a user; user logs in; registration can be disabled.
- [ ] Upload STL, 3MF, OBJ, PLY, GLB and a STEP file; each appears with correct size/format/cover.
- [ ] Public model is viewable and downloadable while signed out.
- [ ] Setting a model to "members" makes it disappear from anonymous browse and media requests return 404.
- [ ] Private model is visible only to owner/admin.
- [ ] 3D viewer loads, rotates, zooms, pans, switches files, fullscreen, screenshot, closes cleanly.
- [ ] Search, category/tag filters, sort, pagination work; counts update after like/bookmark/download.
- [ ] Admin can reset a password (UI and CLI), deactivate a user, feature a model, and download or
      create a DB backup.
- [ ] Data survives container restart and image upgrade (embedded migration runs).
- [ ] `go test -race ./...`, `tsc --noEmit`, `npm run test`, Playwright smoke pass.
- [ ] No external network requests at runtime; CSP has no violations in the console.
- [ ] Backup → wipe volume → restore → app works with the same data.

---

## 19. Risks & mitigations

| Risk | Mitigation |
|---|---|
| 3MF loader compatibility (production extension, external parts) | Support core spec v1; validate server-side; graceful error + download; test real 3MF fixtures |
| Huge STL files exhaust browser memory | Configurable max upload, size warning, progress, lazy viewer, future decimation/LOD |
| SQLite lock contention | WAL, `busy_timeout`, short transactions, one process, indexed queries; document local disk only |
| NAS volume is SMB/NFS | Detect/warn; docs: use a local volume; SQLite over network FS can corrupt |
| Uploaded GLTF references external URLs | Reject external URIs server-side and in the loader URL modifier |
| Image/zip decompression bombs | Decode config first, pixel/entry/size/ratio limits, re-encode images |
| Argon2 too slow on low-power NAS | Tunable parameters, rehash-on-login, benchmark during M1 |
| Design drifts into a generic dashboard | `doc/DESIGN.md` tokens + component specs + reference screenshots; review at M4 |
| Trademark/copyright | Original logo, name, icons, fonts; no copied assets or CSS; layout inspiration only |
| TypeScript 8 unavailable | TS 7.0.2 strict now; single dependency bump when 8 ships |
| Concurrent CLI migration and running server | Embedded goose lock, `BEGIN IMMEDIATE`, `busy_timeout`; document a maintenance window for `migrate up` on busy instances |

---

## 20. Decisions needed from you

1. **Branding**: default site name "MyPrintables" with an original cube logo (recommended), or another name?
2. **Registration**: open by default for household members, or admin-created users only?
3. **Email**: no SMTP in v1 (admin resets passwords) — acceptable?
4. **Visibility default**: public (as requested); should "members" be the default for new uploads instead?
5. **STEP**: download-only in v1, or do you want a STEP→GLB conversion sidecar in the first release?
6. **TypeScript 8**: use current stable TS 7.0.2 now (recommended), or wait/pin a specific TS 8 build?
7. **Extras**: are comments/ratings/collections important for v1, or should we keep the release focused on
   file management + preview? (Recommendation: later.)
8. **Deployment**: target NAS brand/model and UID/GID for the data volume (helps tune the Compose file).

Once approved, I will start at **M0** and keep `doc/PLAN.md` updated as decisions land.
