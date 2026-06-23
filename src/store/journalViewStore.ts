import { create } from 'zustand';
import { getSetting, setSetting } from '../database/functions/settings';

const LAYOUT_KEY = 'larksoul_journal_layout';
const SHOW_ALL_KEY = 'larksoul_journal_show_all';
const AUTO_DATE_PICKER_KEY = 'larksoul_journal_auto_date_picker';

export type JournalLayout = 'list' | 'grid';

interface JournalViewState {
  layout: JournalLayout;
  showAll: boolean;
  autoShowDatePicker: boolean;
  hydrate: () => Promise<void>;
  setLayout: (layout: JournalLayout) => Promise<void>;
  setShowAll: (value: boolean) => Promise<void>;
  toggleAll: () => Promise<void>;
  setAutoShowDatePicker: (value: boolean) => Promise<void>;
}

export const useJournalViewStore = create<JournalViewState>((set, get) => ({
  layout: 'grid',
  showAll: true,
  autoShowDatePicker: true,

  hydrate: async () => {
    const [storedLayout, storedShowAll, storedAutoDatePicker] = await Promise.all([
      getSetting(LAYOUT_KEY),
      getSetting(SHOW_ALL_KEY),
      getSetting(AUTO_DATE_PICKER_KEY),
    ]);
    set({
      layout: (storedLayout as JournalLayout) ?? 'grid',
      showAll: storedShowAll !== null ? storedShowAll === 'true' : true,
      autoShowDatePicker: storedAutoDatePicker !== null ? storedAutoDatePicker === 'true' : true,
    });
  },

  setLayout: async (layout) => {
    set({ layout });
    await setSetting(LAYOUT_KEY, layout);
  },

  setShowAll: async (value) => {
    set({ showAll: value });
    await setSetting(SHOW_ALL_KEY, String(value));
  },

  toggleAll: async () => {
    const next = !get().showAll;
    set({ showAll: next });
    await setSetting(SHOW_ALL_KEY, String(next));
  },

  setAutoShowDatePicker: async (value) => {
    set({ autoShowDatePicker: value });
    await setSetting(AUTO_DATE_PICKER_KEY, String(value));
  },
}));
