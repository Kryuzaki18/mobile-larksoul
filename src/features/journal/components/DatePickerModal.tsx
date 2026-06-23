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
import { Colors } from '../../../utils/themes';
import { useActiveTheme } from '../../../hooks/useActiveTheme';

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
  const theme = useActiveTheme();

  const [internalVisible, setInternalVisible] = useState(false);
  const [localSelected, setLocalSelected] = useState(selectedDate);
  const [jumpMonth, setJumpMonth] = useState<Date | undefined>();

  const backdropAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(SHEET_SLIDE)).current;

  useEffect(() => {
    if (visible) {
      setLocalSelected(selectedDate);
      setJumpMonth(selectedDate);
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
    setJumpMonth(today);
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
            backgroundColor: Colors.backdrop,
          }}
          onPress={handleClose}
        />
      </Animated.View>

      <Animated.View
        className="bg-white dark:bg-slate-900 rounded-tl-[28px] rounded-tr-[28px]"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          transform: [{ translateY: sheetAnim }],
          paddingBottom: insets.bottom + 8,
          shadowColor: Colors.black,
          shadowOpacity: 0.3,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: -6 },
          elevation: 16,
        }}
      >
        <View className="w-9 h-1 rounded-full bg-slate-200 dark:bg-slate-700 self-center my-3" />

        <View className="flex-row items-center justify-between px-5 pt-2.5 pb-3.5">
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <View
              className="w-8 h-8 rounded-[10px] items-center justify-center"
              style={{ backgroundColor: isDark ? theme._13 : theme[50] }}
            >
              <CalendarDays size={15} color={theme[500]} />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: isDark ? Colors.slate100 : Colors.slate950, letterSpacing: -0.3 }}>
                Select Date
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '500', color: Colors.slate500, marginTop: 2, letterSpacing: 0.1 }}>
                {formatSelected(localSelected)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleClose}
            activeOpacity={0.7}
            className="w-[34px] h-[34px] rounded-full items-center justify-center"
            style={{ backgroundColor: isDark ? Colors.slate800 : Colors.slate100 }}
          >
            <X size={15} color={isDark ? Colors.slate400 : Colors.slate500} />
          </TouchableOpacity>
        </View>

        <View className="h-px bg-slate-100 dark:bg-slate-800 mx-4 mb-1" />

        <CalendarView
          selectedDate={localSelected}
          onDayPress={date => setLocalSelected(date)}
          displayMonth={jumpMonth}
        />

        <View className="flex-row items-center justify-between px-5 pt-4" style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={handleToday}
            activeOpacity={0.75}
            disabled={isToday}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: isToday ? (isDark ? Colors.slate800 : Colors.slate200) : theme[500],
              alignItems: 'center',
              opacity: isToday ? 0.4 : 1,
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              letterSpacing: 0.1,
              color: isToday ? (isDark ? Colors.slate600 : Colors.slate400) : theme[500],
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
              backgroundColor: theme[800],
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Check size={14} color={Colors.white} strokeWidth={2.5} />
            <Text style={{ fontSize: 14, fontWeight: '700', letterSpacing: 0.1, color: Colors.white }}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}
