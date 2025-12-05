import { create } from 'zustand';

interface MenuState {
  isCompact: boolean;
  setIsCompact: (value: boolean) => void;
  toggleCompact: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  isCompact: false,
  setIsCompact: (value) => set({ isCompact: value }),
  toggleCompact: () => set((state) => ({ isCompact: !state.isCompact })),
}));
