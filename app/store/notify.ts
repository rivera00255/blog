import { create } from 'zustand';

type NotifyState = {
  notify: { message: string | null };
  show: ({ message }: { message: string }) => void;
  close: () => void;
};

export const useNotifyStore = create<NotifyState>((set) => ({
  notify: { message: null },
  show: ({ message }: { message: string }) => set({ notify: { message } }),
  close: () => set({ notify: { message: null } }),
}));
