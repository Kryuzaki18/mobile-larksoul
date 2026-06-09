import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Icon } from '@ant-design/react-native';
import Header from '../../components/commons/Header';
import ViewTabs, { ViewMode } from './ViewTabs';
import CalendarView from './CalendarView';
import DateSeparator from './DateSeparator';
import JournalCard from './JournalCard';
import ListView from './ListView';
import GridView from './GridView';
import { MOCK_ENTRIES, MOCK_ENTRY_DATES } from './types';

const MONTHS_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function formatDateLabel(date: Date): string {
  const m = MONTHS_SHORT[date.getMonth()];
  const d = String(date.getDate()).padStart(2, '0');
  const y = date.getFullYear();
  return `${m} ${d}, ${y}`;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<ViewMode>('calendar');
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  return (
    <SafeAreaView className="flex-1 bg-slate-50">

      <Header />
      <ViewTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

          {activeTab === 'calendar' && (
            <>
              <CalendarView
                entryDates={MOCK_ENTRY_DATES}
                onDayPress={setSelectedDate}
              />
              <DateSeparator label={formatDateLabel(selectedDate)} />
              {MOCK_ENTRIES.map(entry => (
                <JournalCard key={entry.id} entry={entry} />
              ))}
            </>
          )}

          {activeTab === 'list' && (
            <ListView entries={MOCK_ENTRIES} />
          )}

          {activeTab === 'grid' && (
            <GridView entries={MOCK_ENTRIES} />
          )}

          <View className="h-24" />
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-blue-800 items-center justify-center"
          onPress={() => {}}
        >
          <Icon name="plus" size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
