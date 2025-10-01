import { create } from 'zustand';

export type Slot = { id: string; service: string; start: string; end: string; userId: string };

type DashboardState = {
  slots: Slot[];
  credits: number;
  badges: string[];
  addSlot: (s: Slot) => void;
  setCredits: (n: number) => void;
};

export const useDashboard = create<DashboardState>((set) => ({
  slots: [
    { id: '1', service: 'Netflix', start: '12:00', end: '14:00', userId: 'u1' },
    { id: '2', service: 'Disney+', start: '18:00', end: '19:00', userId: 'u1' }
  ],
  credits: 40,
  badges: ['Sharer', 'Saver'],
  addSlot: (s) => set((st) => ({ slots: [...st.slots, s] })),
  setCredits: (n) => set(() => ({ credits: n }))
}));


