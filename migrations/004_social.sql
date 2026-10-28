-- +goose Up
CREATE TABLE IF NOT EXISTS comments (
    id         TEXT PRIMARY KEY,
    model_id   TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id  TEXT REFERENCES comments(id) ON DELETE CASCADE,
    body       TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    deleted_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_comments_model ON comments(model_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

CREATE TABLE IF NOT EXISTS collections (
    id          TEXT PRIMARY KEY,
    owner_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    visibility  TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','members','private')),
    model_count INTEGER NOT NULL DEFAULT 0,
    created_at  INTEGER NOT NULL,
    updated_at  INTEGER NOT NULL,
    UNIQUE (owner_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_collections_owner ON collections(owner_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_collections_vis ON collections(visibility, updated_at DESC);

CREATE TABLE IF NOT EXISTS collection_models (
    collection_id TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    model_id      TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    added_at      INTEGER NOT NULL,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, model_id)
);
CREATE INDEX IF NOT EXISTS idx_collection_models_model ON collection_models(model_id);

-- +goose Down
DROP TABLE IF EXISTS collection_models;
DROP TABLE IF EXISTS collections;
DROP TABLE IF EXISTS comments;
