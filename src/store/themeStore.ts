import { create } from 'zustand';
import { colorScheme } from 'nativewind';
import type { ThemePreference } from '../models/types/ui.type';
import { getSetting, setSetting } from '../database/functions/settings';
import type { ThemeName } from '../utils/themes';

const THEME_KEY       = 'theme';
const COLOR_THEME_KEY = 'colorTheme';

interface ThemeState {
  theme:          ThemePreference;
  colorTheme:     ThemeName;
  isReady:        boolean;
  hydrate:        () => Promise<void>;
  setTheme:       (theme: ThemePreference) => Promise<void>;
  setColorTheme:  (colorTheme: ThemeName)  => Promise<void>;
}

export const useThemeStore = create<ThemeState>(set => ({
  theme:      'system',
  colorTheme: 'aurum',
  isReady:    false,

  hydrate: async () => {
    const stored      = (await getSetting(THEME_KEY))       as ThemePreference | null;
    const storedColor = (await getSetting(COLOR_THEME_KEY)) as ThemeName | null;
    const theme       = stored      ?? 'system';
    const colorTheme  = storedColor ?? 'aurum';
    colorScheme.set(theme);
    set({ theme, colorTheme, isReady: true });
  },

  setTheme: async theme => {
    colorScheme.set(theme);
    set({ theme });
    await setSetting(THEME_KEY, theme);
  },

  setColorTheme: async colorTheme => {
    set({ colorTheme });
    await setSetting(COLOR_THEME_KEY, colorTheme);
  },
}));
