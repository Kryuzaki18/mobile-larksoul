export interface ColorTheme {
  name:        string;
  label:       string;
  description: string;
  emoji:       string;

  50: string; 100: string; 200: string; 300: string; 400: string;
  500: string;
  600: string; 700: string; 800: string; 900: string; 950: string;

  _15: string;
  _13: string;
  _30: string;

  darkBg: string; darkSurface: string; darkCard: string;
  lightBg: string; lightSurface: string; lightCard: string;
}
