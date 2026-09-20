import type { DailyMission } from '../types/mission';

const DATABASE_URL = 'sqlite:icaro.db';
const WEB_STORAGE_PREFIX = 'icaro.daily-missions.v1';

type MissionRow = {
  id: string;
  mission_date: string;
  slot: number;
  template_id: string;
  title: string;
  description: string;
  target: number;
  unit: DailyMission['unit'];
  xp: number;
  category: DailyMission['category'];
  rationale: string;
  created_at: string;
};

function isTauriRuntime() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

async function getDatabase() {
  const { default: Database } = await import('@tauri-apps/plugin-sql');
  return Database.load(DATABASE_URL);
}

function rowToMission(row: MissionRow): DailyMission {
  return {
    id: row.id,
    missionDate: row.mission_date,
    slot: Number(row.slot),
    templateId: row.template_id,
    title: row.title,
    description: row.description,
    target: Number(row.target),
    unit: row.unit,
    xp: Number(row.xp),
    category: row.category,
    rationale: row.rationale,
    createdAt: row.created_at,
  };
}

export async function loadDailyMissions(missionDate: string): Promise<DailyMission[]> {
  if (!isTauriRuntime()) {
    const stored = localStorage.getItem(`${WEB_STORAGE_PREFIX}:${missionDate}`);
    return stored ? (JSON.parse(stored) as DailyMission[]) : [];
  }

  const db = await getDatabase();
  const rows = await db.select<MissionRow[]>(
    `SELECT id, mission_date, slot, template_id, title, description, target, unit, xp, category, rationale, created_at
     FROM daily_mission
     WHERE mission_date = $1
     ORDER BY slot ASC`,
    [missionDate],
  );

  return rows.map(rowToMission);
}

export async function saveDailyMissions(missions: DailyMission[]): Promise<void> {
  if (missions.length === 0) return;
  const missionDate = missions[0].missionDate;

  if (!isTauriRuntime()) {
    localStorage.setItem(`${WEB_STORAGE_PREFIX}:${missionDate}`, JSON.stringify(missions));
    return;
  }

  const db = await getDatabase();

  for (const mission of missions) {
    await db.execute(
      `INSERT INTO daily_mission (
        id, mission_date, slot, template_id, title, description, target, unit, xp, category, rationale, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT(id) DO NOTHING`,
      [
        mission.id,
        mission.missionDate,
        mission.slot,
        mission.templateId,
        mission.title,
        mission.description,
        mission.target,
        mission.unit,
        mission.xp,
        mission.category,
        mission.rationale,
        mission.createdAt,
      ],
    );
  }
}
