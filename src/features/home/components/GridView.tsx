import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  memo,
} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { Clock, Pencil, Trash2, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { useEntryActions } from '../../../hooks/useEntryActions';
import ImageViewerModal from './ImageViewerModal';

import { formatTimeOnly } from '../../../utils/dateTime';
import { MOOD_META, MOOD_COLORS } from '../../../utils/mood';
import { Colors } from '../../../utils/themes';

import type { GridCardProps, EntryViewProps } from '../../../types/home';
import { useActiveTheme } from '../../../hooks/useActiveTheme';

const CARD_SHADOW = {
  elevation: 1,
  shadowColor: Colors.black,
  shadowOpacity: 0.03,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
} as const;

const MENU_SHADOW = {
  elevation: 3,
  shadowColor: Colors.black,
  shadowOpacity: 0.12,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
} as const;

const GridCard = memo(function GridCard({
  entry,
  index,
  isMenuOpen,
  onToggleMenu,
  onDismiss,
  onEdit,
  onDelete,
}: GridCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useActiveTheme();

  const mountScale = useRef(new Animated.Value(0.8)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const menuFade = useRef(new Animated.Value(0)).current;
  const menuScale = useRef(new Animated.Value(0.88)).current;

  const [viewerVisible, setViewerVisible] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const tagsScrollRef = useRef<ScrollView>(null);
  const tagsScrollX = useRef(0);
  const tagsContentWidth = useRef(0);
  const tagsLayoutWidth = useRef(0);

  function updateTagsArrows(sx = tagsScrollX.current, cw = tagsContentWidth.current, lw = tagsLayoutWidth.current) {
    setShowLeftArrow(sx > 2);
    setShowRightArrow(sx + lw < cw - 2);
  }
  
  const accentColor = MOOD_COLORS[entry.moods[0] ?? 'neutral'] ?? Colors.slate100;
  const timeLabel = formatTimeOnly(entry.createdAt);

  useEffect(() => {
    Animated.timing(mountScale, {
      toValue: 1,
      duration: 360,
      delay: Math.min(index, 7) * 50,
      easing: Easing.out(Easing.back(1.4)),
      useNativeDriver: true,
    }).start();
  }, []);

  useLayoutEffect(() => {
    if (isMenuOpen) {
      menuFade.setValue(0);
      menuScale.setValue(0.88);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      Animated.parallel([
        Animated.timing(menuFade, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(menuScale, {
          toValue: 1,
          damping: 14,
          stiffness: 280,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isMenuOpen]);

  const handleToggle = useCallback(
    () => onToggleMenu(entry.id),
    [onToggleMenu, entry.id],
  );

  const handleEdit = useCallback(() => {
    onToggleMenu(entry.id);
    onEdit(entry.id);
  }, [onToggleMenu, onEdit, entry.id]);

  const handleDelete = useCallback(() => {
    onToggleMenu(entry.id);
    onDelete(entry.id);
  }, [onToggleMenu, onDelete, entry.id]);

  const handlePressIn = () => {
    if (isMenuOpen) return;
    Animated.spring(pressScale, {
      toValue: 0.96,
      damping: 20,
      stiffness: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      damping: 15,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  };

  const iconColor = isDark ? Colors.slate300 : Colors.slate600;

  return (
    <View style={{ width: '50%', padding: 6, zIndex: isMenuOpen ? 20 : 1 }}>
      <Animated.View
        className="relative"
        style={{ transform: [{ scale: mountScale }] }}
      >
        <Animated.View
          style={{
            transform: [{ scale: pressScale }],
            borderRadius: 16,
            ...CARD_SHADOW,
          }}
        >
          <View
            className="bg-white dark:bg-slate-900"
            style={{ borderRadius: 16, overflow: 'hidden' }}
          >
            <View style={{ height: 3, backgroundColor: accentColor }} />

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (isMenuOpen) {
                  onDismiss();
                } else if (entry.imagePaths.length > 0) {
                  setViewerVisible(true);
                }
              }}
              onLongPress={handleToggle}
              delayLongPress={1000}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <View className="pt-1 px-2" style={{ paddingBottom: entry.tags.length > 0 ? 6 : 12 }}>
                <View className="flex-row items-center gap-1 mb-2">
                  <Clock size={12} color={Colors.gray400} />
                  <Text
                    className="text-xs text-gray-400 flex-1"
                    numberOfLines={1}
                  >
                    {timeLabel}
                  </Text>
                  {entry.moods.length > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      {entry.moods.map(mood => (
                        <Text key={mood} style={{ fontSize: 13 }}>
                          {MOOD_META[mood]?.emoji}
                        </Text>
                      ))}
                    </View>
                  )}
                  <TouchableOpacity
                    className="w-7 h-7 rounded-full items-center justify-center"
                    onPress={handleToggle}
                  >
                    <MoreVertical size={14} color={iconColor} />
                  </TouchableOpacity>
                </View>

                <Text
                  className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5"
                  numberOfLines={2}
                >
                  {entry.title}
                </Text>

                <Text
                  className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed"
                  numberOfLines={3}
                >
                  {entry.content}
                </Text>

                {entry.imagePaths.length > 0 && (
                  <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
                    {entry.imagePaths.slice(0, 3).map(uri => (
                      <Image
                        key={uri}
                        source={{ uri }}
                        style={{ width: 34, height: 34, borderRadius: 6 }}
                        resizeMode="cover"
                      />
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {entry.tags.length > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 10, marginHorizontal: 4 }}>
                {showLeftArrow && (
                  <TouchableOpacity
                    onPress={() => tagsScrollRef.current?.scrollTo({ x: Math.max(0, tagsScrollX.current - 80), animated: true })}
                    hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                  >
                    <ChevronLeft size={12} color={isDark ? theme[400] : theme[500]} />
                  </TouchableOpacity>
                )}
                <ScrollView
                  ref={tagsScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ flex: 1 }}
                  contentContainerStyle={{ flexDirection: 'row', gap: 4 }}
                  scrollEventThrottle={16}
                  onScroll={e => {
                    tagsScrollX.current = e.nativeEvent.contentOffset.x;
                    updateTagsArrows(tagsScrollX.current);
                  }}
                  onContentSizeChange={w => {
                    tagsContentWidth.current = w;
                    updateTagsArrows(undefined, w);
                  }}
                  onLayout={e => {
                    tagsLayoutWidth.current = e.nativeEvent.layout.width;
                    updateTagsArrows(undefined, undefined, e.nativeEvent.layout.width);
                  }}
                >
                  {entry.tags.map(tag => (
                    <View
                      key={tag}
                      className="rounded-full px-2 py-0.5"
                      style={{ backgroundColor: isDark ? theme._15 : theme[50] }}
                    >
                      <Text className="text-xs font-medium" style={{ color: isDark ? theme[400] : theme[500] }}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                {showRightArrow && (
                  <TouchableOpacity
                    onPress={() => tagsScrollRef.current?.scrollTo({ x: tagsScrollX.current + 80, animated: true })}
                    hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                  >
                    <ChevronRight size={12} color={isDark ? theme[400] : theme[500]} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </Animated.View>

        {isMenuOpen && (
          <>
            <View
              pointerEvents="none"
              className="absolute top-0 left-0 right-0 bottom-0 !bg-black/10 dark:bg-white/30 rounded-2xl"
            />
            <Animated.View
              className="absolute bg-white dark:bg-slate-800 rounded-2xl overflow-hidden"
              style={{
                right: 8,
                top: 20,
                minWidth: 80,
                ...MENU_SHADOW,
                opacity: menuFade,
                transform: [{ scale: menuScale }],
              }}
            >
              <TouchableOpacity
                className="flex-row items-center gap-1 px-4 py-2"
                onPress={handleEdit}
              >
                <Pencil size={12} color={iconColor} />
                <Text className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  Edit
                </Text>
              </TouchableOpacity>
              <View className="h-px bg-slate-100 dark:bg-slate-700" />
              <TouchableOpacity
                className="flex-row items-center gap-1 px-4 py-2"
                onPress={handleDelete}
              >
                <Trash2 size={12} color={Colors.red500} />
                <Text className="text-xs font-medium text-red-500">Delete</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </Animated.View>

      <ImageViewerModal
        visible={viewerVisible}
        images={entry.imagePaths}
        title={entry.title}
        content={entry.content}
        moods={entry.moods}
        tags={entry.tags}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
});

export default function GridView({ entries, refetch }: EntryViewProps) {
  const { editEntry, confirmDelete } = useEntryActions(refetch);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleMenu = useCallback(
    (id: string) => setActiveMenuId(curr => (curr === id ? null : id)),
    [],
  );

  const dismiss = useCallback(() => setActiveMenuId(null), []);

  return (
    <View className="flex-row flex-wrap px-3 pt-3">
      {entries.map((entry, index) => (
        <GridCard
          key={entry.id}
          entry={entry}
          index={index}
          isMenuOpen={activeMenuId === entry.id}
          onToggleMenu={toggleMenu}
          onDismiss={dismiss}
          onEdit={editEntry}
          onDelete={confirmDelete}
        />
      ))}
    </View>
  );
}
