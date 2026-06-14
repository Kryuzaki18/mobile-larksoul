import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Clock, Calendar, ImageIcon } from 'lucide-react-native';
import type { JournalEntry } from '../../../models/interfaces/users.model';
import { formatEntryTime, getEntryIcon } from '../../../utils/dateTime';

const MOOD_COLORS: Record<string, string> = {
  happy: '#fef9c3',
  grateful: '#dcfce7',
  excited: '#fce7f3',
  neutral: '#f1f5f9',
  reflective: '#ede9fe',
  anxious: '#fff7ed',
  sad: '#e0f2fe',
};

interface GridCardProps {
  entry: JournalEntry;
}

function GridCard({ entry }: GridCardProps) {
  const timeLabel = formatEntryTime(entry.createdAt);
  const iconName = getEntryIcon(entry.createdAt);
  const TimeIcon = iconName === 'clock-circle' ? Clock : Calendar;
  const accentColor = MOOD_COLORS[entry.moods[0] ?? 'neutral'] ?? '#f1f5f9';

  return (
    <TouchableOpacity
      style={{ width: '50%', padding: 6 }}
      activeOpacity={0.82}
    >
      <View
        className="bg-white rounded-2xl overflow-hidden"
        style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
      >
        <View style={{ height: 4, backgroundColor: accentColor }} />

        <View className="p-3">
          <View className="flex-row items-center gap-1 mb-2">
            <TimeIcon size={10} color="#9ca3af" />
            <Text className="text-xs text-gray-400 flex-1" numberOfLines={1}>
              {timeLabel}
            </Text>
          </View>

          {entry.hasImage && (
            <View
              className="h-16 rounded-xl mb-2 items-center justify-center"
              style={{ backgroundColor: entry.imageColor ?? '#334155' }}
            >
              <ImageIcon size={18} color="#94a3b8" />
            </View>
          )}

          <Text className="text-sm font-bold text-slate-800 mb-1.5" numberOfLines={2}>
            {entry.title}
          </Text>

          <Text className="text-xs text-gray-500 leading-relaxed mb-2" numberOfLines={3}>
            {entry.preview}
          </Text>

          {entry.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-1">
              {entry.tags.slice(0, 2).map(tag => (
                <View key={tag} className="bg-blue-50 rounded-full px-2 py-0.5">
                  <Text className="text-xs text-blue-500 font-medium">{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

interface GridViewProps {
  entries: JournalEntry[];
}

export default function GridView({ entries }: GridViewProps) {
  return (
    <View className="flex-row flex-wrap px-3 pt-3">
      {entries.map(entry => (
        <GridCard key={entry.id} entry={entry} />
      ))}
    </View>
  );
}
