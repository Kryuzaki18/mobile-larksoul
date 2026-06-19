import React, { useEffect, useRef, useState } from 'react';
import { PanResponder, View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { MONTH_NAMES, WEEK_DAYS } from '../../../utils/dateTime';

type DayCell = { day: number; type: 'prev' | 'current' | 'next' };

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
  displayMonth?: Date;
}

export default function CalendarView({ selectedDate, entryDates = [], onDayPress, displayMonth }: CalendarViewProps) {
  const [current, setCurrent] = useState(() => new Date());

  useEffect(() => {
    if (displayMonth) {
      setCurrent(new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1));
    }
  }, [displayMonth]);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isCurrentMonth = current.getFullYear() === now.getFullYear() && current.getMonth() === now.getMonth();

  const goToNextMonth = () => {
    setCurrent(c => {
      if (c.getFullYear() === now.getFullYear() && c.getMonth() === now.getMonth()) return c;
      return new Date(c.getFullYear(), c.getMonth() + 1, 1);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10,
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -50) goToNextMonth();
        else if (dx > 50) setCurrent(c => new Date(c.getFullYear(), c.getMonth() - 1, 1));
      },
    }),
  ).current;

  const year = current.getFullYear();
  const month = current.getMonth();
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
      style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}
      {...panResponder.panHandlers}
    >
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <TouchableOpacity
          className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center"
          onPress={() => setCurrent(new Date(year, month - 1, 1))}
        >
          <ChevronLeft size={14} color={isDark ? '#cbd5e1' : '#475569'} />
        </TouchableOpacity>
        <Text className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {MONTH_NAMES[month]} {year}
        </Text>
        <TouchableOpacity
          className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center"
          onPress={goToNextMonth}
          disabled={isCurrentMonth}
          activeOpacity={isCurrentMonth ? 1 : 0.65}
        >
          <ChevronRight size={14} color={isCurrentMonth ? (isDark ? '#475569' : '#cbd5e1') : (isDark ? '#cbd5e1' : '#475569')} />
        </TouchableOpacity>
      </View>

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
            const isToday = isCurrentMonth && cell.type === 'current' && cell.day === todayDay;
            const isSelected =
              cell.type === 'current' &&
              !!selectedDate &&
              selectedDate.toDateString() === new Date(year, month, cell.day).toDateString();
            const hasEntry = cell.type === 'current' && entrySet.has(getDateStr(cell.day));
            const isFuture = cell.type === 'current' && new Date(year, month, cell.day) > today;
            const isSelectable = cell.type === 'current' && !isFuture;

            return (
              <View key={colIdx} className="flex-1 items-center py-0.5">
                <TouchableOpacity
                  onPress={() => isSelectable && onDayPress?.(new Date(year, month, cell.day))}
                  disabled={!isSelectable}
                  activeOpacity={isSelectable ? 0.65 : 1}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected ? '#1e40af' : isToday ? (isDark ? 'rgba(59,130,246,0.15)' : '#eff6ff') : 'transparent',
                  }}
                >
                  <Text
                    className={`text-sm ${
                      isSelected
                        ? 'text-white font-bold'
                        : isToday
                        ? 'text-blue-700 dark:text-blue-400 font-bold'
                        : isFuture
                        ? 'text-gray-200 dark:text-slate-700'
                        : cell.type === 'current'
                        ? 'text-slate-700 dark:text-slate-200'
                        : 'text-gray-300 dark:text-slate-700'
                    }`}
                  >
                    {cell.day}
                  </Text>
                </TouchableOpacity>
                <View className="h-1.5 items-center justify-center mt-0.5">
                  {hasEntry && !isSelected && (
                    <View
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: '#3b82f6' }}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
