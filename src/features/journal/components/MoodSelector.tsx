import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
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
  selected: Mood;
  onSelect: (mood: Mood) => void;
}

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-1 pb-1"
    >
      {MOODS.map(({ value, emoji, label }) => {
        const isActive = selected === value;
        return (
          <TouchableOpacity
            key={value}
            className={`items-center mx-1 px-3 py-2 rounded-xl ${isActive ? 'bg-blue-800' : 'bg-slate-50'}`}
            onPress={() => onSelect(value)}
            activeOpacity={0.75}
          >
            <Text className="text-2xl mb-1">{emoji}</Text>
            <Text className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
