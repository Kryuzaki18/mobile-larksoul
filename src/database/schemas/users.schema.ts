export const SQL_CREATE_USERS = `
  CREATE TABLE IF NOT EXISTS users (
    id         TEXT PRIMARY KEY NOT NULL,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    avatar     TEXT,
    created_at TEXT NOT NULL
  );
`;