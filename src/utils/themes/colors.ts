// Static neutral & semantic palette.
// Primary accent colours live in theme files, not here.

export const Colors = {
  // ── Neutrals ──────────────────────────────────────────────────────────────
  slate950: '#020617',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate300: '#cbd5e1',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50:  '#f8fafc',

  gray500: '#6b7280',
  gray400: '#9ca3af',

  // ── Status / state ────────────────────────────────────────────────────────
  red600:    '#dc2626',
  red500:    '#ef4444',
  red200:    '#fecaca',
  red50:     '#fef2f2',
  red500_10: 'rgba(239,68,68,0.1)',
  red500_20: 'rgba(239,68,68,0.2)',

  green500:  '#22c55e',
  amber600:  '#d97706',
  amber500:  '#f59e0b',
  orange500: '#f97316',

  // ── Accent helpers (non-primary) ──────────────────────────────────────────
  emerald500: '#10b981',
  violet500:  '#8b5cf6',
  violet50:   '#f5f3ff',
  sky500:     '#0ea5e9',
  sky50:      '#f0f9ff',

  // ── Base ──────────────────────────────────────────────────────────────────
  white: '#ffffff',
  black: '#000000',

  navy950: '#0d1929',

  // ── Translucent ───────────────────────────────────────────────────────────
  black_45: 'rgba(0,0,0,0.45)',
  white_06: 'rgba(255,255,255,0.06)',
  white_10: 'rgba(255,255,255,0.1)',

  // ── Semantic ──────────────────────────────────────────────────────────────
  backdrop: 'rgba(2,6,23,0.6)',
} as const;
