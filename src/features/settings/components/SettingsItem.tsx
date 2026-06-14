import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface SettingsItemProps {
  icon?: React.ReactNode;
  iconBg?: string;
  extra?: React.ReactNode;
  arrow?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  isLast?: boolean;
}

export default function SettingsItem({
  icon,
  iconBg = '#f1f5f9',
  extra,
  arrow,
  onPress,
  children,
  isLast,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-3.5 ${!isLast ? 'border-b border-gray-100' : ''}`}
      onPress={onPress}
      activeOpacity={onPress ? 0.65 : 1}
      disabled={!onPress}
    >
      {icon && (
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: iconBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 13,
          }}
        >
          {icon}
        </View>
      )}
      <View className="flex-1">
        {typeof children === 'string' ? (
          <Text className="text-sm font-medium text-slate-800">{children}</Text>
        ) : (
          children
        )}
      </View>
      {extra && <View className="ml-3">{extra}</View>}
      {arrow && <ChevronRight size={15} color="#cbd5e1" style={{ marginLeft: 4 }} />}
    </TouchableOpacity>
  );
}
