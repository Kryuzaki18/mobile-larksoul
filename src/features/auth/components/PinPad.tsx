import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Delete } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../../utils/themes';
import { useActiveTheme } from '../../../hooks/useActiveTheme';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

interface PinPadProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export default function PinPad({ length = 4, value, onChange, error }: PinPadProps) {
  const shake = useRef(new Animated.Value(0)).current;
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useActiveTheme();

  useEffect(() => {
    if (!error) return;
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [error, shake]);

  function handlePress(key: string) {
    if (key === '') return;
    if (key === 'back') {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length < length) {
      onChange(value + key);
    }
  }

  return (
    <View>
      <Animated.View
        className="flex-row justify-center gap-3 mb-10"
        style={{ transform: [{ translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-8, 8] }) }] }}
      >
        {Array.from({ length }).map((_, i) => (
          <View
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: i < value.length ? (error ? Colors.red500 : theme[800]) : (isDark ? Colors.slate700 : Colors.slate200),
            }}
          />
        ))}
      </Animated.View>

      <View className="flex-row flex-wrap justify-center" style={{ width: 264 }}>
        {KEYS.map((key, i) => (
          <TouchableOpacity
            key={i}
            disabled={key === ''}
            onPress={() => handlePress(key)}
            activeOpacity={0.6}
            className="items-center justify-center"
            style={{ width: 88, height: 72 }}
          >
            {key === 'back' ? (
              <Delete size={22} color={isDark ? Colors.slate300 : Colors.slate600} />
            ) : key !== '' ? (
              <Text className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{key}</Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
