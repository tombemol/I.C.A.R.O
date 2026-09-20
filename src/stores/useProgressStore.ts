import { create } from 'zustand';
import { completeMissionThroughEngine } from '../lib/missionCompletionService';
import {
  loadCompletedMissionIds,
  loadPlayerProgress,
  loadProgressStats,
} from '../lib/progressStorage';
import type { DailyMission } from '../types/mission';
import {
  emptyProgressStats,
  type PlayerProgress,
  type ProgressStats,
} from '../types/progress';

type ProgressStatus = 'idle' | 'loading' | 'ready' | 'error';

type ProgressState = {
  progress: PlayerProgress | null;
  completionStats: ProgressStats;
  completedMissionIds: string[];
  missionDate: string | null;
  status: ProgressStatus;
  error: string | null;
  completingMissionId: string | null;
  hydrate: (missionDate: string) => Promise<void>;
  completeMission: (mission: DailyMission) => Promise<boolean>;
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: null,
  completionStats: emptyProgressStats(),
  completedMissionIds: [],
  missionDate: null,
  status: 'idle',
  error: null,
  completingMissionId: null,

  hydrate: async (missionDate) => {
    if (get().status === 'loading') return;
    if (get().status === 'ready' && get().missionDate === missionDate) return;

    set({ status: 'loading', error: null });

    try {
      const [progress, completedMissionIds, completionStats] = await Promise.all([
        loadPlayerProgress(),
        loadCompletedMissionIds(missionDate),
        loadProgressStats(missionDate),
      ]);

      set({
        progress,
        completionStats,
        completedMissionIds,
        missionDate,
        status: 'ready',
        error: null,
      });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Falha ao carregar seu progresso.',
      });
    }
  },

  completeMission: async (mission) => {
    if (get().completingMissionId) return false;
    if (get().completedMissionIds.includes(mission.id)) return false;

    set({ completingMissionId: mission.id, error: null });

    try {
      const { progress, inserted } = await completeMissionThroughEngine(mission);
      let completionStats = get().completionStats;

      if (inserted) {
        try {
          completionStats = await loadProgressStats(mission.missionDate);
        } catch {
          // Estatísticas são derivadas. A recompensa persistida continua sendo a fonte da verdade.
        }
      }

      set((state) => ({
        progress,
        completionStats,
        completedMissionIds: inserted
          ? [...state.completedMissionIds, mission.id]
          : state.completedMissionIds,
        completingMissionId: null,
        status: 'ready',
      }));

      return inserted;
    } catch (error) {
      set({
        completingMissionId: null,
        error: error instanceof Error ? error.message : 'Não foi possível concluir a missão.',
      });
      return false;
    }
  },
}));
