import { Platform } from 'react-native';
import {
  GoogleSignin,
  isSuccessResponse,
  isCancelledResponse,
  statusCodes,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import { getUserByEmail, getUserById, createUser, updateUser, migrateGuestToUser } from '../database/functions/users';
import type { User } from '../models/interfaces/users.model';
import { saveAppleUserMapping, getLocalUserIdForApple, clearAppleUserMapping } from './tokenService';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '../config/auth.config';

export const GUEST_EMAIL = 'guest@larksoul.local';

export function configureGoogleSignIn(): void {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    // Only pass iosClientId if explicitly set — otherwise the SDK reads
    // CLIENT_ID from GoogleService-Info.plist automatically.
    ...(Platform.OS === 'ios' && GOOGLE_IOS_CLIENT_ID
      ? { iosClientId: GOOGLE_IOS_CLIENT_ID }
      : {}),
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });
}

export async function signInAsGuest(): Promise<User> {
  const existing = await getUserByEmail(GUEST_EMAIL);
  if (existing) return existing;
  return createUser('Guest', GUEST_EMAIL);
}

export async function signIn(email: string): Promise<User | null> {
  return getUserByEmail(email);
}

export async function signUp(name: string, email: string, password?: string): Promise<User> {
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }
  return createUser(name, email, { password });
}

/**
 * Returns null when the user cancels (no error should be shown).
 * Throws for real errors (Play Services unavailable, network issues, etc.).
 */
export async function signInWithGoogle(): Promise<User | null> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const response = await GoogleSignin.signIn();

  if (isCancelledResponse(response)) {
    return null;
  }

  if (!isSuccessResponse(response)) {
    return null;
  }

  const { email, name, photo, id: googleId } = response.data.user;

  const existing = await getUserByEmail(email);
  if (existing) {
    // Refresh avatar in the background if the Google photo changed
    if (photo && existing.avatar !== photo) {
      await updateUser(existing.id, { avatar: photo });
      return { ...existing, avatar: photo };
    }
    return existing;
  }

  return createUser(name ?? email, email, {
    avatar: photo ?? undefined,
    social: [`google:${googleId}`],
  });
}

/**
 * Returns null when the user cancels.
 * Throws when Apple credential state is invalid or another error occurs.
 * iOS only — Apple Sign-In is not available on Android.
 */
export async function signInWithApple(): Promise<User | null> {
  if (!appleAuth.isSupported) {
    throw new Error('Apple Sign-In is not supported on this device.');
  }

  let appleAuthResponse;
  try {
    appleAuthResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
  } catch (error: unknown) {
    // User cancelled — do not surface an error
    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code: string }).code === appleAuth.Error.CANCELED
    ) {
      return null;
    }
    throw error;
  }

  const credentialState = await appleAuth.getCredentialStateForUser(
    appleAuthResponse.user,
  );

  if (credentialState !== appleAuth.State.AUTHORIZED) {
    throw new Error('Apple Sign-In was not authorized. Please try again.');
  }

  const { user: appleUserId, email, fullName } = appleAuthResponse;

  // Subsequent sign-ins: Apple withholds email/name — look up by stored mapping
  const existingLocalId = await getLocalUserIdForApple(appleUserId);
  if (existingLocalId) {
    const existing = await getUserById(existingLocalId);
    if (existing) return existing;
  }

  // First sign-in: Apple provides email and name exactly once
  if (!email) {
    throw new Error(
      'Unable to retrieve your email from Apple. If you previously signed in with Apple, try signing out of your Apple ID in Settings and signing in again.',
    );
  }

  const displayName =
    [fullName?.givenName, fullName?.familyName].filter(Boolean).join(' ').trim() ||
    'Apple User';

  const existingByEmail = await getUserByEmail(email);
  const user =
    existingByEmail ??
    (await createUser(displayName, email, { social: [`apple:${appleUserId}`] }));

  await saveAppleUserMapping(appleUserId, user.id);

  return user;
}

export async function signInWithProvider(
  provider: 'google' | 'apple',
): Promise<User | null> {
  return provider === 'google' ? signInWithGoogle() : signInWithApple();
}

export async function migrateGuestAccount(
  guestUserId: string,
  newUserId: string,
): Promise<void> {
  await migrateGuestToUser(guestUserId, newUserId);
}

export async function signOut(): Promise<void> {
  // Sign out Google session if present
  try {
    const currentGoogleUser = await GoogleSignin.getCurrentUser();
    if (currentGoogleUser) {
      await GoogleSignin.signOut();
    }
  } catch {
    // Ignore — user may not have been signed in via Google
  }

  // Clear stored Apple mapping
  await clearAppleUserMapping();
}

export function getGoogleSignInError(error: unknown): string {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case statusCodes.IN_PROGRESS:
        return 'Sign-in is already in progress.';
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return 'Google Play Services is not available on this device.';
      default:
        break;
    }
  }
  return error instanceof Error ? error.message : 'Google Sign-In failed. Please try again.';
}
