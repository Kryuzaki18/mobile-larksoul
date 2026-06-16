import * as Keychain from 'react-native-keychain';

const SERVICE = 'com.larksoul.pinlock';

export async function hasPinLock(): Promise<boolean> {
  const creds = await Keychain.getGenericPassword({ service: SERVICE });
  return !!creds;
}

export async function setPinLock(pin: string): Promise<void> {
  await Keychain.setGenericPassword('pin', pin, { service: SERVICE });
}

export async function verifyPinLock(pin: string): Promise<boolean> {
  const creds = await Keychain.getGenericPassword({ service: SERVICE });
  if (!creds) return false;
  return creds.password === pin;
}

export async function removePinLock(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SERVICE });
}
