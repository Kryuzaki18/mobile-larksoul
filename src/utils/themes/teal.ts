// TEAL — Ocean Teal · hue 177°
// Calm, balanced, deep. 177° sits between cyan and mint — the colour of
// still harbour water. Deep ocean darks, vivid teal accents.

import type { ColorTheme } from '../../types/theme';

export const TealTheme: ColorTheme = {
  name:        'teal',
  label:       'Teal',
  description: 'Ocean teal — calm, balanced, and deep',
  emoji:       '🌊',

  50:  '#F0FDFC',   // white with teal breath
  100: '#CCFBF4',   // very pale teal
  200: '#99F2E8',   // light teal
  300: '#5ADCD4',   // vivid pale teal
  400: '#28BFBA',   // bright teal
  500: '#0FA19A',   // ocean teal          ← primary
  600: '#0C817A',   // deep teal
  700: '#09615C',   // dark teal
  800: '#06413D',   // very dark teal
  900: '#03211E',   // near-black teal
  950: '#01110F',   // teal black

  _15: 'rgba(15,161,154,0.15)',
  _13: 'rgba(15,161,154,0.13)',
  _30: 'rgba(6,65,61,0.30)',

  darkBg:      '#020E0C',
  darkSurface: '#051A18',
  darkCard:    '#092825',

  lightBg:      '#F4FFFE',
  lightSurface: '#E8FCFB',
  lightCard:    '#D0F9F7',
};
