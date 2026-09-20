import { motion } from 'framer-motion';
import { dailyMissions } from './data/missions';
import { MissionRow } from './components/MissionRow';
import { ProgressRing } from './components/ProgressRing';
import { usePlayerStore } from './stores/usePlayerStore';

export function App() {
  const { level, xp, xpToNext, streak, name } = usePlayerStore();
  const levelProgress = (xp / xpToNext) * 100;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand">I.C.A.R.O.</p>
          <p className="brand-subtitle">Índice de Condicionamento, Atividade, Rotina e Objetivos</p>
        </div>
        <button className="avatar" aria-label="Abrir perfil">T</button>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow">Jornada de hoje</p>
          <h1 id="hero-title">Continue subindo, {name}.</h1>
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

      <nav className="bottom-nav" aria-label="Navegação principal">
        <button className="bottom-nav__item is-active"><span>⌂</span>Hoje</button>
        <button className="bottom-nav__item"><span>◎</span>Jornada</button>
        <button className="bottom-nav__item"><span>↗</span>Progresso</button>
        <button className="bottom-nav__item"><span>⚙</span>Ajustes</button>
      </nav>
    </main>
  );
}
