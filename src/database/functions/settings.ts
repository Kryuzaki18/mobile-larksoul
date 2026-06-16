import { getDatabase } from '../index';

export async function getSetting(key: string): Promise<string | null> {
  const { rows } = await getDatabase().execute(
    'SELECT value FROM db_larksoul WHERE key = ?',
    [key],
  );
  return rows.length > 0 ? (rows[0] as { value: string }).value : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await getDatabase().execute(
    'INSERT OR REPLACE INTO db_larksoul (key, value) VALUES (?, ?)',
    [key, value],
  );
}
