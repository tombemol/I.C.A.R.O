import type { HealthDailySnapshot, HealthMetric } from '../types/healthConnect';
import type { DailyMission, MissionCategory } from '../types/mission';
import type {
  LifeAttribute,
  LifeEventMetadataValue,
  LifeEventSource,
  LifeEventType,
  NewLifeEvent,
} from '../types/lifeEvent';

const attributeByMissionCategory: Record<MissionCategory, LifeAttribute> = {
  MOVIMENTO: 'CONDICIONAMENTO',
  FORCA: 'FORCA',
  MOBILIDADE: 'MOBILIDADE',
  CONSTANCIA: 'CONSTANCIA',
};

export type HealthMissionMetric =
  | 'distanceKm'
  | 'activeMinutes'
  | 'walkingMinutes'
  | 'mobilityMinutes'
  | 'longestSessionMinutes';

export type MissionValidationRule = {
  eventType: LifeEventType;
  target: number;
  unit: string;
  metric: HealthMissionMetric;
  requiredPermission: HealthMetric;
  label: string;
};

export type HealthMissionEvaluation = MissionValidationRule & {
  value: number;
  met: boolean;
};

export function attributePointsForMission(mission: DailyMission) {
  return Math.max(1, Math.round(mission.xp / 10));
}

export function missionCompletionToLifeEvent(
  mission: DailyMission,
  createdAt = new Date().toISOString(),
  source: LifeEventSource = 'MANUAL',
  extraMetadata: Record<string, LifeEventMetadataValue> = {},
): NewLifeEvent {
  const eventId = 'mission:' + mission.id + ':completed';

  return {
    id: eventId,
    eventDate: mission.missionDate,
    type: 'MISSION_COMPLETED',
    source,
    attribute: attributeByMissionCategory[mission.category],
    attributePoints: attributePointsForMission(mission),
    quantity: mission.target,
    unit: mission.unit,
    referenceId: mission.id,
    dedupeKey: eventId,
    metadata: {
      templateId: mission.templateId,
      title: mission.title,
      category: mission.category,
      ...extraMetadata,
    },
    createdAt,
  };
}

export function missionValidationRule(mission: DailyMission): MissionValidationRule | null {
  const base = { target: mission.target };

  switch (mission.templateId) {
    case 'walk-distance':
      return {
        ...base,
        eventType: 'DISTANCE_RECORDED',
        unit: 'km',
        metric: 'distanceKm',
        requiredPermission: 'distance',
        label: 'distância diária',
      };
    case 'active-minutes':
    case 'movement-breaks':
      return {
        ...base,
        eventType: 'EXERCISE_SESSION',
        unit: 'min',
        metric: 'activeMinutes',
        requiredPermission: 'workouts',
        label: 'minutos de treino',
      };
    case 'easy-walk':
      return {
        ...base,
        eventType: 'EXERCISE_SESSION',
        unit: 'min',
        metric: 'walkingMinutes',
        requiredPermission: 'workouts',
        label: 'minutos caminhando',
      };
    case 'minimum-session':
      return {
        ...base,
        eventType: 'EXERCISE_SESSION',
        unit: 'min',
        metric: 'longestSessionMinutes',
        requiredPermission: 'workouts',
        label: 'sessão contínua',
      };
    case 'mobility-flow':
      return {
        ...base,
        eventType: 'EXERCISE_SESSION',
        unit: 'min',
        metric: 'mobilityMinutes',
        requiredPermission: 'workouts',
        label: 'mobilidade registrada',
      };
    default:
      return null;
  }
}

function metricValue(metric: HealthMissionMetric, snapshot: HealthDailySnapshot) {
  switch (metric) {
    case 'distanceKm':
      return snapshot.distanceMeters / 1000;
    case 'activeMinutes':
      return snapshot.activeMinutes;
    case 'walkingMinutes':
      return snapshot.walkingMinutes;
    case 'mobilityMinutes':
      return snapshot.mobilityMinutes;
    case 'longestSessionMinutes':
      return snapshot.longestSessionMinutes;
  }
}

export function evaluateMissionWithHealth(
  mission: DailyMission,
  snapshot: HealthDailySnapshot,
  grantedPermissions: readonly string[],
): HealthMissionEvaluation | null {
  const rule = missionValidationRule(mission);
  if (!rule || !grantedPermissions.includes(rule.requiredPermission)) return null;

  const value = Math.round(metricValue(rule.metric, snapshot) * 10) / 10;
  return {
    ...rule,
    value,
    met: value >= rule.target,
  };
}
