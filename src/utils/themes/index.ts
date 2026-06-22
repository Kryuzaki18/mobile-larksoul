export type { ColorTheme } from '../../models/interfaces/colors.types';
export { Colors } from './colors';

// ── Warm ──────────────────────────────────────────────────────────────────────
export { AurumTheme }   from './aurum';
export { OrangeTheme }  from './orange';
export { RoseTheme }    from './rose';
export { CrimsonTheme } from './crimson';
export { ChocoTheme }   from './choco';

// ── Cool ──────────────────────────────────────────────────────────────────────
export { AzureTheme } from './azure';
export { TealTheme } from './teal';
export { JadeTheme } from './jade';
export { VioletTheme } from './violet';

// ── Registry ──────────────────────────────────────────────────────────────────
import { AurumTheme }   from './aurum';
import { OrangeTheme }  from './orange';
import { RoseTheme }    from './rose';
import { CrimsonTheme } from './crimson';
import { ChocoTheme }   from './choco';
import { AzureTheme } from './azure';
import { TealTheme } from './teal';
import { JadeTheme } from './jade';
import { VioletTheme } from './violet';

export const COLOR_THEMES = {
  // Warm
  aurum:   AurumTheme,
  orange:  OrangeTheme,
  rose:    RoseTheme,
  crimson: CrimsonTheme,
  choco:   ChocoTheme,
  // Cool
  azure: AzureTheme,
  teal: TealTheme,
  jade: JadeTheme,
  violet: VioletTheme,
} as const;

export type ThemeName = keyof typeof COLOR_THEMES;
