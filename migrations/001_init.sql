-- +goose Up
CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at INTEGER NOT NULL,
    updated_by TEXT
);

INSERT OR IGNORE INTO settings(key, value, updated_at) VALUES
    ('site_name', 'MyPrintables', unixepoch()),
    ('registration_enabled', 'true', unixepoch()),
    ('email_verification_enabled', 'false', unixepoch()),
    ('default_visibility', 'public', unixepoch()),
    ('require_login_to_browse', 'false', unixepoch()),
    ('max_upload_mb', '1024', unixepoch()),
    ('allowed_formats', 'stl,3mf,obj,ply,glb,gltf', unixepoch()),
    ('featured_model_ids', '', unixepoch()),
    ('footer_text', 'Self-hosted 3D model library.', unixepoch());

-- +goose Down
DROP TABLE IF EXISTS settings;
