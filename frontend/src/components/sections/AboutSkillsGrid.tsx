import { motion } from "motion/react";
import { skills } from "@/data/skills";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { useLanguage } from "@/hooks/useLanguage";
import {
  createStaggerContainer,
  fadeUpVariants,
  HOVER_LIFT_Y_SMALL,
  HOVER_SPRING
} from "@/utils/motionPresets";

/** Faster step for the skill chips, so the long row reads as one wave. */
const SKILL_CHIP_STEP_SECONDS = 0.03;

/** Chip styling: muted surface that turns cyan on hover. */
const SKILL_CHIP_CLASS_NAME =
  "inline-flex items-center gap-2 rounded-full border border-border-subtle " +
  "bg-surface-muted px-4 py-2 text-sm font-medium text-text-secondary " +
  "transition-[color,border-color] duration-200 hover:border-accent-cyan " +
  "hover:text-accent-cyan";

/**
 * Renders the skills heading and the row of skill chips.
 *
 * The heading inherits the About section's stagger; the chips run their own,
 * faster nested stagger and lift slightly on hover.
 *
 * @returns The skills heading and chip grid.
 */
export function AboutSkillsGrid(): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <>
      <motion.h3
        variants={fadeUpVariants}
        className="mt-16 text-center font-display text-3xl font-semibold text-text-primary"
      >
        {dictionary.about.skillsTitle}
      </motion.h3>

      <motion.div
        variants={createStaggerContainer(0, SKILL_CHIP_STEP_SECONDS)}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        {skills.map((skill) => (
          <motion.span
            key={skill.id}
            variants={fadeUpVariants}
            whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
            className={SKILL_CHIP_CLASS_NAME}
          >
            <ThemeIcon
              iconPath={skill.iconPath}
              iconPathDark={skill.iconPathDark}
              alt={`${skill.label} icon`}
              className="h-4 w-4 object-contain"
            />
            {skill.label}
          </motion.span>
        ))}
      </motion.div>
    </>
  );
}
