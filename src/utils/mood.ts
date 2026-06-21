import type { Mood } from '../models/interfaces/users.interface';

export const MOOD_META: Record<Mood, { emoji: string; label: string; color: string }> = {
  happy:      { emoji: '😊', label: 'Happy',      color: '#f59e0b' },
  grateful:   { emoji: '🙏', label: 'Grateful',   color: '#22c55e' },
  excited:    { emoji: '🎉', label: 'Excited',     color: '#f97316' },
  neutral:    { emoji: '😐', label: 'Neutral',     color: '#94a3b8' },
  reflective: { emoji: '🤔', label: 'Reflective',  color: '#a855f7' },
  anxious:    { emoji: '😰', label: 'Anxious',     color: '#ef4444' },
  sad:        { emoji: '😢', label: 'Sad',         color: '#3b82f6' },
};

export const MOOD_COLORS: Record<Mood, string> = Object.fromEntries(
  (Object.keys(MOOD_META) as Mood[]).map(mood => [mood, MOOD_META[mood].color]),
) as Record<Mood, string>;
