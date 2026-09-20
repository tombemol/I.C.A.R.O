import { invoke } from '@tauri-apps/api/core';
import {
  requiredHealthMetrics,
  type HealthAvailability,
  type HealthDailySnapshot,
  type HealthMetric,
  type HealthPermissionResponse,
  type HealthWorkout,
} from '../types/healthConnect';

type AggregatedResponse = {
  buckets: Array<{
    start: number;
    end: number;
    value: number;
    unit: string;
  }>;
};

type WorkoutsResponse = {
  workouts: HealthWorkout[];
};

function isTauriRuntime() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

async function healthInvoke<T>(command: string, args?: Record<string, unknown>) {
  return invoke<T>('plugin:health|' + command, args);
}

export async function getHealthAvailability(): Promise<HealthAvailability> {
  if (!isTauriRuntime()) {
    return {
      available: false,
      platform: 'unsupported',
      reason: 'unsupportedPlatform',
    };
  }

  return healthInvoke<HealthAvailability>('is_available');
}

export async function checkHealthPermissions(): Promise<HealthPermissionResponse> {
  if (!isTauriRuntime()) {
    return { granted: [], state: 'exact' };
  }

  return healthInvoke<HealthPermissionResponse>('check_permissions');
}

export async function requestHealthPermissions(
  metrics: readonly HealthMetric[] = requiredHealthMetrics,
): Promise<HealthPermissionResponse> {
  return healthInvoke<HealthPermissionResponse>('request_permissions', {
    options: { read: [...metrics] },
  });
}

export async function openHealthConnectSettings() {
  if (!isTauriRuntime()) return;
  await healthInvoke<void>('open_settings');
}

function localDayRange(dateKey: string) {
  const start = new Date(dateKey + 'T00:00:00');
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: start.getTime(), end: end.getTime() };
}

async function queryAggregate(metric: 'steps' | 'distance', start: number, end: number) {
  return healthInvoke<AggregatedResponse>('query_aggregated', {
    options: {
      metric,
      start,
      end,
      bucket: 'day',
    },
  });
}

async function queryWorkouts(start: number, end: number) {
  return healthInvoke<WorkoutsResponse>('query_workouts', {
    options: { start, end },
  });
}

function sumBuckets(response: AggregatedResponse | null) {
  return response?.buckets.reduce((sum, bucket) => sum + Number(bucket.value || 0), 0) ?? 0;
}

export async function loadDailyHealthSnapshot(
  dateKey: string,
  permissions: HealthPermissionResponse,
): Promise<HealthDailySnapshot> {
  const granted = new Set(permissions.granted);
  const { start, end } = localDayRange(dateKey);
  const warnings: string[] = [];

  const stepsPromise = granted.has('steps')
    ? queryAggregate('steps', start, end)
    : Promise.resolve<AggregatedResponse | null>(null);

  const distancePromise = granted.has('distance')
    ? queryAggregate('distance', start, end)
    : Promise.resolve<AggregatedResponse | null>(null);

  const workoutsPromise = granted.has('workouts')
    ? queryWorkouts(start, end)
    : Promise.resolve<WorkoutsResponse | null>(null);

  const [stepsResult, distanceResult, workoutsResult] = await Promise.allSettled([
    stepsPromise,
    distancePromise,
    workoutsPromise,
  ]);

  const stepsResponse = stepsResult.status === 'fulfilled' ? stepsResult.value : null;
  const distanceResponse = distanceResult.status === 'fulfilled' ? distanceResult.value : null;
  const workoutsResponse = workoutsResult.status === 'fulfilled' ? workoutsResult.value : null;

  if (stepsResult.status === 'rejected') warnings.push('Não foi possível ler passos.');
  if (distanceResult.status === 'rejected') warnings.push('Não foi possível ler distância.');
  if (workoutsResult.status === 'rejected') warnings.push('Não foi possível ler treinos.');

  const workouts = workoutsResponse?.workouts ?? [];
  const activeMinutes = workouts.reduce((sum, workout) => sum + workout.durationSec / 60, 0);
  const walkingMinutes = workouts
    .filter((workout) => workout.activityType === 'walking')
    .reduce((sum, workout) => sum + workout.durationSec / 60, 0);
  const mobilityMinutes = workouts
    .filter((workout) => ['yoga', 'pilates'].includes(workout.activityType))
    .reduce((sum, workout) => sum + workout.durationSec / 60, 0);
  const longestSessionMinutes = workouts.reduce(
    (longest, workout) => Math.max(longest, workout.durationSec / 60),
    0,
  );

  return {
    date: dateKey,
    steps: Math.round(sumBuckets(stepsResponse)),
    distanceMeters: sumBuckets(distanceResponse),
    workouts,
    activeMinutes: Math.round(activeMinutes * 10) / 10,
    walkingMinutes: Math.round(walkingMinutes * 10) / 10,
    mobilityMinutes: Math.round(mobilityMinutes * 10) / 10,
    longestSessionMinutes: Math.round(longestSessionMinutes * 10) / 10,
    warnings,
  };
}
