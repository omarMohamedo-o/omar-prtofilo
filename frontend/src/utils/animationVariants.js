/**
 * Enhanced Sequential Scroll Animation System
 * with Orbital / Planetary Motion Effects
 *
 * 2-Phase Animation Architecture:
 * - Phase 1: Title appears first (standalone, priority animation)
 * - Phase 2: Content elements appear sequentially after title
 *
 * Motion Philosophy:
 * - Elements don't just fade in, they "orbit into place"
 * - Curved motion paths (x + y combined) for natural feel
 * - Depth effects via scale for premium touch
 * - Alternating directions avoid robotic feel
 *
 * This creates a "guided storytelling" UX where the user's eye
 * is led through the content step-by-step.
 */

// =============================================================================
// PREMIUM EASING CURVES
// =============================================================================

/**
 * Custom cubic-bezier easings for orbital feel
 * These create smooth, physics-inspired motion
 */
export const orbitalEasing = [0.22, 1, 0.36, 1];      // Smooth settle
export const smoothEasing = [0.25, 0.1, 0.25, 1];    // Natural ease
export const bounceEasing = [0.34, 1.56, 0.64, 1];   // Slight overshoot

// =============================================================================
// PHASE 1: TITLE ANIMATIONS (Standalone - appears first)
// =============================================================================

/**
 * Desktop title variant - orbital sweep from left with depth
 */
export const titleVariant = {
  hidden: {
    opacity: 0,
    y: 40,
    x: -20,
    scale: 0.97
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: orbitalEasing,
    },
  },
};

/**
 * Mobile title variant - lighter, faster orbital
 */
export const titleVariantMobile = {
  hidden: {
    opacity: 0,
    y: 25,
    x: -10,
    scale: 0.98
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: orbitalEasing,
    },
  },
};

// =============================================================================
// PHASE 2: CONTAINER ANIMATIONS (Delayed start after title)
// =============================================================================

/**
 * Desktop container - waits for title, then staggers children with orbital timing
 */
export const containerVariant = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.4,        // Wait for title animation
      staggerChildren: 0.18,     // Sequential orbital reveal
    },
  },
};

/**
 * Mobile container - faster timing for performance
 */
export const containerVariantMobile = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.12,
    },
  },
};

/**
 * Container with custom timing
 */
export const createContainerVariant = (delayChildren = 0.5, staggerChildren = 0.15) => ({
  hidden: {},
  show: {
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
});

// =============================================================================
// CHILD ITEM ANIMATIONS - ORBITAL MOTION
// =============================================================================

/**
 * Standard item orbital animation (curves from bottom-left)
 * Creates planetary motion feel
 */
export const itemVariant = {
  hidden: {
    opacity: 0,
    y: 50,
    x: -25,
    scale: 0.95
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: orbitalEasing,
    },
  },
};

/**
 * Mobile item variant - lighter orbital movement
 */
export const itemVariantMobile = {
  hidden: {
    opacity: 0,
    y: 30,
    x: -12,
    scale: 0.97
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: orbitalEasing,
    },
  },
};

/**
 * Orbital slide from left animation
 */
export const itemSlideLeftVariant = {
  hidden: {
    opacity: 0,
    x: -50,
    y: 20,
    scale: 0.96
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: orbitalEasing,
    },
  },
};

/**
 * Orbital slide from right animation
 */
export const itemSlideRightVariant = {
  hidden: {
    opacity: 0,
    x: 50,
    y: 20,
    scale: 0.96
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: orbitalEasing,
    },
  },
};

/**
 * Scale-in with subtle orbital drift
 */
export const itemScaleVariant = {
  hidden: {
    opacity: 0,
    scale: 0.88,
    y: 15
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: orbitalEasing,
    },
  },
};

/**
 * Create alternating orbital slide variant based on index
 * Elements alternate coming from left/right for organic feel
 */
export const getAlternatingSlideVariant = (index) => ({
  hidden: {
    opacity: 0,
    x: index % 2 === 0 ? -35 : 35,
    y: 40,
    scale: 0.95
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: orbitalEasing,
    },
  },
});

/**
 * Create orbital item variant for specific index
 * Full planetary motion with alternating directions
 *
 * @param {number} index - Item index for direction alternation
 * @param {boolean} isMobile - Use mobile-optimized values
 * @returns Framer Motion variant object
 */
export const getOrbitalItemVariant = (index, isMobile = false) => {
  const direction = index % 2 === 0 ? -1 : 1;

  if (isMobile) {
    return {
      hidden: {
        opacity: 0,
        y: 30,
        x: direction * 15,
        scale: 0.97
      },
      show: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: orbitalEasing,
        },
      },
    };
  }

  return {
    hidden: {
      opacity: 0,
      y: 55,
      x: direction * 30,
      scale: 0.94
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: orbitalEasing,
      },
    },
  };
};

// =============================================================================
// VIEWPORT OPTIONS
// =============================================================================

/**
 * Standard viewport settings for scroll-triggered animations
 */
export const viewportOptions = {
  once: true,
  margin: "-100px",
};

/**
 * Mobile-optimized viewport settings
 */
export const viewportOptionsMobile = {
  once: true,
  margin: "-50px",
};

// =============================================================================
// HOVER & FLOATING ANIMATIONS (Premium enhancements)
// =============================================================================

/**
 * Card hover with orbital lift effect
 */
export const cardHoverScale = {
  scale: 1.02,
  y: -3,
  transition: { duration: 0.3, ease: smoothEasing },
};

/**
 * Card hover lift with subtle glow
 */
export const cardHoverLift = {
  y: -6,
  transition: { duration: 0.35, ease: smoothEasing },
};

/**
 * Subtle floating animation props
 * Use with animate prop for continuous motion after appear
 *
 * Usage:
 * <motion.div {...floatingAnimation} />
 */
export const floatingAnimation = {
  animate: {
    y: [0, -6, 0],
  },
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

/**
 * Gentle pulse animation for emphasis
 */
export const pulseAnimation = {
  animate: {
    scale: [1, 1.02, 1],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

/**
 * Combined floating + pulse for hero elements
 */
export const heroFloatingAnimation = {
  animate: {
    y: [0, -8, 0],
    scale: [1, 1.01, 1],
  },
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// =============================================================================
// RESPONSIVE HELPER
// =============================================================================

/**
 * Get responsive animation variants based on screen width
 * Usage: const { title, container, item, orbital } = getResponsiveVariants(isMobile);
 */
export const getResponsiveVariants = (isMobile = false) => ({
  title: isMobile ? titleVariantMobile : titleVariant,
  container: isMobile ? containerVariantMobile : containerVariant,
  item: isMobile ? itemVariantMobile : itemVariant,
  viewport: isMobile ? viewportOptionsMobile : viewportOptions,
  getOrbital: (index) => getOrbitalItemVariant(index, isMobile),
});

// =============================================================================
// SECTION WRAPPER COMPONENT HELPERS
// =============================================================================

/**
 * Default section animation props with orbital timing
 * Use on the outermost section/motion.section element
 */
export const sectionAnimationProps = {
  initial: "hidden",
  whileInView: "show",
  viewport: viewportOptions,
};

/**
 * Create animation props with custom viewport
 */
export const createSectionAnimationProps = (customViewport = viewportOptions) => ({
  initial: "hidden",
  whileInView: "show",
  viewport: customViewport,
});

// =============================================================================
// ADVANCED ORBITAL PATTERNS
// =============================================================================

/**
 * Create a grid item variant with position-based orbital direction
 * Items orbit in from different angles based on their grid position
 *
 * @param {number} index - Item index
 * @param {number} columns - Number of columns in grid
 * @returns Framer Motion variant object
 */
export const getGridOrbitalVariant = (index, columns = 3) => {
  const row = Math.floor(index / columns);
  const col = index % columns;

  // Determine direction based on position
  // Left items come from left, right items from right, center from bottom
  let xOffset;
  if (col === 0) xOffset = -35;
  else if (col === columns - 1) xOffset = 35;
  else xOffset = (row % 2 === 0 ? -15 : 15);

  return {
    hidden: {
      opacity: 0,
      y: 50,
      x: xOffset,
      scale: 0.94
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: orbitalEasing,
      },
    },
  };
};

/**
 * Radial orbital variant - items orbit in from a center point
 * Creates a "starburst" effect
 *
 * @param {number} index - Item index
 * @param {number} total - Total number of items
 * @returns Framer Motion variant object
 */
export const getRadialOrbitalVariant = (index, total) => {
  const angle = (index / total) * Math.PI * 2; // Distribute around circle
  const distance = 60;

  return {
    hidden: {
      opacity: 0,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance + 30, // Add downward offset
      scale: 0.9
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: orbitalEasing,
      },
    },
  };
};
