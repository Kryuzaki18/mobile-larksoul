import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SmilePlus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import type { Mood } from '../../../types/user';
import MoodBreakdownRow from './MoodBreakdownRow';
import { Colors } from '../../../utils/themes';
import { useActiveTheme } from '../../../hooks/useActiveTheme';

interface Props {
  moodCounts: Partial<Record<Mood, number>>;
  isLoading?: boolean;
}

export default function MoodBreakdown({ moodCounts, isLoading }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useActiveTheme();

  const total  = Object.values(moodCounts).reduce((s, n) => s + (n ?? 0), 0);
  const sorted = (Object.entries(moodCounts) as [Mood, number][]).sort((a, b) => b[1] - a[1]);
  const hasMoods = sorted.length > 0;

  return (
    <View
      className="mx-4 mt-3 bg-white dark:bg-slate-900 rounded-2xl p-4"
      style={{
        shadowColor: Colors.black,
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Mood Breakdown
      </Text>

      {isLoading ? (
        <View style={{ paddingVertical: 28, alignItems: 'center' }}>
          <ActivityIndicator color={isDark ? Colors.slate600 : Colors.slate300} />
        </View>
      ) : !hasMoods ? (
        <View style={{ paddingVertical: 24, alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: isDark ? theme._15 : theme[50],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SmilePlus size={22} color={theme[500]} opacity={0.7} />
          </View>
          <View style={{ alignItems: 'center', gap: 3 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: isDark ? Colors.slate400 : Colors.slate500 }}>
              No mood tags yet
            </Text>
            <Text style={{ fontSize: 11, color: isDark ? Colors.slate600 : Colors.slate300, textAlign: 'center', lineHeight: 16 }}>
              Add moods to your entries to{'\n'}see your emotional patterns
            </Text>
          </View>
        </View>
      ) : (
        sorted.map(([mood, count]) => (
          <MoodBreakdownRow
            key={mood}
            mood={mood}
            count={count}
            pct={total > 0 ? (count / total) * 100 : 0}
            isDark={isDark}
          />
        ))
      )}
    </View>
  );
}
