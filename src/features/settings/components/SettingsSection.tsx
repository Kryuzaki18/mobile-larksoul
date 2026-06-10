import React from 'react';
import { View, Text } from 'react-native';
import { List } from '@ant-design/react-native';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="mb-5">
      <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-2 ml-1">
        {title}
      </Text>
      <View className="rounded-2xl overflow-hidden">
        <List>{children}</List>
      </View>
    </View>
  );
}
