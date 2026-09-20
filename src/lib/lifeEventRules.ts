import type { DailyMission, MissionCategory } from '../types/mission';
import type {
  LifeAttribute,
  LifeEventType,
  NewLifeEvent,
} from '../types/lifeEvent';

const attributeByMissionCategory: Record<MissionCategory, LifeAttribute> = {
  MOVIMENTO: 'CONDICIONAMENTO',
  FORCA: 'FORCA',
  MOBILIDADE: 'MOBILIDADE',
  CONSTANCIA: 'CONSTANCIA',
};

const durationTemplates = new Set([
  'active-minutes',
  'easy-walk',
  'mobility-flow',
  'minimum-session',
  'movement-breaks',
]);

export type MissionValidationRule = {
  eventType: LifeEventType;
  target: number;
  unit: string;
};

export function attributePointsForMission(mission: DailyMission) {
  return Math.max(1, Math.round(mission.xp / 10));
}

export function missionCompletionToLifeEvent(
  mission: DailyMission,
  createdAt = new Date().toISOString(),
): NewLifeEvent {
  const eventId = `mission:${mission.id}:completed`;

  return {
    id: eventId,
    eventDate: mission.missionDate,
    type: 'MISSION_COMPLETED',
    source: 'MANUAL',
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
    },
    createdAt,
  };
}

export function missionValidationRule(mission: DailyMission): MissionValidationRule | null {
  if (mission.templateId === 'walk-distance') {
    return {
      eventType: 'DISTANCE_RECORDED',
      target: mission.target,
      unit: 'km',
    };
  }

  if (durationTemplates.has(mission.templateId)) {
    return {
      eventType: 'EXERCISE_SESSION',
      target: mission.target,
      unit: 'min',
    };
  }

  return null;
}
