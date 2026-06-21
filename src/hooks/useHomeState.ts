import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { toDateStr } from '../utils/dateTime';
import type { JournalEntry } from '../models/interfaces/users.model';
import { getEntriesByUser } from '../database/functions/journal';

const MIN_LOADER_DURATION_MS = 1000;

export interface EntryGroup {
  date: string;
  items: JournalEntry[];
}

export function useHomeState(userId: string) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  const fetchEntries = useCallback(() => {
    if (!userId) return;

    if (hasLoadedOnce.current) {
      getEntriesByUser(userId).then(setEntries).catch(console.error);
      return;
    }

    const startedAt = Date.now();
    getEntriesByUser(userId)
      .then(setEntries)
      .catch(console.error)
      .finally(() => {
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(MIN_LOADER_DURATION_MS - elapsed, 0);
        setTimeout(() => {
          hasLoadedOnce.current = true;
          setIsLoading(false);
        }, remaining);
      });
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

  const groupedEntries = useMemo<EntryGroup[]>(() => {
    const map = new Map<string, JournalEntry[]>();
    for (const entry of entries) {
      const dateKey = entry.createdAt.slice(0, 10);
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(entry);
    }
    return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
  }, [entries]);

  return {
    selectedDate,
    setSelectedDate,
    entryDates,
    entriesForDay,
    entries,
    groupedEntries,
    isLoading,
    refetch: fetchEntries,
  };
}
