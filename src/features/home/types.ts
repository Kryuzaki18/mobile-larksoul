export type { JournalEntry, Mood } from '../../models/users.model';

const MONTHS_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

export function formatEntryTime(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  const timeStr = `${String(h).padStart(2, '0')}:${minutes} ${ampm}`;

  if (isToday) return `TODAY, ${timeStr}`;

  const m = MONTHS_SHORT[date.getMonth()];
  const d = String(date.getDate()).padStart(2, '0');
  return `${m} ${d}, ${timeStr}`;
}

export function getEntryIcon(createdAt: string): 'clock-circle' | 'calendar' {
  return new Date(createdAt).getHours() < 17 ? 'clock-circle' : 'calendar';
}

export function toEntryDates(entries: { createdAt: string }[]): string[] {
  return [...new Set(entries.map(e => e.createdAt.slice(0, 10)))];
}
