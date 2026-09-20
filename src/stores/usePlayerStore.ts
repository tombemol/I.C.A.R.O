import { create } from 'zustand';

type PlayerState = {
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  name: string;
  gainXp: (amount: number) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  level: 4,
  xp: 680,
  xpToNext: 1000,
  streak: 6,
  name: 'Tom',
  gainXp: (amount) =>
    set((state) => {
      const nextXp = state.xp + amount;
      if (nextXp >= state.xpToNext) {
        return {
          xp: nextXp - state.xpToNext,
          level: state.level + 1,
          xpToNext: Math.round(state.xpToNext * 1.15),
        };
      }
      return { xp: nextXp };
    }),
}));
