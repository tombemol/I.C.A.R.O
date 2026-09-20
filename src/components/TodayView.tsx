import { useEffect, useState } from 'react';
import { localDateKey } from '../lib/missionGenerator';
import { useMissionStore } from '../stores/useMissionStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useProgressStore } from '../stores/useProgressStore';
import type { DailyMission } from '../types/mission';
import { difficultyLabels } from '../types/player';
import { HealthConnectPanel } from './HealthConnectPanel';
import { LevelUpOverlay } from './game/LevelUpOverlay';
import { PlayerHud } from './game/PlayerHud';
import { MissionRow } from './MissionRow';

export function TodayView() {
  const profile = usePlayerStore((state) => state.profile);
  const { missions, status: missionStatus, error: missionError, hydrateForProfile } = useMissionStore();
  const {
    progress,
    completedMissionIds,
    status: progressStatus,
    error: progressError,
    completingMissionId,
    hydrate: hydrateProgress,
    completeMission,
  } = useProgressStore();

  const [recentCompletionId, setRecentCompletionId] = useState<string | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const today = localDateKey();

  useEffect(() => {
    if (profile) {
      void hydrateForProfile(profile);
      void hydrateProgress(today);
    }
  }, [profile, hydrateForProfile, hydrateProgress, today]);

  useEffect(() => {
    if (!recentCompletionId) return;
    const timer = window.setTimeout(() => setRecentCompletionId(null), 900);
    return () => window.clearTimeout(timer);
  }, [recentCompletionId]);

  useEffect(() => {
    if (levelUp === null) return;
    const timer = window.setTimeout(() => setLevelUp(null), 1500);
    return () => window.clearTimeout(timer);
  }, [levelUp]);

  const level = progress?.level ?? 1;
  const xp = progress?.xp ?? 0;
  const xpToNext = progress?.xpToNext ?? 500;
  const streak = progress?.streak ?? 0;
  const completedCount = missions.filter((mission) => completedMissionIds.includes(mission.id)).length;

  const handleComplete = async (mission: DailyMission) => {
    const previousLevel = useProgressStore.getState().progress?.level ?? 1;
    const inserted = await completeMission(mission);

    if (!inserted) return;

    const nextLevel = useProgressStore.getState().progress?.level ?? previousLevel;
    setRecentCompletionId(mission.id);

    if (nextLevel > previousLevel) setLevelUp(nextLevel);
  };

  return (
    <>
      <section className="today-hero" aria-labelledby="today-message">
        <PlayerHud
          name={profile?.displayName ?? 'Jogador'}
          level={level}
          xp={xp}
          xpToNext={xpToNext}
          streak={streak}
          completedMissions={completedCount}
          totalMissions={missions.length || 3}
        />
        <div className="today-message">
          <p id="today-message">Continue subindo.</p>
          <span>Seu progresso precisa ser real, não espetacular.</span>
        </div>
      </section>

      <HealthConnectPanel missions={missions} />

      <section className="section-block" aria-labelledby="missions-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Missões diárias</p>
            <h2 id="missions-title">{missions.length || 3} missões disponíveis</h2>
          </div>
          <span className="section-date">Hoje</span>
        </div>

        {(missionStatus === 'loading' || progressStatus === 'loading') && (
          <p className="inline-status">Preparando seu dia…</p>
        )}

        {(missionStatus === 'error' || progressStatus === 'error') && (
          <div className="inline-error" role="alert">
            <strong>Alguma coisa emperrou.</strong>
            <span>{missionError ?? progressError}</span>
            <button
              className="button button--quiet"
              type="button"
              onClick={() => {
                if (profile) void hydrateForProfile(profile);
                void hydrateProgress(today, true);
              }}
            >
              Tentar de novo
            </button>
          </div>
        )}

        {missionStatus === 'ready' && progressStatus === 'ready' && (
          <div className="mission-list">
            {missions.map((mission) => (
              <MissionRow
                key={mission.id}
                mission={mission}
                difficulty={profile ? difficultyLabels[profile.difficulty] : 'Padrão'}
                completed={completedMissionIds.includes(mission.id)}
                isCompleting={completingMissionId === mission.id}
                celebrate={recentCompletionId === mission.id}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </section>

      <section className="principle-strip" aria-label="Regra de progressão">
        <span>Regra do sistema</span>
        <strong>Uma missão, uma recompensa. Manual ou automática, a validação continua idempotente.</strong>
      </section>

      <LevelUpOverlay level={levelUp} onDismiss={() => setLevelUp(null)} />
    </>
  );
}
