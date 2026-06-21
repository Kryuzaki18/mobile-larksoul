import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ChevronLeft, ChevronRight, TrendingUp, BookOpen, Flame } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../commons/Header';
import InsightsGraph from './components/InsightsGraph';
import MoodBreakdown from './components/MoodBreakdown';
import { useInsightsGraph } from '../../hooks/useInsightsGraph';
import { useAuthStore } from '../../store/authStore';
import { MOOD_META } from '../../utils/mood';

export default function MoodGraphScreen() {
  const { currentUser } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
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

  const iconColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <Header name={`${firstName}'s`} activeTab="graph" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-5 pb-1">
          <TouchableOpacity
            onPress={goToPrevMonth}
            activeOpacity={0.7}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 items-center justify-center shadow-sm"
          >
            <ChevronLeft size={16} color={iconColor} />
          </TouchableOpacity>

          <View>
            <Text className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {monthName} {selectedYear}
            </Text>
          </View>

          <TouchableOpacity
            onPress={goToNextMonth}
            disabled={!canGoNext}
            activeOpacity={0.7}
            style={{ opacity: canGoNext ? 1 : 0.3 }}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 items-center justify-center shadow-sm"
          >
            <ChevronRight size={16} color={iconColor} />
          </TouchableOpacity>
        </View>

        <View
          className="mx-4 mt-3 bg-white dark:bg-slate-900 rounded-2xl p-4"
          style={{ shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
        >
          <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Mood Activity
          </Text>

          {isLoading ? (
            <View style={{ height: 180, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={isDark ? '#475569' : '#cbd5e1'} />
            </View>
          ) : (
            <InsightsGraph
              dayData={dayData}
              totalEntries={totalEntries}
              monthName={monthName}
              isDark={isDark}
              resetKey={selectedYear * 100 + selectedMonth}
            />
          )}
        </View>

        <View className="flex-row mx-4 mt-3 gap-3">
          <View
            className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 items-center"
            style={{ shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
          >
            <View className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 items-center justify-center mb-2">
              <BookOpen size={14} color="#3b82f6" />
            </View>
            <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {totalEntries}
            </Text>
            <Text className="text-[10px] text-slate-400 mt-0.5">Entries</Text>
          </View>

          <View
            className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 items-center"
            style={{ shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
          >
            <View className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 items-center justify-center mb-2">
              <TrendingUp size={14} color="#f59e0b" />
            </View>
            <Text className="text-xl">
              {topMood ? MOOD_META[topMood].emoji : '—'}
            </Text>
            <Text className="text-[10px] text-slate-400 mt-0.5">
              {topMood ? MOOD_META[topMood].label : 'No mood'}
            </Text>
          </View>

          <View
            className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 items-center"
            style={{ shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
          >
            <View className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 items-center justify-center mb-2">
              <Flame size={14} color="#f97316" />
            </View>
            <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {streak}
            </Text>
            <Text className="text-[10px] text-slate-400 mt-0.5">Day streak</Text>
          </View>
        </View>

        {totalEntries > 0 && !isLoading && (
          <MoodBreakdown moodCounts={moodCounts} />
        )}

        {totalEntries === 0 && !isLoading && (
          <View
            className="mx-4 mt-3 bg-white dark:bg-slate-900 rounded-2xl p-8 items-center"
            style={{ shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
          >
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📊</Text>
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              No entries this month
            </Text>
            <Text className="text-xs text-slate-400 mt-1 text-center">
              Start journaling to see your mood insights here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
