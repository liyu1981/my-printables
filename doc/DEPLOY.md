# Deploying v1 (single binary)

v1 ships as one static Go binary. It embeds the React SPA, migrations, CLI, and API. Docker packaging is
available; Compose and NAS-specific reverse-proxy samples are still post-v1.

## Build

```sh
pnpm install
pnpm build
```

The release build creates `bin/myprintables`. It runs the frontend production build with source maps off,
then a stripped, static Go build.

## Docker

```sh
docker build -t myprintables .
docker run -d --name myprintables -p 8200:8200 -v myprintables_data:/data myprintables
```

The runtime image is Alpine, runs as UID/GID `10001`, and stores the database and media in `/data`.
For a bind mount, prepare ownership first:

```sh
mkdir -p ./data
sudo chown -R 10001:10001 ./data
docker run -d --name myprintables -p 8200:8200 -v "$PWD/data:/data" myprintables
```

The release workflow publishes `ghcr.io/<owner>/<repo>` on `v*` tags. A published image can be run with:

```sh
docker run -d --name myprintables -p 8200:8200 -v myprintables_data:/data ghcr.io/OWNER/REPO:latest
```

## Run

```sh
mkdir -p ./data
./bin/myprintables migrate up --data-dir ./data
./bin/myprintables serve --data-dir ./data
```

Open <http://localhost:8200> and complete `/setup`. To use the environment file:

```sh
set -a; . ./.env; set +a
./bin/myprintables serve
```

Useful commands:

```sh
./bin/myprintables version
./bin/myprintables migrate status --data-dir ./data
./bin/myprintables admin list --data-dir ./data
./bin/myprintables admin create --data-dir ./data --email me@example.com --username me --generate
./bin/myprintables admin reset-password --data-dir ./data --email me@example.com
./bin/myprintables admin verify-email --data-dir ./data --email me@example.com
./bin/myprintables backup --out ./data/backups/app.db
```

## Data directory

Keep `--data-dir` (default `./data`, env `DATA_DIR`) on a **local disk**. SQLite on SMB/NFS can corrupt.
The directory contains:

```
data/
  app.db
  media/models/...
  media/avatars/... (future)
  tmp/
  backups/
```

## systemd example

```ini
[Unit]
Description=MyPrintables
After=network-online.target

[Service]
User=myprintables
Group=myprintables
WorkingDirectory=/srv/myprintables
Environment=DATA_DIR=/srv/myprintables/data
Environment=PORT=8200
Environment=APP_URL=https://models.example.lan
Environment=SECURE_COOKIES=true
ExecStart=/srv/myprintables/bin/myprintables serve
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

## Reverse proxy (Nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name models.example.lan;
    client_max_body_size 1g;

    location / {
        proxy_pass http://127.0.0.1:8200;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Set `SECURE_COOKIES=true` and `TRUSTED_PROXY` when using a reverse proxy.

## Email verification (optional)

Leave `EMAIL_VERIFICATION_ENABLED=false` for personal use. To enable:

1. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM`, and `SMTP_TLS`.
2. Sign in as admin and open **Admin → Site settings**.
3. Enable **Require email verification** and use **Send test email**.

New registrations receive a single-use 24-hour link. Existing active accounts are grandfathered when the
setting is enabled. If email delivery fails, an admin can use **Admin → Users → verify** or
`myprintables admin verify-email`.
