import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';

import type { Mood } from '../../../models/interfaces/users.model';
import MoodBreakdownRow from './MoodBreakdownRow';

interface Props {
  moodCounts: Partial<Record<Mood, number>>;
}

export default function MoodBreakdown({ moodCounts }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const total = Object.values(moodCounts).reduce((s, n) => s + (n ?? 0), 0);
  const sorted = (Object.entries(moodCounts) as [Mood, number][]).sort((a, b) => b[1] - a[1]);

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
      {sorted.map(([mood, count], index) => {
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <MoodBreakdownRow
            key={mood}
            mood={mood}
            count={count}
            pct={pct}
            index={index}
            isDark={isDark}
          />
        );
      })}
    </View>
  );
}
