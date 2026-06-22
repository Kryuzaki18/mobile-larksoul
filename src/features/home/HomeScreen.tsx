import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Header from '../commons/Header';
import CalendarView from './components/CalendarView';
import ListView from './components/ListView';
import GridView from './components/GridView';
import EmptyEntry from './components/EmptyEntry';
import HomeLoader from './components/HomeLoader';
import ControlsBar from './components/ControlsBar';
import AllEntriesView from './components/AllEntriesView';

import { useScrollDateTracker } from '../../hooks/useScrollDateTracker';
import { useHomeState } from '../../hooks/useHomeState';
import { useJournalViewStore } from '../../store/journalViewStore';
import { useAuthStore } from '../../store/authStore';
import { formatDateLabel, formatDateStrLabel, toDateStr } from '../../utils/dateTime';
import type { RootStackParamList } from '../../models/types/navigation.type';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const MONTH_LOADER_DURATION_MS = 300;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { currentUser } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { layout, setLayout, showAll, toggleAll } = useJournalViewStore();
  const userId = currentUser?.id ?? '';
  const {
    selectedDate, setSelectedDate,
    entryDates, entriesForDay,
    groupedEntriesForMonth,
    setDisplayMonth,
    isLoading, refetch,
  } = useHomeState(userId);

  const { visibleDate, onGroupLayout, onScroll, onAllEntriesLayout, onControlsLayout } =
    useScrollDateTracker(showAll, groupedEntriesForMonth);

  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

  const [searchQuery, setSearchQuery] = useState('');
  const [isMonthChanging, setIsMonthChanging] = useState(false);
  const isFirstMonthCall = useRef(true);
  const monthTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMonthChange = useCallback((year: number, month: number) => {
    setDisplayMonth({ year, month });
    if (isFirstMonthCall.current) {
      isFirstMonthCall.current = false;
      return;
    }
    if (monthTimerRef.current) clearTimeout(monthTimerRef.current);
    setIsMonthChanging(true);
    monthTimerRef.current = setTimeout(() => setIsMonthChanging(false), MONTH_LOADER_DURATION_MS);
  }, [setDisplayMonth]);

  const filteredEntriesForDay = useMemo(() => {
    if (!searchQuery) return entriesForDay;
    const q = searchQuery.toLowerCase();
    return entriesForDay.filter(
      e => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q),
    );
  }, [entriesForDay, searchQuery]);

  const filteredGroupedEntriesForMonth = useMemo(() => {
    if (!searchQuery) return groupedEntriesForMonth;
    const q = searchQuery.toLowerCase();
    return groupedEntriesForMonth
      .map(group => ({
        ...group,
        items: group.items.filter(
          e => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q),
        ),
      }))
      .filter(group => group.items.length > 0);
  }, [groupedEntriesForMonth, searchQuery]);

  const firstName = currentUser?.name?.split(' ')[0] ?? 'Your';
  const dateLabel = showAll && visibleDate
    ? formatDateStrLabel(visibleDate)
    : formatDateLabel(selectedDate);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <Header name={`${firstName}'s`} activeTab="home" />

      <View className="flex-1">
        {isLoading ? (
          <HomeLoader />
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[1]}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            <CalendarView
              entryDates={entryDates}
              selectedDate={selectedDate}
              onDayPress={setSelectedDate}
              onMonthChange={handleMonthChange}
            />

            <View onLayout={(e) => onControlsLayout(e.nativeEvent.layout.height)}>
              <ControlsBar
                showAll={showAll}
                onToggleAll={toggleAll}
                layout={layout}
                onLayoutChange={setLayout}
                isDark={isDark}
                onSearch={setSearchQuery}
              />
            </View>

            {showAll ? (
              isMonthChanging ? (
                <HomeLoader />
              ) : (
                <View onLayout={(e) => onAllEntriesLayout(e.nativeEvent.layout.y)}>
                  <AllEntriesView
                    groups={filteredGroupedEntriesForMonth}
                    layout={layout}
                    refetch={refetch}
                    onGroupLayout={onGroupLayout}
                  />
                </View>
              )
            ) : filteredEntriesForDay.length > 0 ? (
              layout === 'list' ? (
                <ListView entries={filteredEntriesForDay} refetch={refetch} />
              ) : (
                <GridView entries={filteredEntriesForDay} refetch={refetch} />
              )
            ) : (
              <EmptyEntry />
            )}

            <View className="h-24" />
          </ScrollView>
        )}

        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-blue-800 items-center justify-center shadow-lg shadow-blue-900"
          onPress={() => navigation.navigate('AddEntry', { date: toDateStr(selectedDate) })}
        >
          <Plus size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
