export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WEEK_DAYS = DAY_NAMES.map(d => d[0]); // 'S', 'M', 'T', 'W', 'T', 'F', 'S'

const MONTHS_ABBR = MONTH_NAMES.map(m => m.slice(0, 3));
const MONTHS_ABBR_UPPER = MONTHS_ABBR.map(m => m.toUpperCase());

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function formatTime(date: Date): string {
  const hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${pad(hours % 12 || 12)}:${pad(date.getMinutes())} ${ampm}`;
}

export function parseDateStr(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatTimeOnly(createdAt: string): string {
  return formatTime(new Date(createdAt));
}

export function formatEntryTime(createdAt: string): string {
  const date = new Date(createdAt);
  const timeStr = formatTime(date);
  if (date.toDateString() === new Date().toDateString()) return `TODAY, ${timeStr}`;
  return `${MONTHS_ABBR_UPPER[date.getMonth()]} ${pad(date.getDate())}, ${timeStr}`;
}

export function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatDateLabel(date: Date): string {
  return `${MONTHS_ABBR_UPPER[date.getMonth()]} ${pad(date.getDate())}, ${date.getFullYear()}`;
}

export function formatEntryDate(dateStr: string): string {
  const date = parseDateStr(dateStr);
  return `${DAY_NAMES[date.getDay()]}, ${MONTHS_ABBR[date.getMonth()]} ${pad(date.getDate())} · ${date.getFullYear()}`;
}

export function formatDateShort(dateStr: string): string {
  const date = parseDateStr(dateStr);
  return `${MONTHS_ABBR[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatDateStrLabel(dateStr: string): string {
  const date = parseDateStr(dateStr);
  return `${MONTHS_ABBR_UPPER[date.getMonth()]} ${pad(date.getDate())}, ${date.getFullYear()}`;
}

export function nowTimeStr(): string {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export function formatSelected(date: Date): string {
  return `${DAY_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
