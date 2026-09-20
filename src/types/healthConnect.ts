export const requiredHealthMetrics = ['steps', 'distance', 'workouts'] as const;

export type HealthMetric = (typeof requiredHealthMetrics)[number];

export type HealthPlatform = 'android' | 'ios' | 'unsupported';

export type HealthAvailabilityReason =
  | 'providerUpdateRequired'
  | 'providerUnavailable'
  | 'healthDataUnavailable'
  | 'unsupportedPlatform';

export type HealthAvailability = {
  available: boolean;
  platform: HealthPlatform;
  reason?: HealthAvailabilityReason;
};

export type HealthPermissionResponse = {
  granted: string[];
  state: 'exact' | 'unknown';
};

export type HealthWorkout = {
  start: number;
  end: number;
  activityType: string;
  rawActivityType: number;
  durationSec: number;
  calories?: number;
  distanceMeters?: number;
  source?: string;
};

export type HealthDailySnapshot = {
  date: string;
  steps: number;
  distanceMeters: number;
  workouts: HealthWorkout[];
  activeMinutes: number;
  walkingMinutes: number;
  mobilityMinutes: number;
  longestSessionMinutes: number;
  warnings: string[];
};

export type HealthMissionMatch = {
  missionId: string;
  metric: string;
  value: number;
  target: number;
  unit: string;
};

export type HealthSyncResult = {
  snapshot: HealthDailySnapshot;
  matchedMissions: HealthMissionMatch[];
  newlyCompletedMissionIds: string[];
};
