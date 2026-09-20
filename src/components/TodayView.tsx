import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useMissionStore } from '../stores/useMissionStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { MissionRow } from './MissionRow';
import { ProgressRing } from './ProgressRing';

export function TodayView() {
  const { profile, level, xp, xpToNext, streak } = usePlayerStore();
  const { missions, status, error, hydrateForProfile } = useMissionStore();
  const levelProgress = (xp / xpToNext) * 100;

  useEffect(() => {
    if (profile) {
      void hydrateForProfile(profile);
    }
  }, [profile, hydrateForProfile]);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow">Jornada de hoje</p>
          <h1 id="hero-title">Continue subindo, {profile?.displayName}.</h1>
          <p>Seu progresso não precisa ser épico hoje. Precisa ser real.</p>
          <div className="hero__actions">
            <button className="button button--primary">Registrar atividade</button>
            <button className="button button--quiet">Ver histórico</button>
          </div>
        </div>

        <motion.div
          className="level-panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <ProgressRing value={levelProgress} label={`Nv. ${level}`} detail={`${xp} / ${xpToNext} XP`} />
          <div className="level-panel__stats">
            <div>
              <span>Sequência</span>
              <strong>{streak} dias</strong>
            </div>
            <div>
              <span>Missões</span>
              <strong>{status === 'ready' ? missions.length : '…'} geradas</strong>
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

        {status === 'loading' && <p className="inline-status">Montando as missões de hoje…</p>}

        {status === 'error' && (
          <div className="inline-error" role="alert">
            <strong>As missões não carregaram.</strong>
            <span>{error}</span>
            {profile && (
              <button className="button button--quiet" type="button" onClick={() => void hydrateForProfile(profile)}>
                Tentar de novo
              </button>
            )}
          </div>
        )}

        {status === 'ready' && (
          <div className="mission-list">
            {missions.map((mission) => <MissionRow key={mission.id} mission={mission} />)}
          </div>
        )}
      </section>

      <section className="principle-strip" aria-label="Princípio do dia">
        <span>Como funciona</span>
        <strong>As missões são geradas uma vez por dia e ficam estáveis até amanhã.</strong>
      </section>
    </>
  );
}
