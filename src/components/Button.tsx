import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { Colors } from '../utils/themes';

interface BackButtonProps {
  onPress?: () => void;
  disabled?: boolean;
}

interface NavButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function BackButton({ onPress, disabled }: BackButtonProps) {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 items-center justify-center"
      style={{
        shadowColor: Colors.black,
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      }}
      onPress={onPress ?? (() => navigation.goBack())}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <ChevronLeft size={18} color={isDark ? Colors.slate200 : Colors.slate800} />
    </TouchableOpacity>
  );
}

function NextPrevButton({ isPrev, onPress, disabled }: NavButtonProps & { isPrev: boolean }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center"
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={{ opacity: disabled ? 0.35 : 1 }}
    >
      {isPrev ? (
        <ChevronLeft size={14} color={isDark ? Colors.slate300 : Colors.slate600} />
      ) : (
        <ChevronRight size={14} color={isDark ? Colors.slate300 : Colors.slate600} />
      )}
    </TouchableOpacity>
  );
}

export function PrevButton({ onPress, disabled }: NavButtonProps) {
  return <NextPrevButton isPrev={true} onPress={onPress} disabled={disabled} />;
}

export function NextButton({ onPress, disabled }: NavButtonProps) {
  return <NextPrevButton isPrev={false} onPress={onPress} disabled={disabled} />;
}
