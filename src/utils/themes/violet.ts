// VIOLET — Amethyst · hue 265°
// Creative, spiritual, luxurious. 265° is pure violet — not blue-purple,
// not pink. Deep indigo darks, vivid amethyst accents, lavender lights.

import type { ColorTheme } from '../../models/interfaces/colors.types';

export const VioletTheme: ColorTheme = {
  name:        'violet',
  label:       'Violet',
  description: 'Vivid amethyst violet — creative and luxurious',
  emoji:       '💜',

  50:  '#F8F5FF',   // lavender white
  100: '#EDE5FF',   // pale lavender
  200: '#D8C5FF',   // soft lavender
  300: '#BC9FFF',   // vivid lavender
  400: '#9B6EFF',   // bright violet
  500: '#7C3AED',   // amethyst            ← primary
  600: '#6320CF',   // deep violet
  700: '#4A179E',   // dark violet
  800: '#320E6C',   // indigo dark
  900: '#1A073A',   // near-black indigo
  950: '#0D031D',   // indigo black

  _15: 'rgba(124,58,237,0.15)',
  _13: 'rgba(124,58,237,0.13)',
  _30: 'rgba(50,14,108,0.30)',

  darkBg:      '#080214',
  darkSurface: '#100426',
  darkCard:    '#18053A',

  lightBg:      '#FDFAFF',
  lightSurface: '#F4EEFF',
  lightCard:    '#E8DEFF',
};
