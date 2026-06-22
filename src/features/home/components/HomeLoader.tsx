import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import { useActiveTheme } from '../../../hooks/useActiveTheme';

export default function HomeLoader() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useActiveTheme();
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.85, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-center py-16">
      <Animated.View
        style={[animatedStyle, { backgroundColor: isDark ? theme._15 : theme[100] }]}
        className="w-16 h-16 rounded-full items-center justify-center mb-4"
      >
        <BookOpen size={28} color={theme[500]} />
      </Animated.View>
      <Text className="text-sm font-semibold text-gray-400">
        Loading your journal...
      </Text>
    </View>
  );
}
