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
import { Colors } from '../../../utils/colors';

export default function HomeLoader() {
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
        style={animatedStyle}
        className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/15 items-center justify-center mb-4"
      >
        <BookOpen size={28} color={Colors.blue500} />
      </Animated.View>
      <Text className="text-sm font-semibold text-gray-400">
        Loading your journal...
      </Text>
    </View>
  );
}
