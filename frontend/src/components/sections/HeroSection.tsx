import { motion } from "motion/react";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { useLanguage } from "@/hooks/useLanguage";
import {
  createStaggerContainer,
  fadeUpVariants,
  HOVER_LIFT_Y_SMALL,
  HOVER_SPRING,
  LAYOUT_SPRING,
  REPLAY_VIEWPORT
} from "@/utils/motionPresets";

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
 * Renders hero section with profile headline and CTA buttons.
 *
 * The hero shares the site-wide spring, travel distance and stagger rhythm with
 * the rest of the page, but not the card hover treatment, which belongs to
 * clickable surfaces. Its entrance replays every time the section re-enters the
 * viewport, so returning to Home plays the cascade again.
 *
 * Layout animations and the entrance animation are kept on separate nodes: the
 * outer wrapper owns `layout` so the block reflows and re-centers smoothly when
 * the EN/ES dictionary swaps in text of a different length, while its children
 * own the `y` entrance. Both write to `transform`, so sharing a node lets
 * layout projection cancel out the rise.
 *
 * The heading animates with no delay because it is the LCP element and
 * Chromium does not count a fully transparent element as painted.
 *
 * @returns Hero section element.
 */
export function HeroSection(): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <section
      id="home"
      className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl items-center justify-center px-5 py-10 md:px-8"
    >
      <motion.div
        layout
        transition={{ layout: LAYOUT_SPRING }}
        className="w-full max-w-3xl text-center"
      >
        <motion.div
          variants={createStaggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={REPLAY_VIEWPORT}
        >
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

          <motion.div
            variants={fadeUpVariants}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
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

          <motion.div
            variants={fadeUpVariants}
            className="mt-12 flex items-center justify-center gap-6 text-text-secondary"
          >
            <motion.a
              href="https://github.com/hervid2"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:text-accent-cyan"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Visit GitHub profile"
              whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
            >
              <ThemeIcon
                iconPath="/assets/icons/social/github.svg"
                iconPathDark="/assets/icons/social/github-dark.svg"
                alt="GitHub icon"
                className="h-[18px] w-[18px] object-contain"
              />
              GitHub
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/hern%C3%A1n-david-cardona-becerra/"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:text-accent-cyan"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Visit LinkedIn profile"
              whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
            >
              <ThemeIcon
                iconPath="/assets/icons/social/linkedin.svg"
                alt="LinkedIn icon"
                className="h-[18px] w-[18px] object-contain"
              />
              LinkedIn
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
