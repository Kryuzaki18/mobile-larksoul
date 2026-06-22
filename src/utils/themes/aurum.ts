// AURUM — Antique Gold · hue 42°
// Premium, editorial. Gold at 42° — precious without the cheapness of #FFD700.
// Ivory lights, amber-tinted dark surfaces.

import type { ColorTheme } from '../../models/interfaces/colors.types';

export const AurumTheme: ColorTheme = {
  name:        'aurum',
  label:       'Aurum',
  description: 'Warm antique gold — premium and editorial',
  emoji:       '✨',

  50:  '#FFFCF0',   // ivory white
  100: '#FFF5D4',   // warm cream
  200: '#FFE898',   // light honey
  300: '#FFD45A',   // golden honey
  400: '#F5BC28',   // bright gold
  500: '#D4A020',   // antique gold        ← primary
  600: '#A87C18',   // deep gold
  700: '#7D5C10',   // dark amber
  800: '#523C08',   // deep amber
  900: '#281E04',   // near-black warm
  950: '#140F02',   // warm black

  _15: 'rgba(212,160,32,0.15)',
  _13: 'rgba(212,160,32,0.13)',
  _30: 'rgba(82,60,8,0.30)',

  darkBg:      '#100A00',
  darkSurface: '#1E1600',
  darkCard:    '#2C2000',

  lightBg:      '#FFFDF8',
  lightSurface: '#FFF8E6',
  lightCard:    '#FFF0CC',
};
