import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

import type { DayData } from '../../../hooks/useInsightsGraph';
import { MOOD_META } from '../../../utils/mood';

export const TOOLTIP_W = 120;
export const TOOLTIP_H = 72;

interface Props {
  day: DayData;
  x: number;
  y: number;
  totalEntries: number;
  monthName: string;
  isDark: boolean;
}

export default function BarTooltip({ day, x, y, totalEntries, monthName, isDark }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    opacity.setValue(0);
    scale.setValue(0.92);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 16,
        stiffness: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [day.day]);

  const pct = totalEntries > 0 ? Math.round((day.count / totalEntries) * 100) : null;
  const bg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const primary = isDark ? '#f1f5f9' : '#0f172a';
  const secondary = isDark ? '#94a3b8' : '#64748b';

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: TOOLTIP_W,
        opacity,
        transform: [{ scale }],
        backgroundColor: bg,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: border,
        paddingHorizontal: 10,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOpacity: isDark ? 0.35 : 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 8,
      }}
    >
      <Text style={{ fontSize: 10, fontWeight: '700', color: primary, marginBottom: 2 }}>
        {monthName} {day.day}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 5,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: '600', color: primary }}>
          {day.count} {day.count === 1 ? 'entry' : 'entries'}
        </Text>
        {pct !== null && (
          <Text style={{ fontSize: 10, color: secondary }}>{pct}%</Text>
        )}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
        {day.entryMoods.map((mood, idx) => (
          <Text key={idx} style={{ fontSize: 12 }}>
            {MOOD_META[mood ?? 'neutral'].emoji}
          </Text>
        ))}
      </View>
    </Animated.View>
  );
}
