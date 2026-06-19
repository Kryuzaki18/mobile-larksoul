import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  PanResponder,
} from 'react-native';
import { Clock, Pencil, Trash2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import type { JournalEntry } from '../../../models/interfaces/users.model';
import { formatTimeOnly } from '../../../utils/dateTime';
import { MOOD_META } from '../../../utils/mood';

interface JournalCardProps {
  entry: JournalEntry;
  index?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
}

const ACTION_WIDTH = 140;
const SWIPE_THRESHOLD = 60;

export default function JournalCard({
  entry,
  index = 0,
  onEdit,
  onDelete,
  onPress,
}: JournalCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const mountSlide = useRef(new Animated.Value(16)).current;
  const isOpen = useRef(false);
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === 'dark';
  const timeLabel = formatTimeOnly(entry.createdAt);

  useEffect(() => {
    const delay = Math.min(index, 8) * 45;
    Animated.parallel([
      Animated.timing(mountSlide, {
        toValue: 0,
        duration: 300,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function snap(open: boolean) {
    Animated.spring(translateX, {
      toValue: open ? -ACTION_WIDTH : 0,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
    isOpen.current = open;
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy),
      onPanResponderMove: (_, { dx }) => {
        const base = isOpen.current ? -ACTION_WIDTH : 0;
        translateX.setValue(Math.min(0, Math.max(-ACTION_WIDTH, base + dx)));
      },
      onPanResponderRelease: (_, { dx, vx }) => {
        const shouldOpen = isOpen.current
          ? !(dx > SWIPE_THRESHOLD || vx > 0.5)
          : dx < -SWIPE_THRESHOLD || vx < -0.5;
        Animated.spring(translateX, {
          toValue: shouldOpen ? -ACTION_WIDTH : 0,
          useNativeDriver: true,
          tension: 40,
          friction: 8,
        }).start();
        isOpen.current = shouldOpen;
      },
    }),
  ).current;

  return (
    <Animated.View
      className="mx-4 mb-3"
      style={{ transform: [{ translateY: mountSlide }] }}
    >
      <View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: ACTION_WIDTH,
          flexDirection: 'row',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
          }}
          onPress={() => {
            snap(false);
            onEdit?.();
          }}
        >
          <Pencil size={13} color={isDark ? '#cbd5e1' : '#475569'} />
          <Text className="text-xs font-medium text-slate-700 dark:text-slate-300">Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
          }}
          onPress={() => {
            snap(false);
            onDelete?.();
          }}
        >
          <Trash2 size={13} color="#ef4444" />
          <Text className="text-xs font-medium text-red-500">Delete</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        className="bg-white dark:bg-slate-900 rounded-2xl p-4"
        style={{
          transform: [{ translateX }],
          elevation: 1,
          shadowColor: '#000',
          shadowOpacity: 0.03,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (isOpen.current) {
              snap(false);
            } else {
              onPress?.();
            }
          }}
          onLongPress={() => snap(true)}
          delayLongPress={1000}
        >
          <View className="flex-row items-center gap-1.5 mb-2">
            <Clock size={13} color="#9ca3af" />
            <Text className="text-xs text-gray-400 font-medium tracking-wider">
              {timeLabel}
            </Text>
          </View>

          <Text
            className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1.5"
            numberOfLines={2}
          >
            {entry.title}
          </Text>

          <Text
            className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-3"
            numberOfLines={3}
          >
            {entry.content}
          </Text>

          <View className="flex-row items-center">
            <View className="flex-1 flex-row flex-wrap gap-2">
              {entry.tags.map(tag => (
                <View key={tag} className="bg-blue-50 dark:bg-blue-500/10 rounded-full px-3 py-1">
                  <Text className="text-xs text-blue-500 dark:text-blue-400 font-medium">{tag}</Text>
                </View>
              ))}
            </View>
            {entry.moods.length > 0 && (
              <View style={{ flexDirection: 'row', gap: 2, marginLeft: 8 }}>
                {entry.moods.map(mood => (
                  <Text key={mood} style={{ fontSize: 16 }}>{MOOD_META[mood]?.emoji}</Text>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
