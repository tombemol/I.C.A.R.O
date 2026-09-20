import type { PlayerProfile } from '../types/player';

const DATABASE_URL = 'sqlite:icaro.db';
const WEB_STORAGE_KEY = 'icaro.player-profile.v1';

type PlayerRow = {
  id: string;
  display_name: string;
  height_cm: number;
  weight_kg: number;
  objective: PlayerProfile['objective'];
  difficulty: PlayerProfile['difficulty'];
  created_at: string;
  updated_at: string;
};

function isTauriRuntime() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

async function getDatabase() {
  const { default: Database } = await import('@tauri-apps/plugin-sql');
  return Database.load(DATABASE_URL);
}

function rowToProfile(row: PlayerRow): PlayerProfile {
  return {
    id: row.id,
    displayName: row.display_name,
    heightCm: Number(row.height_cm),
    weightKg: Number(row.weight_kg),
    objective: row.objective,
    difficulty: row.difficulty,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function loadPlayerProfile(): Promise<PlayerProfile | null> {
  if (!isTauriRuntime()) {
    const stored = localStorage.getItem(WEB_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as PlayerProfile) : null;
  }

  const db = await getDatabase();
  const rows = await db.select<PlayerRow[]>(
    `SELECT id, display_name, height_cm, weight_kg, objective, difficulty, created_at, updated_at
     FROM player_profile
     WHERE id = $1
     LIMIT 1`,
    ['local-player'],
  );

  return rows[0] ? rowToProfile(rows[0]) : null;
}

export async function savePlayerProfile(profile: PlayerProfile): Promise<void> {
  if (!isTauriRuntime()) {
    localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(profile));
    return;
  }

  const db = await getDatabase();
  await db.execute(
    `INSERT INTO player_profile (
      id, display_name, height_cm, weight_kg, objective, difficulty, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT(id) DO UPDATE SET
      display_name = excluded.display_name,
      height_cm = excluded.height_cm,
      weight_kg = excluded.weight_kg,
      objective = excluded.objective,
      difficulty = excluded.difficulty,
      updated_at = excluded.updated_at`,
    [
      profile.id,
      profile.displayName,
      profile.heightCm,
      profile.weightKg,
      profile.objective,
      profile.difficulty,
      profile.createdAt,
      profile.updatedAt,
    ],
  );
}
