import { motion, useReducedMotion } from 'framer-motion';

type XpBarProps = {
  current: number;
  max: number;
  label?: string;
};

export function XpBar({ current, max, label = 'Progresso de XP' }: XpBarProps) {
  const reduceMotion = useReducedMotion();
  const progress = max > 0 ? Math.min(1, Math.max(0, current / max)) : 0;

  return (
    <div className="xp-bar" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={current}>
      <motion.span
        className="xp-bar__fill"
        initial={false}
        animate={{ scaleX: progress }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
