import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Settings, Home, BarChart2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../models/types/navigation.type';
import { useAuthStore } from '../../store/authStore';
import NetworkStatusDot from './NetworkStatusDot';
import { Colors } from '../../utils/colors';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export type HeaderTab = 'home' | 'graph';

interface HeaderProps {
  name?: string;
  activeTab?: HeaderTab;
}

export default function Header({ name = 'Your', activeTab = 'home' }: HeaderProps) {
  const navigation = useNavigation<Nav>();
  const { currentUser } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const initial = currentUser?.name?.[0]?.toUpperCase() ?? 'G';

  const handleTabPress = (tab: HeaderTab) => {
    if (tab === activeTab) return;
    if (tab === 'graph') {
      navigation.navigate('Insights');
    } else {
      navigation.goBack();
    }
  };

  const activeColor = isDark ? Colors.white : Colors.blue800;
  const inactiveColor = isDark ? Colors.slate200 : Colors.slate400;

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
      <View className="flex-row items-center gap-3 flex-1">
        <View className="relative">
          <View className="w-10 h-10 rounded-full bg-blue-800 items-center justify-center">
            <Text className="text-base font-bold text-white">{initial}</Text>
          </View>
          <NetworkStatusDot style={{ position: 'absolute', bottom: -1, right: -1 }} />
        </View>
        <View>
          <Text className="text-base font-bold text-slate-800 dark:text-slate-100">{name}</Text>
          <Text className="text-xs text-gray-400">LarkSoul</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-1">
        <TouchableOpacity
          onPress={() => handleTabPress('home')}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: activeTab === 'home'
              ? isDark ? Colors.blue800_30 : Colors.blue50
              : 'transparent',
          }}
        >
          <Home size={13} color={activeTab === 'home' ? activeColor : inactiveColor} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: activeTab === 'home' ? '600' : '400',
              color: activeTab === 'home' ? activeColor : inactiveColor,
            }}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTabPress('graph')}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: activeTab === 'graph'
              ? isDark ? Colors.blue800_30 : Colors.blue50
              : 'transparent',
          }}
        >
          <BarChart2 size={13} color={activeTab === 'graph' ? activeColor : inactiveColor} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: activeTab === 'graph' ? '600' : '400',
              color: activeTab === 'graph' ? activeColor : inactiveColor,
            }}
          >
            Insights
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-end">
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center"
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <Settings size={17} color={isDark ? Colors.slate300 : Colors.slate600} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
