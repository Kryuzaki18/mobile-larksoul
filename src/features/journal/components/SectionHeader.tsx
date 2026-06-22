import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../../utils/colors';

const TYPE = {
  label:   { fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.5 },
  counter: { fontSize: 11, fontWeight: '500' as const },
} as const;

interface SectionHeaderProps {
  label: string;
  required?: boolean;
  count: number;
  max: number;
  warn?: boolean;
}

export default function SectionHeader({ label, required, count, max, warn }: SectionHeaderProps) {
  const counterColor = warn ? Colors.red500 : count >= max ? Colors.amber500 : Colors.slate500;
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text style={{ ...TYPE.label, color: Colors.slate500 }}>
        {required && <Text style={{ color: Colors.red500 }}>* </Text>}
        {label}
      </Text>
      <Text style={{ ...TYPE.counter, color: counterColor }}>
        {count}/{max}
      </Text>
    </View>
  );
}
