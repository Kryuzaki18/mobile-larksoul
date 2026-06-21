import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
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

import { useHomeState } from '../../hooks/useHomeState';
import { useJournalViewStore } from '../../store/journalViewStore';
import { formatDateLabel, formatDateStrLabel, toDateStr } from '../../utils/dateTime';
import { useAuthStore } from '../../store/authStore';

import type { RootStackParamList } from '../../models/types/navigation.type';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { currentUser } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { layout, setLayout, showAll, toggleAll } = useJournalViewStore();

  const userId = currentUser?.id ?? '';
  const {
    selectedDate,
    setSelectedDate,
    entryDates,
    entriesForDay,
    groupedEntries,
    isLoading,
    refetch,
  } = useHomeState(userId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const allEntriesOffsetY = useRef(0);
  const groupYOffsetsRef = useRef<{ date: string; y: number }[]>([]);
  const controlsBarHeightRef = useRef(0);
  const [visibleDate, setVisibleDate] = useState('');

  useEffect(() => {
    groupYOffsetsRef.current = [];
  }, [groupedEntries]);

  useEffect(() => {
    if (showAll && groupedEntries.length > 0) {
      setVisibleDate(groupedEntries[0].date);
    }
  }, [showAll, groupedEntries]);

  const handleGroupLayout = useCallback((date: string, relativeY: number) => {
    const absoluteY = allEntriesOffsetY.current + relativeY;
    const existing = groupYOffsetsRef.current.filter(g => g.date !== date);
    groupYOffsetsRef.current = [...existing, { date, y: absoluteY }].sort(
      (a, b) => a.y - b.y,
    );
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!showAll) return;
      const y = e.nativeEvent.contentOffset.y;
      const offsets = groupYOffsetsRef.current;
      if (offsets.length === 0) return;

      let current = offsets[0].date;
      for (const offset of offsets) {
        if (offset.y <= y + controlsBarHeightRef.current) {
          current = offset.date;
        } else {
          break;
        }
      }
      setVisibleDate(prev => (prev !== current ? current : prev));
    },
    [showAll],
  );

  const firstName = currentUser?.name?.split(' ')[0] ?? 'Your';
  const dateLabel =
    showAll && visibleDate
      ? formatDateStrLabel(visibleDate)
      : formatDateLabel(selectedDate);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <Header name={`${firstName}'s`} subtitle="Journal" activeTab="home" />

      <View className="flex-1">
        {isLoading ? (
          <HomeLoader />
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[1]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <CalendarView
              entryDates={entryDates}
              selectedDate={selectedDate}
              onDayPress={setSelectedDate}
            />

            <View
              onLayout={(e) => {
                controlsBarHeightRef.current = e.nativeEvent.layout.height;
              }}
            >
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
              <View
                onLayout={(e) => {
                  allEntriesOffsetY.current = e.nativeEvent.layout.y;
                }}
              >
                <AllEntriesView
                  groups={groupedEntries}
                  layout={layout}
                  refetch={refetch}
                  onGroupLayout={handleGroupLayout}
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
          onPress={() =>
            navigation.navigate('AddEntry', { date: toDateStr(selectedDate) })
          }
        >
          <Plus size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
