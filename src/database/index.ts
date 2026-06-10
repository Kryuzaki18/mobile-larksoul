import { open } from '@op-engineering/op-sqlite';
import type { DB } from '@op-engineering/op-sqlite';
import { DB_NAME } from './schemas';
import { runMigrations } from './migrations';

let _db: DB | null = null;

export function getDatabase(): DB {
  if (!_db) {
    _db = open({ name: DB_NAME });
    runMigrations(_db);
  }
  return _db;
}

export function closeDatabase(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}
