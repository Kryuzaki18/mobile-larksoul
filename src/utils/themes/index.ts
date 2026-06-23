export type { ColorTheme } from '../../models/interfaces/colors.types';
export { Colors } from './colors';

// ── Warm ──────────────────────────────────────────────────────────────────────
export { AurumTheme }   from './aurum';
export { OrangeTheme }  from './orange';
export { CrimsonTheme } from './crimson';
export { ChocoTheme }   from './choco';

// ── Cool ──────────────────────────────────────────────────────────────────────
export { JadeTheme } from './jade';
export { VioletTheme } from './violet';
export { TealTheme } from './teal';
export { AzureTheme } from './azure';

// ── Registry ──────────────────────────────────────────────────────────────────
import { AurumTheme }   from './aurum';
import { OrangeTheme }  from './orange';
import { CrimsonTheme } from './crimson';
import { ChocoTheme }   from './choco';
import { JadeTheme } from './jade';
import { VioletTheme } from './violet';
import { TealTheme } from './teal';
import { AzureTheme } from './azure';

export const COLOR_THEMES = {
  // Warm
  aurum:   AurumTheme,
  orange:  OrangeTheme,
  crimson: CrimsonTheme,
  choco:   ChocoTheme,
  // Cool
  jade: JadeTheme,
  violet: VioletTheme,
  teal: TealTheme,
  azure: AzureTheme,
} as const;

export type ThemeName = keyof typeof COLOR_THEMES;
