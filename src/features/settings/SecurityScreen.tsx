import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShieldCheck } from 'lucide-react-native';
import BackButton from '../commons/Button';
import { useColorScheme } from 'nativewind';
import type { RootStackParamList } from '../../models/types/navigation.type';
import { Colors } from '../../utils/colors';
import { setPinLock, removePinLock } from '../../services/securityService';
import { useSecurityStore } from '../../store/securityStore';
import PinPad from '../auth/components/PinPad';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Security'>;

type Step = 'idle' | 'create' | 'confirm';

export default function SecurityScreen() {
  const navigation = useNavigation<Nav>();
  const { isPinEnabled, setPinEnabled } = useSecurityStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [step, setStep] = useState<Step>('idle');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState(false);

  function startSetPin() {
    setStep('create');
    setPin('');
    setFirstPin('');
    setError(false);
  }

  function handleToggle(enabled: boolean) {
    if (enabled) {
      startSetPin();
    } else {
      Alert.alert('Disable PIN Lock', 'Are you sure you want to turn off PIN lock?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            await removePinLock();
            setPinEnabled(false);
          },
        },
      ]);
    }
  }

  async function handlePinChange(next: string) {
    setError(false);
    setPin(next);
    if (next.length !== 4) return;

    if (step === 'create') {
      setFirstPin(next);
      setStep('confirm');
      setPin('');
      return;
    }

    if (step === 'confirm') {
      if (next !== firstPin) {
        setError(true);
        setTimeout(() => {
          setStep('create');
          setPin('');
          setFirstPin('');
        }, 400);
        return;
      }
      await setPinLock(next);
      setPinEnabled(true);
      setStep('idle');
    }
  }

  if (step !== 'idle') {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center px-6">
        <View className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/10 items-center justify-center mb-5">
          <ShieldCheck size={26} color={Colors.blue500} />
        </View>
        <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1.5">
          {step === 'create' ? 'Create a PIN' : 'Confirm your PIN'}
        </Text>
        <Text className="text-sm text-gray-400 mb-10 text-center">
          {error ? "PINs don't match, try again" : 'Use 4 digits to secure your journal'}
        </Text>

        <PinPad value={pin} onChange={handlePinChange} error={error} />

        <TouchableOpacity className="mt-8" onPress={() => setStep('idle')} activeOpacity={0.7}>
          <Text className="text-xs font-medium text-gray-400">Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center px-4 pt-3 pb-3 bg-slate-50 dark:bg-slate-950">
        <BackButton />
        <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 ml-3">Security & PIN Lock</Text>
      </View>

      <View className="px-4 pt-1">
        <View className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
          <View className="flex-row items-center px-4 py-3.5">
            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-800 dark:text-slate-100">PIN Lock</Text>
              <Text className="text-xs text-gray-400 mt-0.5">
                Require a PIN to open the app
              </Text>
            </View>
            <Switch
              value={isPinEnabled}
              onValueChange={handleToggle}
              trackColor={{ false: Colors.slate200, true: Colors.blue600 }}
              thumbColor={Colors.white}
              style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
            />
          </View>

          {isPinEnabled && (
            <TouchableOpacity
              className="flex-row items-center px-4 py-3.5 border-t border-gray-100 dark:border-slate-800"
              onPress={startSetPin}
              activeOpacity={0.65}
            >
              <Text className="text-sm font-medium text-slate-800 dark:text-slate-100 flex-1">Change PIN</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
