import { useThemeStore } from '../store/themeStore';
import { COLOR_THEMES, type ColorTheme } from '../utils/themes';

export function useActiveTheme(): ColorTheme {
  const colorTheme = useThemeStore(s => s.colorTheme);
  return COLOR_THEMES[colorTheme];
}
