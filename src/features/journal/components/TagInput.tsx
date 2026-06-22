import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import { X } from 'lucide-react-native';

import { Colors } from '../../../utils/colors';

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
        borderWidth: 1.5,
        borderColor: isDark ? Colors.slate700 : Colors.slate200,
        borderRadius: 12,
        backgroundColor: isDark ? Colors.slate800 : Colors.slate50,
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
              backgroundColor: isDark ? Colors.blue500_15 : Colors.blue50,
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', letterSpacing: 0.1, color: isDark ? Colors.blue400 : Colors.blue700 }}>
              {tag}
            </Text>
            <TouchableOpacity onPress={() => remove(tag)} hitSlop={8}>
              <X size={10} color={isDark ? Colors.blue400 : Colors.blue500} />
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
            placeholderTextColor={Colors.slate400}
            style={{
              fontSize: 14,
              fontWeight: '400',
              letterSpacing: 0.1,
              color: isDark ? Colors.slate200 : Colors.slate800,
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
