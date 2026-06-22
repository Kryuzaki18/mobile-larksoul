// ROSE — Blush Rose · hue 340°
// Elegant, expressive, romantic. 340° keeps it rose — not red, not candy-pink.
// Deep wine darks, vivid rose accents, blush-cream lights.

import type { ColorTheme } from '../../models/interfaces/colors.types';

export const RoseTheme: ColorTheme = {
  name:        'rose',
  label:       'Rose',
  description: 'Deep blush rose — elegant and expressive',
  emoji:       '🌹',

  50:  '#FFF0F5',   // blush white
  100: '#FFD6E8',   // pale blush
  200: '#FFAACC',   // soft rose
  300: '#F578AF',   // mid rose
  400: '#E04A8C',   // bright rose
  500: '#C2375E',   // deep rose           ← primary
  600: '#9A2849',   // dark rose
  700: '#731A36',   // wine
  800: '#4D1024',   // deep wine
  900: '#270812',   // near-black wine
  950: '#130409',   // wine black

  _15: 'rgba(194,55,94,0.15)',
  _13: 'rgba(194,55,94,0.13)',
  _30: 'rgba(77,16,36,0.30)',

  darkBg:      '#110308',
  darkSurface: '#200612',
  darkCard:    '#30091C',

  lightBg:      '#FFF8FB',
  lightSurface: '#FFF0F5',
  lightCard:    '#FFE0EC',
};
