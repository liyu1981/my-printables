# Backup & restore

## Database snapshot

The safest quick snapshot uses SQLite's `VACUUM INTO` via the binary:

```sh
./bin/myprintables backup --out ./data/backups/app-$(date +%F-%H%M).db
```

This is safe while the server is running.

## Full backup

Media files are immutable and stored under `data/media`. Take a DB snapshot first, then copy the data
directory (or use a filesystem snapshot):

```sh
./bin/myprintables backup --out /backup/app-$(date +%F).db
rsync -a ./data/media/ /backup/media-$(date +%F)/
```

For a guaranteed point-in-time full backup, stop the server first, then copy the entire `data/` directory.
Do not copy a live SQLite WAL database with a plain `cp` while it is being written.

## Restore

1. Stop the server.
2. Restore the database and media into the same `DATA_DIR`.
3. Start the server (or run `myprintables migrate up`).
4. Verify models, previews, and downloads.

The schema migrations are forward-only. Keep a backup from before each upgrade.

## Notes

- Keep backups on a different physical device.
- Test a restore into a temporary directory at least once.
- Do not place `DATA_DIR` on SMB/NFS; use local disk or a block-level volume.
