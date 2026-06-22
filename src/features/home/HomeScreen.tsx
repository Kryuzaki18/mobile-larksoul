import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, ChevronUp } from 'lucide-react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

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
import { useAuthStore } from '../../store/authStore';
import { toDateStr } from '../../utils/dateTime';
import type { RootStackParamList } from '../../models/types/navigation.type';
import { Colors } from '../../utils/themes';
import { useActiveTheme } from '../../hooks/useActiveTheme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type Route = RouteProp<RootStackParamList, 'Home'>;

const MONTH_LOADER_DURATION_MS = 300;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { currentUser } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useActiveTheme();

  const { layout, setLayout, showAll, toggleAll } = useJournalViewStore();
  const userId = currentUser?.id ?? '';
  const {
    selectedDate,
    setSelectedDate,
    entryDates,
    entriesForDay,
    groupedEntriesForMonth,
    displayMonth,
    setDisplayMonth,
    isLoading,
    refetch,
  } = useHomeState(userId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    const returnDate = route.params?.returnDate;
    if (!returnDate) return;
    const [year, month, day] = returnDate.split('-').map(Number);
    setSelectedDate(new Date(year, month - 1, day));
    setDisplayMonth({ year, month: month - 1 });
  }, [route.params?.returnDate]);

  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMonthChanging, setIsMonthChanging] = useState(false);
  const isFirstMonthCall = useRef(true);
  const monthTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMonthChange = useCallback(
    (year: number, month: number) => {
      setDisplayMonth({ year, month });
      if (isFirstMonthCall.current) {
        isFirstMonthCall.current = false;
        return;
      }
      if (monthTimerRef.current) clearTimeout(monthTimerRef.current);
      setIsMonthChanging(true);
      monthTimerRef.current = setTimeout(
        () => setIsMonthChanging(false),
        MONTH_LOADER_DURATION_MS,
      );
    },
    [setDisplayMonth],
  );

  const calendarDisplayMonth = useMemo(
    () => new Date(displayMonth.year, displayMonth.month, 1),
    [displayMonth.year, displayMonth.month],
  );

  const filteredEntriesForDay = useMemo(() => {
    if (!searchQuery) return entriesForDay;
    const q = searchQuery.toLowerCase();
    return entriesForDay.filter(
      e =>
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q),
    );
  }, [entriesForDay, searchQuery]);

  const filteredGroupedEntriesForMonth = useMemo(() => {
    if (!searchQuery) return groupedEntriesForMonth;
    const q = searchQuery.toLowerCase();
    return groupedEntriesForMonth
      .map(group => ({
        ...group,
        items: group.items.filter(
          e =>
            e.title.toLowerCase().includes(q) ||
            e.content.toLowerCase().includes(q),
        ),
      }))
      .filter(group => group.items.length > 0);
  }, [groupedEntriesForMonth, searchQuery]);

  const firstName = currentUser?.name?.split(' ')[0] ?? 'Your';

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <Header name={`${firstName}'s`} activeTab="home" />

      <View className="flex-1">
        {isLoading ? (
          <HomeLoader />
        ) : (
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
          >
            <CalendarView
              entryDates={entryDates}
              selectedDate={selectedDate}
              onDayPress={setSelectedDate}
              onMonthChange={handleMonthChange}
              displayMonth={calendarDisplayMonth}
            />

            <ControlsBar
              showAll={showAll}
              onToggleAll={toggleAll}
              layout={layout}
              onLayoutChange={setLayout}
              isDark={isDark}
              onSearch={setSearchQuery}
            />

            {showAll ? (
              isMonthChanging ? (
                <HomeLoader />
              ) : (
                <AllEntriesView
                  groups={filteredGroupedEntriesForMonth}
                  layout={layout}
                  refetch={refetch}
                />
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

        <View className="absolute bottom-6 right-6 items-center gap-4">
          {scrollY > 150 && (
            <TouchableOpacity
              className="w-12 h-12 rounded-full items-center justify-center shadow-sm"
              style={{ backgroundColor: theme[800] }}
              onPress={() =>
                scrollViewRef.current?.scrollTo({ y: 0, animated: true })
              }
            >
              <ChevronUp size={22} color={Colors.white} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="w-14 h-14 rounded-full items-center justify-center shadow-sm"
            style={{ backgroundColor: theme[800] }}
            onPress={() =>
              navigation.navigate('AddEntry', { date: toDateStr(selectedDate) })
            }
          >
            <Plus size={26} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
