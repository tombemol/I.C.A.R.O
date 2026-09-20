import type { DailyMission } from '../types/mission';
import {
  emptyProgressStats,
  initialPlayerProgress,
  type PlayerProgress,
  type ProgressStats,
} from '../types/progress';

const DATABASE_URL = 'sqlite:icaro.db';
const WEB_PROGRESS_KEY = 'icaro.player-progress.v1';
const WEB_COMPLETION_KEY = 'icaro.mission-completions.v1';

type ProgressRow = {
  id: string;
  level: number;
  xp: number;
  xp_to_next: number;
  streak: number;
  last_active_date: string | null;
  updated_at: string;
};

type CompletionRecord = Record<string, { missionDate: string; xpAwarded: number; completedAt: string }>;

function isTauriRuntime() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

async function getDatabase() {
  const { default: Database } = await import('@tauri-apps/plugin-sql');
  return Database.load(DATABASE_URL);
}

function rowToProgress(row: ProgressRow): PlayerProgress {
  return {
    id: row.id,
    level: Number(row.level),
    xp: Number(row.xp),
    xpToNext: Number(row.xp_to_next),
    streak: Number(row.streak),
    lastActiveDate: row.last_active_date,
    updatedAt: row.updated_at,
  };
}

function shiftDateKey(dateKey: string, offset: number) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function previousDateKey(dateKey: string) {
  return shiftDateKey(dateKey, -1);
}

function lastDateKeys(referenceDate: string, amount: number) {
  return Array.from({ length: amount }, (_, index) => shiftDateKey(referenceDate, index - amount + 1));
}

function applyReward(progress: PlayerProgress, mission: DailyMission): PlayerProgress {
  const totalXp = progress.xp + mission.xp;
  const leveledUp = totalXp >= progress.xpToNext;
  const lastActiveDate = progress.lastActiveDate;

  const streak = lastActiveDate === mission.missionDate
    ? progress.streak
    : lastActiveDate === previousDateKey(mission.missionDate)
      ? progress.streak + 1
      : 1;

  return {
    ...progress,
    level: progress.level + (leveledUp ? 1 : 0),
    xp: leveledUp ? totalXp - progress.xpToNext : totalXp,
    xpToNext: leveledUp ? Math.round(progress.xpToNext * 1.15) : progress.xpToNext,
    streak,
    lastActiveDate: mission.missionDate,
    updatedAt: new Date().toISOString(),
  };
}

export async function loadPlayerProgress(): Promise<PlayerProgress> {
  if (!isTauriRuntime()) {
    const stored = localStorage.getItem(WEB_PROGRESS_KEY);
    return stored ? (JSON.parse(stored) as PlayerProgress) : initialPlayerProgress();
  }

  const db = await getDatabase();
  const rows = await db.select<ProgressRow[]>(
    `SELECT id, level, xp, xp_to_next, streak, last_active_date, updated_at
     FROM player_progress
     WHERE id = $1
     LIMIT 1`,
    ['local-player'],
  );

  return rows[0] ? rowToProgress(rows[0]) : initialPlayerProgress();
}

export async function loadCompletedMissionIds(missionDate: string): Promise<string[]> {
  if (!isTauriRuntime()) {
    const completions = JSON.parse(localStorage.getItem(WEB_COMPLETION_KEY) ?? '{}') as CompletionRecord;
    return Object.entries(completions)
      .filter(([, completion]) => completion.missionDate === missionDate)
      .map(([missionId]) => missionId);
  }

  const db = await getDatabase();
  const rows = await db.select<Array<{ mission_id: string }>>(
    `SELECT mission_id
     FROM mission_completion
     WHERE mission_date = $1`,
    [missionDate],
  );

  return rows.map((row) => row.mission_id);
}

export async function loadProgressStats(referenceDate: string): Promise<ProgressStats> {
  const dates = lastDateKeys(referenceDate, 7);

  if (!isTauriRuntime()) {
    const completions = JSON.parse(localStorage.getItem(WEB_COMPLETION_KEY) ?? '{}') as CompletionRecord;
    const values = Object.values(completions);
    const counts = new Map<string, number>();

    for (const completion of values) {
      counts.set(completion.missionDate, (counts.get(completion.missionDate) ?? 0) + 1);
    }

    return {
      totalCompleted: values.length,
      last7Days: dates.map((date) => ({ date, count: counts.get(date) ?? 0 })),
    };
  }

  const db = await getDatabase();
  const totalRows = await db.select<Array<{ total: number | string }>>(
    'SELECT COUNT(*) AS total FROM mission_completion',
  );
  const groupedRows = await db.select<Array<{ mission_date: string; count: number | string }>>(
    `SELECT mission_date, COUNT(*) AS count
     FROM mission_completion
     WHERE mission_date >= $1 AND mission_date <= $2
     GROUP BY mission_date`,
    [dates[0], referenceDate],
  );

  const counts = new Map(groupedRows.map((row) => [row.mission_date, Number(row.count)]));

  return {
    ...emptyProgressStats(),
    totalCompleted: Number(totalRows[0]?.total ?? 0),
    last7Days: dates.map((date) => ({ date, count: counts.get(date) ?? 0 })),
  };
}

export async function completeMissionAndAward(mission: DailyMission): Promise<{
  progress: PlayerProgress;
  inserted: boolean;
}> {
  if (!isTauriRuntime()) {
    const completions = JSON.parse(localStorage.getItem(WEB_COMPLETION_KEY) ?? '{}') as CompletionRecord;

    if (completions[mission.id]) {
      return { progress: await loadPlayerProgress(), inserted: false };
    }

    const completedAt = new Date().toISOString();
    completions[mission.id] = {
      missionDate: mission.missionDate,
      xpAwarded: mission.xp,
      completedAt,
    };

    const nextProgress = applyReward(await loadPlayerProgress(), mission);
    localStorage.setItem(WEB_COMPLETION_KEY, JSON.stringify(completions));
    localStorage.setItem(WEB_PROGRESS_KEY, JSON.stringify(nextProgress));
    return { progress: nextProgress, inserted: true };
  }

  const db = await getDatabase();
  const completedAt = new Date().toISOString();

  const result = await db.execute(
    `INSERT OR IGNORE INTO mission_completion (
      mission_id, mission_date, xp_awarded, completed_at
    ) VALUES ($1, $2, $3, $4)`,
    [mission.id, mission.missionDate, mission.xp, completedAt],
  );

  return {
    progress: await loadPlayerProgress(),
    inserted: result.rowsAffected > 0,
  };
}
