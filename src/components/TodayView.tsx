import { motion } from 'framer-motion';
import { dailyMissions } from '../data/missions';
import { usePlayerStore } from '../stores/usePlayerStore';
import { MissionRow } from './MissionRow';
import { ProgressRing } from './ProgressRing';

export function TodayView() {
  const { profile, level, xp, xpToNext, streak } = usePlayerStore();
  const levelProgress = (xp / xpToNext) * 100;

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
              <strong>0 / {dailyMissions.length}</strong>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section-block" aria-labelledby="missions-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Missões diárias</p>
            <h2 id="missions-title">Três coisas. Sem teatro.</h2>
          </div>
          <span className="section-date">Hoje</span>
        </div>
        <div className="mission-list">
          {dailyMissions.map((mission) => <MissionRow key={mission.id} mission={mission} />)}
        </div>
      </section>

      <section className="principle-strip" aria-label="Princípio do dia">
        <span>Princípio do dia</span>
        <strong>Consistência vence intensidade que não dura.</strong>
      </section>
    </>
  );
}
