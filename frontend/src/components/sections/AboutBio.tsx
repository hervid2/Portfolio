import { motion } from "motion/react";
import { useLanguage } from "@/hooks/useLanguage";
import { fadeUpVariants } from "@/utils/motionPresets";

/**
 * Renders the About profile block: the portrait next to the three bio paragraphs.
 *
 * Every element inherits the `hidden` / `visible` variants from the About
 * section's stagger container, so the block keeps the section's rhythm.
 *
 * @returns The portrait and bio grid.
 */
export function AboutBio(): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <div className="mt-12 grid items-start gap-10 md:grid-cols-[240px_1fr]">
      <motion.img
        variants={fadeUpVariants}
        src="/assets/images/profile/profile-photo.webp"
        alt="Portrait of Hernán David Cardona"
        className="h-60 w-60 rounded-full border-2 border-accent-cyan object-cover"
        loading="lazy"
      />

      <div>
        <motion.p variants={fadeUpVariants} className="text-lg leading-relaxed text-text-secondary">
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
  );
}
