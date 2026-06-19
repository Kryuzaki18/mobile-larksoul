import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Menu, LayoutGrid } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Header from '../commons/Header';
import CalendarView from './components/CalendarView';
import ListView from './components/ListView';
import GridView from './components/GridView';
import EmptyEntry from './components/EmptyEntry';
import HomeLoader from './components/HomeLoader';

import { useHomeState } from '../../hooks/useHomeState';
import { formatDateLabel, toDateStr } from '../../utils/dateTime';
import { useAuthStore } from '../../store/authStore';

import type { RootStackParamList } from '../../models/types/navigation.type';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { currentUser } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [layout, setLayout] = useState<'list' | 'grid'>('list');

  const userId = currentUser?.id ?? '';
  const {
    selectedDate,
    setSelectedDate,
    entryDates,
    entriesForDay,
    isLoading,
    refetch,
  } = useHomeState(userId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const firstName = currentUser?.name?.split(' ')[0] ?? 'Your';
  const chipInactiveBg = isDark ? '#1e293b' : '#f1f5f9';
  const chipInactiveColor = isDark ? '#94a3b8' : '#6b7280';

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <Header name={`${firstName}'s`} subtitle="Journal" activeTab="home" />

      <View className="flex-1">
        {isLoading ? (
          <HomeLoader />
        ) : (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <CalendarView
              entryDates={entryDates}
              selectedDate={selectedDate}
              onDayPress={setSelectedDate}
            />

            <View className="flex-row items-center px-4 mt-4 mb-1">
              <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase mr-3">
                {formatDateLabel(selectedDate)}
              </Text>
              <View
                className="flex-1 h-px mr-2"
                style={{ backgroundColor: isDark ? '#1e293b' : '#e9edf2' }}
              />
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <TouchableOpacity
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: layout === 'list' ? '#1e40af' : chipInactiveBg,
                  }}
                  onPress={() => setLayout('list')}
                >
                  <Menu size={13} color={layout === 'list' ? '#fff' : chipInactiveColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: layout === 'grid' ? '#1e40af' : chipInactiveBg,
                  }}
                  onPress={() => setLayout('grid')}
                >
                  <LayoutGrid size={13} color={layout === 'grid' ? '#fff' : chipInactiveColor} />
                </TouchableOpacity>
              </View>
            </View>

            {entriesForDay.length > 0 ? (
              layout === 'list' ? (
                <ListView entries={entriesForDay} refetch={refetch} />
              ) : (
                <GridView entries={entriesForDay} refetch={refetch} />
              )
            ) : (
              <EmptyEntry />
            )}

            <View className="h-24" />
          </ScrollView>
        )}

        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-blue-800 items-center justify-center shadow-lg shadow-blue-900"
          onPress={() =>
            navigation.navigate('AddEntry', { date: toDateStr(selectedDate) })
          }
        >
          <Plus size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
