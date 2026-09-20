import type { PlayerProgress } from '../types/progress';

const INITIAL_XP_TO_NEXT = 500;
const LEVEL_GROWTH = 1.15;

export function totalXpFromProgress(progress: PlayerProgress) {
  let completedLevelXp = 0;
  let requirement = INITIAL_XP_TO_NEXT;

  for (let level = 1; level < progress.level; level += 1) {
    completedLevelXp += requirement;
    requirement = Math.round(requirement * LEVEL_GROWTH);
  }

  return completedLevelXp + progress.xp;
}
