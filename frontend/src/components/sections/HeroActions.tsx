import { motion } from "motion/react";
import { useLanguage } from "@/hooks/useLanguage";
import { fadeUpVariants, HOVER_LIFT_Y_SMALL, HOVER_SPRING } from "@/utils/motionPresets";

/**
 * Scrolls to a selected section in the page.
 *
 * @param sectionId - Section id to navigate to.
 */
function jumpToSection(sectionId: string): void {
  const sectionElement = document.getElementById(sectionId);

  if (!sectionElement) {
    return;
  }

  sectionElement.scrollIntoView({ behavior: "smooth" });
}

/**
 * Renders the hero call-to-action buttons that jump to Portfolio and Contact.
 *
 * @returns The CTA button row.
 */
export function HeroActions(): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <motion.div variants={fadeUpVariants} className="mt-10 flex flex-wrap justify-center gap-4">
      <motion.button
        type="button"
        className="btn-primary"
        whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
        onClick={() => jumpToSection("portfolio")}
      >
        {dictionary.hero.ctaPrimary}
      </motion.button>
      <motion.button
        type="button"
        className="btn-secondary"
        whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
        onClick={() => jumpToSection("contact")}
      >
        {dictionary.hero.ctaSecondary}
      </motion.button>
    </motion.div>
  );
}
