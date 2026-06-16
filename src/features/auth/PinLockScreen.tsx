import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Lock, Clock } from 'lucide-react-native';
import PinPad from './components/PinPad';
import {
  verifyPinLock,
  getPinLockStatus,
  MAX_PIN_ATTEMPTS,
} from '../../services/securityService';

interface PinLockScreenProps {
  title?: string;
  subtitle?: string;
  onSuccess: () => void;
  onCancel?: () => void;
  cancelLabel?: string;
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(Math.ceil(ms / 1000), 0);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PinLockScreen({
  title = 'Enter your PIN',
  subtitle = 'Unlock to continue',
  onSuccess,
  onCancel,
  cancelLabel = 'Cancel',
}: PinLockScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(MAX_PIN_ATTEMPTS);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    getPinLockStatus().then(status => {
      setAttemptsRemaining(status.attemptsRemaining);
      setLockedUntil(status.lockedUntil);
    });
  }, []);

  useEffect(() => {
    if (lockedUntil === null) return;

    const tick = () => {
      const remaining = lockedUntil - Date.now();
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttemptsRemaining(MAX_PIN_ATTEMPTS);
        setRemainingMs(0);
      } else {
        setRemainingMs(remaining);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  async function handleChange(next: string) {
    setError(false);
    setPin(next);
    if (next.length === 4) {
      const result = await verifyPinLock(next);
      if (result.success) {
        onSuccess();
        return;
      }

      setError(true);
      setAttemptsRemaining(result.attemptsRemaining);
      if (result.locked) {
        setLockedUntil(result.lockedUntil);
      }
      setTimeout(() => setPin(''), 300);
    }
  }

  const isLocked = lockedUntil !== null;

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 120, height: 120, marginBottom: 5 }}
        resizeMode="contain"
      />

      <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center mb-5">
        {isLocked ? (
          <Clock size={26} color="#dc2626" />
        ) : (
          <Lock size={26} color="#1e40af" />
        )}
      </View>

      <Text className="text-xl font-bold text-slate-800 mb-1">
        {isLocked ? 'Too many attempts' : title}
      </Text>

      <Text className="text-sm text-gray-400 mb-10 text-center">
        {isLocked
          ? `Try again in ${formatCountdown(remainingMs)}`
          : error
          ? `Incorrect PIN, ${attemptsRemaining} attempt${
              attemptsRemaining === 1 ? '' : 's'
            } left`
          : subtitle}
      </Text>

      {!isLocked && (
        <PinPad value={pin} onChange={handleChange} error={error} />
      )}

      <View className="mt-8 items-center gap-3">
        {onCancel && !isLocked && (
          <TouchableOpacity onPress={onCancel} activeOpacity={0.7}>
            <Text className="text-xs font-medium text-gray-400">
              {cancelLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
