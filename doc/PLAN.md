# MyPrintables — Implementation Plan

Status: **v1 implemented** (M0–M6 complete; Docker image and multi-arch GHCR release added; Compose/NAS-specific packaging is post-v1)
Goal: a self-hosted, Printables-inspired 3D model library for a home NAS.
Working name: **MyPrintables** (configurable). The layout is inspired by Printables; no proprietary
logos, fonts, CSS, or icons from printables.com will be copied. Original cube mark:
`web/public/brand/cube-mark.svg`. See `doc/DESIGN.md`.

---

## 1. Product goal & principles

One executable (`myprintables`) containing the Go API, the embedded React SPA, migrations, and admin
CLI tooling. It lets a household:

- Create accounts (open registration by default), with one or more admins.
- Optional email verification (off by default for personal use; SMTP configurable).
- Upload and manage 3D models and their files (`STL`, `3MF`, `OBJ`, `PLY`, `GLB`/`GLTF`, `GCODE`, `STEP`).
- Optional same-origin CubbySlicer hand-off for STL/3MF/OBJ/STEP files.
- Browse, search, filter, like, bookmark, and download models.
- Preview models in the browser with rotate/zoom/pan, file switching, and fullscreen.
- Keep models public by default, or restrict to signed-in users, or keep private.
- Persist everything in a single local data directory (`DATA_DIR`, default `./data`) that can later be
  mounted as a NAS volume.

Principles:

1. **Self-contained**: one binary, one data directory, offline-capable, no external CDN or SaaS dependency.
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
- Likes, bookmarks, download counts, 1–5 star ratings, and comments (with one-level replies).
- Tagging with a tag directory/filter page, plus user-created collections (public/members/private).
- 3D preview for STL / 3MF / OBJ / PLY / GLB / GLTF, plus G-code toolpath preview; client-side auto cover render.
- Image upload with resized derivatives; auto cover fallback if no images.
- Admin dashboard: users, storage, settings, audit log, DB backup download, comment/collection moderation.
- First-class CLI in the same binary: `serve`, `migrate status|up`, `admin create|list|verify-email|reset-password`,
  `backup`, and `version`.
- Single-binary local deployment with an Alpine Docker image. Compose and NAS-specific packaging remain post-v1.
- Tests, docs, backup/restore guide.

### Explicit non-goals (v1)

- Marketplace, payments, "Support creator", Prusa Eshop, brands, contests, clubs, events, community feed.
- Self-service password reset by email, notifications/digests (email verification itself is in scope).
- Social graph / follows, makes, remixes, direct messages.
- IGES upload/conversion; multi-tenant; S3/object storage; OIDC/LDAP.
- Compose and NAS-specific reverse-proxy packaging (post-v1); Docker image and multi-arch GHCR publishing are implemented.
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
| Email | `wneessen/go-mail` | Optional SMTP/TLS; email verification only, off by default |
| Frontend | React | 19.3.x |
| Language | TypeScript | **7.0.2 confirmed** (8.x is not published; pin strict, upgrade later) |
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
| Build | pnpm + package.json + Air | Vite dev/release modes; Air watches frontend + backend |
| Deploy | Single static binary | `CGO_ENABLED=0`; data under `--data-dir`; Docker/NAS post-v1 |

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
   ├── optional SMTP sender (verification emails; disabled by default)
   └── jobs: image variants, cleanup, FTS, backups (in-process, DB-backed)
   │
   ▼
DATA_DIR  (default ./data; one directory, local disk)
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
  Dev mode runs Vite on 5173 with `/api` proxied to 8200.
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
myprintables admin verify-email --email ...
myprintables admin reset-password --email ... [--password-stdin | --generate]
myprintables backup --out ./data/backups/app-YYYYMMDD.db
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
- `admin verify-email` manually marks an account verified (useful when SMTP is down or disabled); it is
  idempotent and audit-logged.
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
│   ├── email/             SMTP sender, templates, verification tokens
│   ├── jobs/              worker + job store
│   └── web/               go:embed dist + index handler + OG injection
├── migrations/            *.sql + embed.go (goose, compiled into the binary)
├── web/                   Vite app
│   ├── src/app/           router, providers, layouts
│   ├── src/components/    ui/, model/, viewer/, admin/
│   ├── src/pages/         home, browse, detail, upload, auth, profile, collections, admin
│   ├── src/atoms/         session, models, comments, collections, viewer, toasts, preferences
│   ├── src/lib/           api client, csrf, formatters, 3d loaders
│   ├── src/styles/        app.css, @theme tokens
│   └── public/            fonts/, brand/cube-mark.svg, favicon.svg
├── testdata/              tiny CC0 STL/3MF/OBJ/PLY/GLB fixtures
├── doc/                   PLAN.md, DESIGN.md, API.md, DEPLOY.md, BACKUP.md
├── package.json           pnpm scripts
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── .air.toml              dev watcher/rebuilder
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
`password_hash`, `role` (`admin|user`), `bio`, `avatar_path`, `is_active`, `email_verified_at` (nullable),
`created_at`, `updated_at`, `last_login_at`.

### sessions
`id`, `user_id`, `token_hash` (SHA-256 of opaque token, unique), `csrf_token`, `user_agent`, `ip_hash`,
`created_at`, `last_seen_at`, `expires_at`. Multiple devices per user; rotate on login; logout deletes.

### email_verification_tokens
`id`, `user_id`, `token_hash` (SHA-256, unique), `expires_at`, `used_at`, `created_at`. One active token
per user: issuing a new token invalidates previous ones. Tokens are single-use and expire after 24 hours.

### settings
`key` PK, `value` TEXT (JSON where needed), `updated_at`, `updated_by`.
Keys: `site_name`, `registration_enabled`, `email_verification_enabled` (default `false`),
`default_visibility`, `require_login_to_browse`, `max_upload_mb`, `allowed_formats`,
`featured_model_ids`, `footer_text`. SMTP credentials are env-only, never stored in `settings`.

### categories
`id`, `slug` unique, `name`, `parent_id`, `icon`, `sort_order`. Seeded: 3D Printers, Art & Design,
Costumes & Accessories, Fashion, Gadgets, Healthcare, Hobby & Makers, Household, Learning, Seasonal
designs, Sports & Outdoor, Tabletop Miniatures, Toys & Games, World & Scans (Printables-inspired taxonomy).

### models
`id`, `owner_id`, `title`, `slug`, `description` (Markdown), `category_id`, `license`, `source_url`,
`visibility` (`public|members|private`), `status` (`draft|published`), `featured`,
`download_count`, `like_count`, `bookmark_count`, `view_count`, `comment_count`, `rating_count`,
`rating_avg REAL`, `collection_count`, `created_at`, `updated_at`, `published_at`.
Indexes: `(status, visibility, published_at DESC)`, `(owner_id, created_at DESC)`, `(category_id)`,
`(download_count DESC)`, `(like_count DESC)`, `(rating_avg DESC, rating_count DESC)`, `(featured)`.

### model_files
`id`, `model_id`, `filename` (original, sanitized for display), `storage_path` (relative),
`format` (`stl|3mf|obj|ply|glb|gltf`), `size_bytes`, `sha256`, `is_preview`, `sort_order`, `created_at`.
STEP/STP is supported in v1 via client-side OpenCascade tessellation; the file is stored in its original format.

### model_images
`id`, `model_id`, `storage_path` (relative original), `large_path`, `thumb_path`, `width`, `height`,
`kind` (`upload|render`), `sort_order`, `created_at`. Exactly one cover (first by `sort_order`).

### tags / model_tags
`tags(id, slug unique, name)`; `model_tags(model_id, tag_id, PK)`. Normalize to lowercase slug.

### likes / bookmarks
`(user_id, model_id, created_at)` composite PK each; counters maintained transactionally.

### comments
`id`, `model_id`, `user_id`, `parent_id NULL` (top-level comment for one-level replies), `body`
(plain text, 1–5000 chars), `created_at`, `updated_at`, `deleted_at NULL`.
Indexes: `(model_id, created_at DESC)`, `(parent_id)`. Replies must share the parent's model; nested
replies are rejected. Deletes are soft so reply threads remain readable.

### ratings
`(user_id, model_id)` composite PK, `score` integer 1–5, `created_at`, `updated_at`. One rating per user
per model; upsert replaces the score. `models.rating_avg` / `rating_count` are updated in the same
transaction. Ratings are aggregate-only in public responses; a user can read their own score.

### collections / collection_models
`collections(id, owner_id, name, slug, description, visibility public|members|private default public,
model_count, created_at, updated_at)`; unique `(owner_id, slug)`.
`collection_models(collection_id, model_id, added_at, sort_order, PK(collection_id, model_id))`.
Collection visibility gates the collection page; the model list is additionally filtered by each
viewer's model permissions so a public collection can never leak a private/members model.

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

### Future tables (post-v1)
`makes`, `remixes`, `model_versions`, `notifications`, `email_outbox` (only if async mail delivery is
needed later).

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
| Like/bookmark/rate/comment | ❌ | ✅ | ✅ | ✅ |
| Edit/delete own comment or rating | ❌ | ✅ | ✅ | ✅ |
| Moderate comments on own model | ❌ | ❌ | ✅ | ✅ |
| Create/manage own collections | ❌ | ✅ | ✅ | ✅ |
| View **public** / **members** / **private** collection | ✅ / ❌ / ❌ | ✅ / ✅ / ❌ | ✅ / ✅ / ✅ | ✅ / ✅ / ✅ |
| Admin pages, users, settings, audit, backup | ❌ | ❌ | ❌ | ✅ |
| Manually verify an email | ❌ | ❌ | ❌ | ✅ |
| Reset another user's password | ❌ | ❌ | ❌ | ✅ |

Rules:

- Private/unauthorized model lookups return **404** (not 403) to avoid existence leaks.
- `require_login_to_browse` (admin setting) hides even public content from anonymous users.
- Every media byte goes through the same policy as the model metadata.
- Comments/ratings require a verified, active account when email verification is enabled; reading comments
  follows the model's visibility.
- Collections never widen model access: the collection page and model list are both filtered per viewer.
- Admins can transfer ownership before deleting a user; default is "delete models" with typed confirmation.

---

## 8. API design

Base: `/api`. JSON errors: `{"error":{"code","message","fields":{},"requestId"}}`.
Pagination: `?page=1&perPage=24` → `{items, page, perPage, total, totalPages}` (max 100).
Authenticated mutations require `X-CSRF-Token` and a same-origin `Origin` check. Public auth endpoints
(login/register/setup/verify) are rate-limited and same-origin checked; verification tokens are secret.

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
| POST | `/api/auth/register` | Register (open by default); may return `requiresVerification` |
| POST | `/api/auth/verify-email` | Consume a verification token, mark verified, create session |
| POST | `/api/auth/resend-verification` | Re-send verification; generic response (no enumeration) |

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
| PUT/DELETE | `/api/models/{id}/rating` | Upsert/remove my 1–5 rating |
| GET/POST | `/api/models/{id}/comments` | Paginated comments; create top-level or reply |
| PATCH/DELETE | `/api/comments/{id}` | Edit/delete own comment; owner/admin moderate |
| GET | `/api/models/{id}/collections` | Visible collections containing this model |
| GET | `/api/models/{id}/related` | Same category/tags, public, limit 8 |
| GET | `/api/models/{id}/downloads` | Owner/admin stats (optional v1) |

### Discovery & users
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/categories` | Category tree + model counts |
| GET | `/api/tags?q=&limit=` | Autocomplete (with `q`) or all tags with counts |
| GET | `/api/tags/{slug}` | Tag page + model count |
| GET | `/api/tags/{slug}/models` | Models with this tag, visibility-filtered |
| GET | `/api/collections` | Public collections + own collections |
| POST | `/api/collections` | Create collection |
| GET/PATCH/DELETE | `/api/collections/{id}` | Read/update/delete (owner/admin) |
| POST/DELETE | `/api/collections/{id}/models/{modelId}` | Add/remove a visible model |
| PATCH | `/api/collections/{id}/models` | Reorder collection items |
| GET | `/api/users/{username}` | Public profile + counts + collections |
| GET | `/api/users/{username}/models` | Public/member-filtered models |
| GET | `/api/users/{username}/collections` | Visible collections by owner |
| GET | `/api/stats` | Home counters (models, users, downloads) |

### Admin
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/stats` | Users, models, storage, disk free, recent activity |
| GET | `/api/admin/users` | List/search/filter |
| PATCH | `/api/admin/users/{id}` | Role, active, verify email, display name, reset password |
| DELETE | `/api/admin/users/{id}` | Transfer or delete content |
| GET/PATCH | `/api/admin/settings` | Typed site settings (incl. email verification toggle) |
| POST | `/api/admin/smtp/test` | Send a test message to the current admin |
| GET/DELETE | `/api/admin/comments/{id}` | Moderate a comment |
| DELETE | `/api/admin/ratings/{userId}/{modelId}` | Remove an abusive rating |
| DELETE | `/api/admin/collections/{id}` | Moderate a collection |
| GET | `/api/admin/audit` | Paginated audit log |
| GET | `/api/admin/jobs` | Job queue health |
| POST | `/api/admin/backup` | `VACUUM INTO` snapshot + download |
| POST | `/api/admin/cleanup` | Orphaned temp/media cleanup |

### Upload flow (two-phase, resumable-friendly)

1. `POST /api/models` → draft model with metadata.
2. `POST /api/models/{id}/files` one file at a time (streamed to `$DATA_DIR/tmp`, hashed, validated against
   the v1 allowlist, atomically renamed). Frontend uses `XMLHttpRequest` for upload progress.
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
  users exist, create on boot for unattended installs. Setup endpoint is permanently disabled after the
  first user.
- **Registration**: **open by default** (admin toggle can close it). New users are `user`. Admin can
  deactivate, promote, verify, and reset passwords.
- **Email verification (optional, default off)**: when disabled, registration sets `email_verified_at`
  and logs the user in immediately. Enabling it later grandfathers existing active accounts (no lockout);
  only new registrations and changed email addresses require verification. When enabled, registration
  creates an unverified account, emails a single-use 24-hour link, and login is refused until verified.
  `POST /api/auth/resend-verification` is generic and rate-limited. Admin-created users are marked verified
  (admin vouches for them). Changing an email address requires the current password and re-verification
  when enabled. If SMTP is unavailable, admins can use the UI or `myprintables admin verify-email`.
- **SMTP**: env-only configuration (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`,
  `SMTP_FROM`, `SMTP_TLS`); never stored in the DB or logs. The admin settings page can send a test email.
  Enabling verification without working SMTP is rejected with a clear error. Mail is sent synchronously;
  failures are surfaced and audited, and the user can retry.
- **Password reset**: still admin/CLI in v1 (SMTP availability does not enable self-service reset).
- **Rate limits** (in-memory, per instance; trusted-proxy aware): login 5/min/IP + 20/hour/account,
  register 3/hour/IP, verify/resend 5/hour/account, comments 30/hour/user + 1/5s, upload 20/hour/user,
  general API 300/min/IP. Constant-time failure responses.
- **Audit**: login success/failure, logout, password changes, email verification/resend, user admin
  actions, model visibility changes, comments/ratings/collections moderation, deletes, settings changes,
  backups.

---

## 10. Storage & uploads

### Data directory layout
```
$DATA_DIR/                 # default ./data
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

- Atomic writes: stream to `$DATA_DIR/tmp/<random>`, `fsync`, then `rename` into place; then DB
  transaction. Failures leave only temp files, cleaned by a job.
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
| GCODE | `.gcode`, `.gco`, `.g` | ✅ | Toolpath lines; extrusion orange, travel gray |
| STEP | `.step`, `.stp` | ✅ | OpenCascade WASM tessellation for preview; original file retained |
| Others | — | ❌ | Reject with a clear "unsupported format" message |

IGES remains post-v1. Also note the extension is **3MF**, not "p3mf".

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
| `/model/:id/:slug` | Model detail: gallery, metadata, tabs (Details / Files / Comments / Collections) |
| `/upload` | Upload wizard: files → images/cover → details → visibility → publish |
| `/collections` | Discover public collections + my collections |
| `/collections/:id/:slug` | Collection detail with visibility-filtered model grid |
| `/tags` | Tag index (A–Z with counts) |
| `/tags/:slug` | Tag page and model grid |
| `/login`, `/register`, `/setup` | Auth / first-run |
| `/verify-email` | Consume email verification token; resend state |
| `/u/:username` | Public profile + their visible models and collections |
| `/settings` | Profile, email verification status, password, sessions |
| `/admin` | Admin dashboard (users, content, comments, collections, storage, settings, audit, jobs) |
| `*` | 404 |

### State (Jotai)
- `sessionAtom`: user, CSRF token, capabilities; loaded once at boot.
- `settingsAtom`: public site settings.
- `modelListAtomFamily(params)`: cached browse results + refresh/invalidate.
- `modelDetailAtomFamily(id)`: detail cache.
- `likesAtomFamily` / `bookmarksAtomFamily` / `ratingAtomFamily`: optimistic toggles with rollback.
- `commentsAtomFamily(modelId, sort, page)`: paginated comments + local insert/edit/delete.
- `collectionsAtom`, `collectionDetailAtomFamily(id)`, `modelCollectionsAtomFamily(modelId)`.
- `tagAtomFamily(slug)` and tag autocomplete cache.
- `viewerPrefsAtom` (`atomWithStorage`): material color, wireframe, grid, background, autorotate.
- `uploadQueueAtom`: files, progress, errors, staged cover.
- `toastsAtom`.
- `browseFiltersAtom`: URL-synced filter state (search params are the source of truth).
- No Redux/TanStack Query; a small `resource` helper wraps `atomWithRefresh` + abortable fetch.

### Components (design system)
- `AppShell`, `UtilityBar`, `MainNav`, `SearchPill`, `MobileNav`, `Footer`.
- `ModelCard`, `ModelCardSkeleton`, `ModelGrid`, `CategoryPill`, `StatBar`, `LikeButton`, `BookmarkButton`.
- `Gallery`, `ImageLightbox`, `Tabs`, `TagChips`, `TagInput`, `DownloadButton`, `ActionBar`,
  `VisibilityBadge`.
- `StarRating` (read-only) + `RatingInput` (1–5, accessible radio group), `YourRating`.
- `CommentList`, `CommentForm`, `CommentItem` (reply/edit/delete), `CommentSkeleton`.
- `CollectionCard`, `CollectionGrid`, `CollectionFormDialog`, `CollectionPicker`, `AddToCollection`.
- `ModelViewer` + `ViewerControls` + `ViewerFileBar` + `ViewerThumbnails`, lazy-loaded.
- `UploadDropzone`, `FileList`, `ImageManager`, `CoverPicker`, `VisibilityRadio`, `TagInput`.
- Radix-based `Dialog`, `DropdownMenu`, `Tabs`, `Tooltip`, `Select`, `Switch`; styled with Tailwind.
- `AdminUserTable`, `AdminCommentTable`, `AdminCollectionTable`, `AdminStats`, `AdminSettingsForm`,
  `SmtpTestCard`, `AuditTable`, `StorageBar`.

### Data fetching
- `lib/api.ts`: typed fetch wrapper, credentials include, CSRF header for mutations, AbortController,
  normalized errors, 401 → clear session atom and redirect to login preserving `next`.
- Route-level code splitting; `three` only inside the viewer chunk.
- Image `srcset` with `thumb`/`large`, `loading=lazy`, `decoding=async`, fixed aspect ratio to prevent CLS.
- Markdown rendering sanitized; links `rel="nofollow noopener noreferrer"`, `target="_blank"`.
- Optimistic likes/bookmarks/ratings, disabled while pending, revert on error. Comments and collections
  invalidate the relevant atom after a successful mutation.
- Toasts for success/failure; inline field errors from API. Email verification and unverified-account states
  are handled as first-class routes, not error toasts.

### Home adaptation (NAS, not marketplace)
- Hero carousel of admin-featured models using their covers, dark gradient overlay, title, short
  description, "View model" CTA (orange).
- "Featured models" 4-up; "Latest uploads"; "Featured collections"; "Browse by category" tiles;
  "Top creators"; library stats.
- No store/contest/club banners. Nav: 3D Models, Collections, Tags, Upload (+ Create).

---

## 13. Admin

- **First run** `/setup`: create admin (email, username, display name, password). Headless installs can
  use `myprintables admin create --email ... --username ...` instead.
- **Dashboard**: users/models/files counts, DB size, media bytes, disk free, recent uploads/downloads,
  failed jobs, quick links.
- **Users**: search, role badge, active toggle, reset password (show once), revoke sessions, delete with
  content transfer/delete. The same reset is available offline via
  `myprintables admin reset-password --email ...`.
- **Settings**: site name, registration enabled, email verification enabled, require login to browse,
  default visibility, max upload MB, allowed formats, featured model IDs, footer text.
- **Email**: verification toggle, SMTP status from env, send test message, resend/manual verify a user.
- **Content moderation**: all models table with owner/visibility/status, feature toggle, force private,
  delete; tables for comments, ratings, and collections with remove/force-private actions.
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
- CLI admin actions require local filesystem access, use hidden password prompts or stdin, revoke
  sessions, and are audit-logged; `--password` is intentionally unsupported.
- Email verification tokens are 32 random bytes, stored only as SHA-256 hashes, single-use, expire in 24h,
  and are invalidated on resend/email change. Resend responses are generic (no account enumeration).
  SMTP uses TLS when configured; credentials are env-only and never logged.
- Comments accept plain text only (no HTML/Markdown), max 5000 chars, rate-limited; rendering preserves
  line breaks with escaping. One-level replies are validated against the parent's model.
- Ratings are integer 1–5, unique per `(user, model)`; average/count are recomputed transactionally.
- Collections enforce owner/visibility checks on every read and filter the included models per viewer;
  a public collection cannot expose a members/private model.
- Trusted proxy config for real client IP; never blindly trust `X-Forwarded-For`.
- Secrets only via env; no secrets in DB/logs; passwords never logged.
- `govulncheck`, `npm audit`, dependency pinning; optional ClamAV scan hook later.
- Data-directory local-disk requirement documented (SQLite on NFS/SMB is unsafe).

---

## 15. Running v1 (single binary)

### Env vars
```
PORT=8200
DATA_DIR=./data                 # later: a NAS volume
SITE_NAME=MyPrintables
APP_URL=http://localhost:8200  # used in verification links
SECURE_COOKIES=false           # true when served over HTTPS
TRUSTED_PROXY=                 # e.g. 172.16.0.0/12
REGISTRATION_ENABLED=true      # open registration by default
EMAIL_VERIFICATION_ENABLED=false  # initial default; admin setting is authoritative afterwards
MAX_UPLOAD_MB=1024
ADMIN_EMAIL=                   # optional unattended bootstrap
ADMIN_PASSWORD=                # optional; use setup page otherwise
AUTO_MIGRATE=true              # serve applies embedded migrations on boot by default
LOG_LEVEL=info

# Optional SMTP; required only when email verification is enabled
SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM=MyPrintables <no-reply@localhost>
SMTP_TLS=true
```

### Build

```sh
CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o bin/myprintables ./cmd/myprintables
./bin/myprintables version
./bin/myprintables migrate status
./bin/myprintables serve
```

`pnpm build` runs the Vite production build and then the static Go build. The result is the only runtime
artifact: it contains the API, SPA, and migrations. `pnpm dev` runs Air, which rebuilds frontend/backend and
restarts the server; development frontend builds keep inline source maps and stay unminified.
No Node, npm, or external asset directory is needed at runtime.

### Run

```sh
mkdir -p ./data
./bin/myprintables migrate up --data-dir ./data
./bin/myprintables serve --data-dir ./data
# open http://localhost:8200 and complete /setup
```

- Operations are the same binary:
  ```sh
  ./bin/myprintables migrate status --data-dir ./data
  ./bin/myprintables admin reset-password --email me@example.com --data-dir ./data
  ./bin/myprintables admin verify-email --email me@example.com --data-dir ./data
  ./bin/myprintables backup --out ./data/backups/app-$(date +%F).db
  ```
- Run under systemd/launchd/supervisor later; Docker, Compose, multi-arch images, and NAS-specific
  reverse-proxy samples are explicitly **post-v1**.
- The data directory must be on a local disk, not SMB/NFS. SQLite over a network filesystem can corrupt.

### Backup & restore
- Media files are immutable; DB snapshot via `myprintables backup --out ...` (`VACUUM INTO`).
- Full backup: snapshot DB, then copy/rsync media (preferably during quiet hours or from a filesystem
  snapshot).
- Restore: stop the server, restore `$DATA_DIR`, start; embedded migrations are forward-only and run on
  boot (or explicitly with `myprintables migrate up`).

---

## 16. Testing

### Go
- Unit: password hash/verify, session tokens, visibility matrix, slug/username validation, path safety,
  image limits, 3MF ZIP validation, format sniffing, rate limiter, CSRF, verification token expiry/use,
  comments/replies authorization, rating constraints, collection visibility filtering.
- Integration (`httptest` + temp SQLite + temp data dir): setup, login, open registration, optional email
  verification (fake SMTP), CRUD, upload, download, media authz, likes/bookmarks/ratings/comments,
  collections, search/filter/pagination, admin actions, backup.
- `go test -race ./...`, `go vet`, `golangci-lint`, `govulncheck`.

### Frontend
- Vitest + React Testing Library: atoms, API client, ModelCard, StarRating, comments, filters, auth guard,
  upload queue, collection picker.
- MSW for API mocks; Playwright e2e: setup → upload STL/3MF → public view → members-only gate →
  rate/comment/collect → search/tag filter → viewer canvas → restart persistence → admin reset.
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
SPA, Vite + Tailwind + TS strict, design tokens, cube logo + header/footer shell, home skeleton, pnpm
scripts, Air config, CI. No Docker in v1.
**Done when**: one `go build ./cmd/myprintables` binary embeds the UI and supports `version`, `migrate
status`, `serve`, and `admin reset-password --help`; `pnpm dev` runs Air with frontend/backend rebuilds; `go test`/`tsc` pass.

### M1 — Accounts, email verification & admin (4 d)
Users/sessions/settings/email-token migrations; `/setup` (or `admin create`); open registration with admin
toggle; login/register/logout/me; CSRF; rate limits; optional SMTP verification flow; profile; route guards;
admin user management; verify/reset CLI; audit for auth events.
**Done when**: fresh install → admin → second user → visibility of admin pages → session survives restart;
verification disabled = immediate login; verification enabled + fake SMTP = verify link works; manual
verify/reset CLI works.

### M2 — Models, files, tags, browse (6 d)
Schema + storage; upload flow; image derivatives; tags/categories; tag page; model CRUD; visibility;
browse/search/filter/sort; detail page; author profile; likes/bookmarks/downloads; admin content table.
**Done when**: an anonymous visitor can browse public models and download; members-only content is blocked
for anonymous users; owner/admin rules hold; tag filtering and pagination are correct.

### M3 — 3D preview (5 d)
Viewer with STL/3MF/OBJ/PLY/GLB; controls, fullscreen, file switching, thumbnails; loading/error states;
client-generated cover; format validation; memory cleanup; mobile. STEP preview uses occt-import-js.
**Done when**: sample files render and fit correctly; switching files works; 150 MB STL is usable; closing
releases memory; unsupported formats show download fallback.

### M4 — Comments, ratings & collections (4 d)
Comment threads (top-level + one reply level), edit/delete/moderation; 1–5 ratings with aggregates on cards
and detail; collection CRUD, visibility, add-to-collection, collection pages; admin moderation.
**Done when**: signed-in users can comment/reply/rate/collect; anonymous users can read public threads and
ratings; collection pages never expose models the viewer cannot access; counters stay consistent.

### M5 — Design polish & home (4 d)
Hero carousel, featured/latest/collections/categories/creators, skeletons, empty states, image srcset,
markdown, responsive header/drawer, detail page fidelity, comment/collection UI, OG meta injection,
404/500, toasts, focus states.
**Done when**: home/browse/detail/viewer/collections visually match the reference language; mobile pass;
axe clean.

### M6 — Admin, hardening & release (4 d)
Admin dashboard/storage/settings/email/audit/backup; comment/rating/collection moderation; CLI backup;
cleanup jobs; security headers; upload limits; backup docs; Playwright + race tests; seed data; release
checklist.
**Done when**: a fresh single-binary deploy passes the end-to-end acceptance list below and a documented
backup can be restored.

### Later (post-v1, prioritized with you)
Compose/NAS-specific packaging; STEP→GLB sidecar; makes/remixes; self-service
password reset via SMTP; OIDC; resumable uploads; bulk import CLI (`myp import ./folder --owner …`);
S3 storage; ClamAV; Draco/LOD; dark mode; Prometheus metrics.

---

## 18. Acceptance checklist (v1)

- [ ] Clean directory: `./bin/myprintables migrate up --data-dir ./data` then `serve`; open browser and
      complete `/setup`.
- [ ] One `go build` artifact serves both API and SPA with no external asset directory; `myprintables
      version`, `migrate status`, `migrate up`, `admin reset-password`, and `admin verify-email` work.
- [ ] Registration is open by default; admin can close it. Admin can also create a user.
- [ ] Email verification is off by default (immediate login). Enabled with a fake SMTP server, an
      unverified user receives a link, cannot log in before verifying, and can resend.
- [ ] Upload STL, 3MF, OBJ, PLY, GLB, GCODE, and STEP; each appears with correct size/format/cover,
      and STEP renders in the 3D viewer.
- [ ] Public model is viewable and downloadable while signed out.
- [ ] Setting a model to "members" makes it disappear from anonymous browse and media requests return 404.
- [ ] Private model is visible only to owner/admin.
- [ ] 3D viewer loads, rotates, zooms, pans, switches files, fullscreen, screenshot, closes cleanly.
- [ ] Search, category/tag filters, sort, pagination work; counts update after like/bookmark/download.
- [ ] Signed-in users can rate (1–5), comment/reply, edit/delete their comment, and create/curate
      collections; aggregate ratings and counts update on cards/detail; public collection pages never
      expose private/members models.
- [ ] Admin can reset a password (UI and CLI), verify an email, deactivate a user, moderate a comment/
      collection, feature a model, and download or create a DB backup.
- [ ] Data survives binary restart and upgrade (embedded migration runs).
- [ ] `go test -race ./...`, `tsc --noEmit`, `npm run test`, Playwright smoke pass.
- [ ] No external network requests at runtime (except configured SMTP); CSP has no violations.
- [ ] Backup → wipe data directory → restore → app works with the same data.

---

## 19. Risks & mitigations

| Risk | Mitigation |
|---|---|
| 3MF loader compatibility (production extension, external parts) | Support core spec v1; validate server-side; graceful error + download; test real 3MF fixtures |
| Huge STL files exhaust browser memory | Configurable max upload, size warning, progress, lazy viewer, future decimation/LOD |
| SQLite lock contention | WAL, `busy_timeout`, short transactions, one process, indexed queries; document local disk only |
| Data directory on SMB/NFS | Detect/warn; docs: use a local disk; SQLite over network FS can corrupt |
| Uploaded GLTF references external URLs | Reject external URIs server-side and in the loader URL modifier |
| Image/zip decompression bombs | Decode config first, pixel/entry/size/ratio limits, re-encode images |
| Argon2 too slow on low-power hardware | Tunable parameters, rehash-on-login, benchmark during M1 |
| Design drifts into a generic dashboard | `doc/DESIGN.md` tokens + component specs + reference screenshots; review at M5 |
| Trademark/copyright | Original cube mark, name, icons, fonts; no copied assets or CSS; layout inspiration only |
| TypeScript 8 unavailable | TS 7.0.2 confirmed and pinned; upgrade post-v1 when 8 ships |
| Concurrent CLI migration and running server | Embedded goose lock, `BEGIN IMMEDIATE`, `busy_timeout`; document a maintenance window for `migrate up` on busy instances |
| SMTP misconfiguration locks out new users | Verification off by default; test-email button; admin verify CLI/UI; clear error when enabling without SMTP; resend endpoint |
| Social scope (comments/ratings/collections) delays the core library | Timebox M4; comments are plain text with one reply level; no notifications/follows; collections and ratings are deliberately small |

---

## 20. Decisions locked for v1

| Topic | Decision |
|---|---|
| Branding | **MyPrintables**, original orange isometric cube mark at `web/public/brand/cube-mark.svg`; favicon at `web/public/favicon.svg`; wordmark set in Archivo |
| Registration | **Open by default**; admin toggle to close; admin-created users remain available |
| Email | Optional email verification, **off by default**; SMTP env config; admin/CLI manual verify; password reset stays admin/CLI |
| Default visibility | **Public** for new models |
| STEP | **Supported in v1** (`.step`/`.stp`) with browser-side OpenCascade preview |
| TypeScript | **7.0.2**, strict; upgrade later when 8 ships |
| v1 features | **Comments, ratings, tagging, and collections are in v1** (scoped small: one reply level, 1–5 stars, flat collection lists) |
| Deployment | **Single binary first**; Docker/Compose/multi-arch NAS packaging post-v1 |
| Data location | One local directory via `--data-dir` / `DATA_DIR`; default `./data` |

Remaining post-v1 decisions: SMTP provider/from-address details and NAS target and UID/GID mapping.
Nothing blocks M0.

M0–M6 are implemented as the v1 single binary. See `README.md`, `doc/DEPLOY.md`, `doc/BACKUP.md`, and `doc/API.md`.
