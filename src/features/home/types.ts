export interface JournalEntry {
  id: string;
  iconType: 'clock-circle' | 'calendar';
  time: string;
  title: string;
  preview: string;
  hasImage?: boolean;
  tags: string[];
}

export const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    iconType: 'clock-circle',
    time: 'TODAY, 08:30 AM',
    title: 'Morning Dew & Clarity',
    preview:
      'The world felt particularly quiet this morning. I sat by the window and...',
    tags: ['#meditation', '#peace'],
  },
  {
    id: '2',
    iconType: 'calendar',
    time: 'TODAY, 09:15 PM',
    title: 'The Silent Mountains',
    preview:
      "There is a specific kind of silence found only at high altitudes. It's not an absence of sound, but a...",
    hasImage: true,
    tags: ['#nature', '#reflection'],
  },
];

// ISO date strings (YYYY-MM-DD) that have journal entries
export const MOCK_ENTRY_DATES: string[] = [
  '2026-06-01',
  '2026-06-05',
  '2026-06-09',
  '2026-06-15',
  '2026-06-20',
];
