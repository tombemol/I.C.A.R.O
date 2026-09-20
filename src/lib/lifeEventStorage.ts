import { missionCompletionToLifeEvent } from './lifeEventRules';
import type { DailyMission } from '../types/mission';
import {
  attributeLevelFromPoints,
  lifeAttributes,
  type LifeAttribute,
  type LifeEvent,
  type LifeEventMetadataValue,
  type NewLifeEvent,
  type PlayerAttributeProgress,
} from '../types/lifeEvent';

const DATABASE_URL = 'sqlite:icaro.db';
const WEB_EVENT_KEY = 'icaro.life-events.v1';
const WEB_ATTRIBUTE_KEY = 'icaro.player-attributes.v1';
const WEB_COMPLETION_KEY = 'icaro.mission-completions.v1';
const WEB_MISSION_PREFIX = 'icaro.daily-missions.v1:';

type AttributeRow = {
  attribute: LifeAttribute;
  points: number;
  updated_at: string;
};

type LifeEventRow = {
  id: string;
  event_date: string;
  event_type: LifeEvent['type'];
  source: LifeEvent['source'];
  attribute: LifeAttribute | null;
  attribute_points: number;
  quantity: number | null;
  unit: string | null;
  reference_id: string | null;
  dedupe_key: string;
  metadata_json: string;
  created_at: string;
};

type CompletionRecord = Record<string, {
  missionDate: string;
  xpAwarded: number;
  completedAt: string;
}>;

function isTauriRuntime() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

async function getDatabase() {
  const { default: Database } = await import('@tauri-apps/plugin-sql');
  return Database.load(DATABASE_URL);
}

function nowIso() {
  return new Date().toISOString();
}

function initialAttributes(): PlayerAttributeProgress[] {
  const updatedAt = nowIso();
  return lifeAttributes.map((attribute) => ({
    attribute,
    points: 0,
    level: 1,
    updatedAt,
  }));
}

function parseMetadata(value: string): Record<string, LifeEventMetadataValue> {
  try {
    return JSON.parse(value) as Record<string, LifeEventMetadataValue>;
  } catch {
    return {};
  }
}

function rowToEvent(row: LifeEventRow): LifeEvent {
  return {
    id: row.id,
    eventDate: row.event_date,
    type: row.event_type,
    source: row.source,
    attribute: row.attribute,
    attributePoints: Number(row.attribute_points),
    quantity: row.quantity === null ? null : Number(row.quantity),
    unit: row.unit,
    referenceId: row.reference_id,
    dedupeKey: row.dedupe_key,
    metadata: parseMetadata(row.metadata_json),
    createdAt: row.created_at,
  };
}

export async function loadPlayerAttributes(): Promise<PlayerAttributeProgress[]> {
  if (!isTauriRuntime()) {
    const stored = localStorage.getItem(WEB_ATTRIBUTE_KEY);
    if (!stored) return initialAttributes();

    const rows = JSON.parse(stored) as PlayerAttributeProgress[];
    const byAttribute = new Map(rows.map((row) => [row.attribute, row]));

    return lifeAttributes.map((attribute) => {
      const row = byAttribute.get(attribute);
      const points = Number(row?.points ?? 0);
      return {
        attribute,
        points,
        level: attributeLevelFromPoints(points),
        updatedAt: row?.updatedAt ?? nowIso(),
      };
    });
  }

  const db = await getDatabase();
  const rows = await db.select<AttributeRow[]>(
    `SELECT attribute, points, updated_at
     FROM player_attribute`,
  );
  const byAttribute = new Map(rows.map((row) => [row.attribute, row]));

  return lifeAttributes.map((attribute) => {
    const row = byAttribute.get(attribute);
    const points = Number(row?.points ?? 0);
    return {
      attribute,
      points,
      level: attributeLevelFromPoints(points),
      updatedAt: row?.updated_at ?? nowIso(),
    };
  });
}

export async function loadRecentLifeEvents(limit = 8): Promise<LifeEvent[]> {
  if (!isTauriRuntime()) {
    const events = JSON.parse(localStorage.getItem(WEB_EVENT_KEY) ?? '[]') as LifeEvent[];
    return events
      .slice()
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(0, limit);
  }

  const db = await getDatabase();
  const rows = await db.select<LifeEventRow[]>(
    `SELECT id, event_date, event_type, source, attribute, attribute_points, quantity,
            unit, reference_id, dedupe_key, metadata_json, created_at
     FROM life_event
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit],
  );

  return rows.map(rowToEvent);
}

export async function recordLifeEvent(input: NewLifeEvent): Promise<boolean> {
  const event: LifeEvent = {
    ...input,
    createdAt: input.createdAt ?? nowIso(),
  };

  if (!isTauriRuntime()) {
    const events = JSON.parse(localStorage.getItem(WEB_EVENT_KEY) ?? '[]') as LifeEvent[];
    if (events.some((item) => item.dedupeKey === event.dedupeKey)) return false;

    events.push(event);
    localStorage.setItem(WEB_EVENT_KEY, JSON.stringify(events));

    if (event.attribute && event.attributePoints > 0) {
      const attributes = await loadPlayerAttributes();
      const next = attributes.map((row) => {
        if (row.attribute !== event.attribute) return row;
        const points = row.points + event.attributePoints;
        return {
          ...row,
          points,
          level: attributeLevelFromPoints(points),
          updatedAt: event.createdAt,
        };
      });
      localStorage.setItem(WEB_ATTRIBUTE_KEY, JSON.stringify(next));
    }

    return true;
  }

  const db = await getDatabase();
  const result = await db.execute(
    `INSERT OR IGNORE INTO life_event (
      id, event_date, event_type, source, attribute, attribute_points, quantity,
      unit, reference_id, dedupe_key, metadata_json, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      event.id,
      event.eventDate,
      event.type,
      event.source,
      event.attribute,
      event.attributePoints,
      event.quantity,
      event.unit,
      event.referenceId,
      event.dedupeKey,
      JSON.stringify(event.metadata),
      event.createdAt,
    ],
  );

  return result.rowsAffected > 0;
}

async function reconcileWebMissionCompletions() {
  const completions = JSON.parse(localStorage.getItem(WEB_COMPLETION_KEY) ?? '{}') as CompletionRecord;
  if (Object.keys(completions).length === 0) return;

  const missions = new Map<string, DailyMission>();

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith(WEB_MISSION_PREFIX)) continue;

    try {
      const rows = JSON.parse(localStorage.getItem(key) ?? '[]') as DailyMission[];
      for (const mission of rows) missions.set(mission.id, mission);
    } catch {
      // Preview web é ambiente de desenvolvimento. Uma chave inválida não deve bloquear as demais.
    }
  }

  for (const [missionId, completion] of Object.entries(completions)) {
    const mission = missions.get(missionId);
    if (!mission) continue;
    await recordLifeEvent(missionCompletionToLifeEvent(mission, completion.completedAt));
  }
}

export async function reconcileLifeEventsFromMissionCompletions(): Promise<void> {
  if (!isTauriRuntime()) {
    await reconcileWebMissionCompletions();
    return;
  }

  const db = await getDatabase();
  await db.execute(
    `INSERT OR IGNORE INTO life_event (
      id, event_date, event_type, source, attribute, attribute_points, quantity,
      unit, reference_id, dedupe_key, metadata_json, created_at
    )
    SELECT
      'mission:' || mc.mission_id || ':completed',
      mc.mission_date,
      'MISSION_COMPLETED',
      'MANUAL',
      CASE dm.category
        WHEN 'MOVIMENTO' THEN 'CONDICIONAMENTO'
        WHEN 'FORCA' THEN 'FORCA'
        WHEN 'MOBILIDADE' THEN 'MOBILIDADE'
        ELSE 'CONSTANCIA'
      END,
      MAX(1, CAST(ROUND(dm.xp / 10.0) AS INTEGER)),
      dm.target,
      dm.unit,
      mc.mission_id,
      'mission:' || mc.mission_id || ':completed',
      '{}',
      mc.completed_at
    FROM mission_completion mc
    INNER JOIN daily_mission dm ON dm.id = mc.mission_id`,
  );
}
