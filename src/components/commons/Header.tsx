import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../models/types/navigation.type';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HeaderProps {
  name?: string;
  subtitle?: string;
}

export default function Header({
  name = "Krystian's",
  subtitle = 'Journal',
}: HeaderProps) {
  const navigation = useNavigation<HomeNav>();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white">
      <View className="flex-row items-center gap-2.5">
        <View className="w-10 h-10 rounded-full bg-sky-200 items-center justify-center overflow-hidden">
          <Text className="text-xl">🧑</Text>
        </View>
        <View>
          <Text className="text-sm font-bold text-slate-800">{name}</Text>
          <Text className="text-xs text-gray-400">{subtitle}</Text>
        </View>
      </View>
      <TouchableOpacity className="p-1.5" onPress={() => navigation.replace('Settings')}>
        <Settings size={22} color="#1e3a5f" />
      </TouchableOpacity>
    </View>
  );
}
