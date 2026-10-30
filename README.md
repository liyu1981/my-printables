# MyPrintables

Self-hosted, Printables-inspired 3D model library. One Go binary embeds the API, React SPA, migrations,
and the administrative CLI.

![MyPrintables homepage](https://raw.githubusercontent.com/liyu1981/my-printables/master/assets/myprintables_homepage.png)

## Features (v1)

- Open registration with optional email verification (SMTP, off by default)
- Admin and user roles, sessions, password reset via admin UI/CLI
- Models with multiple STL / 3MF / OBJ / PLY / GLB / GLTF files
- G-code uploads with a toolpath viewer
- STEP/STP uploads with browser-side OpenCascade preview
- Bulk folder import with a one-by-one confirmation queue
- Optional CubbySlicer integration: send STL/3MF/OBJ/STEP straight to a browser slicer
- MCP server for LLMs with API-key authenticated read/create/update access
- PDF/TXT/Markdown/ZIP attachments for assembly instructions and documentation
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

## Slicer integration

The repository includes [CubbySlicer](https://github.com/JoshTheDerf/cubbyslicer) as a pinned Git submodule at
`third_party/cubbyslicer`. It is served same-origin at `/slicer/`, so it can fetch both public and private
model files using the existing session.

After cloning:

```sh
git submodule update --init --recursive
pnpm build:slicer
```

`pnpm build:slicer` stages the upstream OrcaSlicer/preFlight/Full Spectrum WASM artifacts and builds the Vue
slicer into `internal/web/slicer`. `pnpm build` includes this step automatically.

Model pages show a **Slice in CubbySlicer** button for supported inputs:

```text
STL · 3MF · OBJ · STEP
```

The button opens:

```text
/slicer/?model=<same-origin file URL>&name=<filename>&arrange=all
```

Notes:

- CubbySlicer is **AGPL-3.0-or-later**; its source and license are in the submodule. Engine artifacts are
  fetched from the CubbySlicer public deployment by `scripts/sync-cubby-engines.mjs`.
- `/slicer/` is served with COOP/COEP headers and a relaxed WASM/worker CSP.
- PLY, GLB/GLTF, and G-code are not supported as slicer inputs, so no Slice action is shown for them.
- Model deletion remains a human-only action.

## Docker

### Pull from GHCR

```sh
docker pull ghcr.io/liyu1981/my-printables:latest

# or pin a release
docker pull ghcr.io/liyu1981/my-printables:v0.1.5
```

Run the published image with persistent storage:

```sh
docker run -d \
  --name myprintables \
  -p 8200:8200 \
  -v myprintables_data:/data \
  ghcr.io/liyu1981/my-printables:latest
```

If the GHCR package is private, log in first:

```sh
echo "$GHCR_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

### Build locally

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

The release workflow publishes multi-arch images for `v*` tags.

### NAS / Synology

The container always stores its database, media, temp files, and backups under **`/data`**. Map a local
NAS shared folder to that path.

Example with a Synology shared folder at `/volume1/docker/myprintables`:

```sh
sudo mkdir -p /volume1/docker/myprintables
sudo chown -R 10001:10001 /volume1/docker/myprintables
sudo chmod -R u+rwX,g+rwX /volume1/docker/myprintables

docker run -d \
  --name myprintables \
  --restart unless-stopped \
  -p 8200:8200 \
  -v /volume1/docker/myprintables:/data \
  ghcr.io/liyu1981/my-printables:latest
```

In Synology **Container Manager**, use the same mapping:

- Host folder: `/volume1/docker/myprintables`
- Container folder: `/data`
- Port: `8200` → `8200`
- Restart policy: `unless-stopped`

Important:

- The container runs as UID/GID **`10001`**. The mapped folder must be readable and writable by that
  user, otherwise SQLite and uploads will fail.
- Use a **local NAS shared folder** for `/data`, not an SMB/NFS network share. SQLite on network
  filesystems can corrupt data.
- If the container logs permission errors, fix ownership on the host and restart it:
  ```sh
  sudo chown -R 10001:10001 /volume1/docker/myprintables
  docker restart myprintables
  ```
- Back up the mapped folder regularly. It contains `app.db`, `media/`, and `backups/`.

## MCP server for LLMs

The app exposes an MCP server over Streamable HTTP, disabled by default.

```sh
MCP_ENABLED=true
```

Endpoint:

```text
http://<host>:8200/mcp
Authorization: Bearer <credential>
```

Two credential types are supported:

1. **User API keys** — create them in **Settings → API keys**. They act as that user and can read, create,
   and update content through MCP.
2. **Global `MCP_TOKEN`** — optional read-only credential for the public library. Useful for a shared
   read-only assistant.

```sh
# Optional public read-only token
MCP_TOKEN=replace-with-a-long-random-token
```

For Docker, add:

```sh
-e MCP_ENABLED=true
# optional:
-e MCP_TOKEN=replace-with-a-long-random-token
```

MCP clients should use the **Streamable HTTP** transport. User API keys are scoped to the user's permissions;
private and members-only models are only visible to their owner/admin. The global token only sees published
public models.

### Read tools

| Tool | Purpose |
|---|---|
| `search_models` | Search visible models by text/category/tag, with sort and limit |
| `get_model` | Full model metadata, 3D file links, image links, and attachment links |
| `list_categories` | Categories with counts |
| `list_tags` | Tags |
| `get_library_stats` | Public model/user/download/file counts |

### Write tools (API keys only)

| Tool | Purpose |
|---|---|
| `create_model` | Create a model owned by the user (metadata only) |
| `update_model` | Update the user's model metadata, visibility, status, or tags |
| `add_comment` | Comment or reply on a visible model |
| `set_rating` / `remove_rating` | Manage the user's 1–5 star rating |
| `toggle_like` / `toggle_bookmark` | Toggle the user's like/bookmark |
| `create_collection` | Create a collection |
| `add_to_collection` / `remove_from_collection` | Manage collection membership |

**MCP never exposes a delete-model tool.** Deleting models remains a human-only action in the web UI/API.
3D file uploads are also done through the web UI; MCP can create/update the metadata around them.

API keys are shown only once when created. Revoke them at any time from Settings.

For a local client using stdio instead of HTTP:

```sh
./bin/myprintables mcp --data-dir ./data
```

The stdio server has no user credential and is read-only/public only.

Generate a global token with:

```sh
openssl rand -hex 32
```

Set `APP_URL` to the externally reachable base URL so file/image/attachment links returned by tools are usable
by the LLM client. Put MCP behind HTTPS if exposing it beyond your LAN.

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

## License

MyPrintables is released under the [MIT License](LICENSE).

### Third-party notices

- **CubbySlicer** — AGPL-3.0-or-later. The pinned source is in
  [`third_party/cubbyslicer`](third_party/cubbyslicer); its license is included there. The slicer is served
  as a separate app under `/slicer/` and is not merged into the MyPrintables source.
- **Slicer engine artifacts** — OrcaSlicer / preFlight / Full Spectrum WASM builds retain their upstream
  licenses. They are staged by `scripts/sync-cubby-engines.mjs` and are not covered by the MIT license.
- **occt-import-js** — LGPL-2.1. Used for browser-side STEP tessellation; license text is in
  `web/node_modules/occt-import-js/LICENSE.md` after dependency installation.

Other dependencies remain under their respective upstream licenses. If you redistribute a built binary,
keep this notice and the applicable third-party license/source information.
