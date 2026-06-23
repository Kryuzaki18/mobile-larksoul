import { create } from 'zustand';
import { getSetting, setSetting } from '../database/functions/settings';

const LAYOUT_KEY = 'journal_layout';
const SHOW_ALL_KEY = 'journal_show_all';

export type JournalLayout = 'list' | 'grid';

interface JournalViewState {
  layout: JournalLayout;
  showAll: boolean;
  hydrate: () => Promise<void>;
  setLayout: (layout: JournalLayout) => Promise<void>;
  toggleAll: () => Promise<void>;
}

export const useJournalViewStore = create<JournalViewState>((set, get) => ({
  layout: 'grid',
  showAll: true,

  hydrate: async () => {
    const [storedLayout, storedShowAll] = await Promise.all([
      getSetting(LAYOUT_KEY),
      getSetting(SHOW_ALL_KEY),
    ]);
    set({
      layout: (storedLayout as JournalLayout) ?? 'grid',
      showAll: storedShowAll !== null ? storedShowAll === 'true' : true,
    });
  },

  setLayout: async (layout) => {
    set({ layout });
    await setSetting(LAYOUT_KEY, layout);
  },

  toggleAll: async () => {
    const next = !get().showAll;
    set({ showAll: next });
    await setSetting(SHOW_ALL_KEY, String(next));
  },
}));
