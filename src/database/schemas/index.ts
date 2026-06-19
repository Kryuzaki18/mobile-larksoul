export * from './users.schema';
export * from './journalEntries.schema';

export const DB_NAME = 'larksoul.db';
export const DB_VERSION = 2;

export const SQL_CREATE_DB_LARKSOUL = `
  CREATE TABLE IF NOT EXISTS db_larksoul (
    key   TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
`;

export const SQL_CREATE_INDEX_ENTRIES_USER = `
  CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id
  ON journal_entries (user_id, created_at DESC);
`;
