# MyPrintables

Self-hosted, Printables-inspired 3D model library. One Go binary embeds the API, React SPA, migrations,
and the administrative CLI.

## Development

```sh
make build
./bin/myprintables serve --data-dir ./data
```

Open <http://localhost:8080>.

- `doc/PLAN.md` — implementation plan and decisions
- `doc/DESIGN.md` — design language and component specs
- `AGENTS.md` — repository agent rules

## CLI

```sh
myprintables serve
myprintables migrate status
myprintables migrate up
myprintables admin reset-password --email you@example.com
myprintables backup --out ./data/backups/app.db
myprintables version
```
