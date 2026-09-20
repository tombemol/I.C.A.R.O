import { create } from 'zustand';
import { generateDailyMissions, localDateKey } from '../lib/missionGenerator';
import { loadDailyMissions, saveDailyMissions } from '../lib/missionStorage';
import type { DailyMission } from '../types/mission';
import type { PlayerProfile } from '../types/player';

type MissionStatus = 'idle' | 'loading' | 'ready' | 'error';

type MissionState = {
  missions: DailyMission[];
  missionDate: string | null;
  status: MissionStatus;
  error: string | null;
  hydrateForProfile: (profile: PlayerProfile) => Promise<void>;
};

export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  missionDate: null,
  status: 'idle',
  error: null,

  hydrateForProfile: async (profile) => {
    const today = localDateKey();

    if (get().status === 'ready' && get().missionDate === today) return;
    if (get().status === 'loading') return;

    set({ status: 'loading', error: null });

    try {
      let missions = await loadDailyMissions(today);

      if (missions.length === 0) {
        missions = generateDailyMissions(profile, today);
        await saveDailyMissions(missions);
      }

      set({
        missions,
        missionDate: today,
        status: 'ready',
        error: null,
      });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Falha ao preparar as missões do dia.',
      });
    }
  },
}));
