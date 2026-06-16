import { Text, View } from 'react-native';
import { BookOpen } from 'lucide-react-native';

export default function EmptyEntry() {
  return (
    <View className="items-center py-16">
      <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-4">
        <BookOpen size={28} color="#cbd5e1" />
      </View>
      <Text className="text-sm font-semibold text-gray-400">
        Nothing here yet
      </Text>
      <Text className="text-xs text-gray-300 mt-1">
        Tap + to write your first entry
      </Text>
    </View>
  );
}
