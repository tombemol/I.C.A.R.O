import { useEffect } from 'react';
import { localDateKey } from '../lib/missionGenerator';
import { useProgressStore } from '../stores/useProgressStore';
import { ProgressRing } from './ProgressRing';

export function ProgressView() {
  const { progress, status, error, hydrate } = useProgressStore();
  const today = localDateKey();

  useEffect(() => {
    void hydrate(today);
  }, [hydrate, today]);

  if (status === 'loading' || !progress) {
    return (
      <section className="view-section">
        <div className="page-intro">
          <p className="eyebrow">Progresso</p>
          <h1>Carregando sua evolução.</h1>
        </div>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="view-section">
        <div className="page-intro">
          <p className="eyebrow">Progresso</p>
          <h1>Não consegui abrir seu progresso.</h1>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  const percent = (progress.xp / progress.xpToNext) * 100;

  return (
    <section className="view-section" aria-labelledby="progress-title">
      <div className="page-intro">
        <p className="eyebrow">Progresso</p>
        <h1 id="progress-title">Agora conta de verdade.</h1>
        <p>XP, nível e sequência ficam salvos localmente. Reabrir o app não apaga a jornada nem fabrica recompensa nova.</p>
      </div>

      <div className="progress-overview">
        <ProgressRing
          value={percent}
          label={'Nv. ' + progress.level}
          detail={progress.xp + ' / ' + progress.xpToNext + ' XP'}
        />
        <dl className="progress-stats">
          <div><dt>Sequência atual</dt><dd>{progress.streak} {progress.streak === 1 ? 'dia' : 'dias'}</dd></div>
          <div><dt>Próximo nível</dt><dd>{progress.xpToNext - progress.xp} XP</dd></div>
          <div><dt>Último dia ativo</dt><dd>{progress.lastActiveDate ?? 'Ainda não começou'}</dd></div>
        </dl>
      </div>

      <div className="progress-explainer">
        <p className="eyebrow">Regra atual</p>
        <p>A sequência avança quando você conclui ao menos uma missão em dias consecutivos. Mais de uma missão no mesmo dia aumenta XP, mas não infla a sequência.</p>
      </div>
    </section>
  );
}
