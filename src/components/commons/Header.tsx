import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@ant-design/react-native';

interface HeaderProps {
  name?: string;
  subtitle?: string;
  onSettingsPress?: () => void;
}

export default function Header({
  name = "Krystian's",
  subtitle = 'Jornal',
  onSettingsPress,
}: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white">
      <View className="flex-row items-center gap-2.5">
        <View className="w-10 h-10 rounded-full bg-sky-200 items-center justify-center overflow-hidden">
          <Text className="text-xl">🧑</Text>
        </View>
        <View>
          <Text className="text-sm font-bold text-slate-800">{name}</Text>
          <Text className="text-xs text-gray-400">{subtitle}</Text>
        </View>
      </View>
      <TouchableOpacity className="p-1.5" onPress={onSettingsPress}>
        <Icon name="setting" size={22} color="#1e3a5f" />
      </TouchableOpacity>
    </View>
  );
}
