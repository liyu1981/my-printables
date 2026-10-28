# Changelog

## v0.1.3 — 2026-10-28

### Features

- Model attachments for PDF, TXT, Markdown, and ZIP files
- Attachment drag-and-drop/upload with owner/admin permissions and model visibility enforcement
- Attachment list with inline open and download actions in the model Files tab
- Signed-in user chip restored in the header, linking to account settings

### Docs / Deploy

- Synology/NAS deployment instructions, including `/data` volume mapping and UID/GID permissions
- Homepage screenshot added to the README

## v0.1.2 — 2026-10-28

### Improvements

- Merged the utility header into a single MyPrintables header bar
- Centered the search bar and added a mobile search row
- Locked the gallery capture frame to a 4:3 aspect ratio while moving or resizing
- Added corner handles for resizing the capture frame
- Added explicit zoom in/out controls to the 3D viewer

## v0.1.1 — 2026-10-28

### Improvements

- Drag-and-drop support for 3D files and gallery images in the upload page
- Inline interactive 3D preview when a model has no uploaded gallery images
- Save a selected 4:3 region from the fullscreen 3D viewer directly to the gallery
- Gallery captures can be repositioned by dragging the capture frame
- Model card and collection tile images now fit instead of being cropped
- GitHub and Reddit links added to the footer
- GHCR pull and Docker deployment instructions added to the README

## v0.1.0 — 2026-10-28

Initial release.

### Highlights

- Single self-contained Go binary with embedded React SPA, migrations, API, and CLI
- Open registration with optional SMTP email verification (off by default)
- Admin/user roles, sessions, first-run setup, and admin/CLI password reset
- Model uploads with STL, 3MF, OBJ, PLY, GLB, and GLTF support
- Public, members-only, and private visibility enforced on metadata and media
- Image uploads with automatic resizing and client-generated covers
- Interactive inline and fullscreen 3D preview with orbit, zoom, screenshots, and region-cropped gallery captures
- Search, category/tag filters, likes, bookmarks, downloads, ratings, comments, and collections
- Admin dashboard for users, content moderation, storage, audit log, SMTP, and site settings
- SQLite WAL database plus plain media files in a single local data directory
- Alpine multi-stage Docker image running as non-root on port 8200
- GitHub Actions CI for tests/builds and GHCR multi-arch image publishing on `v*` tags

### Notes

- Docker/NAS-specific Compose and reverse-proxy packaging remain post-v1.
- STEP/STP import and preview remain post-v1.
