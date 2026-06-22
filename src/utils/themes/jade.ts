// JADE — Vivid Mint · hue 155°
// Fresh, vital, natural. 155° is the sweet spot between clinical teal and
// yellow lime — jade stone, tropical leaves, a mountain spring.

import type { ColorTheme } from '../../models/interfaces/colors.types';

export const JadeTheme: ColorTheme = {
  name:        'jade',
  label:       'Jade',
  description: 'Vivid mint jade — fresh and natural',
  emoji:       '🍃',

  50:  '#F0FFF7',   // mint white
  100: '#D8FFEE',   // pale mint
  200: '#A6FFD8',   // light mint
  300: '#5CEDB6',   // vivid pale jade
  400: '#20D294',   // bright jade
  500: '#10B87C',   // jade green          ← primary
  600: '#0C9362',   // deep jade
  700: '#096E49',   // forest jade
  800: '#064A32',   // dark green
  900: '#03241A',   // near-black forest
  950: '#01130D',   // forest black

  _15: 'rgba(16,184,124,0.15)',
  _13: 'rgba(16,184,124,0.13)',
  _30: 'rgba(6,74,50,0.30)',

  darkBg:      '#030F08',
  darkSurface: '#071A10',
  darkCard:    '#0C2618',

  lightBg:      '#F5FFFB',
  lightSurface: '#EAFFF5',
  lightCard:    '#D4FFE9',
};
