import type { Mission } from '../data/missions';

type MissionRowProps = {
  mission: Mission;
};

export function MissionRow({ mission }: MissionRowProps) {
  const progress = Math.min(100, (mission.progress / mission.target) * 100);
  return (
    <article className="mission-row">
      <div className="mission-row__head">
        <div>
          <p className="eyebrow">{mission.kind}</p>
          <h3>{mission.title}</h3>
        </div>
        <strong className="xp">+{mission.xp} XP</strong>
      </div>
      <p>{mission.description}</p>
      <div className="mission-row__progress" aria-label={`${progress.toFixed(0)}% concluído`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="mission-row__meta">
        <span>{mission.progress} / {mission.target} {mission.unit}</span>
        <span>{progress.toFixed(0)}%</span>
      </div>
    </article>
  );
}
