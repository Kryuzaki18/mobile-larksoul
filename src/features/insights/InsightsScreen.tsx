import React, { useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { TrendingUp, BookOpen, Flame, BarChart2 } from 'lucide-react-native';
import { PrevButton, NextButton } from '../commons/Button';
import { useColorScheme } from 'nativewind';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../commons/Header';
import InsightsGraph from './components/InsightsGraph';
import MoodBreakdown from './components/MoodBreakdown';
import { useInsightsGraph } from '../../hooks/useInsightsGraph';
import { useAuthStore } from '../../store/authStore';
import { MOOD_META } from '../../utils/mood';
import { Colors } from '../../utils/themes';
import { useActiveTheme } from '../../hooks/useActiveTheme';

const cardShadow = (isDark: boolean) => ({
  shadowColor: Colors.black,
  shadowOpacity: isDark ? 0.3 : 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2 as const,
});

export default function InsightsScreen() {
  const { currentUser } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useActiveTheme();
  const userId = currentUser?.id ?? '';
  const firstName = currentUser?.name?.split(' ')[0] ?? 'Your';

  const {
    selectedYear,
    selectedMonth,
    monthName,
    dayData,
    moodCounts,
    topMood,
    totalEntries,
    streak,
    isLoading,
    canGoNext,
    goToPrevMonth,
    goToNextMonth,
    refetch,
  } = useInsightsGraph(userId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <Header name={`${firstName}'s`} activeTab="graph" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-5 pb-1">
          <PrevButton onPress={goToPrevMonth} />
          <Text className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {monthName} {selectedYear}
          </Text>
          <NextButton onPress={goToNextMonth} disabled={!canGoNext} />
        </View>

        {/* ── Mood Activity card — always rendered ─────────────────────── */}
        <View
          className="mx-4 mt-3 bg-white dark:bg-slate-900 rounded-2xl p-4"
          style={cardShadow(isDark)}
        >
          <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Mood Activity
          </Text>

          {isLoading ? (
            <View style={{ height: 180, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={isDark ? Colors.slate600 : Colors.slate300} />
            </View>
          ) : totalEntries === 0 ? (
            <View style={{ height: 180, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: isDark ? theme._15 : theme[50],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChart2 size={24} color={theme[500]} opacity={0.7} />
              </View>
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: isDark ? Colors.slate400 : Colors.slate500 }}>
                  No entries this month
                </Text>
                <Text style={{ fontSize: 11, color: isDark ? Colors.slate600 : Colors.slate300, textAlign: 'center', lineHeight: 16 }}>
                  Write your first entry to{'\n'}start tracking your mood
                </Text>
              </View>
            </View>
          ) : (
            <InsightsGraph
              dayData={dayData}
              totalEntries={totalEntries}
              monthName={monthName}
              isDark={isDark}
              resetKey={selectedYear * 100 + selectedMonth}
              theme={theme}
            />
          )}
        </View>

        <View className="flex-row mx-4 mt-3 gap-3">
          <View
            className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 items-center"
            style={cardShadow(isDark)}
          >
            <View
              className="w-8 h-8 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: isDark ? theme._15 : theme[50] }}
            >
              <BookOpen size={14} color={theme[500]} />
            </View>
            <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {isLoading ? '—' : totalEntries}
            </Text>
            <Text className="text-[10px] text-slate-400 mt-0.5">Entries</Text>
          </View>

          <View
            className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 items-center"
            style={cardShadow(isDark)}
          >
            <View className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 items-center justify-center mb-2">
              <TrendingUp size={14} color={Colors.amber500} />
            </View>
            <Text className="text-xl">
              {!isLoading && topMood ? MOOD_META[topMood].emoji : '—'}
            </Text>
            <Text className="text-[10px] text-slate-400 mt-0.5">
              {!isLoading && topMood ? MOOD_META[topMood].label : 'Top mood'}
            </Text>
          </View>

          <View
            className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 items-center"
            style={cardShadow(isDark)}
          >
            <View className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 items-center justify-center mb-2">
              <Flame size={14} color={Colors.orange500} />
            </View>
            <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {isLoading ? '—' : streak}
            </Text>
            <Text className="text-[10px] text-slate-400 mt-0.5">Day streak</Text>
          </View>
        </View>

        {/* ── Mood Breakdown — always rendered ─────────────────────────── */}
        <MoodBreakdown moodCounts={moodCounts} isLoading={isLoading} />
      </ScrollView>
    </View>
  );
}
