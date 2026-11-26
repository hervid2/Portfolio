import { motion } from "motion/react";
import { useLanguage } from "@/hooks/useLanguage";
import { fadeUpVariants } from "@/utils/motionPresets";

/**
 * Renders the hero headline: name, role and positioning statement.
 *
 * Each line inherits the `hidden` / `visible` variants from the hero's stagger
 * container. The heading animates with no delay because it is the LCP element
 * and Chromium does not count a fully transparent element as painted.
 *
 * @returns The hero heading and its two copy paragraphs.
 */
export function HeroIntro(): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <>
      <motion.h1
        variants={fadeUpVariants}
        className="font-display text-5xl font-bold tracking-tight text-text-primary md:text-7xl"
      >
        Hernán David Cardona
      </motion.h1>

      <motion.p
        variants={fadeUpVariants}
        className="mt-5 font-display text-4xl font-semibold text-accent-cyan md:text-5xl"
      >
        {dictionary.hero.role}
      </motion.p>

      <motion.p
        variants={fadeUpVariants}
        className="mx-auto mt-7 max-w-2xl text-xl text-text-secondary"
      >
        {dictionary.hero.statement}
      </motion.p>
    </>
  );
}
