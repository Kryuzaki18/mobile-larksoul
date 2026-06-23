import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  PanResponder,
} from 'react-native';
import { Clock, Pencil, Trash2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import type { JournalEntry } from '../../../models/interfaces/users.interface';
import { formatTimeOnly } from '../../../utils/dateTime';
import { MOOD_COLORS, MOOD_META } from '../../../utils/mood';
import { Colors } from '../../../utils/themes';
import { useActiveTheme } from '../../../hooks/useActiveTheme';

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

  const accentColor = MOOD_COLORS[entry.moods[0] ?? 'neutral'] ?? Colors.slate100;
  const isDark = colorScheme === 'dark';
  const theme = useActiveTheme();
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
      className="mx-4 mb-2"
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
          <Pencil size={13} color={isDark ? Colors.slate300 : Colors.slate600} />
          <Text className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Edit
          </Text>
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
          <Trash2 size={13} color={Colors.red500} />
          <Text className="text-xs font-medium text-red-500">Delete</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        className="bg-white dark:bg-slate-900 rounded-2xl"
        style={{
          transform: [{ translateX }],
          elevation: 1,
          shadowColor: Colors.black,
          shadowOpacity: 0.05,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
        {...panResponder.panHandlers}
      >
        <View className="overflow-hidden rounded-2xl">
          <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: accentColor, zIndex: 1 }} />

          <TouchableOpacity
            className="p-4"
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
            <View className="flex-row items-center mb-2">
              <Clock size={13} color={Colors.gray400} />
              <Text className="text-xs text-gray-400 font-medium tracking-wider ml-1 flex-1">
                {timeLabel}
              </Text>
              {entry.moods.length > 0 && (
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
                >
                  {entry.moods.map(mood => (
                    <Text key={mood} style={{ fontSize: 16 }}>
                      {MOOD_META[mood]?.emoji}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text
                  className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1.5"
                  numberOfLines={2}
                >
                  {entry.title}
                </Text>

                <Text
                  className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed"
                  numberOfLines={3}
                >
                  {entry.content}
                </Text>
              </View>

              {entry.imagePaths.length > 0 && (
                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 2 }}>
                  {entry.imagePaths.slice(0, 3).map((uri, i) => (
                    <Image
                      key={uri}
                      source={{ uri }}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        marginLeft: i === 0 ? 0 : -10,
                        borderWidth: 2,
                        borderColor: isDark ? Colors.slate900 : Colors.white,
                      }}
                      resizeMode="cover"
                    />
                  ))}
                </View>
              )}
            </View>

            {entry.tags.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mt-3">
                {entry.tags.map(tag => (
                  <View
                    key={tag}
                    className="rounded-full px-3 py-1"
                    style={{ backgroundColor: isDark ? theme._15 : theme[50] }}
                  >
                    <Text className="text-xs font-medium" style={{ color: isDark ? theme[400] : theme[500] }}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
