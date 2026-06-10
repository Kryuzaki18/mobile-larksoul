import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { X, Plus } from 'lucide-react-native';

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
            <View key={tag} className="flex-row items-center bg-blue-50 rounded-full px-3 py-1">
              <Text className="text-xs text-blue-700 font-medium mr-1">{tag}</Text>
              <TouchableOpacity className="pl-0.5 py-0.5" onPress={() => remove(tag)}>
                <X size={11} color="#1d4ed8" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View className="flex-row items-center bg-slate-50 rounded-xl overflow-hidden border border-gray-100">
        <TextInput
          value={value}
          onChangeText={setValue}
          onSubmitEditing={commit}
          placeholder="Add a tag..."
          placeholderTextColor="#9ca3af"
          className="flex-1 px-3 py-2.5 text-sm text-slate-800"
          autoCapitalize="none"
          returnKeyType="done"
          maxLength={30}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          className="px-3 py-2.5"
          onPress={commit}
          disabled={!value.trim()}
        >
          <Plus size={18} color={value.trim() ? '#1e40af' : '#9ca3af'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
