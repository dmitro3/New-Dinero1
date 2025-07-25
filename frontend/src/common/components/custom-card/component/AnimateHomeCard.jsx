import { AnimatePresence, motion } from 'framer-motion';

export default function AnimateHomeCard({
  children, id, type,
}) {
  return (
    <AnimatePresence>
      <motion.div
        variants={{
          offscreen: {
            y: type === 'home' ? 40 : 100,
            opacity: 0,
            scale: 0.5,
            rotate: 0,
          },
          onscreen: {
            y: 10,
            rotate: 0,
            transition: {
              type: 'spring',
              bounce: 0.4,
              duration: 0.8,
            },
          },
        }}
        key={id}
        initial="offscreen"
        // initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileInView="onscreen"
        // transition={{ duration: 0.5, delay: id * 0.1 }}
        // whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        // viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        whileHover={{
          y: -1, scale: 1.04, boxShadow: '0px 0px 20px rgba(255, 255, 255, 0.5)', zIndex: [0, 1],
        }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="relative mt-4 rounded-lg overflow-hidden group hover:cursor-pointer h-[200px] w-full max-w-[150px]"
      >
        {/* <motion.div
        key={id}
        initial={{ y: 0, scale: 1, rotate: 0 }}
        whileHover={{ y: -8, rotate: 2 }}
        transition={{ duration: 0.3 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className={className}
      > */}
        {children}
      </motion.div>
      {/* </motion.div> */}
    </AnimatePresence>
  );
}
