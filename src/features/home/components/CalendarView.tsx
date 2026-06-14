import React, { useRef, useState } from 'react';
import { PanResponder, View, Text, TouchableOpacity } from 'react-native';
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
}

export default function CalendarView({ selectedDate, entryDates = [], onDayPress }: CalendarViewProps) {
  const [current, setCurrent] = useState(() => new Date());

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10,
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -50) setCurrent(c => new Date(c.getFullYear(), c.getMonth() + 1, 1));
        else if (dx > 50) setCurrent(c => new Date(c.getFullYear(), c.getMonth() - 1, 1));
      },
    }),
  ).current;

  const year = current.getFullYear();
  const month = current.getMonth();
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const todayDay = now.getDate();
  const entrySet = new Set(entryDates);

  const cells = buildCalendarCells(year, month);
  const rows: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const getDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <View
      className="bg-white rounded-2xl mx-4 mt-4 pb-3"
      style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}
      {...panResponder.panHandlers}
    >
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <TouchableOpacity
          className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
          onPress={() => setCurrent(new Date(year, month - 1, 1))}
        >
          <ChevronLeft size={14} color="#475569" />
        </TouchableOpacity>
        <Text className="text-sm font-bold text-slate-800">
          {MONTH_NAMES[month]} {year}
        </Text>
        <TouchableOpacity
          className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
          onPress={() => setCurrent(new Date(year, month + 1, 1))}
        >
          <ChevronRight size={14} color="#475569" />
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

            return (
              <TouchableOpacity
                key={colIdx}
                className="flex-1 items-center py-0.5"
                onPress={() => cell.type === 'current' && onDayPress?.(new Date(year, month, cell.day))}
                activeOpacity={cell.type === 'current' ? 0.65 : 1}
              >
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    isSelected ? 'bg-blue-800' : isToday ? 'bg-blue-50' : ''
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      isSelected
                        ? 'text-white font-bold'
                        : isToday
                        ? 'text-blue-700 font-bold'
                        : cell.type === 'current'
                        ? 'text-slate-700'
                        : 'text-gray-300'
                    }`}
                  >
                    {cell.day}
                  </Text>
                </View>
                <View className="h-1.5 items-center justify-center mt-0.5">
                  {hasEntry && !isSelected && (
                    <View
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: '#3b82f6' }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}
