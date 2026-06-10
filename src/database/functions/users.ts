import { getDatabase } from '../index';
import type { User } from '../../models/interfaces/users.model';

type RawUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  created_at: string;
};

function toUser(raw: RawUser): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: raw.avatar ?? undefined,
    createdAt: raw.created_at,
  };
}

function generateUserId(): string {
  return `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function getUserById(id: string): Promise<User | null> {
  const { rows } = await getDatabase().execute(
    'SELECT * FROM users WHERE id = ?',
    [id],
  );
  return rows.length > 0 ? toUser(rows[0] as RawUser) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { rows } = await getDatabase().execute(
    'SELECT * FROM users WHERE email = ?',
    [email],
  );
  return rows.length > 0 ? toUser(rows[0] as RawUser) : null;
}

export async function createUser(name: string, email: string): Promise<User> {
  const id = generateUserId();
  const createdAt = new Date().toISOString();
  await getDatabase().execute(
    'INSERT INTO users (id, name, email, created_at) VALUES (?, ?, ?, ?)',
    [id, name, email, createdAt],
  );
  return { id, name, email, createdAt };
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<User, 'name' | 'avatar'>>,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | null)[] = [];

  if (patch.name !== undefined) { fields.push('name = ?'); values.push(patch.name); }
  if (patch.avatar !== undefined) { fields.push('avatar = ?'); values.push(patch.avatar ?? null); }
  if (fields.length === 0) return;

  await getDatabase().execute(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    [...values, id],
  );
}

export async function deleteUser(id: string): Promise<void> {
  // Cascades to journal_entries via REFERENCES … ON DELETE CASCADE
  await getDatabase().execute('DELETE FROM users WHERE id = ?', [id]);
}
