import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../../utils/colors';

interface CalendarDayCellProps {
  day: number;
  type: 'prev' | 'current' | 'next';
  isToday: boolean;
  isSelected: boolean;
  hasEntry: boolean;
  isFuture: boolean;
  isDark: boolean;
  onPress: () => void;
}

export default function CalendarDayCell({
  day,
  type,
  isToday,
  isSelected,
  hasEntry,
  isFuture,
  isDark,
  onPress,
}: CalendarDayCellProps) {
  const isSelectable = type === 'current' && !isFuture;

  const cellBg = isSelected
    ? Colors.blue800
    : isToday
    ? isDark
      ? Colors.blue500_15
      : Colors.blue50
    : 'transparent';

  const textClass = `text-sm ${
    isSelected
      ? 'text-white font-bold'
      : isToday
      ? 'text-blue-700 dark:text-blue-400 font-bold'
      : isFuture
      ? 'text-gray-200 dark:text-slate-700'
      : type === 'current'
      ? 'text-slate-700 dark:text-slate-200'
      : 'text-gray-300 dark:text-slate-700'
  }`;

  return (
    <View className="flex-1 items-center py-0.5">
      <TouchableOpacity
        onPress={onPress}
        disabled={!isSelectable}
        activeOpacity={isSelectable ? 0.65 : 1}
        className="w-8 h-8 rounded-full overflow-hidden items-center justify-center"
        style={{ backgroundColor: cellBg }}
      >
        <Text className={textClass}>{day}</Text>
      </TouchableOpacity>
      <View className="h-1.5 items-center justify-center mt-0.5">
        {hasEntry && !isSelected && (
          <View className="w-1 h-1 rounded-full" style={{ backgroundColor: Colors.blue500 }} />
        )}
      </View>
    </View>
  );
}
