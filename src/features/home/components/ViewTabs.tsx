import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, Menu, LayoutGrid } from 'lucide-react-native';

export type ViewMode = 'calendar' | 'list' | 'grid';

interface Tab {
  mode: ViewMode;
  label: string;
  Icon: React.FC<{ size: number; color: string }>;
}

const TABS: Tab[] = [
  { mode: 'calendar', label: 'Calendar', Icon: Calendar },
  { mode: 'list', label: 'List', Icon: Menu },
  { mode: 'grid', label: 'Grid', Icon: LayoutGrid },
];

interface ViewTabsProps {
  activeTab: ViewMode;
  onTabChange: (tab: ViewMode) => void;
}

export default function ViewTabs({ activeTab, onTabChange }: ViewTabsProps) {
  return (
    <View className="flex-row items-center gap-1 px-4 py-2 bg-white border-b border-gray-100">
      {TABS.map(({ mode, label, Icon }) => {
        const isActive = activeTab === mode;
        return (
          <TouchableOpacity
            key={mode}
            className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full ${isActive ? 'bg-blue-800' : ''}`}
            onPress={() => onTabChange(mode)}
          >
            <Icon size={14} color={isActive ? '#ffffff' : '#6b7280'} />
            <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
