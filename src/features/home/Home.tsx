import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@ant-design/react-native';
import Header from '../../components/commons/Header';
import ViewTabs, { ViewMode } from './ViewTabs';
import CalendarView from './CalendarView';
import DateSeparator from './DateSeparator';
import JournalCard from './JournalCard';
import ListView from './ListView';
import GridView from './GridView';
import { toEntryDates } from '../../utils/dateTime';
import { JOURNAL_ENTRIES, CURRENT_USER } from '../../constants/users.data';

const MONTHS_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function formatDateLabel(date: Date): string {
  const m = MONTHS_SHORT[date.getMonth()];
  const d = String(date.getDate()).padStart(2, '0');
  const y = date.getFullYear();
  return `${m} ${d}, ${y}`;
}

function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ViewMode>('calendar');
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const entryDates = useMemo(() => toEntryDates(JOURNAL_ENTRIES), []);

  const entriesForDay = useMemo(() => {
    const dateStr = toDateStr(selectedDate);
    return JOURNAL_ENTRIES.filter(e => e.createdAt.startsWith(dateStr));
  }, [selectedDate]);

  return (
    <View className="flex-1 bg-slate-50">

      <Header
        name={CURRENT_USER.name.split(' ')[0] + "'s"}
        subtitle="Jornal"
      />
      <ViewTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

          {activeTab === 'calendar' && (
            <>
              <CalendarView
                entryDates={entryDates}
                onDayPress={setSelectedDate}
              />
              <DateSeparator label={formatDateLabel(selectedDate)} />

              {entriesForDay.length > 0 ? (
                entriesForDay.map(entry => (
                  <JournalCard key={entry.id} entry={entry} />
                ))
              ) : (
                <View className="items-center py-14">
                  <Icon name="book" size={44} color="#cbd5e1" />
                  <Text className="text-gray-400 text-sm mt-3">No entries for this day</Text>
                </View>
              )}
            </>
          )}

          {activeTab === 'list' && (
            <ListView entries={JOURNAL_ENTRIES} />
          )}

          {activeTab === 'grid' && (
            <GridView entries={JOURNAL_ENTRIES} />
          )}

          <View className="h-24" />
        </ScrollView>

        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-blue-800 items-center justify-center"
          onPress={() => {}}
        >
          <Icon name="plus" size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>

    </View>
  );
}
