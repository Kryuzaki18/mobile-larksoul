// CRIMSON — Scarlet Red · hue 355°
// Bold, passionate, energetic. True crimson at 355° — no orange drift,
// no pink softness. Blood-red darks, saturated scarlet accents.

import type { ColorTheme } from '../../models/interfaces/colors.types';

export const CrimsonTheme: ColorTheme = {
  name:        'crimson',
  label:       'Crimson',
  description: 'Vivid scarlet red — bold and passionate',
  emoji:       '🔴',

  50:  '#FFF0F0',   // white-red
  100: '#FFD4D4',   // pale blush red
  200: '#FFA8A8',   // light red
  300: '#F07070',   // salmon red
  400: '#D83C3C',   // vivid red
  500: '#C01E1E',   // crimson             ← primary
  600: '#9A1414',   // deep crimson
  700: '#730E0E',   // dark red
  800: '#4D0808',   // blood red
  900: '#260404',   // near-black red
  950: '#130202',   // red black

  _15: 'rgba(192,30,30,0.15)',
  _13: 'rgba(192,30,30,0.13)',
  _30: 'rgba(77,8,8,0.30)',

  darkBg:      '#110202',
  darkSurface: '#1F0404',
  darkCard:    '#2D0606',

  lightBg:      '#FFF8F8',
  lightSurface: '#FFEFEF',
  lightCard:    '#FFE0E0',
};
