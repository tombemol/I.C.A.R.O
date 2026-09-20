import { motion, useReducedMotion } from 'framer-motion';
import { missionValidationRule } from '../lib/lifeEventRules';
import { missionCategoryLabels, type DailyMission, type MissionCategory } from '../types/mission';
import { MissionCompletion } from './game/MissionCompletion';
import { MissionReward } from './game/MissionReward';

type MissionRowProps = {
  mission: DailyMission;
  difficulty: string;
  completed: boolean;
  isCompleting: boolean;
  celebrate: boolean;
  onComplete: (mission: DailyMission) => void;
};

const categoryIcons: Record<MissionCategory, string> = {
  MOVIMENTO: '↗',
  FORCA: '◆',
  MOBILIDADE: '⟲',
  CONSTANCIA: '∞',
};

export function MissionRow({
  mission,
  difficulty,
  completed,
  isCompleting,
  celebrate,
  onComplete,
}: MissionRowProps) {
  const reduceMotion = useReducedMotion();
  const automaticRule = missionValidationRule(mission);

  return (
    <motion.article
      layout={!reduceMotion}
      className={completed ? 'mission-row is-complete' : 'mission-row'}
      transition={{ duration: reduceMotion ? 0 : 0.28 }}
    >
      <div className="mission-row__head">
        <div className="mission-row__identity">
          <span className="mission-category-icon" aria-hidden="true">{categoryIcons[mission.category]}</span>
          <div>
            <p className="eyebrow">Missão diária · {missionCategoryLabels[mission.category]}</p>
            <h3>{mission.title}</h3>
          </div>
        </div>
        <MissionReward xp={mission.xp} completed={completed} />
      </div>

      {completed ? (
        <div className="mission-row__completed">
          <span>✓ Missão concluída</span>
          <strong>+{mission.xp} XP obtido</strong>
        </div>
      ) : (
        <>
          <p>{mission.description}</p>

          <div className="quest-meta">
            <div>
              <span>Objetivo</span>
              <strong>{mission.target} {mission.unit}</strong>
            </div>
            <div>
              <span>Recompensa</span>
              <strong>+{mission.xp} XP</strong>
            </div>
            <div>
              <span>Dificuldade</span>
              <strong>{difficulty}</strong>
            </div>
          </div>

          <p className="mission-rationale">{mission.rationale}</p>

          {automaticRule && (
            <p className="mission-auto-validation">
              Compatível com validação automática por {automaticRule.label}
            </p>
          )}

          <button
            className="mission-complete-button"
            type="button"
            disabled={isCompleting}
            onClick={() => onComplete(mission)}
          >
            {isCompleting ? 'VALIDANDO...' : 'CONCLUIR MISSÃO'}
          </button>
        </>
      )}

      <MissionCompletion visible={celebrate} xp={mission.xp} />
    </motion.article>
  );
}
