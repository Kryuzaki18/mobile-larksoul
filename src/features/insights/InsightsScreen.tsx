import React, { useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { TrendingUp, BookOpen, Flame, BarChart2 } from 'lucide-react-native';
import { PrevButton, NextButton } from '../commons/Button';
import { useColorScheme } from 'nativewind';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../commons/Header';
import InsightsGraph from './components/InsightsGraph';
import MoodBreakdown from './components/MoodBreakdown';
import { useInsightsGraph, type DayData } from '../../hooks/useInsightsGraph';
import { useAuthStore } from '../../store/authStore';
import { MOOD_META } from '../../utils/mood';
import { Colors, type ColorTheme } from '../../utils/themes';
import { useActiveTheme } from '../../hooks/useActiveTheme';

const cardShadow = (isDark: boolean) => ({
  shadowColor: Colors.black,
  shadowOpacity: isDark ? 0.3 : 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2 as const,
});

interface StatCardProps {
  isDark: boolean;
  iconBg: string;
  icon: React.ReactNode;
  value: string | number;
  label: string;
  bold?: boolean;
}

function StatCard({ isDark, iconBg, icon, value, label, bold = true }: StatCardProps) {
  return (
    <View
      className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 items-center"
      style={cardShadow(isDark)}
    >
      <View
        className="w-8 h-8 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </View>
      <Text className={bold ? 'text-xl font-bold text-slate-800 dark:text-slate-100' : 'text-xl'}>
        {value}
      </Text>
      <Text className="text-[10px] text-slate-400 mt-0.5">{label}</Text>
    </View>
  );
}

interface GraphCardBodyProps {
  isLoading: boolean;
  hasMoodData: boolean;
  totalEntries: number;
  isDark: boolean;
  theme: ColorTheme;
  dayData: DayData[];
  monthName: string;
  resetKey: number;
}

function GraphCardBody({
  isLoading,
  hasMoodData,
  totalEntries,
  isDark,
  theme,
  dayData,
  monthName,
  resetKey,
}: GraphCardBodyProps) {
  if (isLoading) {
    return (
      <View style={{ height: 180, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={isDark ? Colors.slate600 : Colors.slate300} />
      </View>
    );
  }

  if (!hasMoodData) {
    const title    = totalEntries === 0 ? 'No entries this month' : 'No mood data yet';
    const subtitle = totalEntries === 0
      ? 'Write your first entry to\nstart tracking your mood'
      : 'Tag your entries with a mood\nto see activity here';

    return (
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
            {title}
          </Text>
          <Text style={{ fontSize: 11, color: isDark ? Colors.slate600 : Colors.slate300, textAlign: 'center', lineHeight: 16 }}>
            {subtitle}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <InsightsGraph
      dayData={dayData}
      totalEntries={totalEntries}
      monthName={monthName}
      isDark={isDark}
      resetKey={resetKey}
      theme={theme}
    />
  );
}

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

  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

  const hasMoodData = Object.keys(moodCounts).length > 0;

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

        <View
          className="mx-4 mt-3 bg-white dark:bg-slate-900 rounded-2xl p-4"
          style={cardShadow(isDark)}
        >
          <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Mood Activity
          </Text>
          <GraphCardBody
            isLoading={isLoading}
            hasMoodData={hasMoodData}
            totalEntries={totalEntries}
            isDark={isDark}
            theme={theme}
            dayData={dayData}
            monthName={monthName}
            resetKey={selectedYear * 100 + selectedMonth}
          />
        </View>

        <View className="flex-row mx-4 mt-3 gap-3">
          <StatCard
            isDark={isDark}
            iconBg={isDark ? theme._15 : theme[50]}
            icon={<BookOpen size={14} color={theme[500]} />}
            value={isLoading ? '—' : totalEntries}
            label="Entries"
          />
          <StatCard
            isDark={isDark}
            iconBg={isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb'}
            icon={<TrendingUp size={14} color={Colors.amber500} />}
            value={!isLoading && topMood ? MOOD_META[topMood].emoji : '—'}
            label={!isLoading && topMood ? MOOD_META[topMood].label : 'Top mood'}
            bold={false}
          />
          <StatCard
            isDark={isDark}
            iconBg={isDark ? 'rgba(249,115,22,0.1)' : '#fff7ed'}
            icon={<Flame size={14} color={Colors.orange500} />}
            value={isLoading ? '—' : streak}
            label="Day streak"
          />
        </View>

        <MoodBreakdown moodCounts={moodCounts} isLoading={isLoading} />
      </ScrollView>
    </View>
  );
}
