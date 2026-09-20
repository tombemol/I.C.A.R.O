import type { LifeEventMetadataValue, LifeEventSource } from '../types/lifeEvent';
import type { DailyMission } from '../types/mission';
import { missionCompletionToLifeEvent } from './lifeEventRules';
import { recordLifeEvent } from './lifeEventStorage';
import { completeMissionAndAward } from './progressStorage';

type CompletionOptions = {
  source?: LifeEventSource;
  metadata?: Record<string, LifeEventMetadataValue>;
};

export async function completeMissionThroughEngine(
  mission: DailyMission,
  options: CompletionOptions = {},
) {
  const result = await completeMissionAndAward(mission);

  try {
    await recordLifeEvent(
      missionCompletionToLifeEvent(
        mission,
        undefined,
        options.source ?? 'MANUAL',
        options.metadata ?? {},
      ),
    );
  } catch {
    // A conclusão e o XP já foram persistidos. A reconciliação do motor repara o evento depois.
  }

  return result;
}
