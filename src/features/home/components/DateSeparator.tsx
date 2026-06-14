import React from 'react';
import { View, Text } from 'react-native';

interface DateSeparatorProps {
  label: string;
}

export default function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <View className="flex-row items-center px-4 mt-4 mb-1">
      <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase mr-3">
        {label}
      </Text>
      <View className="flex-1 h-px" style={{ backgroundColor: '#e9edf2' }} />
    </View>
  );
}
