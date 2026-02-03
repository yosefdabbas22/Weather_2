import { Variants } from "framer-motion";

// Optimized transition settings - minimal and fast
const textTransition = { duration: 0.16, ease: "easeOut" as const };
const textExitTransition = { duration: 0.15, ease: "easeOut" as const };

// Fade + slide animation for city/country names - minimal movement
export const fadeSlideVariants: Variants = {
  initial: {
    opacity: 0,
    y: 4,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: textTransition,
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: textExitTransition,
  },
};

// Crossfade for temperature values - opacity only
export const crossfadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: textTransition,
  },
  exit: {
    opacity: 0,
    transition: textExitTransition,
  },
};

// Stagger container for stats cards - faster stagger
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

// Fade-up for individual stat cards - minimal movement
export const fadeUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 4,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: textTransition,
  },
};

// Stagger container for forecast list - minimal stagger
export const staggerListVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

// Fade-in for forecast list items - minimal movement
export const fadeInVariants: Variants = {
  initial: {
    opacity: 0,
    x: -4,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: textTransition,
  },
};

// Page transition for loading → content - not used anymore (removed to prevent re-mounts)
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: textTransition,
  },
  exit: {
    opacity: 0,
    transition: textExitTransition,
  },
};
