export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: delay * 0.1,
      ease: [0.22, 0.68, 0, 1.1],
    },
  }),
};

export const slideInRight = {
  hidden: { opacity: 0, x: 120 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      delay: delay * 0.12,
      ease: [0.22, 0.68, 0, 1.1],
    },
  }),
};

export const shimmer = {
  // CSS animation only
};