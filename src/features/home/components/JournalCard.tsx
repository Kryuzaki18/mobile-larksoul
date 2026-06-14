import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { Clock, Calendar, Image, Pencil, Trash2 } from 'lucide-react-native';
import type { JournalEntry } from '../../../utils/dateTime';
import { formatEntryTime, getEntryIcon } from '../../../utils/dateTime';

interface JournalCardProps {
  entry: JournalEntry;
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
}

const ACTION_WIDTH = 140;
const SWIPE_THRESHOLD = 60;

export default function JournalCard({ entry, onEdit, onDelete, onPress }: JournalCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);
  const timeLabel = formatEntryTime(entry.createdAt);
  const iconName = getEntryIcon(entry.createdAt);
  const TimeIcon = iconName === 'clock-circle' ? Clock : Calendar;

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
    <View className="mx-4 mb-3">
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
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 5 }}
          onPress={() => { snap(false); onEdit?.(); }}
        >
          <Pencil size={16}  />
          <Text style={{ fontSize: 11, fontWeight: '600' }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1,justifyContent: 'center', alignItems: 'center', gap: 5 }}
          onPress={() => { snap(false); onDelete?.(); }}
        >
          <Trash2 size={16}  />
          <Text style={{  fontSize: 11, fontWeight: '600' }}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        className="bg-white rounded-2xl p-4"
        style={{ transform: [{ translateX }] }}
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
        >
          <View className="flex-row items-center gap-1.5 mb-2">
            <TimeIcon size={13} color="#9ca3af" />
            <Text className="text-xs text-gray-400 font-medium tracking-wider">{timeLabel}</Text>
          </View>

          <Text className="text-xl font-bold text-slate-800 mb-1.5" numberOfLines={2}>
            {entry.title}
          </Text>

          <Text className="text-sm text-gray-500 leading-relaxed mb-3" numberOfLines={3}>
            {entry.preview}
          </Text>

          {entry.hasImage && (
            <View
              className="h-36 rounded-xl mb-3 items-center justify-center overflow-hidden"
              style={{ backgroundColor: entry.imageColor ?? '#334155' }}
            >
              <Image size={36} color="#94a3b8" />
            </View>
          )}

          <View className="flex-row flex-wrap gap-2">
            {entry.tags.map(tag => (
              <View key={tag} className="bg-blue-50 rounded-full px-3 py-1">
                <Text className="text-xs text-blue-500 font-medium">{tag}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
