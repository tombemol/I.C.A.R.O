import { create } from 'zustand';
import { loadPlayerProfile, savePlayerProfile } from '../lib/playerStorage';
import type { PlayerProfile, PlayerProfileInput } from '../types/player';

type HydrationStatus = 'idle' | 'loading' | 'ready' | 'error';

type PlayerState = {
  profile: PlayerProfile | null;
  hydrationStatus: HydrationStatus;
  hydrationError: string | null;
  hydrate: () => Promise<void>;
  saveProfile: (input: PlayerProfileInput) => Promise<PlayerProfile>;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  profile: null,
  hydrationStatus: 'idle',
  hydrationError: null,

  hydrate: async () => {
    if (get().hydrationStatus === 'loading') return;

    set({ hydrationStatus: 'loading', hydrationError: null });
    try {
      const profile = await loadPlayerProfile();
      set({ profile, hydrationStatus: 'ready' });
    } catch (error) {
      set({
        hydrationStatus: 'error',
        hydrationError: error instanceof Error ? error.message : 'Falha ao carregar a ficha.',
      });
    }
  },

  saveProfile: async (input) => {
    const current = get().profile;
    const now = new Date().toISOString();
    const profile: PlayerProfile = {
      id: 'local-player',
      ...input,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    };

    await savePlayerProfile(profile);
    set({ profile, hydrationStatus: 'ready', hydrationError: null });
    return profile;
  },
}));
