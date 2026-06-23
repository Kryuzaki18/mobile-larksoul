import { getDatabase } from '../index';
import type { User } from '../../types/user';

type RawUser = {
  id: string;
  name: string;
  avatar: string | null;
  email: string;
  password: string | null;
  social: string;
  pin: string | null;
  is_verified: number;
  verified_at: string | null;
  created_at: string;
};

interface CreateUserOptions {
  avatar?: string;
  password?: string;
  social?: string[];
  pin?: string;
}

function toUser(raw: RawUser): User {
  return {
    id: raw.id,
    name: raw.name,
    avatar: raw.avatar ?? undefined,
    email: raw.email,
    password: raw.password ?? undefined,
    social: JSON.parse(raw.social) as string[],
    pin: raw.pin ?? undefined,
    isVerified: raw.is_verified === 1,
    verifiedAt: raw.verified_at ?? undefined,
    createdAt: raw.created_at,
  };
}

function generateUserId(): string {
  return `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function getUserById(id: string): Promise<User | null> {
  const { rows } = await getDatabase().execute(
    'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
    [id],
  );
  return rows.length > 0 ? toUser(rows[0] as RawUser) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { rows } = await getDatabase().execute(
    'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
    [email],
  );
  return rows.length > 0 ? toUser(rows[0] as RawUser) : null;
}

export async function hasRegisteredUser(): Promise<boolean> {
  const { rows } = await getDatabase().execute(
    "SELECT 1 FROM users WHERE email != 'guest@larksoul.local' AND deleted_at IS NULL LIMIT 1",
  );
  return rows.length > 0;
}

export async function createUser(
  name: string,
  email: string,
  options: CreateUserOptions = {},
): Promise<User> {
  const id = generateUserId();
  const createdAt = new Date().toISOString();
  const social = options.social ?? [];
  const isVerified = social.length > 0;
  const verifiedAt = isVerified ? createdAt : null;

  await getDatabase().execute(
    `INSERT INTO users (id, name,  avatar, email,password, social, pin, is_verified, verified_at,  created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      name,
      options.avatar ?? null,
      email,
      options.password ?? null,
      JSON.stringify(social),
      options.pin ?? null,
      isVerified ? 1 : 0,
      verifiedAt,
      createdAt,
    ],
  );

  return {
    id,
    name,
    avatar: options.avatar,
    email,
    password: options.password,
    social,
    pin: options.pin,
    isVerified,
    verifiedAt: verifiedAt ?? undefined,
    createdAt,
  };
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<User, 'name' | 'avatar' | 'password' | 'social' | 'isVerified' | 'verifiedAt' | 'pin'>>,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (patch.name !== undefined) { fields.push('name = ?'); values.push(patch.name); }
  if (patch.avatar !== undefined) { fields.push('avatar = ?'); values.push(patch.avatar ?? null); }
  if (patch.password !== undefined) { fields.push('password = ?'); values.push(patch.password ?? null); }
  if (patch.social !== undefined) { fields.push('social = ?'); values.push(JSON.stringify(patch.social)); }
  if (patch.isVerified !== undefined) { fields.push('is_verified = ?'); values.push(patch.isVerified ? 1 : 0); }
  if (patch.verifiedAt !== undefined) { fields.push('verified_at = ?'); values.push(patch.verifiedAt ?? null); }
  if (patch.pin !== undefined) { fields.push('pin = ?'); values.push(patch.pin ?? null); }

  if (fields.length === 0) return;

  await getDatabase().execute(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    [...values, id],
  );
}

export async function deleteUser(id: string): Promise<void> {
  await getDatabase().execute(
    'UPDATE users SET deleted_at = ? WHERE id = ?',
    [new Date().toISOString(), id],
  );
}

export async function migrateGuestToUser(
  guestUserId: string,
  newUserId: string,
): Promise<void> {
  const db = getDatabase();
  // Reassign all journal entries from the guest account to the real account
  await db.execute(
    'UPDATE journal_entries SET user_id = ? WHERE user_id = ? AND deleted_at IS NULL',
    [newUserId, guestUserId],
  );
  // Soft-delete the guest account — its email slot is freed for reuse
  await db.execute(
    'UPDATE users SET deleted_at = ? WHERE id = ?',
    [new Date().toISOString(), guestUserId],
  );
}
