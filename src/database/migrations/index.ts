import type { DB } from '@op-engineering/op-sqlite';
import {
  DB_VERSION,
  SQL_CREATE_DB_LARKSOUL,
  SQL_CREATE_USERS,
  SQL_CREATE_JOURNAL_ENTRIES,
  SQL_CREATE_INDEX_ENTRIES_USER,
} from '../schemas';

function getVersion(db: DB): number {
  try {
    const { rows } = db.executeSync(
      'SELECT value FROM db_larksoul WHERE key = ?',
      ['version'],
    );
    return rows.length > 0 ? parseInt((rows[0] as { value: string }).value, 10) : 0;
  } catch {
    return 0;
  }
}

function setVersion(db: DB, version: number): void {
  db.executeSync(
    'INSERT OR REPLACE INTO db_larksoul (key, value) VALUES (?, ?)',
    ['version', String(version)],
  );
}

// Tolerates re-running ALTER TABLE steps against a DB that's already
// partway migrated (e.g. a previous run crashed between steps).
// function tryExec(db: DB, sql: string): void {
//   try {
//     db.executeSync(sql);
//   } catch {
//     // column already added/dropped — safe to ignore
//   }
// }

export function runMigrations(db: DB): void {
  db.executeSync(SQL_CREATE_DB_LARKSOUL);

  const current = getVersion(db);
  setVersion(db, 1);

  if (current < 1) {
    db.executeSync(SQL_CREATE_USERS);
    db.executeSync(SQL_CREATE_JOURNAL_ENTRIES);
    db.executeSync(SQL_CREATE_INDEX_ENTRIES_USER);
    setVersion(db, 1);
  }

  if (current < 2) {
    try {
      db.executeSync(
        "ALTER TABLE journal_entries ADD COLUMN image_paths TEXT NOT NULL DEFAULT '[]'",
      );
    } catch {
      // column already exists — safe to ignore
    }
    setVersion(db, 2);
  }

  if (current < DB_VERSION) {
    setVersion(db, DB_VERSION);
  }
}
