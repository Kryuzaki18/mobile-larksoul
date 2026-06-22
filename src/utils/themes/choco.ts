// CHOCO — Dark Chocolate · hue 25°
// Indulgent, cozy, rich. Restrained saturation (76%) keeps it squarely
// chocolate — no orange drift, no muddy beige. Espresso darks, parchment lights.

import type { ColorTheme } from '../../models/interfaces/colors.types';

export const ChocoTheme: ColorTheme = {
  name:        'choco',
  label:       'Cocoa',
  description: 'Rich dark chocolate — indulgent and cozy',
  emoji:       '🍫',

  50:  '#FBF5F0',   // ivory cream
  100: '#F5E4D4',   // warm cream
  200: '#EBCAAE',   // light caramel
  300: '#D9A07A',   // caramel milk
  400: '#C07545',   // warm caramel
  500: '#8B4513',   // saddle brown        ← primary
  600: '#6D3410',   // dark chocolate
  700: '#51270C',   // bitter chocolate
  800: '#361908',   // espresso
  900: '#1C0D03',   // near-black coffee
  950: '#0E0601',   // espresso black

  _15: 'rgba(139,69,19,0.15)',
  _13: 'rgba(139,69,19,0.13)',
  _30: 'rgba(54,25,8,0.30)',

  darkBg:      '#0C0501',
  darkSurface: '#180C03',
  darkCard:    '#261305',

  lightBg:      '#FDF9F6',
  lightSurface: '#F7EEE5',
  lightCard:    '#F0DFD0',
};
