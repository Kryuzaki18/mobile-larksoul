import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@ant-design/react-native';

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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
  entryDates?: string[];
  onDayPress?: (date: Date) => void;
}

export default function CalendarView({ entryDates = [], onDayPress }: CalendarViewProps) {
  const [current, setCurrent] = useState(() => new Date());

  const year = current.getFullYear();
  const month = current.getMonth();

  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const todayDay = now.getDate();

  const entrySet = new Set(entryDates);

  const cells = buildCalendarCells(year, month);
  const rows: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const getDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <View className="bg-white rounded-2xl mx-4 mt-4 p-4">

      {/* Month navigation */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          className="p-2"
          onPress={() => setCurrent(new Date(year, month - 1, 1))}
        >
          <Icon name="left" size={16} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-base font-semibold text-slate-800">
          {MONTH_NAMES[month]} {year}
        </Text>
        <TouchableOpacity
          className="p-2"
          onPress={() => setCurrent(new Date(year, month + 1, 1))}
        >
          <Icon name="right" size={16} color="#1e293b" />
        </TouchableOpacity>
      </View>

      {/* Day-of-week headers */}
      <View className="flex-row mb-1">
        {WEEK_DAYS.map((d, i) => (
          <View key={i} className="flex-1 items-center py-1">
            <Text className="text-xs text-gray-400 font-medium">{d}</Text>
          </View>
        ))}
      </View>

      {/* Calendar rows */}
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} className="flex-row">
          {row.map((cell, colIdx) => {
            const isToday = isCurrentMonth && cell.type === 'current' && cell.day === todayDay;
            const hasEntry = cell.type === 'current' && entrySet.has(getDateStr(cell.day));

            return (
              <TouchableOpacity
                key={colIdx}
                className="flex-1 items-center py-0.5"
                onPress={() => {
                  if (cell.type === 'current') {
                    onDayPress?.(new Date(year, month, cell.day));
                  }
                }}
                activeOpacity={cell.type === 'current' ? 0.7 : 1}
              >
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    isToday ? 'bg-sky-200' : ''
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      isToday
                        ? 'text-blue-800 font-semibold'
                        : cell.type === 'current'
                        ? 'text-slate-700'
                        : 'text-gray-300'
                    }`}
                  >
                    {cell.day}
                  </Text>
                </View>
                <View className="h-2 items-center justify-center">
                  {(hasEntry || isToday) && (
                    <View className="w-1.5 h-1.5 rounded-full bg-blue-500" />
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
