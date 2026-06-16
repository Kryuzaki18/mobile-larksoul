import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { X, Hash } from 'lucide-react-native';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [value, setValue] = useState('');

  function commit() {
    const tag = value.trim().toLowerCase().replace(/^#+/, '');
    if (!tag || tags.includes(`#${tag}`)) {
      setValue('');
      return;
    }
    onChange([...tags, `#${tag}`]);
    setValue('');
  }

  function remove(tag: string) {
    onChange(tags.filter(t => t !== tag));
  }

  return (
    <View>
      {tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-3">
          {tags.map(tag => (
            <View key={tag} className="flex-row items-center gap-1 bg-blue-50 dark:bg-blue-500/10 rounded-full px-3 py-1.5">
              <Text className="text-xs font-semibold text-blue-700 dark:text-blue-400">{tag}</Text>
              <TouchableOpacity onPress={() => remove(tag)} hitSlop={8}>
                <X size={10} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View className="flex-row items-center rounded-xl border border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden">
        <View className="pl-3">
          <Hash size={14} color="#94a3b8" />
        </View>
        <TextInput
          value={value}
          onChangeText={setValue}
          onSubmitEditing={commit}
          placeholder="Add a tag…"
          placeholderTextColor="#94a3b8"
          className="flex-1 px-2 py-3 text-sm text-slate-800 dark:text-slate-100"
          autoCapitalize="none"
          returnKeyType="done"
          maxLength={30}
          blurOnSubmit={false}
        />
        {value.trim().length > 0 && (
          <TouchableOpacity className="px-3 py-3" onPress={commit}>
            <Text className="text-xs font-bold text-blue-700 dark:text-blue-400">Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
