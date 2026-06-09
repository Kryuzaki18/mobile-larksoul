import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@ant-design/react-native';
import type { JournalEntry } from './types';
import { formatEntryTime, getEntryIcon } from './types';

interface GridViewProps {
  entries: JournalEntry[];
}

export default function GridView({ entries }: GridViewProps) {
  return (
    <View className="flex-row flex-wrap px-3 pt-2">
      {entries.map(entry => {
        const timeLabel = formatEntryTime(entry.createdAt);
        const iconName = getEntryIcon(entry.createdAt);
        const imageBg = entry.imageColor ?? '#334155';

        return (
          <TouchableOpacity
            key={entry.id}
            className="w-1/2 p-1.5"
            activeOpacity={0.85}
          >
            <View className="bg-white rounded-2xl p-3">

              <View className="flex-row items-center gap-1 mb-2">
                <Icon name={iconName} size={11} color="#9ca3af" />
                <Text className="text-xs text-gray-400 flex-1" numberOfLines={1}>
                  {timeLabel}
                </Text>
              </View>


              {entry.hasImage && (
                <View
                  className="h-20 rounded-xl mb-2 items-center justify-center"
                  style={{ backgroundColor: imageBg }}
                >
                  <Icon name="picture" size={22} color="#94a3b8" />
                </View>
              )}


              <Text className="text-sm font-bold text-slate-800 mb-1" numberOfLines={2}>
                {entry.title}
              </Text>


              <Text className="text-xs text-gray-500 leading-relaxed mb-2" numberOfLines={3}>
                {entry.preview}
              </Text>


              <View className="flex-row flex-wrap gap-1">
                {entry.tags.slice(0, 2).map(tag => (
                  <View key={tag} className="bg-blue-50 rounded-full px-2 py-0.5">
                    <Text className="text-xs text-blue-500">{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
