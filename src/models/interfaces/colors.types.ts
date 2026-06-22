export interface ColorTheme {
  name:        string;
  label:       string;
  description: string;
  emoji:       string;

  // Full hue scale (50 = lightest, 950 = darkest)
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

  // Translucent helpers
  _15: string;   // 500 @ 15 %  — chip / hover bg
  _13: string;   // 500 @ 13 %  — subtle tint
  _30: string;   // 800 @ 30 %  — active tab bg (dark)

  // Dark-mode surfaces  page → sheet → elevated card
  darkBg:      string;
  darkSurface: string;
  darkCard:    string;

  // Light-mode surfaces
  lightBg:      string;
  lightSurface: string;
  lightCard:    string;
}
