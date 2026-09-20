import { create } from 'zustand';
import {
  checkHealthPermissions,
  getHealthAvailability,
  openHealthConnectSettings,
  requestHealthPermissions,
} from '../lib/healthConnect';
import { syncHealthConnectDay } from '../lib/healthMissionSync';
import type {
  HealthAvailability,
  HealthDailySnapshot,
  HealthPermissionResponse,
  HealthSyncResult,
} from '../types/healthConnect';
import type { DailyMission } from '../types/mission';

type HealthConnectStatus =
  | 'idle'
  | 'checking'
  | 'ready'
  | 'requesting'
  | 'syncing'
  | 'error';

type HealthConnectState = {
  availability: HealthAvailability | null;
  permissions: HealthPermissionResponse | null;
  snapshot: HealthDailySnapshot | null;
  status: HealthConnectStatus;
  error: string | null;
  lastSyncDate: string | null;
  lastSyncedAt: string | null;
  lastAutoCompletedIds: string[];
  initialize: () => Promise<void>;
  requestAccess: () => Promise<HealthPermissionResponse | null>;
  syncDay: (
    dateKey: string,
    missions: DailyMission[],
    force?: boolean,
  ) => Promise<HealthSyncResult | null>;
  openSettings: () => Promise<void>;
};

export const useHealthConnectStore = create<HealthConnectState>((set, get) => ({
  availability: null,
  permissions: null,
  snapshot: null,
  status: 'idle',
  error: null,
  lastSyncDate: null,
  lastSyncedAt: null,
  lastAutoCompletedIds: [],

  initialize: async () => {
    const currentStatus = get().status;
    if (['checking', 'requesting', 'syncing'].includes(currentStatus)) return;

    set({ status: 'checking', error: null });

    try {
      const availability = await getHealthAvailability();

      if (!availability.available) {
        set({
          availability,
          permissions: null,
          status: 'ready',
          error: null,
        });
        return;
      }

      const permissions = await checkHealthPermissions();
      set({
        availability,
        permissions,
        status: 'ready',
        error: null,
      });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error
          ? error.message
          : 'Não foi possível verificar o Health Connect.',
      });
    }
  },

  requestAccess: async () => {
    if (!get().availability?.available) return null;

    set({ status: 'requesting', error: null });

    try {
      const permissions = await requestHealthPermissions();
      set({
        permissions,
        status: 'ready',
        error: null,
      });
      return permissions;
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error
          ? error.message
          : 'Não foi possível solicitar acesso ao Health Connect.',
      });
      return null;
    }
  },

  syncDay: async (dateKey, missions, force = false) => {
    if (get().status === 'syncing') return null;
    if (!force && get().lastSyncDate === dateKey) return null;

    const availability = get().availability;
    const permissions = get().permissions;
    if (!availability?.available || !permissions || permissions.granted.length === 0) {
      return null;
    }

    set({ status: 'syncing', error: null });

    try {
      const result = await syncHealthConnectDay(dateKey, missions, permissions);
      set({
        snapshot: result.snapshot,
        status: 'ready',
        error: null,
        lastSyncDate: dateKey,
        lastSyncedAt: new Date().toISOString(),
        lastAutoCompletedIds: result.newlyCompletedMissionIds,
      });
      return result;
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error
          ? error.message
          : 'Não foi possível sincronizar o Health Connect.',
      });
      return null;
    }
  },

  openSettings: async () => {
    try {
      await openHealthConnectSettings();
    } catch (error) {
      set({
        error: error instanceof Error
          ? error.message
          : 'Não foi possível abrir as configurações do Health Connect.',
      });
    }
  },
}));
