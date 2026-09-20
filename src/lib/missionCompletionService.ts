import type { DailyMission } from '../types/mission';
import { missionCompletionToLifeEvent } from './lifeEventRules';
import { recordLifeEvent } from './lifeEventStorage';
import { completeMissionAndAward } from './progressStorage';

export async function completeMissionThroughEngine(mission: DailyMission) {
  const result = await completeMissionAndAward(mission);

  try {
    await recordLifeEvent(missionCompletionToLifeEvent(mission));
  } catch {
    // A conclusão e o XP já foram persistidos. A reconciliação do motor repara o evento depois.
  }

  return result;
}
