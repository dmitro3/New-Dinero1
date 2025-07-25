export const CASINO_ANIMATION_CONFIG = (animationIndex, index) => {
  switch (animationIndex) {
    case 1: return {
      initial: {
        opacity: 0,
        // if odd index card,slide from right instead of left
        x: index % 2 === 0 ? 50 : -50,
      },
      whileInView: {
        opacity: 1,
        x: 0, // Slide in to its original position
        transition: {
          duration: 0.5, // Animation duration
        },
      },
      viewport: { once: true },
    };
    case 2: return {
      initial: {
        opacity: 0,
        y: 50, // All cards will slide in from the right
      },
      whileInView: {
        opacity: 1,
        y: 0, // Slide in to its original position
        transition: {
          duration: 0.2, // Animation duration
        },
      },
      viewport: { once: true },
    };
    case 3: return {
      initial: {
        x: 100, // Start from right
        opacity: 0,
        scale: 0.8,
        rotate: 15,
      },
      animate: {
        x: 0,
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: (index % 27) * 0.1, // Stagger based on index
          duration: 0.2,
        },
      },
    };
    case 4: return {
      initial: {
        x: 100, // Start from right
        opacity: 0,
        scale: 0.8,
        rotate: 15,
      },
      animate: {
        x: 0,
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
          type: 'tween',
          ease: [0.42, 0, 0.58, 1],
          delay: parseFloat(Math.ceil(index % 27) * 0.1), // Stagger based on index
          duration: 0.2,
        },
      },
    };
    case 5: return {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: {
        type: 'tween',
        duration: 0.4,
        delay: (index % 27) * 0.1,
      },
    };
    default: return {
      initial: {
        x: 250,
        y: 250, // changed to x-axis
        opacity: 0,
        scale: 0.5,
        rotate: 0,
      },
      animate: {
        x: 0,
        y: 0, // changed to x-axis
        rotate: 360,
        scale: 1,
        opacity: 1,
        transition: {
          type: 'spring',
          bounce: 0.3,
          duration: 0.4,
          delay: (index % 27) * 0.1, // added delay to stagger the animation
        },
      },
      // viewport={{ once: false, amount: 0.9 }}
      transition: { duration: 0.8 },
    };
  }
};
