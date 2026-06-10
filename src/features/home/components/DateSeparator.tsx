import React from 'react';
import { View, Text } from 'react-native';

interface DateSeparatorProps {
  label: string;
}

export default function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <View className="flex-row items-center px-4 my-3">
      <View className="flex-1 h-px bg-gray-200" />
      <Text className="mx-3 text-xs text-gray-400 font-medium tracking-widest">{label}</Text>
      <View className="flex-1 h-px bg-gray-200" />
    </View>
  );
}
