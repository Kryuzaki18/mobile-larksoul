import { create } from 'zustand';
import type { ViewMode } from '../models/types/ui.type';

interface SettingsState {
  defaultLayout: ViewMode;
  setDefaultLayout: (layout: ViewMode) => void;
}

export const useSettingsStore = create<SettingsState>(set => ({
  defaultLayout: 'calendar',
  setDefaultLayout: layout => set({ defaultLayout: layout }),
}));
