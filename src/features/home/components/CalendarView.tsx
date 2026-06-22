import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';
import { WEEK_DAYS } from '../../../utils/dateTime';
import { Colors } from '../../../utils/themes';
import CalendarHeader from './CalendarHeader';
import CalendarDayCell from './CalendarDayCell';

type DayCell = { day: number; type: 'prev' | 'current' | 'next' };

const SLIDE = 300;

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function buildCalendarCells(year: number, month: number): DayCell[] {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  const cells: DayCell[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, type: 'prev' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'current' });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay++, type: 'next' });
  }
  return cells;
}

interface CalendarViewProps {
  selectedDate?: Date;
  entryDates?: string[];
  onDayPress?: (date: Date) => void;
  onMonthChange?: (year: number, month: number) => void;
  displayMonth?: Date;
}

export default function CalendarView({ selectedDate, entryDates = [], onDayPress, onMonthChange, displayMonth }: CalendarViewProps) {
  const [current, setCurrent] = useState(() => new Date());
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(1)).current;

  const currentRef = useRef(current);
  useEffect(() => { currentRef.current = current; }, [current]);

  useEffect(() => {
    onMonthChange?.(current.getFullYear(), current.getMonth());
  }, [current]);

  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isCurrentMonth =
    current.getFullYear() === now.getFullYear() && current.getMonth() === now.getMonth();

  function navigate(dir: -1 | 1, next: Date) {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: dir * -SLIDE,
        duration: 170,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 130,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrent(next);
      slideAnim.setValue(dir * SLIDE);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 260,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  const navigateRef = useRef(navigate);
  useEffect(() => { navigateRef.current = navigate; });

  function prevMonth() {
    const c = currentRef.current;
    navigate(-1, new Date(c.getFullYear(), c.getMonth() - 1, 1));
  }

  function nextMonth() {
    const c = currentRef.current;
    const candidate = new Date(c.getFullYear(), c.getMonth() + 1, 1);
    const limit = new Date(now.getFullYear(), now.getMonth(), 1);
    if (candidate > limit) return;
    navigate(1, candidate);
  }

  const prevDisplayMonth = useRef<Date | undefined>(undefined);
  useEffect(() => {
    if (!displayMonth) return;
    if (
      prevDisplayMonth.current?.getFullYear() === displayMonth.getFullYear() &&
      prevDisplayMonth.current?.getMonth() === displayMonth.getMonth()
    ) return;
    prevDisplayMonth.current = displayMonth;
    const next = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1);
    const c = currentRef.current;
    const cFirst = new Date(c.getFullYear(), c.getMonth(), 1);
    if (next.getTime() === cFirst.getTime()) return;
    const dir = next > cFirst ? 1 : -1;
    navigateRef.current(dir, next);
  }, [displayMonth]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10,
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -50) {
          const c = currentRef.current;
          const candidate = new Date(c.getFullYear(), c.getMonth() + 1, 1);
          const limit = new Date(now.getFullYear(), now.getMonth(), 1);
          if (candidate <= limit) navigateRef.current(1, candidate);
        } else if (dx > 50) {
          const c = currentRef.current;
          navigateRef.current(-1, new Date(c.getFullYear(), c.getMonth() - 1, 1));
        }
      },
    }),
  ).current;

  const year     = current.getFullYear();
  const month    = current.getMonth();
  const todayDay = now.getDate();
  const entrySet = new Set(entryDates);

  const cells = buildCalendarCells(year, month);
  const rows: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const getDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <View
      className="bg-white dark:bg-slate-900 rounded-2xl mx-4 mt-4 pb-3"
      style={{ elevation: 1, shadowColor: Colors.black, shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}
      {...panResponder.panHandlers}
    >
      <CalendarHeader
        year={year}
        month={month}
        isCurrentMonth={isCurrentMonth}
        onPrev={prevMonth}
        onNext={nextMonth}
      />

      <View style={{ overflow: 'hidden' }}>
        <Animated.View style={{ transform: [{ translateX: slideAnim }], opacity: fadeAnim }}>
          <View className="flex-row px-2 mb-1">
            {WEEK_DAYS.map((d, i) => (
              <View key={i} className="flex-1 items-center py-1">
                <Text className="text-xs font-semibold text-gray-400">{d}</Text>
              </View>
            ))}
          </View>

          {rows.map((row, rowIdx) => (
            <View key={rowIdx} className="flex-row px-2">
              {row.map((cell, colIdx) => {
                const isToday    = isCurrentMonth && cell.type === 'current' && cell.day === todayDay;
                const isSelected =
                  cell.type === 'current' &&
                  !!selectedDate &&
                  selectedDate.toDateString() === new Date(year, month, cell.day).toDateString();
                const hasEntry   = cell.type === 'current' && entrySet.has(getDateStr(cell.day));
                const isFuture   = cell.type === 'current' && new Date(year, month, cell.day) > today;

                return (
                  <CalendarDayCell
                    key={colIdx}
                    day={cell.day}
                    type={cell.type}
                    isToday={isToday}
                    isSelected={isSelected}
                    hasEntry={hasEntry}
                    isFuture={isFuture}
                    isDark={isDark}
                    onPress={() => {
                      if (cell.type === 'current' && !isFuture) {
                        onDayPress?.(new Date(year, month, cell.day));
                      }
                    }}
                  />
                );
              })}
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}
