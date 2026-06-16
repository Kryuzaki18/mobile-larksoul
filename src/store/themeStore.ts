import { create } from 'zustand';
import { colorScheme } from 'nativewind';
import type { ThemePreference } from '../models/types/ui.type';
import { getSetting, setSetting } from '../database/functions/settings';

const THEME_KEY = 'theme';

interface ThemeState {
  theme: ThemePreference;
  isReady: boolean;
  hydrate: () => Promise<void>;
  setTheme: (theme: ThemePreference) => Promise<void>;
}

export const useThemeStore = create<ThemeState>(set => ({
  theme: 'system',
  isReady: false,

  hydrate: async () => {
    const stored = (await getSetting(THEME_KEY)) as ThemePreference | null;
    const theme = stored ?? 'system';
    colorScheme.set(theme);
    set({ theme, isReady: true });
  },

  setTheme: async theme => {
    colorScheme.set(theme);
    set({ theme });
    await setSetting(THEME_KEY, theme);
  },
}));
