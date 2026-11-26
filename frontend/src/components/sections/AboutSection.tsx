import { motion } from "motion/react";
import { AboutBio } from "@/components/sections/AboutBio";
import { AboutSkillsGrid } from "@/components/sections/AboutSkillsGrid";
import { useLanguage } from "@/hooks/useLanguage";
import { createStaggerContainer, fadeUpVariants, REPLAY_VIEWPORT } from "@/utils/motionPresets";

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

      <AboutBio />
      <AboutSkillsGrid />
    </motion.section>
  );
}
