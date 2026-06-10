import { useState, useEffect, useMemo, useCallback } from 'react';
import { toDateStr } from '../utils/dateTime';
import type { JournalEntry } from '../models/interfaces/users.model';
import { getEntriesByUser } from '../database/functions/journal';

export function useHomeState(userId: string) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const fetchEntries = useCallback(() => {
    if (!userId) return;
    getEntriesByUser(userId).then(setEntries).catch(console.error);
  }, [userId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const entryDates = useMemo(
    () => [...new Set(entries.map(e => e.createdAt.slice(0, 10)))],
    [entries],
  );

  const entriesForDay = useMemo<JournalEntry[]>(
    () => {
      const dateStr = toDateStr(selectedDate);
      return entries.filter(e => e.createdAt.startsWith(dateStr));
    },
    [entries, selectedDate],
  );

  return { selectedDate, setSelectedDate, entryDates, entriesForDay, entries, refetch: fetchEntries };
}
