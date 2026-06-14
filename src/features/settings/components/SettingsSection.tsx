import React from 'react';
import { View, Text } from 'react-native';

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  const childArray = React.Children.toArray(children);
  return (
    <View className="mb-4">
      {title && (
        <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-2 ml-1 uppercase">
          {title}
        </Text>
      )}
      <View className="rounded-2xl overflow-hidden bg-white">
        {childArray.map((child, i) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<{ isLast?: boolean }>, {
                isLast: i === childArray.length - 1,
              })
            : child,
        )}
      </View>
    </View>
  );
}
