import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { BookOpen, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/commons/Header';
import CalendarView from './components/CalendarView';
import DateSeparator from './components/DateSeparator';
import JournalCard from './components/JournalCard';
import ListView from './components/ListView';
import GridView from './components/GridView';
import { useHomeState } from '../../hooks/useHomeState';
import { formatDateLabel, toDateStr } from '../../utils/dateTime';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { deleteEntry } from '../../database/functions/journal';
import type { RootStackParamList } from '../../models/types/navigation.type';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { currentUser } = useAuthStore();
  const { defaultLayout } = useSettingsStore();

  const userId = currentUser?.id ?? '';
  const { selectedDate, setSelectedDate, entryDates, entriesForDay, entries, refetch } =
    useHomeState(userId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const firstName = currentUser?.name?.split(' ')[0] ?? 'Your';

  return (
    <View className="flex-1 bg-slate-50">
      <Header name={`${firstName}'s`} subtitle="Journal" />

      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {defaultLayout === 'calendar' && (
            <>
              <CalendarView
                entryDates={entryDates}
                selectedDate={selectedDate}
                onDayPress={setSelectedDate}
              />
              <DateSeparator label={formatDateLabel(selectedDate)} />
              {entriesForDay.length > 0 ? (
                entriesForDay.map(entry => (
                  <JournalCard
                    key={entry.id}
                    entry={entry}
                    onEdit={() => navigation.navigate('AddEntry', { entryId: entry.id })}
                    onDelete={() =>
                      Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => deleteEntry(entry.id).then(refetch).catch(console.error),
                        },
                      ])
                    }
                  />
                ))
              ) : (
                <View className="items-center py-14">
                  <BookOpen size={44} color="#cbd5e1" />
                  <Text className="text-gray-400 text-sm mt-3">No entries for this day</Text>
                </View>
              )}
            </>
          )}

          {defaultLayout === 'list' && <ListView entries={entries} />}
          {defaultLayout === 'grid' && <GridView entries={entries} />}

          <View className="h-24" />
        </ScrollView>

        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-blue-800 items-center justify-center shadow-lg shadow-blue-900"
          onPress={() => navigation.navigate('AddEntry', { date: toDateStr(selectedDate) })}
        >
          <Plus size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
