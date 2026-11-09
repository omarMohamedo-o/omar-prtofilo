/**
 * High-Performance Smooth Animation System
 * with Snappy Orbital / Planetary Motion Effects
 *
 * Optimized for 60-120fps responsiveness and zero jank.
 */

// Snappy cubic-bezier easings
export const orbitalEasing = [0.16, 1, 0.3, 1];   // Fast, butter-smooth settle
export const smoothEasing = [0.25, 0.1, 0.25, 1]; // Natural ease
export const bounceEasing = [0.34, 1.4, 0.64, 1]; // Crisp overshoot

// =============================================================================
// PHASE 1: TITLE ANIMATIONS
// =============================================================================

export const titleVariant = {
  hidden: {
    opacity: 0,
    y: 24,
    x: -12,
    scale: 0.98
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      ease: orbitalEasing,
    },
  },
};

export const titleVariantMobile = {
  hidden: {
    opacity: 0,
    y: 16,
    x: -6,
    scale: 0.99
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: orbitalEasing,
    },
  },
};

// =============================================================================
// PHASE 2: CONTAINER ANIMATIONS
// =============================================================================

export const containerVariant = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.1,        // Fast start right after title
      staggerChildren: 0.07,     // Snappy sequential reveal
    },
  },
};

export const containerVariantMobile = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.06,
      staggerChildren: 0.05,
    },
  },
};

export const createContainerVariant = (delayChildren = 0.1, staggerChildren = 0.06) => ({
  hidden: {},
  show: {
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
});

// =============================================================================
// CHILD ITEM ANIMATIONS
// =============================================================================

export const itemVariant = {
  hidden: {
    opacity: 0,
    y: 28,
    x: -14,
    scale: 0.97
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.36,
      ease: orbitalEasing,
    },
  },
};

export const itemVariantMobile = {
  hidden: {
    opacity: 0,
    y: 18,
    x: -8,
    scale: 0.98
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.26,
      ease: orbitalEasing,
    },
  },
};

export const itemSlideLeftVariant = {
  hidden: {
    opacity: 0,
    x: -28,
    y: 12,
    scale: 0.98
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.34,
      ease: orbitalEasing,
    },
  },
};

export const itemSlideRightVariant = {
  hidden: {
    opacity: 0,
    x: 28,
    y: 12,
    scale: 0.98
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.34,
      ease: orbitalEasing,
    },
  },
};

export const itemScaleVariant = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 10
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: orbitalEasing,
    },
  },
};

export const getAlternatingSlideVariant = (index) => ({
  hidden: {
    opacity: 0,
    x: index % 2 === 0 ? -20 : 20,
    y: 22,
    scale: 0.97
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.36,
      ease: orbitalEasing,
    },
  },
});

export const getOrbitalItemVariant = (index, isMobile = false) => {
  const direction = index % 2 === 0 ? -1 : 1;

  if (isMobile) {
    return {
      hidden: {
        opacity: 0,
        y: 18,
        x: direction * 10,
        scale: 0.98
      },
      show: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
          duration: 0.28,
          ease: orbitalEasing,
        },
      },
    };
  }

  return {
    hidden: {
      opacity: 0,
      y: 30,
      x: direction * 18,
      scale: 0.96
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.38,
        ease: orbitalEasing,
      },
    },
  };
};

// =============================================================================
// VIEWPORT OPTIONS
// =============================================================================

export const viewportOptions = {
  once: true,
  margin: "-60px",
};

export const viewportOptionsMobile = {
  once: true,
  margin: "-30px",
};

// =============================================================================
// HOVER & FLOATING ANIMATIONS
// =============================================================================

export const cardHoverScale = {
  scale: 1.02,
  y: -3,
  transition: { duration: 0.2, ease: smoothEasing },
};

export const cardHoverLift = {
  y: -5,
  transition: { duration: 0.2, ease: smoothEasing },
};

export const floatingAnimation = {
  animate: {
    y: [0, -5, 0],
  },
  transition: {
    duration: 3.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const pulseAnimation = {
  animate: {
    scale: [1, 1.02, 1],
  },
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const heroFloatingAnimation = {
  animate: {
    y: [0, -6, 0],
    scale: [1, 1.01, 1],
  },
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const getResponsiveVariants = (isMobile = false) => ({
  title: isMobile ? titleVariantMobile : titleVariant,
  container: isMobile ? containerVariantMobile : containerVariant,
  item: isMobile ? itemVariantMobile : itemVariant,
  viewport: isMobile ? viewportOptionsMobile : viewportOptions,
  getOrbital: (index) => getOrbitalItemVariant(index, isMobile),
});

export const sectionAnimationProps = {
  initial: "hidden",
  whileInView: "show",
  viewport: viewportOptions,
};

export const createSectionAnimationProps = (customViewport = viewportOptions) => ({
  initial: "hidden",
  whileInView: "show",
  viewport: customViewport,
});

export const getGridOrbitalVariant = (index, columns = 3) => {
  const row = Math.floor(index / columns);
  const col = index % columns;

  let xOffset;
  if (col === 0) xOffset = -20;
  else if (col === columns - 1) xOffset = 20;
  else xOffset = (row % 2 === 0 ? -10 : 10);

  return {
    hidden: {
      opacity: 0,
      y: 28,
      x: xOffset,
      scale: 0.96
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.36,
        ease: orbitalEasing,
      },
    },
  };
};

export const getRadialOrbitalVariant = (index, total) => {
  const angle = (index / total) * Math.PI * 2;
  const distance = 40;

  return {
    hidden: {
      opacity: 0,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance + 20,
      scale: 0.93
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.38,
        ease: orbitalEasing,
      },
    },
  };
};
