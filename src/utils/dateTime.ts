const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
export const WEEK_DAYS = DAY_NAMES.map(m => m.slice(0, 1)); // 'S', 'M', 'T', 'W', 'T', 'F', 'S'

const MONTHS_ABBR = MONTH_NAMES.map(m => m.slice(0, 3));          // 'Jan', 'Feb', ...
const MONTHS_ABBR_UPPER = MONTHS_ABBR.map(m => m.toUpperCase());  // 'JAN', 'FEB', ...

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

  const m = MONTHS_ABBR_UPPER[date.getMonth()];
  const d = String(date.getDate()).padStart(2, '0');
  return `${m} ${d}, ${timeStr}`;
}

export function getEntryIcon(createdAt: string): 'clock-circle' | 'calendar' {
  return new Date(createdAt).getHours() < 17 ? 'clock-circle' : 'calendar';
}

export function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function formatDateLabel(date: Date): string {
  const m = MONTHS_ABBR_UPPER[date.getMonth()];
  const d = String(date.getDate()).padStart(2, '0');
  const y = date.getFullYear();
  return `${m} ${d}, ${y}`;
}

export function formatEntryDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return `${DAY_NAMES[d.getDay()]}, ${MONTHS_ABBR[month - 1]} ${String(day).padStart(2, '0')} · ${year}`;
}

export function formatDateShort(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${MONTHS_ABBR[month - 1]} ${day}, ${year}`;
}
