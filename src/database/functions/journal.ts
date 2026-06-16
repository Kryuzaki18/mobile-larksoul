import { getDatabase } from '../index';
import type { JournalEntry, Mood } from '../../models/interfaces/users.model';

type RawEntry = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  tags: string;
  created_at: string;
  updated_at: string;
};

function parseMoods(raw: string): Mood[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Mood[]) : [parsed as Mood];
  } catch {
    return [raw as Mood];
  }
}

function toEntry(raw: RawEntry): JournalEntry {
  return {
    id: raw.id,
    userId: raw.user_id,
    title: raw.title,
    content: raw.content,
    moods: parseMoods(raw.mood),
    tags: JSON.parse(raw.tags) as string[],
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function generateEntryId(): string {
  return `e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function getEntriesByUser(userId: string): Promise<JournalEntry[]> {
  const { rows } = await getDatabase().execute(
    'SELECT * FROM journal_entries WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC',
    [userId],
  );
  return (rows as RawEntry[]).map(toEntry);
}

export async function getEntriesByDate(
  userId: string,
  dateStr: string,
): Promise<JournalEntry[]> {
  const { rows } = await getDatabase().execute(
    `SELECT * FROM journal_entries
     WHERE user_id = ? AND created_at LIKE ? AND deleted_at IS NULL
     ORDER BY created_at DESC`,
    [userId, `${dateStr}%`],
  );
  return (rows as RawEntry[]).map(toEntry);
}

export async function getEntryById(id: string): Promise<JournalEntry | null> {
  const { rows } = await getDatabase().execute(
    'SELECT * FROM journal_entries WHERE id = ? AND deleted_at IS NULL',
    [id],
  );
  return rows.length > 0 ? toEntry(rows[0] as RawEntry) : null;
}

export async function createEntry(
  entry: Omit<JournalEntry, 'id' | 'updatedAt'>,
): Promise<JournalEntry> {
  const id = generateEntryId();
  const now = new Date().toISOString();

  await getDatabase().execute(
    `INSERT INTO journal_entries
       (id, user_id, title, content, mood, tags, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      entry.userId,
      entry.title,
      entry.content,
      JSON.stringify(entry.moods),
      JSON.stringify(entry.tags),
      entry.createdAt,
      now,
    ],
  );

  return { ...entry, id, updatedAt: now };
}

export async function updateEntry(
  id: string,
  patch: Partial<Pick<JournalEntry, 'title' | 'content' | 'moods' | 'tags'>>,
): Promise<void> {
  const fields: string[] = [];
  const values: string[] = [];

  if (patch.title !== undefined) { fields.push('title = ?'); values.push(patch.title); }
  if (patch.content !== undefined) { fields.push('content = ?'); values.push(patch.content); }
  if (patch.moods !== undefined) { fields.push('mood = ?'); values.push(JSON.stringify(patch.moods)); }
  if (patch.tags !== undefined) { fields.push('tags = ?'); values.push(JSON.stringify(patch.tags)); }

  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(new Date().toISOString());

  await getDatabase().execute(
    `UPDATE journal_entries SET ${fields.join(', ')} WHERE id = ?`,
    [...values, id],
  );
}

export async function deleteEntry(id: string): Promise<void> {
  await getDatabase().execute(
    'UPDATE journal_entries SET deleted_at = ? WHERE id = ?',
    [new Date().toISOString(), id],
  );
}
