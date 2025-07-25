import { AnimatePresence, motion } from 'framer-motion';
import { CASINO_ANIMATION_CONFIG } from '../constant';

export default function AnimateCasinoCard({
  children, id, index,
}) {
  return (
    <AnimatePresence>
      <motion.div
        className="game-card-animation-holder"
        key={id}
        {...CASINO_ANIMATION_CONFIG(2, index)}
        whileHover={{
          zIndex: [0, 1],
        }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
