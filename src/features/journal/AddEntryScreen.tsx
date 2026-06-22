import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
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
import { Calendar } from 'lucide-react-native';
import BackButton from '../commons/Button';
import { useColorScheme } from 'nativewind';
import type { RootStackParamList } from '../../models/types/navigation.type';
import type { Mood } from '../../models/interfaces/users.interface';
import { createEntry, updateEntry, getEntryById } from '../../database/functions/journal';
import { useAuthStore } from '../../store/authStore';
import { formatEntryDate, toDateStr, parseDateStr } from '../../utils/dateTime';
import { Colors } from '../../utils/themes';
import { useActiveTheme } from '../../hooks/useActiveTheme';
import MoodSelector from './components/MoodSelector';
import TagInput from './components/TagInput';
import DatePickerModal from './components/DatePickerModal';
import SectionHeader from './components/SectionHeader';

const TYPE = {
  screenTitle: { fontSize: 16, fontWeight: '700' as const, letterSpacing: -0.3 },
  screenDate:  { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.1 },
  saveBtn:     { fontSize: 14, fontWeight: '700' as const, letterSpacing: 0.1 },
  label:       { fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.5 },
  counter:     { fontSize: 11, fontWeight: '500' as const },
  inputTitle:  { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.5 },
  inputBody:   { fontSize: 15, fontWeight: '400' as const, lineHeight: 26, letterSpacing: 0.15 },
  error:       { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.1 },
} as const;

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddEntry'>;
type Route = RouteProp<RootStackParamList, 'AddEntry'>;

const SECTION_COUNT = 4;

const INPUT_CONTAINER_BASE = {
  borderWidth: 1.5,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
} as const;

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
  const theme = useActiveTheme();
  const contentRef = useRef<TextInput>(null);
  const canSave = title.trim().length >= 2 && content.trim().length >= 7;

  const placeholderColor = isDark ? Colors.slate600 : Colors.slate400;

  const sectionAnims = useRef(
    Array.from({ length: SECTION_COUNT }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(18),
    })),
  ).current;

  const titleFocusAnim = useRef(new Animated.Value(0)).current;
  const contentFocusAnim = useRef(new Animated.Value(0)).current;

  const saveScale = useRef(new Animated.Value(1)).current;
  const saveReadyAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(
      70,
      sectionAnims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
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

  const animateFocus = useCallback((anim: Animated.Value, focused: boolean) => {
    Animated.timing(anim, {
      toValue: focused ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  const pulseSave = useCallback(() => {
    Animated.sequence([
      Animated.spring(saveScale, { toValue: 0.93, useNativeDriver: true, damping: 15, stiffness: 300 }),
      Animated.spring(saveScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 200 }),
    ]).start();
  }, [saveScale]);

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

  const handleSave = useCallback(async () => {
    if (!canSave || saving) return;
    pulseSave();
    setSaving(true);
    setError(null);
    try {
      if (entryId) {
        await updateEntry(entryId, { title: title.trim(), content: content.trim(), moods, tags });
        navigation.goBack();
      } else {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const createdAt = `${date}T${h}:${m}:${s}`;
        await createEntry({
          userId: currentUser?.id ?? '',
          title: title.trim(),
          content: content.trim(),
          moods,
          tags,
          createdAt,
        });
        navigation.navigate('Home', { returnDate: date });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save. Please try again.');
      setSaving(false);
    }
  }, [canSave, saving, entryId, title, content, moods, tags, date, currentUser, navigation, pulseSave]);

  const titleBorderColor = titleFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? Colors.slate700 : Colors.slate200, theme[500]],
  });
  const contentBorderColor = contentFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? Colors.slate700 : Colors.slate200, theme[500]],
  });
  const saveBg = saveReadyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? Colors.slate800 : Colors.slate100, theme[800]],
  });
  const saveTextColor = saveReadyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? Colors.slate600 : Colors.slate400, Colors.white],
  });

  function sectionStyle(i: number) {
    return {
      opacity: sectionAnims[i].opacity,
      transform: [{ translateY: sectionAnims[i].translateY }],
    };
  }

  const cardStyle = useMemo(() => ({
    backgroundColor: isDark ? Colors.slate900 : Colors.white,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOpacity: isDark ? 0.2 : 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  }), [isDark]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-100 dark:bg-slate-950"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-row items-center justify-between px-4 pt-3 pb-2.5 bg-slate-100 dark:bg-slate-950">
        <BackButton />

        <View style={{ alignItems: 'center' }}>
          <Text style={{ ...TYPE.screenTitle, color: isDark ? Colors.slate100 : Colors.slate900 }}>
            {entryId ? 'Edit Entry' : 'New Entry'}
          </Text>
          {entryId ? (
            <Text style={{ ...TYPE.screenDate, color: Colors.slate500, marginTop: 2 }}>
              {formatEntryDate(date)}
            </Text>
          ) : (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 4 }}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.65}
            >
              <Calendar size={10} color={Colors.slate500} />
              <Text style={{ ...TYPE.screenDate, color: Colors.slate500 }}>
                {formatEntryDate(date)}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Animated.View style={{ transform: [{ scale: saveScale }] }}>
          <TouchableOpacity onPress={handleSave} disabled={!canSave || saving} activeOpacity={0.85}>
            <Animated.View style={{
              paddingHorizontal: 20,
              paddingVertical: 9,
              borderRadius: 20,
              backgroundColor: saveBg,
              minWidth: 68,
              alignItems: 'center',
            }}>
              {saving
                ? <ActivityIndicator size="small" color={canSave ? Colors.white : Colors.slate500} />
                : <Animated.Text style={{ ...TYPE.saveBtn, color: saveTextColor }}>Save</Animated.Text>
              }
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 48 }}
      >
        <Animated.View style={[cardStyle, sectionStyle(0)]}>
          <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 }}>
            <SectionHeader label="HOW ARE YOU FEELING?" count={moods.length} max={3} />
            <MoodSelector selected={moods} onSelect={setMoods} />
          </View>
        </Animated.View>

        <Animated.View style={[cardStyle, sectionStyle(1)]}>
          <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 }}>
            <SectionHeader
              label="TITLE"
              required
              count={title.length}
              max={30}
              warn={title.length > 0 && title.trim().length < 2}
            />
            <Animated.View
              className="bg-slate-50 dark:bg-slate-800"
              style={{ ...INPUT_CONTAINER_BASE, borderColor: titleBorderColor }}
            >
              <TextInput
                value={title}
                onChangeText={setTitle}
                onFocus={() => animateFocus(titleFocusAnim, true)}
                onBlur={() => animateFocus(titleFocusAnim, false)}
                placeholder="Name this chapter of your day…"
                placeholderTextColor={placeholderColor}
                style={{ ...TYPE.inputTitle, color: isDark ? Colors.slate100 : Colors.slate900 }}
                maxLength={30}
                returnKeyType="next"
                onSubmitEditing={() => contentRef.current?.focus()}
                submitBehavior="submit"
              />
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.View style={[cardStyle, sectionStyle(2)]}>
          <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 }}>
            <SectionHeader
              label="THOUGHTS"
              required
              count={content.length}
              max={300}
              warn={content.length > 0 && content.trim().length < 7}
            />
            <Animated.View
              className="bg-slate-50 dark:bg-slate-800"
              style={{ ...INPUT_CONTAINER_BASE, borderColor: contentBorderColor }}
            >
              <TextInput
                ref={contentRef}
                value={content}
                onChangeText={setContent}
                onFocus={() => animateFocus(contentFocusAnim, true)}
                onBlur={() => animateFocus(contentFocusAnim, false)}
                placeholder="What's on your mind? This space is yours…"
                placeholderTextColor={placeholderColor}
                multiline
                textAlignVertical="top"
                style={{ ...TYPE.inputBody, color: isDark ? Colors.slate200 : Colors.slate800, minHeight: 148 }}
                scrollEnabled={false}
                maxLength={300}
              />
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.View style={[cardStyle, sectionStyle(3)]}>
          <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 }}>
            <SectionHeader label="TAGS" count={tags.length} max={3} />
            <TagInput tags={tags} onChange={setTags} />
          </View>
        </Animated.View>

        {error !== null && (
          <View style={{
            backgroundColor: isDark ? Colors.red500_10 : Colors.red50,
            borderWidth: 1,
            borderColor: isDark ? Colors.red500_20 : Colors.red200,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            marginTop: 4,
          }}>
            <Text style={{ ...TYPE.error, color: Colors.red500, textAlign: 'center' }}>
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
