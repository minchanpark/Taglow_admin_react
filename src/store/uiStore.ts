import { create } from 'zustand';

type UiState = {
  isSidebarCollapsed: boolean;
  toastMessage?: string;
  toggleSidebar(): void;
  setToastMessage(message?: string): void;
};

export const useUiStore = create<UiState>((set) => ({
  isSidebarCollapsed: false,
  toastMessage: undefined,
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setToastMessage: (toastMessage) => set({ toastMessage }),
}));
