import { create } from 'zustand';

import type { User } from '../types/user';

interface AuthState {
  currentUser: User | null;
  isGuest: boolean;
  setUser: (user: User, isGuest?: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  currentUser: null,
  isGuest: false,
  setUser: (user, isGuest = false) => set({ currentUser: user, isGuest }),
  clearUser: () => set({ currentUser: null, isGuest: false }),
}));
