// AZURE — Powder Blue · hue 200°
// Airy, optimistic, clear. 200° is cloudless-sky blue — not cold cyan,
// not deep navy. Arctic-tinted darks, icy light surfaces.

import type { ColorTheme } from '../../types/theme';

export const AzureTheme: ColorTheme = {
  name:        'azure',
  label:       'Azure',
  description: 'Clear powder blue — airy and refreshing',
  emoji:       '🌤',

  50:  '#F0FAFF',   // ice white
  100: '#DCF2FF',   // pale sky
  200: '#B0DFFF',   // light blue
  300: '#70C4FF',   // baby blue
  400: '#2AACEE',   // vivid sky
  500: '#0A98D0',   // azure               ← primary
  600: '#087FAE',   // deep azure
  700: '#066088',   // dark azure
  800: '#044260',   // deep navy
  900: '#022138',   // near-black cool
  950: '#01111E',   // arctic black

  _15: 'rgba(10,152,208,0.15)',
  _13: 'rgba(10,152,208,0.13)',
  _30: 'rgba(4,66,96,0.30)',

  darkBg:      '#030D16',
  darkSurface: '#071E30',
  darkCard:    '#0C2E48',

  lightBg:      '#F8FCFF',
  lightSurface: '#EBF6FF',
  lightCard:    '#D6EDFF',
};
