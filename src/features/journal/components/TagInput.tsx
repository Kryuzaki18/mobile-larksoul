import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import { X } from 'lucide-react-native';

const MAX_TAGS = 3;
const MIN_CHARS = 2;
const MAX_CHARS = 15;

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [value, setValue] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isAtMax = tags.length >= MAX_TAGS;

  function commit(raw: string) {
    const tag = raw.trim().toLowerCase();
    if (tag.length < MIN_CHARS || isAtMax || tags.includes(`#${tag}`)) {
      setValue('');
      return;
    }
    onChange([...tags, `#${tag}`]);
    setValue('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }

  function handleChangeText(text: string) {
    const cleaned = text.replace(/,/g, '');
    if (cleaned.length >= MAX_CHARS) {
      commit(cleaned.slice(0, MAX_CHARS));
    } else {
      setValue(cleaned);
    }
  }

  function remove(tag: string) {
    onChange(tags.filter(t => t !== tag));
    inputRef.current?.focus();
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderRadius: 12,
        backgroundColor: isDark ? '#1e293b' : '#f8fafc',
        paddingHorizontal: 10,
        paddingVertical: 6,
        minHeight: 44,
      }}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
      >
        {tags.map(tag => (
          <View
            key={tag}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#eff6ff',
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: isDark ? '#60a5fa' : '#1d4ed8' }}>
              {tag}
            </Text>
            <TouchableOpacity onPress={() => remove(tag)} hitSlop={8}>
              <X size={10} color={isDark ? '#60a5fa' : '#3b82f6'} />
            </TouchableOpacity>
          </View>
        ))}

        {!isAtMax && (
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={handleChangeText}
            onSubmitEditing={() => commit(value)}
            placeholder={tags.length === 0 ? 'mood, travel, idea…' : ''}
            placeholderTextColor="#94a3b8"
            style={{
              fontSize: 14,
              color: isDark ? '#e2e8f0' : '#1e293b',
              minWidth: 120,
              paddingVertical: 2,
            }}
            autoCapitalize="none"
            returnKeyType="done"
            maxLength={MAX_CHARS}
            submitBehavior="submit"
          />
        )}
      </ScrollView>
    </TouchableOpacity>
  );
}
