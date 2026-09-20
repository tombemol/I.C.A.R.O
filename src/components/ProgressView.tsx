import { usePlayerStore } from '../stores/usePlayerStore';
import { ProgressRing } from './ProgressRing';

export function ProgressView() {
  const { level, xp, xpToNext, streak } = usePlayerStore();
  const progress = (xp / xpToNext) * 100;

  return (
    <section className="view-section" aria-labelledby="progress-title">
      <div className="page-intro">
        <p className="eyebrow">Progresso</p>
        <h1 id="progress-title">O que já acumulou.</h1>
        <p>A 0.1.0 guarda a ficha. Histórico real de atividades entra nas próximas fases, quando as missões começarem a gerar eventos persistentes.</p>
      </div>

      <div className="progress-overview">
        <ProgressRing value={progress} label={`Nv. ${level}`} detail={`${xp} / ${xpToNext} XP`} />
        <dl className="progress-stats">
          <div><dt>Sequência atual</dt><dd>{streak} dias</dd></div>
          <div><dt>Próximo nível</dt><dd>{xpToNext - xp} XP</dd></div>
          <div><dt>Persistência</dt><dd>SQLite local</dd></div>
        </dl>
      </div>
    </section>
  );
}
