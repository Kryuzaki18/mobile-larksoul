import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import type { RootStackParamList } from '../../models/types/navigation.type';
import type { Mood } from '../../models/interfaces/users.model';
import { createEntry } from '../../database/functions/journal';
import { useAuthStore } from '../../store/authStore';
import MoodSelector from './components/MoodSelector';
import TagInput from './components/TagInput';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddEntry'>;
type Route = RouteProp<RootStackParamList, 'AddEntry'>;

const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function formatEntryDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[month - 1]} ${String(day).padStart(2, '0')} ${year}`;
}

export default function AddEntryScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const date = route.params?.date ?? new Date().toISOString().slice(0, 10);
  const { currentUser } = useAuthStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('neutral');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contentRef = useRef<TextInput>(null);
  const canSave = title.trim().length > 0 && content.trim().length > 0;

  async function handleSave() {
    if (!canSave || saving) return;
    setSaving(true);
    setError(null);
    try {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const createdAt = new Date(`${date}T${h}:${m}:${s}`).toISOString();
      const preview = content.trim().replace(/\n+/g, ' ').slice(0, 150);

      await createEntry({
        userId: currentUser?.id ?? '',
        title: title.trim(),
        content: content.trim(),
        preview,
        mood,
        tags,
        hasImage: false,
        createdAt,
      });

      navigation.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save. Please try again.');
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-row items-center justify-between px-4 pt-3 pb-3 bg-white border-b border-gray-100">
        <TouchableOpacity className="p-1.5 -ml-1" onPress={() => navigation.goBack()}>
          <ChevronLeft size={22} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-slate-800">New Entry</Text>
        <TouchableOpacity
          className={`px-4 py-1.5 rounded-full overflow-hidden ${canSave ? 'bg-blue-800' : 'bg-gray-100'}`}
          onPress={handleSave}
          disabled={!canSave || saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className={`text-sm font-semibold ${canSave ? 'text-white' : 'text-gray-400'}`}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-4 pt-4 pb-10"
      >
        <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-4 ml-1">
          {formatEntryDate(date)}
        </Text>

        <View className="bg-white rounded-2xl px-4 pt-4 pb-3 mb-3">
          <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">
            HOW ARE YOU FEELING?
          </Text>
          <MoodSelector selected={mood} onSelect={setMood} />
        </View>

        <View className="bg-white rounded-2xl px-4 py-3.5 mb-3">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Give your entry a title..."
            placeholderTextColor="#9ca3af"
            className="text-xl font-bold text-slate-800"
            maxLength={120}
            returnKeyType="next"
            onSubmitEditing={() => contentRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>

        <View className="bg-white rounded-2xl px-4 pt-3.5 pb-4 mb-3">
          <TextInput
            ref={contentRef}
            value={content}
            onChangeText={setContent}
            placeholder="Write your thoughts..."
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
            className="text-sm text-slate-700 min-h-36"
            scrollEnabled={false}
          />
        </View>

        <View className="bg-white rounded-2xl px-4 py-4 mb-3">
          <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">
            TAGS
          </Text>
          <TagInput tags={tags} onChange={setTags} />
        </View>

        {error !== null && (
          <Text className="text-red-500 text-sm text-center mt-1">{error}</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
