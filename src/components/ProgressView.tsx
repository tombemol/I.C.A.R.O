import { useEffect } from 'react';
import { localDateKey } from '../lib/missionGenerator';
import { totalXpFromProgress } from '../lib/progression';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useProgressStore } from '../stores/useProgressStore';
import { LifeProgressPanel } from './LifeProgressPanel';
import { RankBadge } from './game/RankBadge';
import { XpBar } from './game/XpBar';

const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

function dayLabel(dateKey: string) {
  return weekday.format(new Date(`${dateKey}T12:00:00`)).replace('.', '').toUpperCase();
}

export function ProgressView() {
  const profile = usePlayerStore((state) => state.profile);
  const { progress, completionStats, status, error, hydrate } = useProgressStore();
  const today = localDateKey();

  useEffect(() => {
    void hydrate(today);
  }, [hydrate, today]);

  if (status === 'error') {
    return (
      <section className="view-section">
        <div className="page-intro">
          <p className="eyebrow">Ficha de progresso</p>
          <h1>Não consegui abrir seu progresso.</h1>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (status === 'loading' || !progress) {
    return (
      <section className="view-section">
        <div className="page-intro">
          <p className="eyebrow">Ficha de progresso</p>
          <h1>Carregando sua evolução.</h1>
        </div>
      </section>
    );
  }

  const totalXp = totalXpFromProgress(progress);

  return (
    <section className="view-section" aria-labelledby="progress-title">
      <div className="character-sheet-head">
        <div>
          <p className="eyebrow">Ficha de progresso</p>
          <h1 id="progress-title">{profile?.displayName ?? 'Jogador'}</h1>
        </div>
        <div className="character-sheet-level">
          <strong>Nv. {progress.level}</strong>
          <RankBadge level={progress.level} />
        </div>
      </div>

      <div className="progress-xp-block">
        <div>
          <span>Progresso do nível</span>
          <strong>{progress.xp.toLocaleString('pt-BR')} / {progress.xpToNext.toLocaleString('pt-BR')} XP</strong>
        </div>
        <XpBar current={progress.xp} max={progress.xpToNext} />
      </div>

      <dl className="character-stats">
        <div>
          <dt>XP total</dt>
          <dd>{totalXp.toLocaleString('pt-BR')}</dd>
        </div>
        <div>
          <dt>Sequência atual</dt>
          <dd>{progress.streak} {progress.streak === 1 ? 'dia' : 'dias'}</dd>
        </div>
        <div>
          <dt>Missões concluídas</dt>
          <dd>{completionStats.totalCompleted}</dd>
        </div>
      </dl>

      <LifeProgressPanel />

      <div className="week-progress">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Últimos 7 dias</p>
            <h2>Ritmo de missão</h2>
          </div>
        </div>

        <div className="week-progress__list" aria-label="Missões concluídas nos últimos sete dias">
          {completionStats.last7Days.map((day) => (
            <div className="week-progress__day" key={day.date}>
              <span>{dayLabel(day.date)}</span>
              <div className="week-progress__pips" aria-label={`${day.count} de 3 missões concluídas`}>
                {[0, 1, 2].map((index) => (
                  <i key={index} className={index < day.count ? 'is-filled' : undefined} />
                ))}
              </div>
              <strong>{day.count}/3</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
