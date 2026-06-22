import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import type { Mood } from '../../../models/interfaces/users.interface';
import { MOOD_META } from '../../../utils/mood';
import { Colors } from '../../../utils/colors';

const MAX_MOODS = 3;

const MOODS = (Object.keys(MOOD_META) as Mood[]).map(value => ({
  value,
  ...MOOD_META[value],
}));

interface MoodSelectorProps {
  selected: Mood[];
  onSelect: (moods: Mood[]) => void;
}

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isMaxed = selected.length >= MAX_MOODS;

  function toggle(value: Mood) {
    if (selected.includes(value)) {
      onSelect(selected.filter(m => m !== value));
    } else if (!isMaxed) {
      onSelect([...selected, value]);
    }
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
    >
      {MOODS.map(({ value, emoji, label }) => {
        const isActive = selected.includes(value);
        const isDisabled = isMaxed && !isActive;
        return (
          <TouchableOpacity
            key={value}
            onPress={() => toggle(value)}
            activeOpacity={isDisabled ? 1 : 0.75}
            disabled={isDisabled}
            style={{
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 16,
              backgroundColor: isActive ? Colors.blue900 : isDark ? Colors.slate800 : Colors.slate50,
              borderWidth: 1.5,
              borderColor: isActive ? Colors.blue800 : isDark ? Colors.slate700 : Colors.slate100,
              minWidth: 66,
              opacity: isDisabled ? 0.35 : 1,
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 4 }}>{emoji}</Text>
            <Text style={{
              fontSize: 10,
              fontWeight: '700',
              color: isActive ? Colors.white : isDark ? Colors.slate500 : Colors.slate400,
              letterSpacing: 1,
            }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
