-- +goose Up
CREATE TABLE IF NOT EXISTS model_attachments (
    id           TEXT PRIMARY KEY,
    model_id     TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    filename     TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type    TEXT NOT NULL,
    size_bytes   INTEGER NOT NULL,
    sha256       TEXT NOT NULL,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_model_attachments_model ON model_attachments(model_id, sort_order);

-- +goose Down
DROP TABLE IF EXISTS model_attachments;
