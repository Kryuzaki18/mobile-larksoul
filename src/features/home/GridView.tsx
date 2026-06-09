import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@ant-design/react-native';
import type { JournalEntry } from './types';

interface GridViewProps {
  entries: JournalEntry[];
}

export default function GridView({ entries }: GridViewProps) {
  return (
    <View className="flex-row flex-wrap px-3 pt-2">
      {entries.map(entry => (
        <TouchableOpacity
          key={entry.id}
          className="w-1/2 p-1.5"
          activeOpacity={0.85}
        >
          <View className="bg-white rounded-2xl p-3">
            <View className="flex-row items-center gap-1 mb-2">
              <Icon name={entry.iconType} size={11} color="#9ca3af" />
              <Text className="text-xs text-gray-400 flex-1" numberOfLines={1}>
                {entry.time}
              </Text>
            </View>
            <Text className="text-sm font-bold text-slate-800 mb-1" numberOfLines={2}>
              {entry.title}
            </Text>
            <Text className="text-xs text-gray-500 leading-relaxed mb-2" numberOfLines={3}>
              {entry.preview}
            </Text>
            <View className="flex-row flex-wrap gap-1">
              {entry.tags.map(tag => (
                <View key={tag} className="bg-blue-50 rounded-full px-2 py-0.5">
                  <Text className="text-xs text-blue-500">{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
