import * as Keychain from 'react-native-keychain';

const SERVICE = 'com.larksoul.pinlock';
const LOCKOUT_SERVICE = 'com.larksoul.pinlock.lockout';

export const MAX_PIN_ATTEMPTS = 5;
export const PIN_LOCKOUT_DURATION_MS = 5 * 60 * 1000;

interface LockoutState {
  attempts: number;
  lockedUntil: number | null;
}

export interface PinLockStatus {
  locked: boolean;
  lockedUntil: number | null;
  attemptsRemaining: number;
}

async function getLockoutState(): Promise<LockoutState> {
  const creds = await Keychain.getGenericPassword({ service: LOCKOUT_SERVICE });
  if (!creds) return { attempts: 0, lockedUntil: null };
  try {
    return JSON.parse(creds.password) as LockoutState;
  } catch {
    return { attempts: 0, lockedUntil: null };
  }
}

async function saveLockoutState(state: LockoutState): Promise<void> {
  await Keychain.setGenericPassword('lockout', JSON.stringify(state), { service: LOCKOUT_SERVICE });
}

export async function hasPinLock(): Promise<boolean> {
  const creds = await Keychain.getGenericPassword({ service: SERVICE });
  return !!creds;
}

export async function setPinLock(pin: string): Promise<void> {
  await Keychain.setGenericPassword('pin', pin, { service: SERVICE });
  await resetPinLockAttempts();
}

export async function getPinLockStatus(): Promise<PinLockStatus> {
  const state = await getLockoutState();

  if (state.lockedUntil !== null && Date.now() >= state.lockedUntil) {
    await saveLockoutState({ attempts: 0, lockedUntil: null });
    return { locked: false, lockedUntil: null, attemptsRemaining: MAX_PIN_ATTEMPTS };
  }

  if (state.lockedUntil !== null) {
    return { locked: true, lockedUntil: state.lockedUntil, attemptsRemaining: 0 };
  }

  return { locked: false, lockedUntil: null, attemptsRemaining: MAX_PIN_ATTEMPTS - state.attempts };
}

export async function verifyPinLock(
  pin: string,
): Promise<{ success: boolean } & PinLockStatus> {
  const status = await getPinLockStatus();
  if (status.locked) {
    return { success: false, ...status };
  }

  const creds = await Keychain.getGenericPassword({ service: SERVICE });
  const isValid = !!creds && creds.password === pin;

  if (isValid) {
    await resetPinLockAttempts();
    return { success: true, locked: false, lockedUntil: null, attemptsRemaining: MAX_PIN_ATTEMPTS };
  }

  const state = await getLockoutState();
  const attempts = state.attempts + 1;
  const lockedUntil = attempts >= MAX_PIN_ATTEMPTS ? Date.now() + PIN_LOCKOUT_DURATION_MS : null;
  await saveLockoutState({ attempts, lockedUntil });

  return {
    success: false,
    locked: lockedUntil !== null,
    lockedUntil,
    attemptsRemaining: Math.max(MAX_PIN_ATTEMPTS - attempts, 0),
  };
}

export async function resetPinLockAttempts(): Promise<void> {
  await saveLockoutState({ attempts: 0, lockedUntil: null });
}

export async function removePinLock(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SERVICE });
  await Keychain.resetGenericPassword({ service: LOCKOUT_SERVICE });
}
