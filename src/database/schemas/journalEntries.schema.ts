export const SQL_CREATE_JOURNAL_ENTRIES = `
  CREATE TABLE IF NOT EXISTS journal_entries (
    id          TEXT PRIMARY KEY NOT NULL,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    preview     TEXT NOT NULL,
    mood        TEXT NOT NULL,
    tags        TEXT NOT NULL DEFAULT '[]',
    has_image   INTEGER NOT NULL DEFAULT 0,
    image_color TEXT,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );
`;