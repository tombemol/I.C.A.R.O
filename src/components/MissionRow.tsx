import { missionCategoryLabels, type DailyMission } from '../types/mission';

type MissionRowProps = {
  mission: DailyMission;
};

export function MissionRow({ mission }: MissionRowProps) {
  return (
    <article className="mission-row">
      <div className="mission-row__head">
        <div>
          <p className="eyebrow">{missionCategoryLabels[mission.category]}</p>
          <h3>{mission.title}</h3>
        </div>
        <strong className="xp">+{mission.xp} XP</strong>
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
    </article>
  );
}
