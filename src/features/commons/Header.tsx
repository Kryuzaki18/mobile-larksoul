import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../models/types/navigation.type';
import { useAuthStore } from '../../store/authStore';
import NetworkStatusDot from './NetworkStatusDot';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HeaderProps {
  name?: string;
  subtitle?: string;
}

export default function Header({ name = "Your", subtitle = 'Journal' }: HeaderProps) {
  const navigation = useNavigation<HomeNav>();
  const { currentUser } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const initial = currentUser?.name?.[0]?.toUpperCase() ?? 'G';

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
      <View className="flex-row items-center gap-3">
        <View className="relative">
          <View className="w-10 h-10 rounded-full bg-blue-800 items-center justify-center">
            <Text className="text-base font-bold text-white">{initial}</Text>
          </View>
          <NetworkStatusDot style={{ position: 'absolute', bottom: -1, right: -1 }} />
        </View>
        <View>
          <Text className="text-base font-bold text-slate-800 dark:text-slate-100">{name}</Text>
          <Text className="text-xs text-gray-400">{subtitle}</Text>
        </View>
      </View>
      <TouchableOpacity
        className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center"
        onPress={() => navigation.replace('Settings')}
        activeOpacity={0.7}
      >
        <Settings size={17} color={colorScheme === 'dark' ? '#cbd5e1' : '#475569'} />
      </TouchableOpacity>
    </View>
  );
}
