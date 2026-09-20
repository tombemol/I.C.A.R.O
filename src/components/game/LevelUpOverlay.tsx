import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type LevelUpOverlayProps = {
  level: number | null;
  onDismiss: () => void;
};

export function LevelUpOverlay({ level, onDismiss }: LevelUpOverlayProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {level !== null && (
        <motion.div
          className="level-up-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="level-up-title"
          onClick={onDismiss}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <motion.div
            className="level-up"
            onClick={(event) => event.stopPropagation()}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">Nível aumentado</p>
            <h2 id="level-up-title">Nv. {level}</h2>
            <p>Continue avançando.</p>
            <button type="button" className="button button--quiet" onClick={onDismiss}>
              Continuar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
