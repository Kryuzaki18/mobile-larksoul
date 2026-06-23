import React from 'react';
import { View, Text } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { Colors } from '../utils/themes';

export default function OfflineWarning() {
  return (
    <View className="flex-row items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-100 dark:border-amber-500/20">
      <WifiOff size={13} color={Colors.amber600} />
      <Text className="text-xs font-medium text-amber-700 dark:text-amber-400 flex-1">
        No internet — social sign-in unavailable
      </Text>
    </View>
  );
}
