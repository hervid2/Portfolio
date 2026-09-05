import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects } from "@/data/projects";
import { useLanguage } from "@/hooks/useLanguage";
import { useProjectFilter } from "@/hooks/useProjectFilter";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectFilterBar } from "@/components/ui/ProjectFilterBar";
import { CredentialsModal } from "@/components/ui/CredentialsModal";
import { VideoModal } from "@/components/ui/VideoModal";
import { fadeUpVariants, LAYOUT_SPRING, REPLAY_VIEWPORT } from "@/utils/motionPresets";

/**
 * Renders the filterable portfolio grid from typed project data.
 *
 * The grid stays a CSS grid at every breakpoint, so adding projects keeps the
 * existing column rhythm; Motion only animates each card to its new grid slot
 * when the filter changes.
 *
 * @returns Portfolio section element.
 */
export function PortfolioSection(): JSX.Element {
  const { dictionary, language } = useLanguage();
  const { categories, activeCategory, visibleProjects, selectCategory } = useProjectFilter();
  const [openCredentialsId, setOpenCredentialsId] = useState<string | null>(null);
  const [openVideoId, setOpenVideoId] = useState<string | null>(null);

  const activeProject = openCredentialsId
    ? projects.find((project) => project.id === openCredentialsId)
    : null;

  const activeVideoProject = openVideoId
    ? projects.find((project) => project.id === openVideoId)
    : null;

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

      <motion.div
        layout
        transition={{ layout: LAYOUT_SPRING }}
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              language={language}
              dictionary={dictionary}
              onOpenVideo={setOpenVideoId}
              onOpenCredentials={setOpenCredentialsId}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {activeProject?.demoCredentials ? (
          <CredentialsModal
            key="credentials-modal"
            projectId={activeProject.id}
            onClose={() => setOpenCredentialsId(null)}
            projectTitle={activeProject.title}
            credentials={activeProject.demoCredentials}
            language={language}
            dictionary={dictionary}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {activeVideoProject?.demoVideoId ? (
          <VideoModal
            key="video-modal"
            projectId={activeVideoProject.id}
            onClose={() => setOpenVideoId(null)}
            projectTitle={activeVideoProject.title}
            videoId={activeVideoProject.demoVideoId[language]}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
