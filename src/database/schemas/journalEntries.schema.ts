export const SQL_CREATE_JOURNAL_ENTRIES = `
  CREATE TABLE IF NOT EXISTS journal_entries (
    id          TEXT PRIMARY KEY NOT NULL,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       TEXT NOT NULL CHECK(length(title) >= 2 AND length(title) <= 30),
    content     TEXT NOT NULL CHECK(length(content) >= 7 AND length(content) <= 300),
    mood        TEXT NOT NULL,
    tags        TEXT NOT NULL DEFAULT '[]',
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL,
    deleted_at  TEXT
  );
`;