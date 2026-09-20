export type PlayerProgress = {
  id: string;
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  lastActiveDate: string | null;
  updatedAt: string;
};

export type DailyCompletionSummary = {
  date: string;
  count: number;
};

export type ProgressStats = {
  totalCompleted: number;
  last7Days: DailyCompletionSummary[];
};

export const emptyProgressStats = (): ProgressStats => ({
  totalCompleted: 0,
  last7Days: [],
});

export const initialPlayerProgress = (): PlayerProgress => ({
  id: 'local-player',
  level: 1,
  xp: 0,
  xpToNext: 500,
  streak: 0,
  lastActiveDate: null,
  updatedAt: new Date().toISOString(),
});
