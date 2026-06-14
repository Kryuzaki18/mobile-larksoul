import React, { useRef, useState, useEffect } from 'react';
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
import { createEntry, updateEntry, getEntryById } from '../../database/functions/journal';
import { useAuthStore } from '../../store/authStore';
import MoodSelector from './components/MoodSelector';
import TagInput from './components/TagInput';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddEntry'>;
type Route = RouteProp<RootStackParamList, 'AddEntry'>;

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatEntryDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[month - 1]} ${String(day).padStart(2, '0')} · ${year}`;
}

export default function AddEntryScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const entryId = route.params?.entryId;
  const date = route.params?.date ?? new Date().toISOString().slice(0, 10);
  const { currentUser } = useAuthStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moods, setMoods] = useState<Mood[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contentRef = useRef<TextInput>(null);
  const canSave = title.trim().length > 0 && content.trim().length > 0;

  useEffect(() => {
    if (!entryId) return;
    getEntryById(entryId).then(entry => {
      if (!entry) return;
      setTitle(entry.title);
      setContent(entry.content);
      setMoods(entry.moods);
      setTags(entry.tags);
    }).catch(console.error);
  }, [entryId]);

  async function handleSave() {
    if (!canSave || saving) return;
    setSaving(true);
    setError(null);
    try {
      const preview = content.trim().replace(/\n+/g, ' ');
      if (entryId) {
        await updateEntry(entryId, { title: title.trim(), content: content.trim(), preview, moods, tags });
      } else {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const createdAt = new Date(`${date}T${h}:${m}:${s}`).toISOString();
        await createEntry({
          userId: currentUser?.id ?? '',
          title: title.trim(),
          content: content.trim(),
          preview,
          moods,
          tags,
          hasImage: false,
          createdAt,
        });
      }
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
      <View className="flex-row items-center justify-between px-4 pt-3 pb-3 bg-slate-50">
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-white items-center justify-center"
          style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={18} color="#1e293b" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-sm font-bold text-slate-800">
            {entryId ? 'Edit Entry' : 'New Entry'}
          </Text>
          <Text className="text-xs text-gray-400">{formatEntryDate(date)}</Text>
        </View>

        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${canSave ? 'bg-blue-800' : 'bg-gray-100'}`}
          onPress={handleSave}
          disabled={!canSave || saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator size="small" color={canSave ? '#ffffff' : '#9ca3af'} />
          ) : (
            <Text className={`text-xs font-bold ${canSave ? 'text-white' : 'text-gray-400'}`}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 }}
      >
        <View className="bg-white rounded-2xl px-4 pt-4 pb-3 mb-3">
          <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">
            HOW ARE YOU FEELING?
          </Text>
          <MoodSelector selected={moods} onSelect={setMoods} />
        </View>

        <View className="bg-white rounded-2xl px-4 py-4 mb-3">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#cbd5e1"
            className="text-xl font-bold text-slate-800"
            maxLength={120}
            returnKeyType="next"
            onSubmitEditing={() => contentRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>

        <View className="bg-white rounded-2xl px-4 pt-4 pb-5 mb-3">
          <TextInput
            ref={contentRef}
            value={content}
            onChangeText={setContent}
            placeholder="Write your thoughts…"
            placeholderTextColor="#cbd5e1"
            multiline
            textAlignVertical="top"
            className="text-sm text-slate-700 leading-relaxed"
            style={{ minHeight: 140 }}
            scrollEnabled={false}
            maxLength={1000}
          />
        </View>

        <View className="bg-white rounded-2xl px-4 py-4 mb-3">
          <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">TAGS</Text>
          <TagInput tags={tags} onChange={setTags} />
        </View>

        {error !== null && (
          <Text className="text-red-500 text-xs text-center mt-1">{error}</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
