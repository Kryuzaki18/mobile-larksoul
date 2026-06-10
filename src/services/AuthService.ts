import { getUserByEmail, createUser } from '../database/functions/users';
import type { User } from '../models/interfaces/users.model';

export const GUEST_EMAIL = 'guest@larksoul.local';

export async function signInAsGuest(): Promise<User> {
  const existing = await getUserByEmail(GUEST_EMAIL);
  if (existing) return existing;
  return createUser('Guest', GUEST_EMAIL);
}

export async function signIn(email: string): Promise<User | null> {
  return getUserByEmail(email);
}

export async function signUp(name: string, email: string): Promise<User> {
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }
  return createUser(name, email);
}

export async function signOut(): Promise<void> {
  // Session teardown — extend when token/session storage is added
}
