import { Text, View } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { Colors } from '../../../utils/themes';

export default function EmptyEntry() {
  return (
    <View className="items-center py-16">
      <View className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-4">
        <BookOpen size={28} color={Colors.slate400} />
      </View>
      <Text className="text-sm font-semibold text-gray-400">
        Nothing here yet
      </Text>
      <Text className="text-xs text-gray-300 dark:text-slate-600 mt-1">
        Tap + to write your first entry
      </Text>
    </View>
  );
}
