import { create } from 'zustand';

interface SecurityState {
  isPinEnabled: boolean;
  isLocked: boolean;
  suppressNextLock: boolean;
  isPickingMedia: boolean;
  setPinEnabled: (enabled: boolean) => void;
  lock: () => void;
  unlock: () => void;
  suppressLock: () => void;
  clearSuppressLock: () => void;
  setPickingMedia: (picking: boolean) => void;
}

export const useSecurityStore = create<SecurityState>(set => ({
  isPinEnabled: false,
  isLocked: false,
  suppressNextLock: false,
  isPickingMedia: false,
  setPinEnabled: enabled => set({ isPinEnabled: enabled }),
  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false }),
  suppressLock: () => set({ suppressNextLock: true }),
  clearSuppressLock: () => set({ suppressNextLock: false }),
  setPickingMedia: picking => set({ isPickingMedia: picking }),
}));
