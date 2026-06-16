import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Lock } from 'lucide-react-native';
import PinPad from './components/PinPad';
import { verifyPinLock } from '../../services/securityService';

interface PinLockScreenProps {
  title?: string;
  subtitle?: string;
  onSuccess: () => void;
  onCancel?: () => void;
  cancelLabel?: string;
  onForgotPin?: () => void;
}

export default function PinLockScreen({
  title = 'Enter your PIN',
  subtitle = 'Unlock to continue',
  onSuccess,
  onCancel,
  cancelLabel = 'Cancel',
  onForgotPin,
}: PinLockScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  async function handleChange(next: string) {
    setError(false);
    setPin(next);
    if (next.length === 4) {
      const isValid = await verifyPinLock(next);
      if (isValid) {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => setPin(''), 300);
      }
    }
  }

  return (
    <View className="flex-1 bg-slate-50 items-center justify-center px-6">
      <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center mb-5">
        <Lock size={26} color="#1e40af" />
      </View>
      <Text className="text-xl font-bold text-slate-800 mb-1.5">{title}</Text>
      <Text className="text-sm text-gray-400 mb-10 text-center">
        {error ? 'Incorrect PIN, try again' : subtitle}
      </Text>

      <PinPad value={pin} onChange={handleChange} error={error} />

      <View className="mt-8 items-center gap-3">
        {onForgotPin && (
          <TouchableOpacity onPress={onForgotPin} activeOpacity={0.7}>
            <Text className="text-xs font-semibold text-blue-700">Forgot PIN? Sign out</Text>
          </TouchableOpacity>
        )}
        {onCancel && (
          <TouchableOpacity onPress={onCancel} activeOpacity={0.7}>
            <Text className="text-xs font-medium text-gray-400">{cancelLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
