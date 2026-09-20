import { create } from 'zustand';
import {
  loadPlayerAttributes,
  loadRecentLifeEvents,
  reconcileLifeEventsFromMissionCompletions,
} from '../lib/lifeEventStorage';
import type { LifeEvent, PlayerAttributeProgress } from '../types/lifeEvent';

type LifeEngineStatus = 'idle' | 'loading' | 'ready' | 'error';

type LifeEngineState = {
  attributes: PlayerAttributeProgress[];
  recentEvents: LifeEvent[];
  status: LifeEngineStatus;
  error: string | null;
  hydrate: () => Promise<void>;
};

export const useLifeEngineStore = create<LifeEngineState>((set, get) => ({
  attributes: [],
  recentEvents: [],
  status: 'idle',
  error: null,

  hydrate: async () => {
    if (get().status === 'loading') return;

    set({ status: 'loading', error: null });

    try {
      await reconcileLifeEventsFromMissionCompletions();
      const [attributes, recentEvents] = await Promise.all([
        loadPlayerAttributes(),
        loadRecentLifeEvents(),
      ]);

      set({
        attributes,
        recentEvents,
        status: 'ready',
        error: null,
      });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Falha ao carregar o motor de eventos.',
      });
    }
  },
}));
