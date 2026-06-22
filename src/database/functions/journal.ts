import { getDatabase } from '../index';
import type { JournalEntry, Mood } from '../../models/interfaces/users.interface';

type RawEntry = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  tags: string;
  image_paths: string;
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
    imagePaths: JSON.parse(raw.image_paths ?? '[]') as string[],
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function generateEntryId(): string {
  return `e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function validateEntryFields(
  title?: string,
  content?: string,
  moods?: Mood[],
  tags?: string[],
  imagePaths?: string[],
): void {
  if (title !== undefined) {
    if (title.length < 2 || title.length > 30)
      throw new Error('Title must be 2–30 characters');
  }
  if (content !== undefined) {
    if (content.length < 7 || content.length > 300)
      throw new Error('Content must be 7–300 characters');
  }
  if (moods !== undefined && moods.length > 3) {
    throw new Error('Select up to 3 moods');
  }
  if (tags !== undefined) {
    if (tags.length > 3) throw new Error('Add up to 3 tags');
    for (const tag of tags) {
      const bare = tag.replace(/^#/, '');
      if (bare.length < 2 || bare.length > 15)
        throw new Error(`Tag "${tag}" must be 2–15 characters`);
    }
  }
  if (imagePaths !== undefined && imagePaths.length > 3) {
    throw new Error('Upload up to 3 images');
  }
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
  validateEntryFields(entry.title, entry.content, entry.moods, entry.tags, entry.imagePaths);
  const id = generateEntryId();
  const now = new Date().toISOString();

  await getDatabase().execute(
    `INSERT INTO journal_entries
       (id, user_id, title, content, mood, tags, image_paths, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      entry.userId,
      entry.title,
      entry.content,
      JSON.stringify(entry.moods),
      JSON.stringify(entry.tags),
      JSON.stringify(entry.imagePaths ?? []),
      entry.createdAt,
      now,
    ],
  );

  return { ...entry, id, updatedAt: now };
}

export async function updateEntry(
  id: string,
  patch: Partial<Pick<JournalEntry, 'title' | 'content' | 'moods' | 'tags' | 'imagePaths'>>,
): Promise<void> {
  validateEntryFields(patch.title, patch.content, patch.moods, patch.tags, patch.imagePaths);
  const fields: string[] = [];
  const values: string[] = [];

  if (patch.title !== undefined) { fields.push('title = ?'); values.push(patch.title); }
  if (patch.content !== undefined) { fields.push('content = ?'); values.push(patch.content); }
  if (patch.moods !== undefined) { fields.push('mood = ?'); values.push(JSON.stringify(patch.moods)); }
  if (patch.tags !== undefined) { fields.push('tags = ?'); values.push(JSON.stringify(patch.tags)); }
  if (patch.imagePaths !== undefined) { fields.push('image_paths = ?'); values.push(JSON.stringify(patch.imagePaths)); }

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
