"use client";
import { create } from "zustand";

type NavigationState = {
  isOpen: boolean;
  activeItem: string | null;
  toggle: () => void;
  close: () => void;
  setActiveItem: (item: string | null) => void;
};

export const useNavigationStore = create<NavigationState>((set) => ({
  isOpen: false,
  activeItem: null,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
  setActiveItem: (activeItem) => set({ activeItem }),
}));

