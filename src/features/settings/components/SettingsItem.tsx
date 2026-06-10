import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface SettingsItemProps {
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  arrow?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

export default function SettingsItem({
  icon,
  extra,
  arrow,
  onPress,
  children,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3.5 border-b border-gray-100"
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      {icon && <View className="mr-3 w-6 items-center">{icon}</View>}
      <View className="flex-1">
        {typeof children === 'string' ? (
          <Text className="text-sm text-slate-800">{children}</Text>
        ) : (
          children
        )}
      </View>
      {extra && <View className="ml-2">{extra}</View>}
      {arrow && <ChevronRight size={16} color="#9ca3af" className="ml-1" />}
    </TouchableOpacity>
  );
}
