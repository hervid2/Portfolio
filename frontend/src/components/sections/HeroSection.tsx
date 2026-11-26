import { motion } from "motion/react";
import { HeroActions } from "@/components/sections/HeroActions";
import { HeroIntro } from "@/components/sections/HeroIntro";
import { HeroProfileCard } from "@/components/sections/HeroProfileCard";
import { createStaggerContainer, LAYOUT_SPRING, REPLAY_VIEWPORT } from "@/utils/motionPresets";

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
 * @returns Hero section element.
 */
export function HeroSection(): JSX.Element {
  return (
    <section
      id="home"
      className={
        "mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl items-center justify-center " +
        "px-5 py-10 md:px-8"
      }
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
          <HeroIntro />
          <HeroActions />
          <HeroProfileCard />
        </motion.div>
      </motion.div>
    </section>
  );
}
