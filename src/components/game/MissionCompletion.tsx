import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type MissionCompletionProps = {
  visible: boolean;
  xp: number;
};

export function MissionCompletion({ visible, xp }: MissionCompletionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="mission-completion"
          role="status"
          initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
        >
          <span>✓ Missão concluída</span>
          <strong>+{xp} XP obtido</strong>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
