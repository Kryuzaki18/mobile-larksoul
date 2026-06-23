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
import type { User } from '../types/user';
import { saveAppleUserMapping, getLocalUserIdForApple, clearAppleUserMapping } from './tokenService';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '../config/auth.config';
import { EMAIL_REGEX } from '../utils/validation';

export const GUEST_EMAIL = 'guest@larksoul.local';

function validateEmailAndPassword(email: string, password: string): void {
  if (!EMAIL_REGEX.test(email)) {
    throw new Error('Enter a valid email address.');
  }
  if (password.length < 7) {
    throw new Error('Password must be at least 7 characters.');
  }
}

export function configureGoogleSignIn(): void {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
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

export async function signIn(email: string, password: string): Promise<User> {
  validateEmailAndPassword(email, password);
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('No account found with this email.');
  }
  if (user.password !== password) {
    throw new Error('Incorrect password.');
  }
  return user;
}

export async function signUp(name: string, email: string, password?: string): Promise<User> {
  validateEmailAndPassword(email, password ?? '');
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }
  return createUser(name, email, { password });
}

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
    const code = (error as { code?: string }).code;
    if (code === appleAuth.Error.CANCELED) {
      return null;
    }
    if (code === appleAuth.Error.FAILED) {
      throw new Error('Sign In with Apple is not available on the simulator. Use a physical device.');
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

  const existingLocalId = await getLocalUserIdForApple(appleUserId);
  if (existingLocalId) {
    const existing = await getUserById(existingLocalId);
    if (existing) return existing;
  }

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
  try {
    const currentGoogleUser = await GoogleSignin.getCurrentUser();
    if (currentGoogleUser) {
      await GoogleSignin.signOut();
    }
  } catch {
    // Ignore — user may not have been signed in via Google
  }

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
