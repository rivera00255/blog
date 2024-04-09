import { create } from 'zustand';

type PageMarkerState = {
  page: number;
  save: (page: number) => void;
  reset: () => void;
};

export const usePageMarkerState = create<PageMarkerState>((set) => ({
  page: 1,
  save: (page: number) => set({ page: page }),
  reset: () => set({ page: 1 }),
}));
