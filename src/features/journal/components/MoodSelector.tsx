import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import type { Mood } from '../../../models/interfaces/users.model';

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'grateful', emoji: '🙏', label: 'Grateful' },
  { value: 'excited', emoji: '🎉', label: 'Excited' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'reflective', emoji: '🤔', label: 'Reflective' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
];

interface MoodSelectorProps {
  selected: Mood[];
  onSelect: (moods: Mood[]) => void;
}

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  function toggle(value: Mood) {
    onSelect(
      selected.includes(value)
        ? selected.filter(m => m !== value)
        : [...selected, value],
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
    >
      {MOODS.map(({ value, emoji, label }) => {
        const isActive = selected.includes(value);
        return (
          <TouchableOpacity
            key={value}
            onPress={() => toggle(value)}
            activeOpacity={0.75}
            style={{
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 16,
              backgroundColor: isActive ? '#1e3a8a' : '#f8fafc',
              borderWidth: 1.5,
              borderColor: isActive ? '#1e40af' : '#f1f5f9',
              minWidth: 66,
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 4 }}>{emoji}</Text>
            <Text style={{
              fontSize: 10,
              fontWeight: '600',
              color: isActive ? '#ffffff' : '#94a3b8',
              letterSpacing: 0.3,
            }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
