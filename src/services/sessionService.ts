import * as Keychain from 'react-native-keychain';

const SERVICE = 'com.larksoul.session';

type SessionData = { userId: string; isGuest: boolean };

export async function saveSession(userId: string, isGuest: boolean): Promise<void> {
  await Keychain.setGenericPassword('session', JSON.stringify({ userId, isGuest }), { service: SERVICE });
}

export async function loadSession(): Promise<SessionData | null> {
  const creds = await Keychain.getGenericPassword({ service: SERVICE });
  if (!creds) return null;
  try {
    return JSON.parse(creds.password) as SessionData;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SERVICE });
}
