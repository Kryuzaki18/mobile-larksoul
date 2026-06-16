export const SQL_CREATE_USERS = `
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY NOT NULL,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    avatar      TEXT,
    password    TEXT,
    social      TEXT NOT NULL DEFAULT '[]',
    is_verified INTEGER NOT NULL DEFAULT 0,
    verified_at TEXT,
    pin         TEXT,
    created_at  TEXT NOT NULL,
    deleted_at  TEXT
  );
`;