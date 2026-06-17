import * as Keychain from 'react-native-keychain';

/**
 * Stores the mapping between an Apple user identifier (stable, app-scoped)
 * and the local SQLite user ID.
 *
 * Apple only provides the user's email on the very first sign-in. On
 * subsequent sign-ins we receive only the opaque `user` identifier, so we
 * persist this mapping in Keychain to look up the local account.
 */

const APPLE_UID_SERVICE = 'com.larksoul.apple.uid';

export async function saveAppleUserMapping(
  appleUserId: string,
  localUserId: string,
): Promise<void> {
  await Keychain.setGenericPassword(appleUserId, localUserId, {
    service: APPLE_UID_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getLocalUserIdForApple(
  appleUserId: string,
): Promise<string | null> {
  try {
    const creds = await Keychain.getGenericPassword({ service: APPLE_UID_SERVICE });
    if (!creds || creds.username !== appleUserId) return null;
    return creds.password;
  } catch {
    return null;
  }
}

export async function clearAppleUserMapping(): Promise<void> {
  try {
    await Keychain.resetGenericPassword({ service: APPLE_UID_SERVICE });
  } catch {
    // ignore — mapping may not exist
  }
}
