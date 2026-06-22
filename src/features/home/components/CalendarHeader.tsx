import React from 'react';
import { View, Text } from 'react-native';
import { MONTH_NAMES } from '../../../utils/dateTime';
import { PrevButton, NextButton } from '../../commons/Button';

interface CalendarHeaderProps {
  year: number;
  month: number;
  isCurrentMonth: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function CalendarHeader({ year, month, isCurrentMonth, onPrev, onNext }: CalendarHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
      <PrevButton onPress={onPrev} />
      <Text className="text-sm font-bold text-slate-800 dark:text-slate-100">
        {MONTH_NAMES[month]} {year}
      </Text>
      <NextButton onPress={onNext} disabled={isCurrentMonth} />
    </View>
  );
}
