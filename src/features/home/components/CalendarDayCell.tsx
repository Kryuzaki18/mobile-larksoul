import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useActiveTheme } from '../../../hooks/useActiveTheme';

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
  const theme = useActiveTheme();
  const isSelectable = type === 'current' && !isFuture;

  const cellBg = isSelected
    ? theme[800]
    : isToday
    ? isDark
      ? theme._15
      : theme[50]
    : 'transparent';

  const textClass = `text-sm ${
    isSelected
      ? 'text-white font-bold'
      : isToday
      ? 'font-bold'
      : isFuture
      ? 'text-gray-200 dark:text-slate-700'
      : type === 'current'
      ? 'text-slate-700 dark:text-slate-200'
      : 'text-gray-300 dark:text-slate-700'
  }`;

  const todayTextStyle = (!isSelected && isToday)
    ? { color: isDark ? theme[400] : theme[700] }
    : undefined;

  return (
    <View className="flex-1 items-center py-0.5">
      <TouchableOpacity
        onPress={onPress}
        disabled={!isSelectable}
        activeOpacity={isSelectable ? 0.65 : 1}
        className="w-8 h-8 rounded-full overflow-hidden items-center justify-center"
        style={{ backgroundColor: cellBg }}
      >
        <Text className={textClass} style={todayTextStyle}>{day}</Text>
      </TouchableOpacity>
      <View className="h-1.5 items-center justify-center mt-0.5">
        {hasEntry && !isSelected && (
          <View className="w-1 h-1 rounded-full" style={{ backgroundColor: theme[500] }} />
        )}
      </View>
    </View>
  );
}
