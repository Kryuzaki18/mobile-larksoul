import React, { useCallback } from 'react';
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

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { currentUser } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { layout, setLayout, showAll, toggleAll } = useJournalViewStore();
  const userId = currentUser?.id ?? '';
  const { selectedDate, setSelectedDate, entryDates, entriesForDay, groupedEntries, isLoading, refetch } =
    useHomeState(userId);

  const { visibleDate, onGroupLayout, onScroll, onAllEntriesLayout, onControlsLayout } =
    useScrollDateTracker(showAll, groupedEntries);

  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

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
            />

            <View onLayout={(e) => onControlsLayout(e.nativeEvent.layout.height)}>
              <ControlsBar
                dateLabel={dateLabel}
                showAll={showAll}
                onToggleAll={toggleAll}
                layout={layout}
                onLayoutChange={setLayout}
                isDark={isDark}
              />
            </View>

            {showAll ? (
              <View onLayout={(e) => onAllEntriesLayout(e.nativeEvent.layout.y)}>
                <AllEntriesView
                  groups={groupedEntries}
                  layout={layout}
                  refetch={refetch}
                  onGroupLayout={onGroupLayout}
                />
              </View>
            ) : entriesForDay.length > 0 ? (
              layout === 'list' ? (
                <ListView entries={entriesForDay} refetch={refetch} />
              ) : (
                <GridView entries={entriesForDay} refetch={refetch} />
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
