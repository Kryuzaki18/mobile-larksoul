import { getDatabase } from '../index';
import type { JournalEntry, Mood } from '../../models/interfaces/users.model';

type RawEntry = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  preview: string;
  mood: string;
  tags: string;
  has_image: number;
  image_color: string | null;
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
    preview: raw.preview,
    moods: parseMoods(raw.mood),
    tags: JSON.parse(raw.tags) as string[],
    hasImage: raw.has_image === 1,
    imageColor: raw.image_color ?? undefined,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function generateEntryId(): string {
  return `e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function getEntriesByUser(userId: string): Promise<JournalEntry[]> {
  const { rows } = await getDatabase().execute(
    'SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC',
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
     WHERE user_id = ? AND created_at LIKE ?
     ORDER BY created_at DESC`,
    [userId, `${dateStr}%`],
  );
  return (rows as RawEntry[]).map(toEntry);
}

export async function getEntryById(id: string): Promise<JournalEntry | null> {
  const { rows } = await getDatabase().execute(
    'SELECT * FROM journal_entries WHERE id = ?',
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
       (id, user_id, title, content, preview, mood, tags, has_image, image_color, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      entry.userId,
      entry.title,
      entry.content,
      entry.preview,
      JSON.stringify(entry.moods),
      JSON.stringify(entry.tags),
      entry.hasImage ? 1 : 0,
      entry.imageColor ?? null,
      entry.createdAt,
      now,
    ],
  );

  return { ...entry, id, updatedAt: now };
}

export async function updateEntry(
  id: string,
  patch: Partial<Pick<JournalEntry, 'title' | 'content' | 'preview' | 'moods' | 'tags' | 'hasImage' | 'imageColor'>>,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (patch.title !== undefined) { fields.push('title = ?'); values.push(patch.title); }
  if (patch.content !== undefined) { fields.push('content = ?'); values.push(patch.content); }
  if (patch.preview !== undefined) { fields.push('preview = ?'); values.push(patch.preview); }
  if (patch.moods !== undefined) { fields.push('mood = ?'); values.push(JSON.stringify(patch.moods)); }
  if (patch.tags !== undefined) { fields.push('tags = ?'); values.push(JSON.stringify(patch.tags)); }
  if (patch.hasImage !== undefined) { fields.push('has_image = ?'); values.push(patch.hasImage ? 1 : 0); }
  if (patch.imageColor !== undefined) { fields.push('image_color = ?'); values.push(patch.imageColor ?? null); }

  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(new Date().toISOString());

  await getDatabase().execute(
    `UPDATE journal_entries SET ${fields.join(', ')} WHERE id = ?`,
    [...values, id],
  );
}

export async function deleteEntry(id: string): Promise<void> {
  await getDatabase().execute('DELETE FROM journal_entries WHERE id = ?', [id]);
}

export async function getEntryDates(userId: string): Promise<string[]> {
  const { rows } = await getDatabase().execute(
    `SELECT DISTINCT substr(created_at, 1, 10) AS date
     FROM journal_entries
     WHERE user_id = ?
     ORDER BY date DESC`,
    [userId],
  );
  return (rows as { date: string }[]).map(r => r.date);
}
