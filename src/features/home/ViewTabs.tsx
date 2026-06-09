import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@ant-design/react-native';

export type ViewMode = 'calendar' | 'list' | 'grid';

interface ViewTabsProps {
  activeTab: ViewMode;
  onTabChange: (tab: ViewMode) => void;
}

export default function ViewTabs({ activeTab, onTabChange }: ViewTabsProps) {
  return (
    <View className="flex-row items-center gap-1 px-4 py-2 bg-white border-b border-gray-100">

      <TouchableOpacity
        className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full ${activeTab === 'calendar' ? 'bg-blue-800' : ''}`}
        onPress={() => onTabChange('calendar')}
      >
        <Icon name="calendar" size={14} color={activeTab === 'calendar' ? '#ffffff' : '#6b7280'} />
        <Text className={`text-sm font-medium ${activeTab === 'calendar' ? 'text-white' : 'text-gray-500'}`}>
          Calendar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full ${activeTab === 'list' ? 'bg-blue-800' : ''}`}
        onPress={() => onTabChange('list')}
      >
        <Icon name="bars" size={14} color={activeTab === 'list' ? '#ffffff' : '#6b7280'} />
        <Text className={`text-sm font-medium ${activeTab === 'list' ? 'text-white' : 'text-gray-500'}`}>
          List
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full ${activeTab === 'grid' ? 'bg-blue-800' : ''}`}
        onPress={() => onTabChange('grid')}
      >
        <Icon name="appstore" size={14} color={activeTab === 'grid' ? '#ffffff' : '#6b7280'} />
        <Text className={`text-sm font-medium ${activeTab === 'grid' ? 'text-white' : 'text-gray-500'}`}>
          Grid
        </Text>
      </TouchableOpacity>

    </View>
  );
}
