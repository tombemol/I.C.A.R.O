import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { localDateKey } from '../lib/missionGenerator';
import { useMissionStore } from '../stores/useMissionStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useProgressStore } from '../stores/useProgressStore';
import type { DailyMission } from '../types/mission';
import { MissionRow } from './MissionRow';
import { ProgressRing } from './ProgressRing';

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

  const today = localDateKey();

  useEffect(() => {
    if (profile) {
      void hydrateForProfile(profile);
      void hydrateProgress(today);
    }
  }, [profile, hydrateForProfile, hydrateProgress, today]);

  const level = progress?.level ?? 1;
  const xp = progress?.xp ?? 0;
  const xpToNext = progress?.xpToNext ?? 500;
  const streak = progress?.streak ?? 0;
  const levelProgress = (xp / xpToNext) * 100;
  const completedCount = missions.filter((mission) => completedMissionIds.includes(mission.id)).length;

  const handleComplete = async (mission: DailyMission) => {
    await completeMission(mission);
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow">Jornada de hoje</p>
          <h1 id="hero-title">Continue subindo, {profile?.displayName}.</h1>
          <p>Seu progresso não precisa ser épico hoje. Precisa ser real.</p>
        </div>

        <motion.div
          className="level-panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <ProgressRing value={levelProgress} label={'Nv. ' + level} detail={xp + ' / ' + xpToNext + ' XP'} />
          <div className="level-panel__stats">
            <div>
              <span>Sequência</span>
              <strong>{streak} {streak === 1 ? 'dia' : 'dias'}</strong>
            </div>
            <div>
              <span>Missões</span>
              <strong>{missionStatus === 'ready' ? completedCount + ' / ' + missions.length : '…'}</strong>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section-block" aria-labelledby="missions-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Missões diárias</p>
            <h2 id="missions-title">Feitas para sua ficha.</h2>
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
                void hydrateProgress(today);
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
                completed={completedMissionIds.includes(mission.id)}
                isCompleting={completingMissionId === mission.id}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </section>

      <section className="principle-strip" aria-label="Regra de progressão">
        <span>Progressão</span>
        <strong>Cada missão concede XP uma única vez. Fechar e abrir o app não duplica recompensa.</strong>
      </section>
    </>
  );
}
