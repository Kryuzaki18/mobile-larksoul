import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';

import type { Mood } from '../../../models/interfaces/users.model';
import { MOOD_META, MOOD_COLORS } from '../../../utils/mood';

interface Props {
  mood: Mood;
  count: number;
  pct: number;
  isDark: boolean;
}

export default function MoodBreakdownRow({ mood, count, pct }: Props) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    const listenerId = widthAnim.addListener(({ value }) => {
      setDisplayPct(Math.round(value));
    });
    return () => widthAnim.removeListener(listenerId);
  }, []);

  useEffect(() => {
    widthAnim.setValue(0);
    setDisplayPct(0);
    Animated.timing(widthAnim, {
      toValue: pct,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const widthInterp = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={{ marginBottom: 14 }}>
      <View className="flex-row justify-between items-center mb-1.5">
        <View className="flex-row items-center gap-2">
          <Text style={{ fontSize: 14 }}>{MOOD_META[mood].emoji}</Text>
          <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {MOOD_META[mood].label}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text className="text-xs text-slate-400">{displayPct}%</Text>
          <Text className="text-xs font-semibold text-slate-500 dark:text-slate-300">
            {count}×
          </Text>
        </View>
      </View>
      <View className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <Animated.View
          style={{
            width: widthInterp,
            height: '100%',
            borderRadius: 999,
            backgroundColor: MOOD_COLORS[mood],
          }}
        />
      </View>
    </View>
  );
}
