import { motion } from "motion/react";
import { skills } from "@/data/skills";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { useLanguage } from "@/hooks/useLanguage";
import {
  createStaggerContainer,
  fadeUpVariants,
  HOVER_LIFT_Y_SMALL,
  HOVER_SPRING,
  REPLAY_VIEWPORT
} from "@/utils/motionPresets";

/** Faster step for the skill chips, so the long row reads as one wave. */
const SKILL_CHIP_STEP_SECONDS = 0.03;

/**
 * Renders the personal profile and dynamic skills section.
 *
 * Sits below the fold, so it animates on scroll with `whileInView` while
 * reusing the same spring, travel distance and stagger rhythm as the hero.
 *
 * @returns About section element.
 */
export function AboutSection(): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <motion.section
      id="about"
      variants={createStaggerContainer()}
      initial="hidden"
      whileInView="visible"
      viewport={REPLAY_VIEWPORT}
      className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8"
    >
      <motion.h2 variants={fadeUpVariants} className="section-title text-center">
        {dictionary.about.title}
      </motion.h2>

      <div className="mt-12 grid items-start gap-10 md:grid-cols-[240px_1fr]">
        <motion.img
          variants={fadeUpVariants}
          src="/assets/images/profile/profile-photo.webp"
          alt="Portrait of Hernán David Cardona"
          className="h-60 w-60 rounded-full border-2 border-accent-cyan object-cover"
          loading="lazy"
        />

        <div>
          <motion.p
            variants={fadeUpVariants}
            className="text-lg leading-relaxed text-text-secondary"
          >
            {dictionary.about.bioParagraphOne}
          </motion.p>
          <motion.p
            variants={fadeUpVariants}
            className="mt-6 text-lg leading-relaxed text-text-secondary"
          >
            {dictionary.about.bioParagraphTwo}
          </motion.p>
          <motion.p
            variants={fadeUpVariants}
            className="mt-6 text-lg leading-relaxed text-text-secondary"
          >
            {dictionary.about.bioParagraphThree}
          </motion.p>
        </div>
      </div>

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
            className={
              "inline-flex items-center gap-2 rounded-full border border-border-subtle " +
              "bg-surface-muted px-4 py-2 text-sm font-medium text-text-secondary " +
              "transition-[color,border-color] duration-200 hover:border-accent-cyan " +
              "hover:text-accent-cyan"
            }
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
    </motion.section>
  );
}
