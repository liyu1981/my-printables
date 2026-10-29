-- +goose Up
CREATE TABLE model_files_new (
    id          TEXT PRIMARY KEY,
    model_id    TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    filename    TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    format      TEXT NOT NULL CHECK (format IN ('stl','3mf','obj','ply','glb','gltf','gcode')),
    size_bytes  INTEGER NOT NULL,
    sha256      TEXT NOT NULL,
    is_preview  INTEGER NOT NULL DEFAULT 0,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  INTEGER NOT NULL
);
INSERT INTO model_files_new SELECT
    id, model_id, filename, storage_path, format, size_bytes, sha256, is_preview, sort_order, created_at
FROM model_files;
DROP TABLE model_files;
ALTER TABLE model_files_new RENAME TO model_files;
CREATE INDEX IF NOT EXISTS idx_model_files_model ON model_files(model_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_model_files_preview ON model_files(model_id, is_preview DESC);
UPDATE settings SET value = 'stl,3mf,obj,ply,glb,gltf,gcode'
WHERE key = 'allowed_formats' AND value = 'stl,3mf,obj,ply,glb,gltf';

-- +goose Down
CREATE TABLE model_files_old (
    id          TEXT PRIMARY KEY,
    model_id    TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    filename    TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    format      TEXT NOT NULL CHECK (format IN ('stl','3mf','obj','ply','glb','gltf')),
    size_bytes  INTEGER NOT NULL,
    sha256      TEXT NOT NULL,
    is_preview  INTEGER NOT NULL DEFAULT 0,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  INTEGER NOT NULL
);
INSERT INTO model_files_old SELECT
    id, model_id, filename, storage_path, format, size_bytes, sha256, is_preview, sort_order, created_at
FROM model_files WHERE format <> 'gcode';
DROP TABLE model_files;
ALTER TABLE model_files_old RENAME TO model_files;
CREATE INDEX IF NOT EXISTS idx_model_files_model ON model_files(model_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_model_files_preview ON model_files(model_id, is_preview DESC);
UPDATE settings SET value = 'stl,3mf,obj,ply,glb,gltf'
WHERE key = 'allowed_formats' AND value = 'stl,3mf,obj,ply,glb,gltf,gcode';
