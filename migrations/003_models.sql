-- +goose Up
CREATE TABLE IF NOT EXISTS categories (
    id         TEXT PRIMARY KEY,
    slug       TEXT NOT NULL UNIQUE,
    name       TEXT NOT NULL,
    parent_id  TEXT REFERENCES categories(id) ON DELETE SET NULL,
    icon       TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO categories(id, slug, name, icon, sort_order) VALUES
    ('cat_3d_printers','3d-printers','3D Printers','printer',10),
    ('cat_art_design','art-design','Art & Design','palette',20),
    ('cat_costumes','costumes-accessories','Costumes & Accessories','shirt',30),
    ('cat_fashion','fashion','Fashion','sparkles',40),
    ('cat_gadgets','gadgets','Gadgets','cpu',50),
    ('cat_healthcare','healthcare','Healthcare','heart-pulse',60),
    ('cat_hobby','hobby-makers','Hobby & Makers','wrench',70),
    ('cat_household','household','Household','home',80),
    ('cat_learning','learning','Learning','graduation-cap',90),
    ('cat_seasonal','seasonal-designs','Seasonal designs','snowflake',100),
    ('cat_sports','sports-outdoor','Sports & Outdoor','bike',110),
    ('cat_tabletop','tabletop-miniatures','Tabletop Miniatures','swords',120),
    ('cat_toys','toys-games','Toys & Games','gamepad-2',130),
    ('cat_world','world-scans','World & Scans','globe',140);

CREATE TABLE IF NOT EXISTS models (
    id               TEXT PRIMARY KEY,
    owner_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title            TEXT NOT NULL,
    slug             TEXT NOT NULL UNIQUE,
    description      TEXT NOT NULL DEFAULT '',
    category_id      TEXT REFERENCES categories(id) ON DELETE SET NULL,
    license          TEXT NOT NULL DEFAULT '',
    source_url       TEXT NOT NULL DEFAULT '',
    visibility       TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','members','private')),
    status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
    featured         INTEGER NOT NULL DEFAULT 0,
    download_count   INTEGER NOT NULL DEFAULT 0,
    like_count       INTEGER NOT NULL DEFAULT 0,
    bookmark_count   INTEGER NOT NULL DEFAULT 0,
    view_count       INTEGER NOT NULL DEFAULT 0,
    comment_count    INTEGER NOT NULL DEFAULT 0,
    rating_count     INTEGER NOT NULL DEFAULT 0,
    rating_avg       REAL NOT NULL DEFAULT 0,
    collection_count INTEGER NOT NULL DEFAULT 0,
    created_at       INTEGER NOT NULL,
    updated_at       INTEGER NOT NULL,
    published_at     INTEGER
);
CREATE INDEX IF NOT EXISTS idx_models_list ON models(status, visibility, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_models_owner ON models(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_models_category ON models(category_id);
CREATE INDEX IF NOT EXISTS idx_models_downloads ON models(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_models_likes ON models(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_models_featured ON models(featured, published_at DESC);

CREATE TABLE IF NOT EXISTS model_files (
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
CREATE INDEX IF NOT EXISTS idx_model_files_model ON model_files(model_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_model_files_preview ON model_files(model_id, is_preview DESC);

CREATE TABLE IF NOT EXISTS model_images (
    id            TEXT PRIMARY KEY,
    model_id      TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    original_path TEXT NOT NULL,
    large_path    TEXT NOT NULL,
    thumb_path    TEXT NOT NULL,
    width         INTEGER NOT NULL,
    height        INTEGER NOT NULL,
    kind          TEXT NOT NULL DEFAULT 'upload' CHECK (kind IN ('upload','render')),
    sort_order    INTEGER NOT NULL DEFAULT 0,
    created_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_model_images_model ON model_images(model_id, sort_order);

CREATE TABLE IF NOT EXISTS tags (
    id   TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS model_tags (
    model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    tag_id   TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (model_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_model_tags_tag ON model_tags(tag_id);

CREATE TABLE IF NOT EXISTS likes (
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_id   TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, model_id)
);
CREATE INDEX IF NOT EXISTS idx_likes_model ON likes(model_id);

CREATE TABLE IF NOT EXISTS bookmarks (
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_id   TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, model_id)
);
CREATE INDEX IF NOT EXISTS idx_bookmarks_model ON bookmarks(model_id);

CREATE TABLE IF NOT EXISTS ratings (
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_id   TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    score      INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, model_id)
);
CREATE INDEX IF NOT EXISTS idx_ratings_model ON ratings(model_id);

CREATE TABLE IF NOT EXISTS downloads (
    id         TEXT PRIMARY KEY,
    model_id   TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    file_id    TEXT REFERENCES model_files(id) ON DELETE SET NULL,
    user_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
    ip_hash    TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_downloads_model ON downloads(model_id, created_at DESC);

-- +goose Down
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS downloads;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS model_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS model_images;
DROP TABLE IF EXISTS model_files;
DROP TABLE IF EXISTS models;
DROP TABLE IF EXISTS categories;
