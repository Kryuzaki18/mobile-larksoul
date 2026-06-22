// Three curated accent themes. Each mirrors the shape of Colors so they can
// slot in as drop-in replacements for the app's primary hue.
// Usage: import { AurumTheme as Theme } from './themes'
//        then swap Colors.blue* → Theme[500], Theme.darkBg, etc.

export interface ColorTheme {
  name:        string;
  label:       string;
  description: string;
  emoji:       string;

  // Full hue scale
  50:  string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;   // primary accent
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;

  // Translucent helpers — used for chips, focus rings, hover layers
  _15: string;   // 500 @ 15 %
  _13: string;   // 500 @ 13 %
  _30: string;   // 800 @ 30 %

  // Dark-mode surfaces (page → card → elevated card)
  darkBg:      string;
  darkSurface: string;
  darkCard:    string;

  // Light-mode surfaces
  lightBg:      string;
  lightSurface: string;
  lightCard:    string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AURUM — Antique Gold
// Warm, premium, editorial. Deep amber darks, glowing honey accents, ivory
// lights. The gold sits at hue 42° — rich enough to feel precious, warm
// enough to avoid the cheapness of pure #FFD700.
// ─────────────────────────────────────────────────────────────────────────────
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
  500: '#D4A020',   // antique gold  ← primary
  600: '#A87C18',   // deep gold
  700: '#7D5C10',   // dark amber
  800: '#523C08',   // deep amber
  900: '#281E04',   // near-black warm
  950: '#140F02',   // warm black

  _15: 'rgba(212,160,32,0.15)',
  _13: 'rgba(212,160,32,0.13)',
  _30: 'rgba(82,60,8,0.30)',

  darkBg:      '#100A00',   // deep warm black
  darkSurface: '#1E1600',   // dark amber tint
  darkCard:    '#2C2000',   // elevated amber

  lightBg:      '#FFFDF8',   // warm near-white
  lightSurface: '#FFF8E6',   // cream
  lightCard:    '#FFF0CC',   // honeyed parchment
};

// ─────────────────────────────────────────────────────────────────────────────
// AZURE — Powder Blue
// Airy, clear, optimistic. Crisp arctic darks, vivid sky accents, icy lights.
// Hue 200° keeps it sky-like rather than cold-cyan or deep-navy — the colour
// of a cloudless midday sky reflected in still water.
// ─────────────────────────────────────────────────────────────────────────────
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
  500: '#0A98D0',   // azure          ← primary
  600: '#087FAE',   // deep azure
  700: '#066088',   // dark azure
  800: '#044260',   // deep navy
  900: '#022138',   // near-black cool
  950: '#01111E',   // arctic black

  _15: 'rgba(10,152,208,0.15)',
  _13: 'rgba(10,152,208,0.13)',
  _30: 'rgba(4,66,96,0.30)',

  darkBg:      '#030D16',   // deep cold black
  darkSurface: '#071E30',   // dark navy
  darkCard:    '#0C2E48',   // elevated navy

  lightBg:      '#F8FCFF',   // ice near-white
  lightSurface: '#EBF6FF',   // pale blue
  lightCard:    '#D6EDFF',   // soft baby blue
};

// ─────────────────────────────────────────────────────────────────────────────
// JADE — Vivid Mint
// Fresh, vital, natural. Deep forest darks, glowing jade accents, crisp mint
// whites. Hue 155° is the sweet spot between clinical teal and yellow lime —
// think tropical leaves, jade stone, or a mountain spring.
// ─────────────────────────────────────────────────────────────────────────────
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
  500: '#10B87C',   // jade green     ← primary
  600: '#0C9362',   // deep jade
  700: '#096E49',   // forest jade
  800: '#064A32',   // dark green
  900: '#03241A',   // near-black forest
  950: '#01130D',   // forest black

  _15: 'rgba(16,184,124,0.15)',
  _13: 'rgba(16,184,124,0.13)',
  _30: 'rgba(6,74,50,0.30)',

  darkBg:      '#030F08',   // deep forest black
  darkSurface: '#071A10',   // dark forest
  darkCard:    '#0C2618',   // elevated forest

  lightBg:      '#F5FFFB',   // mint near-white
  lightSurface: '#EAFFF5',   // pale mint
  lightCard:    '#D4FFE9',   // soft mint
};

// ─────────────────────────────────────────────────────────────────────────────
// CHOCO — Dark Chocolate
// Indulgent, cozy, rich. Espresso darks, saddle-brown accents, parchment
// lights. Hue 25° at restrained saturation (76%) keeps it squarely in
// chocolate territory — no orange drift, no muddy beige.
// Scale reads: espresso → dark chocolate → milk chocolate → cream → ivory.
// ─────────────────────────────────────────────────────────────────────────────
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
  500: '#8B4513',   // saddle brown ← primary
  600: '#6D3410',   // dark chocolate
  700: '#51270C',   // bitter chocolate
  800: '#361908',   // espresso
  900: '#1C0D03',   // near-black coffee
  950: '#0E0601',   // espresso black

  _15: 'rgba(139,69,19,0.15)',
  _13: 'rgba(139,69,19,0.13)',
  _30: 'rgba(54,25,8,0.30)',

  darkBg:      '#0C0501',   // deep espresso black
  darkSurface: '#180C03',   // dark roast
  darkCard:    '#261305',   // elevated espresso

  lightBg:      '#FDF9F6',   // warm near-white
  lightSurface: '#F7EEE5',   // parchment cream
  lightCard:    '#F0DFD0',   // warm parchment
};

// ─────────────────────────────────────────────────────────────────────────────
// Lookup map — index by theme name
// ─────────────────────────────────────────────────────────────────────────────
export const COLOR_THEMES = {
  aurum: AurumTheme,
  azure: AzureTheme,
  jade:  JadeTheme,
  choco: ChocoTheme,
} as const;

export type ThemeName = keyof typeof COLOR_THEMES;
