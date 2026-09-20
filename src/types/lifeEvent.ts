export const lifeAttributes = [
  'CONDICIONAMENTO',
  'FORCA',
  'MOBILIDADE',
  'CONSTANCIA',
] as const;

export const lifeEventTypes = [
  'MISSION_COMPLETED',
  'STEPS_RECORDED',
  'DISTANCE_RECORDED',
  'EXERCISE_SESSION',
] as const;

export const lifeEventSources = ['MANUAL', 'SYSTEM', 'HEALTH_CONNECT'] as const;

export type LifeAttribute = (typeof lifeAttributes)[number];
export type LifeEventType = (typeof lifeEventTypes)[number];
export type LifeEventSource = (typeof lifeEventSources)[number];
export type LifeEventMetadataValue = string | number | boolean | null;

export type LifeEvent = {
  id: string;
  eventDate: string;
  type: LifeEventType;
  source: LifeEventSource;
  attribute: LifeAttribute | null;
  attributePoints: number;
  quantity: number | null;
  unit: string | null;
  referenceId: string | null;
  dedupeKey: string;
  metadata: Record<string, LifeEventMetadataValue>;
  createdAt: string;
};

export type NewLifeEvent = Omit<LifeEvent, 'createdAt'> & {
  createdAt?: string;
};

export type PlayerAttributeProgress = {
  attribute: LifeAttribute;
  points: number;
  level: number;
  updatedAt: string;
};

export const ATTRIBUTE_LEVEL_STEP = 250;

export function attributeLevelFromPoints(points: number) {
  return Math.floor(Math.max(0, points) / ATTRIBUTE_LEVEL_STEP) + 1;
}

export const attributeLabels: Record<LifeAttribute, string> = {
  CONDICIONAMENTO: 'Condicionamento',
  FORCA: 'Força',
  MOBILIDADE: 'Mobilidade',
  CONSTANCIA: 'Constância',
};

export const lifeEventTypeLabels: Record<LifeEventType, string> = {
  MISSION_COMPLETED: 'Missão concluída',
  STEPS_RECORDED: 'Passos registrados',
  DISTANCE_RECORDED: 'Distância registrada',
  EXERCISE_SESSION: 'Sessão de exercício',
};

export const lifeEventSourceLabels: Record<LifeEventSource, string> = {
  MANUAL: 'Manual',
  SYSTEM: 'Sistema',
  HEALTH_CONNECT: 'Health Connect',
};
