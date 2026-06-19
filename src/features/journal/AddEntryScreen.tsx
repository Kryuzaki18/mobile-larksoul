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
  Animated,
  Easing,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { ChevronLeft, Calendar } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import type { RootStackParamList } from '../../models/types/navigation.type';
import type { Mood } from '../../models/interfaces/users.model';
import { createEntry, updateEntry, getEntryById } from '../../database/functions/journal';
import { useAuthStore } from '../../store/authStore';
import { formatEntryDate, toDateStr } from '../../utils/dateTime';
import MoodSelector from './components/MoodSelector';
import TagInput from './components/TagInput';
import DatePickerModal from './components/DatePickerModal';

function parseDateStr(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddEntry'>;
type Route = RouteProp<RootStackParamList, 'AddEntry'>;

const SECTION_COUNT = 4;

export default function AddEntryScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const entryId = route.params?.entryId;
  const initialDate = route.params?.date ?? toDateStr(new Date());
  const { currentUser } = useAuthStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moods, setMoods] = useState<Mood[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => parseDateStr(initialDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const date = toDateStr(selectedDate);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const contentRef = useRef<TextInput>(null);
  const canSave = title.trim().length >= 2 && content.trim().length >= 7;

  // — Stagger mount animations —
  const sectionAnims = useRef(
    Array.from({ length: SECTION_COUNT }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(18),
    })),
  ).current;

  // — Focus border animations —
  const titleFocusAnim = useRef(new Animated.Value(0)).current;
  const contentFocusAnim = useRef(new Animated.Value(0)).current;

  // — Save button animation —
  const saveScale = useRef(new Animated.Value(1)).current;
  const saveReadyAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(
      70,
      sectionAnims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ),
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(saveReadyAnim, {
      toValue: canSave ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [canSave]);

  function animateFocus(anim: Animated.Value, focused: boolean) {
    Animated.timing(anim, {
      toValue: focused ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }

  function pulseSave() {
    Animated.sequence([
      Animated.spring(saveScale, { toValue: 0.93, useNativeDriver: true, damping: 15, stiffness: 300 }),
      Animated.spring(saveScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 200 }),
    ]).start();
  }

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
    pulseSave();
    setSaving(true);
    setError(null);
    try {
      if (entryId) {
        await updateEntry(entryId, { title: title.trim(), content: content.trim(), moods, tags });
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
          moods,
          tags,
          createdAt,
        });
      }
      navigation.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save. Please try again.');
      setSaving(false);
    }
  }

  const titleBorderColor = titleFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? '#334155' : '#e2e8f0', '#3b82f6'],
  });
  const contentBorderColor = contentFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? '#334155' : '#e2e8f0', '#3b82f6'],
  });
  const saveBg = saveReadyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? '#1e293b' : '#f1f5f9', '#1e40af'],
  });
  const saveTextColor = saveReadyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? '#475569' : '#94a3b8', '#ffffff'],
  });

  function sectionStyle(i: number) {
    return {
      opacity: sectionAnims[i].opacity,
      transform: [{ translateY: sectionAnims[i].translateY }],
    };
  }

  const cardStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.2 : 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  };

  const sectionLabelStyle = {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    color: '#64748b',
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDark ? '#020617' : '#f1f5f9' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 10,
        backgroundColor: isDark ? '#020617' : '#f1f5f9',
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <ChevronLeft size={18} color={isDark ? '#94a3b8' : '#475569'} />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: isDark ? '#f1f5f9' : '#0f172a', letterSpacing: 0.2 }}>
            {entryId ? 'Edit Entry' : 'New Entry'}
          </Text>
          {entryId ? (
            <Text style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{formatEntryDate(date)}</Text>
          ) : (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 4 }}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.65}
            >
              <Calendar size={10} color="#64748b" />
              <Text style={{ fontSize: 11, color: '#64748b' }}>{formatEntryDate(date)}</Text>
            </TouchableOpacity>
          )}
        </View>

        <Animated.View style={{ transform: [{ scale: saveScale }] }}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave || saving}
            activeOpacity={0.85}
          >
            <Animated.View style={{
              paddingHorizontal: 18,
              paddingVertical: 9,
              borderRadius: 20,
              backgroundColor: saveBg,
              minWidth: 64,
              alignItems: 'center',
            }}>
              {saving ? (
                <ActivityIndicator size="small" color={canSave ? '#ffffff' : '#64748b'} />
              ) : (
                <Animated.Text style={{ fontSize: 13, fontWeight: '700', color: saveTextColor }}>
                  Save
                </Animated.Text>
              )}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 48 }}
      >
        {/* Feeling */}
        <Animated.View style={[cardStyle, sectionStyle(0)]}>
          <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Text style={sectionLabelStyle}>HOW ARE YOU FEELING?</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: moods.length >= 3 ? '#f59e0b' : '#64748b' }}>
                {moods.length}/3
              </Text>
            </View>
            <MoodSelector selected={moods} onSelect={setMoods} />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={[cardStyle, sectionStyle(1)]}>
          <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={sectionLabelStyle}>
                <Text style={{ color: '#ef4444' }}>* </Text>TITLE
              </Text>
              <Text style={{
                fontSize: 11,
                fontWeight: '600',
                color: title.trim().length < 2 ? '#ef4444' : title.length >= 27 ? '#f59e0b' : '#64748b',
              }}>
                {title.length}/30
              </Text>
            </View>
            <Animated.View style={{
              borderWidth: 1.5,
              borderColor: titleBorderColor,
              borderRadius: 12,
              backgroundColor: isDark ? '#1e293b' : '#f8fafc',
              paddingHorizontal: 14,
              paddingVertical: 11,
            }}>
              <TextInput
                value={title}
                onChangeText={setTitle}
                onFocus={() => animateFocus(titleFocusAnim, true)}
                onBlur={() => animateFocus(titleFocusAnim, false)}
                placeholder="Name this chapter of your day…"
                placeholderTextColor={isDark ? '#334155' : '#cbd5e1'}
                style={{ fontSize: 18, fontWeight: '700', color: isDark ? '#f1f5f9' : '#0f172a' }}
                maxLength={30}
                returnKeyType="next"
                onSubmitEditing={() => contentRef.current?.focus()}
                submitBehavior="submit"
              />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Thoughts */}
        <Animated.View style={[cardStyle, sectionStyle(2)]}>
          <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={sectionLabelStyle}>
                <Text style={{ color: '#ef4444' }}>* </Text>THOUGHTS
              </Text>
              <Text style={{
                fontSize: 11,
                fontWeight: '600',
                color: content.trim().length < 7 ? '#ef4444' : content.length >= 255 ? '#f59e0b' : '#64748b',
              }}>
                {content.length}/300
              </Text>
            </View>
            <Animated.View style={{
              borderWidth: 1.5,
              borderColor: contentBorderColor,
              borderRadius: 12,
              backgroundColor: isDark ? '#1e293b' : '#f8fafc',
              paddingHorizontal: 14,
              paddingVertical: 11,
            }}>
              <TextInput
                ref={contentRef}
                value={content}
                onChangeText={setContent}
                onFocus={() => animateFocus(contentFocusAnim, true)}
                onBlur={() => animateFocus(contentFocusAnim, false)}
                placeholder="What's on your mind? This space is yours…"
                placeholderTextColor={isDark ? '#334155' : '#cbd5e1'}
                multiline
                textAlignVertical="top"
                style={{ fontSize: 15, lineHeight: 24, color: isDark ? '#e2e8f0' : '#1e293b', minHeight: 148 }}
                scrollEnabled={false}
                maxLength={300}
              />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Tags */}
        <Animated.View style={[cardStyle, sectionStyle(3)]}>
          <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={sectionLabelStyle}>TAGS</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: tags.length >= 3 ? '#f59e0b' : '#64748b' }}>
                {tags.length}/3
              </Text>
            </View>
            <TagInput tags={tags} onChange={setTags} />
          </View>
        </Animated.View>

        {error !== null && (
          <View style={{
            backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(239,68,68,0.2)' : '#fecaca',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            marginTop: 4,
          }}>
            <Text style={{ fontSize: 12, color: '#ef4444', textAlign: 'center', fontWeight: '500' }}>
              {error}
            </Text>
          </View>
        )}
      </ScrollView>

      <DatePickerModal
        visible={showDatePicker}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        onClose={() => setShowDatePicker(false)}
      />
    </KeyboardAvoidingView>
  );
}
