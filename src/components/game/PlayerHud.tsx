import { motion, useReducedMotion } from 'framer-motion';
import { RankBadge } from './RankBadge';
import { XpBar } from './XpBar';

type PlayerHudProps = {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  completedMissions: number;
  totalMissions: number;
};

export function PlayerHud({
  name,
  level,
  xp,
  xpToNext,
  streak,
  completedMissions,
  totalMissions,
}: PlayerHudProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="player-hud"
      aria-label="Status do jogador"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.35 }}
    >
      <div className="player-hud__identity">
        <div>
          <p className="eyebrow">Jornada de hoje</p>
          <h1>{name}</h1>
        </div>
        <div className="player-hud__level">
          <span>Nv. {level}</span>
          <RankBadge level={level} />
        </div>
      </div>

      <div className="player-hud__xp">
        <div className="player-hud__xp-label">
          <strong>{xp.toLocaleString('pt-BR')} / {xpToNext.toLocaleString('pt-BR')} XP</strong>
          <span>{Math.max(0, xpToNext - xp).toLocaleString('pt-BR')} para o próximo nível</span>
        </div>
        <XpBar current={xp} max={xpToNext} />
      </div>

      <div className="player-hud__stats">
        <div>
          <span aria-hidden="true">🔥</span>
          <strong>{streak} {streak === 1 ? 'dia' : 'dias'}</strong>
          <small>sequência</small>
        </div>
        <div>
          <span aria-hidden="true">⚔</span>
          <strong>{completedMissions} / {totalMissions}</strong>
          <small>missões</small>
        </div>
      </div>
    </motion.section>
  );
}
