import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@ant-design/react-native';

export type ViewMode = 'calendar' | 'list' | 'grid';

interface Tab {
  mode: ViewMode;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { mode: 'calendar', label: 'Calendar', icon: 'calendar' },
  { mode: 'list', label: 'List', icon: 'bars' },
  { mode: 'grid', label: 'Grid', icon: 'appstore' },
];

interface ViewTabsProps {
  activeTab: ViewMode;
  onTabChange: (tab: ViewMode) => void;
}

export default function ViewTabs({ activeTab, onTabChange }: ViewTabsProps) {
  return (
    <View className="flex-row items-center gap-1 px-4 py-2 bg-white border-b border-gray-100">
      {TABS.map(({ mode, label, icon }) => {
        const isActive = activeTab === mode;
        return (
          <TouchableOpacity
            key={mode}
            className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full ${isActive ? 'bg-blue-800' : ''}`}
            onPress={() => onTabChange(mode)}
          >
            <Icon name={icon} size={14} color={isActive ? '#ffffff' : '#6b7280'} />
            <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
