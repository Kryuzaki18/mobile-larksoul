import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from '@ant-design/react-native';
import Header from '../../components/commons/Header';
import ViewTabs, { ViewMode } from './components/ViewTabs';
import CalendarView from './components/CalendarView';
import DateSeparator from './components/DateSeparator';
import JournalCard from './components/JournalCard';
import ListView from './components/ListView';
import GridView from './components/GridView';
import { useHomeState } from '../../hooks/useHomeState';
import { formatDateLabel } from '../../utils/dateTime';
import { JOURNAL_ENTRIES, CURRENT_USER } from '../../constants/users.data';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<ViewMode>('calendar');
  const { selectedDate, setSelectedDate, entryDates, entriesForDay } = useHomeState();

  return (
    <View className="flex-1 bg-slate-50">
      <Header name={`${CURRENT_USER.name.split(' ')[0]}'s`} subtitle="Journal" />
      <ViewTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {activeTab === 'calendar' && (
            <>
              <CalendarView entryDates={entryDates} onDayPress={setSelectedDate} />
              <DateSeparator label={formatDateLabel(selectedDate)} />
              {entriesForDay.length > 0 ? (
                entriesForDay.map(entry => <JournalCard key={entry.id} entry={entry} />)
              ) : (
                <View className="items-center py-14">
                  <Icon name="book" size={44} color="#cbd5e1" />
                  <Text className="text-gray-400 text-sm mt-3">No entries for this day</Text>
                </View>
              )}
            </>
          )}

          {activeTab === 'list' && <ListView entries={JOURNAL_ENTRIES} />}
          {activeTab === 'grid' && <GridView entries={JOURNAL_ENTRIES} />}

          <View className="h-24" />
        </ScrollView>

        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-blue-800 items-center justify-center shadow-lg shadow-blue-900"
          onPress={() => {}}
        >
          <Icon name="plus" size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
