import { useState, useEffect, useCallback, useMemo } from 'react';
import type { JournalEntry, Mood } from '../models/interfaces/users.model';
import { getEntriesByUser } from '../database/functions/journal';
import { MONTH_NAMES } from '../utils/dateTime';

export type DayData = {
  day: number;
  dateStr: string;
  count: number;
  entryMoods: (Mood | null)[];
};

export type MoodCounts = Partial<Record<Mood, number>>;

export function useInsightsGraph(userId: string) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await getEntriesByUser(userId);
      setAllEntries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  const monthEntries = useMemo(
    () => allEntries.filter(e => e.createdAt.startsWith(monthStr)),
    [allEntries, monthStr],
  );

  const dayData = useMemo<DayData[]>(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dayStr = `${monthStr}-${String(day).padStart(2, '0')}`;
        const entries = monthEntries.filter(e => e.createdAt.startsWith(dayStr));
        const entryMoods = entries.map(e => e.moods[0] ?? null);
        return { day, dateStr: dayStr, count: entries.length, entryMoods };
      }),
    [monthEntries, daysInMonth, monthStr],
  );

  const moodCounts = useMemo<MoodCounts>(
    () =>
      monthEntries.reduce<MoodCounts>((acc, entry) => {
        entry.moods.forEach(mood => {
          acc[mood] = (acc[mood] ?? 0) + 1;
        });
        return acc;
      }, {}),
    [monthEntries],
  );

  const topMood = useMemo<Mood | undefined>(
    () =>
      (Object.entries(moodCounts) as [Mood, number][]).sort((a, b) => b[1] - a[1])[0]?.[0],
    [moodCounts],
  );

  const totalEntries = monthEntries.length;

  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      if (allEntries.some(e => e.createdAt.startsWith(dateStr))) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [allEntries]);

  const canGoNext =
    !(selectedYear === now.getFullYear() && selectedMonth >= now.getMonth() + 1);

  const goToPrevMonth = useCallback(() => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  }, [selectedMonth]);

  const goToNextMonth = useCallback(() => {
    if (!canGoNext) return;
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  }, [canGoNext, selectedMonth]);

  return {
    selectedYear,
    selectedMonth,
    monthName: MONTH_NAMES[selectedMonth - 1],
    dayData,
    moodCounts,
    topMood,
    totalEntries,
    streak,
    isLoading,
    canGoNext,
    goToPrevMonth,
    goToNextMonth,
    refetch: fetchEntries,
  };
}
