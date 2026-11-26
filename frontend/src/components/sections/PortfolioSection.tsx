import { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/hooks/useLanguage";
import { useProjectFilter } from "@/hooks/useProjectFilter";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { PortfolioModals } from "@/components/sections/PortfolioModals";
import { ProjectFilterBar } from "@/components/ui/ProjectFilterBar";
import { fadeUpVariants, REPLAY_VIEWPORT } from "@/utils/motionPresets";

/**
 * Renders the filterable portfolio section from typed project data.
 *
 * Owns the filter state and which modal is open; the grid and the modal layer
 * are delegated to `PortfolioGrid` and `PortfolioModals`.
 *
 * @returns Portfolio section element.
 */
export function PortfolioSection(): JSX.Element {
  const { dictionary } = useLanguage();
  const { categories, activeCategory, visibleProjects, selectCategory } = useProjectFilter();
  const [openCredentialsId, setOpenCredentialsId] = useState<string | null>(null);
  const [openVideoId, setOpenVideoId] = useState<string | null>(null);

  return (
    <section id="portfolio" className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8">
      <motion.header
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={REPLAY_VIEWPORT}
        className="mb-10 text-center"
      >
        <h2 className="section-title">{dictionary.portfolio.title}</h2>
        <p className="section-subtitle">{dictionary.portfolio.subtitle}</p>
      </motion.header>

      <ProjectFilterBar
        categories={categories}
        activeCategory={activeCategory}
        allLabel={dictionary.portfolio.filterAll}
        groupLabel={dictionary.portfolio.filterLabel}
        onSelect={selectCategory}
      />

      <PortfolioGrid
        visibleProjects={visibleProjects}
        onOpenVideo={setOpenVideoId}
        onOpenCredentials={setOpenCredentialsId}
      />

      <PortfolioModals
        openCredentialsId={openCredentialsId}
        openVideoId={openVideoId}
        onCloseCredentials={() => setOpenCredentialsId(null)}
        onCloseVideo={() => setOpenVideoId(null)}
      />
    </section>
  );
}
