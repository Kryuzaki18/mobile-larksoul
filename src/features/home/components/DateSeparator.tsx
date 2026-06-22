import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../../utils/themes';

interface DateSeparatorProps {
  label: string;
}

export default function DateSeparator({ label }: DateSeparatorProps) {
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex-row items-center px-4 mt-4">
      <View
        className="flex-1 h-px"
        style={{
          backgroundColor: colorScheme === 'dark' ? Colors.slate800 : Colors.slate200,
        }}
      />
      <Text className="text-xs font-bold text-gray-400 tracking-widest ml-3">
        {label}
      </Text>
    </View>
  );
}
