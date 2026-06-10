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

export function runMigrations(db: DB): void {
  db.executeSync(SQL_CREATE_DB_LARKSOUL);

  const current = getVersion(db);

  if (current < 1) {
    db.executeSync(SQL_CREATE_USERS);
    db.executeSync(SQL_CREATE_JOURNAL_ENTRIES);
    db.executeSync(SQL_CREATE_INDEX_ENTRIES_USER);
    db.executeSync(
      'INSERT OR REPLACE INTO db_larksoul (key, value) VALUES (?, ?)',
      ['version', '1'],
    );
  }

  // Add future migrations below:
  // if (current < 2) {
  //   db.executeSync(`ALTER TABLE journal_entries ADD COLUMN ...`);
  //   db.executeSync('INSERT OR REPLACE INTO db_larksoul (key, value) VALUES (?, ?)', ['version', '2']);
  // }

  if (current < DB_VERSION) {
    db.executeSync(
      'INSERT OR REPLACE INTO db_larksoul (key, value) VALUES (?, ?)',
      ['version', String(DB_VERSION)],
    );
  }
}
