import { missionCategoryLabels, type DailyMission } from '../types/mission';

type MissionRowProps = {
  mission: DailyMission;
  completed: boolean;
  isCompleting: boolean;
  onComplete: (mission: DailyMission) => void;
};

export function MissionRow({ mission, completed, isCompleting, onComplete }: MissionRowProps) {
  return (
    <article className={completed ? 'mission-row is-complete' : 'mission-row'}>
      <div className="mission-row__head">
        <div>
          <p className="eyebrow">{missionCategoryLabels[mission.category]}</p>
          <h3>{mission.title}</h3>
        </div>
        <strong className="xp">{completed ? 'Concluída' : '+' + mission.xp + ' XP'}</strong>
      </div>

      <p>{mission.description}</p>

      <div className="mission-prescription">
        <div>
          <span>Meta de hoje</span>
          <strong>{mission.target} {mission.unit}</strong>
        </div>
        <div>
          <span>Por que esta missão?</span>
          <strong>{mission.rationale}</strong>
        </div>
      </div>

      <button
        className={completed ? 'mission-complete-button is-complete' : 'mission-complete-button'}
        type="button"
        disabled={completed || isCompleting}
        onClick={() => onComplete(mission)}
      >
        {completed ? '✓ XP concedido' : isCompleting ? 'Salvando…' : 'Marcar como concluída'}
      </button>
    </article>
  );
}
