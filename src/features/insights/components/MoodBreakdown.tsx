import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';
import type { Mood } from '../../../models/interfaces/users.model';
import { MOOD_COLORS } from './InsightsGraph';

export const MOOD_META: Record<Mood, { emoji: string; label: string }> = {
  happy: { emoji: '😊', label: 'Happy' },
  grateful: { emoji: '🙏', label: 'Grateful' },
  excited: { emoji: '🎉', label: 'Excited' },
  neutral: { emoji: '😐', label: 'Neutral' },
  reflective: { emoji: '🤔', label: 'Reflective' },
  anxious: { emoji: '😰', label: 'Anxious' },
  sad: { emoji: '😢', label: 'Sad' },
};

interface Props {
  moodCounts: Partial<Record<Mood, number>>;
}

export default function MoodBreakdown({ moodCounts }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const total = Object.values(moodCounts).reduce((s, n) => s + (n ?? 0), 0);

  return (
    <View
      className="mx-4 mt-3 bg-white dark:bg-slate-900 rounded-2xl p-4"
      style={{
        shadowColor: '#000',
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Mood Breakdown
      </Text>

      {(Object.entries(moodCounts) as [Mood, number][])
        .sort((a, b) => b[1] - a[1])
        .map(([mood, count]) => {
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <View key={mood} className="mb-3.5">
              <View className="flex-row justify-between items-center mb-1.5">
                <View className="flex-row items-center gap-2">
                  <Text style={{ fontSize: 14 }}>{MOOD_META[mood].emoji}</Text>
                  <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {MOOD_META[mood].label}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-xs text-slate-400">{Math.round(pct)}%</Text>
                  <Text className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                    {count}×
                  </Text>
                </View>
              </View>
              <View className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <View
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    borderRadius: 999,
                    backgroundColor: MOOD_COLORS[mood],
                  }}
                />
              </View>
            </View>
          );
        })}
    </View>
  );
}
