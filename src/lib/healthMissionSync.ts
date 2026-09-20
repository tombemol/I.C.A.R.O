import { loadDailyHealthSnapshot } from './healthConnect';
import { upsertHealthEvidence } from './healthEvidenceStorage';
import { evaluateMissionWithHealth } from './lifeEventRules';
import { completeMissionThroughEngine } from './missionCompletionService';
import type { HealthPermissionResponse, HealthSyncResult } from '../types/healthConnect';
import type { DailyMission } from '../types/mission';

function workoutEventKey(start: number, end: number, rawActivityType: number) {
  return 'health:workout:' + start + ':' + end + ':' + rawActivityType;
}

export async function syncHealthConnectDay(
  dateKey: string,
  missions: DailyMission[],
  permissions: HealthPermissionResponse,
): Promise<HealthSyncResult> {
  const snapshot = await loadDailyHealthSnapshot(dateKey, permissions);
  const granted = permissions.granted;

  if (granted.includes('steps')) {
    const id = 'health:' + dateKey + ':steps';
    await upsertHealthEvidence({
      id,
      eventDate: dateKey,
      type: 'STEPS_RECORDED',
      source: 'HEALTH_CONNECT',
      attribute: null,
      attributePoints: 0,
      quantity: snapshot.steps,
      unit: 'steps',
      referenceId: null,
      dedupeKey: id,
      metadata: {
        metric: 'steps',
        provider: 'Health Connect',
      },
    });
  }

  if (granted.includes('distance')) {
    const id = 'health:' + dateKey + ':distance';
    await upsertHealthEvidence({
      id,
      eventDate: dateKey,
      type: 'DISTANCE_RECORDED',
      source: 'HEALTH_CONNECT',
      attribute: null,
      attributePoints: 0,
      quantity: Math.round((snapshot.distanceMeters / 1000) * 100) / 100,
      unit: 'km',
      referenceId: null,
      dedupeKey: id,
      metadata: {
        metric: 'distance',
        meters: Math.round(snapshot.distanceMeters),
        provider: 'Health Connect',
      },
    });
  }

  if (granted.includes('workouts')) {
    for (const workout of snapshot.workouts) {
      const id = workoutEventKey(workout.start, workout.end, workout.rawActivityType);
      await upsertHealthEvidence({
        id,
        eventDate: dateKey,
        type: 'EXERCISE_SESSION',
        source: 'HEALTH_CONNECT',
        attribute: null,
        attributePoints: 0,
        quantity: Math.round((workout.durationSec / 60) * 10) / 10,
        unit: 'min',
        referenceId: null,
        dedupeKey: id,
        metadata: {
          activityType: workout.activityType,
          rawActivityType: workout.rawActivityType,
          start: workout.start,
          end: workout.end,
          source: workout.source ?? null,
        },
      });
    }
  }

  const matchedMissions: HealthSyncResult['matchedMissions'] = [];
  const newlyCompletedMissionIds: string[] = [];

  for (const mission of missions) {
    const evaluation = evaluateMissionWithHealth(mission, snapshot, granted);
    if (!evaluation?.met) continue;

    matchedMissions.push({
      missionId: mission.id,
      metric: evaluation.label,
      value: evaluation.value,
      target: evaluation.target,
      unit: evaluation.unit,
    });

    const result = await completeMissionThroughEngine(mission, {
      source: 'HEALTH_CONNECT',
      metadata: {
        validation: 'health_connect',
        evidenceMetric: evaluation.metric,
        measuredValue: evaluation.value,
        measuredUnit: evaluation.unit,
      },
    });

    if (result.inserted) newlyCompletedMissionIds.push(mission.id);
  }

  return {
    snapshot,
    matchedMissions,
    newlyCompletedMissionIds,
  };
}
