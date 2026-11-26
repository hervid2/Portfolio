import { motion } from "motion/react";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { fadeUpVariants, HOVER_LIFT_Y_SMALL, HOVER_SPRING } from "@/utils/motionPresets";

/** Shared classes for each hero profile link. */
const PROFILE_LINK_CLASS =
  "inline-flex items-center gap-2 text-sm font-semibold hover:text-accent-cyan";

/** Size classes for each profile link icon. */
const PROFILE_ICON_CLASS = "h-[18px] w-[18px] object-contain";

/**
 * Renders the hero's external profile links (GitHub and LinkedIn).
 *
 * The hero is a single centered column, so the "profile card" is this row of
 * profile links. Its English `aria-label` and `alt` strings are pre-existing and
 * kept as-is (plan R-12).
 *
 * @returns The profile link row.
 */
export function HeroProfileCard(): JSX.Element {
  return (
    <motion.div
      variants={fadeUpVariants}
      className="mt-12 flex items-center justify-center gap-6 text-text-secondary"
    >
      <motion.a
        href="https://github.com/hervid2"
        className={PROFILE_LINK_CLASS}
        rel="noopener noreferrer"
        target="_blank"
        aria-label="Visit GitHub profile"
        whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
      >
        <ThemeIcon
          iconPath="/assets/icons/social/github.svg"
          iconPathDark="/assets/icons/social/github-dark.svg"
          alt="GitHub icon"
          className={PROFILE_ICON_CLASS}
        />
        GitHub
      </motion.a>
      <motion.a
        href="https://www.linkedin.com/in/hern%C3%A1n-david-cardona-becerra/"
        className={PROFILE_LINK_CLASS}
        rel="noopener noreferrer"
        target="_blank"
        aria-label="Visit LinkedIn profile"
        whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
      >
        <ThemeIcon
          iconPath="/assets/icons/social/linkedin.svg"
          alt="LinkedIn icon"
          className={PROFILE_ICON_CLASS}
        />
        LinkedIn
      </motion.a>
    </motion.div>
  );
}
