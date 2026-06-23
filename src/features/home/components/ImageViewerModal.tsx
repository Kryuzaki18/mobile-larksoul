import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Colors } from '../../../utils/themes';
import { MOOD_META } from '../../../utils/mood';

import type { Mood } from '../../../models/interfaces/users.interface';

import { useActiveTheme } from '../../../hooks/useActiveTheme';

const { width: SW } = Dimensions.get('window');
const IMG_W = SW - 48;
const IMG_H = Math.round(SW * 0.62);
const DOT_COUNT = 3;

interface Props {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  title: string;
  content?: string;
  moods?: string[];
  tags: string[];
  onClose: () => void;
}

export default function ImageViewerModal({
  visible,
  images,
  initialIndex = 0,
  title,
  content,
  moods,
  tags,
  onClose,
}: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useActiveTheme();

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const scrollRef = useRef<ScrollView>(null);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.88)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const dotAnims = useRef(
    Array.from({ length: DOT_COUNT }, (_, i) =>
      new Animated.Value(i === initialIndex ? 1 : 0),
    ),
  ).current;

  useEffect(() => {
    if (visible) {
      const idx = Math.max(0, Math.min(initialIndex, images.length - 1));
      setCurrentIndex(idx);
      dotAnims.forEach((a, i) => a.setValue(i === idx ? 1 : 0));

      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: idx * SW, animated: false });
      }, 50);

      Animated.parallel([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(contentScale, {
          toValue: 1,
          damping: 18,
          stiffness: 280,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => contentScale.setValue(0.88));
    }
  }, [visible, initialIndex]);

  function moveDots(nextIndex: number) {
    dotAnims.forEach((a, i) =>
      Animated.timing(a, {
        toValue: i === nextIndex ? 1 : 0,
        duration: 220,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }).start(),
    );
  }

  function goTo(nextIndex: number) {
    scrollRef.current?.scrollTo({ x: nextIndex * SW, animated: true });
    setCurrentIndex(nextIndex);
    moveDots(nextIndex);
  }

  const overlayColor   = isDark ? 'rgba(2,6,23,0.97)'     : 'rgba(241,245,249,0.97)';
  const titleColor     = isDark ? Colors.white              : Colors.slate900;
  const contentColor   = isDark ? Colors.slate400           : Colors.slate500;
  const closeBg        = isDark ? theme._15                 : 'rgba(0,0,0,0.06)';
  const closeIcon      = isDark ? theme[300]                : Colors.slate600;
  const arrowBg        = isDark ? theme._15                 : 'rgba(0,0,0,0.06)';
  const arrowBorder    = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const arrowIcon      = isDark ? theme[300]                : Colors.slate600;
  const activeDot      = isDark ? theme[400]                : theme[500];
  const inactiveDotBg  = isDark ? Colors.white              : Colors.slate400;
  const tagBg          = isDark ? theme._15                 : theme[50];
  const tagBorder      = isDark ? 'rgba(255,255,255,0.06)' : theme[100];
  const tagText        = isDark ? theme[300]                : theme[600];
  const dividerColor   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor, opacity: bgAnim }]}
      />

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { opacity: contentOpacity, transform: [{ scale: contentScale }] },
        ]}
      >
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          style={{
            position: 'absolute',
            top: 56,
            right: 20,
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: closeBg,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <X size={16} color={closeIcon} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ paddingHorizontal: 20, paddingBottom: 14 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: titleColor,
                letterSpacing: -0.4,
                lineHeight: 26,
              }}
            >
              {title}
            </Text>

            {moods && moods.length > 0 && (
              <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
                {moods.map(mood => (
                  <Text key={mood} style={{ fontSize: 20 }}>
                    {MOOD_META[mood as Mood]?.emoji}
                  </Text>
                ))}
              </View>
            )}

            {!!content && (
              <Text
                style={{ fontSize: 13, lineHeight: 20, color: contentColor, marginTop: 8 }}
              >
                {content}
              </Text>
            )}
          </View>

          <View
            style={{ height: 1, backgroundColor: dividerColor, marginHorizontal: 20, marginBottom: 16 }}
          />

          <View style={{ height: IMG_H }}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              bounces={images.length > 1}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(e.nativeEvent.contentOffset.x / SW);
                if (newIndex !== currentIndex) {
                  setCurrentIndex(newIndex);
                  moveDots(newIndex);
                }
              }}
            >
              {images.map((uri, i) => (
                <View
                  key={i}
                  style={{ width: SW, height: IMG_H, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Image
                    source={{ uri }}
                    style={{ width: IMG_W, height: IMG_H, borderRadius: 16 }}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>

            <View
              pointerEvents="box-none"
              style={[
                StyleSheet.absoluteFill,
                { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
              ]}
            >
              {currentIndex > 0 ? (
                <TouchableOpacity
                  onPress={() => goTo(currentIndex - 1)}
                  activeOpacity={0.7}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: arrowBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: arrowBorder,
                  }}
                >
                  <ChevronLeft size={22} color={arrowIcon} strokeWidth={2} />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 44 }} />
              )}
              <View style={{ flex: 1 }} />
              {currentIndex < images.length - 1 ? (
                <TouchableOpacity
                  onPress={() => goTo(currentIndex + 1)}
                  activeOpacity={0.7}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: arrowBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: arrowBorder,
                  }}
                >
                  <ChevronRight size={22} color={arrowIcon} strokeWidth={2} />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 44 }} />
              )}
            </View>
          </View>

          {images.length > 1 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 6,
                paddingVertical: 14,
              }}
            >
              {images.slice(0, DOT_COUNT).map((_, i) => (
                <Animated.View
                  key={i}
                  style={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: i === currentIndex ? activeDot : inactiveDotBg,
                    width: dotAnims[i].interpolate({ inputRange: [0, 1], outputRange: [6, 22] }),
                    opacity: dotAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] }),
                  }}
                />
              ))}
            </View>
          )}

          {tags.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'center',
                paddingHorizontal: 24,
                paddingTop: images.length > 1 ? 0 : 14,
              }}
            >
              {tags.map(tag => (
                <View
                  key={tag}
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    backgroundColor: tagBg,
                    borderWidth: 1,
                    borderColor: tagBorder,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: tagText }}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}
