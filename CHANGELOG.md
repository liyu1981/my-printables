# Changelog

## v0.1.7 — 2026-10-30

### Fixes

- **Slice in CubbySlicer** now opens a file picker when a model has more than one slicer-supported 3D file
- The picker lists every STL/3MF/OBJ/STEP file with its filename, format, and default-preview marker
- Selecting a picker entry opens that exact file in CubbySlicer and closes the menu
- Models with a single slicer-supported file keep the direct one-click Slice action
- Per-file Slice actions in the Files tab remain available

### Documentation

- Refreshed the README with grouped feature sections for models, social features, administration, and deployment
- Added a supported-format matrix covering upload, inline preview, and CubbySlicer support
- Documented STEP/OpenCascade previews, inline gallery navigation, file switching, G-code toolpaths, MCP, API keys, and bulk import
- Added CubbySlicer submodule initialization to the source build instructions

## v0.1.6 — 2026-10-30

### Features

- STEP/STP upload support with browser-side OpenCascade tessellation for the inline preview and fullscreen viewer
- STEP is now included in upload validation, folder import, format filters, generated covers, and model metadata
- Self-hosted CubbySlicer integration at `/slicer/` using a pinned Git submodule
- **Slice in CubbySlicer** actions on supported model files (STL, 3MF, OBJ, STEP)
- Same-origin slicer hand-off so private and members-only files use the existing session
- Per-file **Slice** links in the model Files tab
- File switcher in the inline 3D preview when a model has multiple 3D files
- Inline gallery 3D preview is kept in the gallery flow; the fullscreen viewer remains opt-in

### Fixes and maintenance

- Added a dedicated license section and third-party notices
- Removed dead code, unused imports, and ineffective helpers across the Go backend and React frontend
- Centralized supported file extensions, upload accept lists, and format labels in the frontend
- Added strict trailing-JSON rejection, atomic admin-settings validation, and better update/stat error handling
- Added missing audit entries for admin and media deletion actions
- Fixed static-file behavior so missing assets return 404 and HEAD responses do not write bodies
- Added SQLite constraint-code detection for unique conflicts
- Enabled frontend unused-local/parameter checks
- Fixed object URL leaks in upload previews and improved STEP worker crash recovery

### Upgrade notes

- Migration `008_step.sql` extends the stored model format allowlist and updates the default `allowed_formats` setting. It is applied automatically with `AUTO_MIGRATE=true`.
- STEP files are stored unchanged; tessellation happens in the browser. There is no server-side STEP conversion.
- CubbySlicer assets are embedded in release builds and included in the Docker image. Source builds should run:
  ```sh
  git submodule update --init --recursive
  pnpm build
  ```
- CubbySlicer remains a separate **AGPL-3.0-or-later** application under `/slicer/`; its source and license are in `third_party/cubbyslicer`.

## v0.1.5 — 2026-10-29

### Features

- MCP server over Streamable HTTP for LLM access
- User API keys created from Settings, with one-time key display and revocation
- API-key-scoped MCP read/create/update tools; model deletion is never exposed to MCP
- API keys also authenticate read-only HTTP/media requests
- Bulk folder import from Settings with recursive folder scanning and a one-by-one confirmation queue
- Gallery 3D tile now opens the inline preview instead of the fullscreen viewer
- Previous/next carousel controls in the gallery

### Fixes

- Footer version prefix normalization

## v0.1.4 — 2026-10-28

### Features

- G-code upload support for `.gcode`, `.gco`, and `.g` files
- G-code toolpath viewer with extrusion and travel paths
- G-code arc support plus absolute/relative coordinate, unit, homing, and position-reset handling
- G-code files work with inline preview, fullscreen viewer, and generated covers

### Fixes

- Footer no longer renders duplicate version prefixes such as `vv0.1.3`

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
