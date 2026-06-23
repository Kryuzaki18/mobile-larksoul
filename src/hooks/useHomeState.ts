import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { toDateStr } from '../utils/dateTime';
import type { JournalEntry } from '../types/user';
import { getEntriesByUser, getEntriesByDate } from '../database/functions/journal';

const MIN_LOADER_DURATION_MS = 1000;

export interface EntryGroup {
  date: string;
  items: JournalEntry[];
}

export interface DisplayMonth {
  year: number;
  month: number;
}

export function useHomeState(userId: string) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [dayEntries, setDayEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDayLoading, setIsDayLoading] = useState(false);
  const [displayMonth, setDisplayMonth] = useState<DisplayMonth>(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
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

  const fetchDay = useCallback(async () => {
    if (!userId) return;
    setIsDayLoading(true);
    try {
      const result = await getEntriesByDate(userId, toDateStr(selectedDate));
      setDayEntries(result);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setIsDayLoading(false);
      }, 300);
    }
  }, [userId, selectedDate]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    fetchDay();
  }, [fetchDay]);

  const entryDates = useMemo(
    () => [...new Set(entries.map(e => e.createdAt.slice(0, 10)))],
    [entries],
  );

  const entriesForDay = dayEntries;

  const groupedEntries = useMemo<EntryGroup[]>(() => {
    const map = new Map<string, JournalEntry[]>();
    for (const entry of entries) {
      const dateKey = entry.createdAt.slice(0, 10);
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(entry);
    }
    return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
  }, [entries]);

  const groupedEntriesForMonth = useMemo<EntryGroup[]>(() => {
    const prefix = `${displayMonth.year}-${String(displayMonth.month + 1).padStart(2, '0')}`;
    return groupedEntries.filter(g => g.date.startsWith(prefix));
  }, [groupedEntries, displayMonth]);

  const refetch = useCallback(() => {
    fetchEntries();
    fetchDay();
  }, [fetchEntries, fetchDay]);

  return {
    selectedDate,
    setSelectedDate,
    entryDates,
    entriesForDay,
    entries,
    groupedEntries,
    groupedEntriesForMonth,
    displayMonth,
    setDisplayMonth,
    isLoading,
    isDayLoading,
    refetch,
  };
}
