// ORANGE — Sunset Orange · hue 27°
// Warm, energetic, bold. 27° is pure citrus orange — not golden-amber (42°),
// not red-orange (15°). Deep ember darks, vivid sunset accents, peach lights.

import type { ColorTheme } from '../../models/interfaces/colors.types';

export const OrangeTheme: ColorTheme = {
  name:        'orange',
  label:       'Sunset',
  description: 'Vivid sunset orange — warm and energetic',
  emoji:       '🌅',

  50:  '#FFF8F0',   // warm white
  100: '#FFECD4',   // pale peach
  200: '#FFD4A0',   // light peach
  300: '#FFAF5A',   // warm peach-orange
  400: '#FF8420',   // vivid light orange
  500: '#E8650A',   // sunset orange       ← primary
  600: '#C05008',   // deep orange
  700: '#8F3C05',   // dark ember
  800: '#602805',   // deep ember
  900: '#301402',   // near-black ember
  950: '#180A01',   // ember black

  _15: 'rgba(232,101,10,0.15)',
  _13: 'rgba(232,101,10,0.13)',
  _30: 'rgba(96,40,5,0.30)',

  darkBg:      '#130600',
  darkSurface: '#201000',
  darkCard:    '#301800',

  lightBg:      '#FFF9F5',
  lightSurface: '#FFF3E8',
  lightCard:    '#FFE8D0',
};
