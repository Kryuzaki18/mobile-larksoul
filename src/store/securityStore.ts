import { create } from 'zustand';

interface SecurityState {
  isPinEnabled: boolean;
  isLocked: boolean;
  setPinEnabled: (enabled: boolean) => void;
  lock: () => void;
  unlock: () => void;
}

export const useSecurityStore = create<SecurityState>(set => ({
  isPinEnabled: false,
  isLocked: false,
  setPinEnabled: enabled => set({ isPinEnabled: enabled }),
  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false }),
}));
