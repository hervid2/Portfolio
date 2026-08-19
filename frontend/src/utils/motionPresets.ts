import { stagger } from "motion/react";
import type { Transition, Variants } from "motion/react";

/**
 * Shared motion vocabulary for the whole portfolio.
 *
 * Every animated surface reuses these tokens so the site reads as one system:
 * the same spring, the same travel distance and the same stagger rhythm,
 * regardless of whether the element is a hero heading or a project card.
 */

/** Vertical travel distance in pixels for entrance animations. */
export const ENTRANCE_OFFSET_Y = 24;

/** Duration in seconds for entrance animations. */
export const ENTRANCE_DURATION_SECONDS = 0.7;

/** Delay in seconds between consecutive items of a staggered group. */
export const STAGGER_STEP_SECONDS = 0.14;

/**
 * Entrance spring shared by the hero, the cards and the lower sections.
 *
 * `visualDuration` sets how long the element takes to visually reach its
 * target, and `bounce` adds the small elastic overshoot that makes the rise
 * read as movement rather than as a plain fade.
 */
export const ENTRANCE_SPRING: Transition = {
  type: "spring",
  visualDuration: ENTRANCE_DURATION_SECONDS,
  bounce: 0.2
};

/**
 * Viewport config for entrances that replay on every visit to a section.
 *
 * `once: false` re-runs the animation each time the element re-enters the
 * viewport, so navigating back to a section plays its cascade again instead of
 * showing it already settled.
 */
export const REPLAY_VIEWPORT = { once: false, amount: 0.15 } as const;

/** Hover lift in pixels, matching the previous CSS `hover:-translate-y-1`. */
export const HOVER_LIFT_Y = -4;

/** Hover lift in pixels for small controls, matching `hover:-translate-y-0.5`. */
export const HOVER_LIFT_Y_SMALL = -2;

/**
 * Spring used for layout reflows: grid reordering when filtering and card
 * resizing when the EN/ES dictionary swaps to text of a different length.
 */
export const LAYOUT_SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 34,
  mass: 0.9
};

/** Snappier spring for hover feedback on interactive surfaces. */
export const HOVER_SPRING: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 30
};

/** Fade-and-rise entrance shared by hero elements and lower sections. */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: ENTRANCE_OFFSET_Y },
  visible: {
    opacity: 1,
    y: 0,
    transition: ENTRANCE_SPRING
  }
};

/**
 * Entrance for cards leaving and entering the filtered grid.
 *
 * Exit scales down slightly so a removed card reads as collapsing in place
 * rather than sliding away, which keeps the grid rhythm legible.
 */
export const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: ENTRANCE_OFFSET_Y, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: ENTRANCE_SPRING
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

/**
 * Builds a container variant that staggers its children with the shared rhythm.
 *
 * Uses `delayChildren: stagger(...)`, the current Motion orchestration API;
 * the older `staggerChildren` option is deprecated.
 *
 * @param startDelaySeconds - Delay before the first child starts animating.
 * @param stepSeconds - Delay added between consecutive children.
 * @returns Variants object to spread on a staggering parent element.
 */
export function createStaggerContainer(
  startDelaySeconds = 0,
  stepSeconds = STAGGER_STEP_SECONDS
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        delayChildren: stagger(stepSeconds, { startDelay: startDelaySeconds })
      }
    }
  };
}
