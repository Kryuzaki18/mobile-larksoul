import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import { X, CalendarDays, Check } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CalendarView from '../../home/components/CalendarView';
import { MONTH_NAMES } from '../../../utils/dateTime';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHEET_SLIDE = 420;

function formatSelected(date: Date): string {
  return `${DAY_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

interface DatePickerModalProps {
  visible: boolean;
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export default function DatePickerModal({
  visible,
  selectedDate,
  onSelect,
  onClose,
}: DatePickerModalProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [internalVisible, setInternalVisible] = useState(false);
  const [localSelected, setLocalSelected] = useState(selectedDate);

  const backdropAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(SHEET_SLIDE)).current;

  useEffect(() => {
    if (visible) {
      setLocalSelected(selectedDate);
      setInternalVisible(true);
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(backdropAnim, {
            toValue: 1,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.spring(sheetAnim, {
            toValue: 0,
            damping: 22,
            stiffness: 220,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [visible]);

  function dismiss(callback?: () => void) {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: SHEET_SLIDE,
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setInternalVisible(false);
      callback?.();
    });
  }

  function handleClose() {
    dismiss(onClose);
  }

  function handleDone() {
    dismiss(() => {
      onSelect(localSelected);
      onClose();
    });
  }

  function handleToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setLocalSelected(today);
  }

  const isToday = (() => {
    const now = new Date();
    return (
      localSelected.getFullYear() === now.getFullYear() &&
      localSelected.getMonth() === now.getMonth() &&
      localSelected.getDate() === now.getDate()
    );
  })();

  return (
    <Modal
      visible={internalVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View
        style={{ flex: 1, justifyContent: 'flex-end', opacity: backdropAnim }}
        pointerEvents="box-none"
      >
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.6)',
          }}
          onPress={handleClose}
        />
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          transform: [{ translateY: sheetAnim }],
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingBottom: insets.bottom + 8,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: -6 },
          elevation: 16,
        }}
      >
        <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <View style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: isDark ? '#334155' : '#e2e8f0',
          }} />
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 14,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: isDark ? '#1e40af22' : '#eff6ff',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CalendarDays size={15} color="#3b82f6" />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: isDark ? '#f1f5f9' : '#0f172a', letterSpacing: 0.2 }}>
                Select Date
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>
                {formatSelected(localSelected)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleClose}
            activeOpacity={0.7}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={15} color={isDark ? '#94a3b8' : '#64748b'} />
          </TouchableOpacity>
        </View>

        <View style={{
          height: 1,
          backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
          marginHorizontal: 16,
          marginBottom: 4,
        }} />

        <CalendarView
          selectedDate={localSelected}
          onDayPress={date => setLocalSelected(date)}
        />

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 16,
          gap: 12,
        }}>
          <TouchableOpacity
            onPress={handleToday}
            activeOpacity={0.75}
            disabled={isToday}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: isToday ? (isDark ? '#1e293b' : '#e2e8f0') : '#3b82f6',
              alignItems: 'center',
              opacity: isToday ? 0.4 : 1,
            }}
          >
            <Text style={{
              fontSize: 13,
              fontWeight: '600',
              color: isToday ? (isDark ? '#475569' : '#94a3b8') : '#3b82f6',
            }}>
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDone}
            activeOpacity={0.85}
            style={{
              flex: 2,
              paddingVertical: 12,
              borderRadius: 14,
              backgroundColor: '#1e40af',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Check size={14} color="#ffffff" strokeWidth={2.5} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#ffffff' }}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}
