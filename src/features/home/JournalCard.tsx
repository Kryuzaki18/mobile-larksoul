import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@ant-design/react-native';
import type { JournalEntry } from './types';

interface JournalCardProps {
  entry: JournalEntry;
  onMenuPress?: () => void;
  onPress?: () => void;
}

export default function JournalCard({ entry, onMenuPress, onPress }: JournalCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mx-4 mb-3 p-4"
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Timestamp row */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-1.5">
          <Icon name={entry.iconType} size={13} color="#9ca3af" />
          <Text className="text-xs text-gray-400 font-medium tracking-wider">
            {entry.time}
          </Text>
        </View>
        <TouchableOpacity className="p-1" onPress={onMenuPress}>
          <Icon name="ellipsis" size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text className="text-xl font-bold text-slate-800 mb-1.5" numberOfLines={2}>
        {entry.title}
      </Text>

      {/* Preview */}
      <Text className="text-sm text-gray-500 leading-relaxed mb-3" numberOfLines={3}>
        {entry.preview}
      </Text>

      {/* Image placeholder */}
      {entry.hasImage && (
        <View className="h-36 rounded-xl bg-slate-700 mb-3 items-center justify-center overflow-hidden">
          <Icon name="picture" size={36} color="#475569" />
        </View>
      )}

      {/* Tags */}
      <View className="flex-row flex-wrap gap-2">
        {entry.tags.map(tag => (
          <View key={tag} className="bg-blue-50 rounded-full px-3 py-1">
            <Text className="text-xs text-blue-500 font-medium">{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}
