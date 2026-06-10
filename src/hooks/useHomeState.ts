import { useMemo, useState } from 'react';
import { toEntryDates, toDateStr } from '../utils/dateTime';
import { JOURNAL_ENTRIES } from '../constants/users.data';
import type { JournalEntry } from '../utils/dateTime';

export function useHomeState() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const entryDates = useMemo(() => toEntryDates(JOURNAL_ENTRIES), []);

  const entriesForDay = useMemo<JournalEntry[]>(() => {
    const dateStr = toDateStr(selectedDate);
    return JOURNAL_ENTRIES.filter(e => e.createdAt.startsWith(dateStr));
  }, [selectedDate]);

  return { selectedDate, setSelectedDate, entryDates, entriesForDay };
}
