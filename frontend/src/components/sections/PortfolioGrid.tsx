import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/hooks/useLanguage";
import { ProjectCard } from "@/components/ui/ProjectCard";
import type { Project } from "@/types/project";
import { LAYOUT_SPRING } from "@/utils/motionPresets";

/** Props for the filtered project grid. */
interface PortfolioGridProps {
  visibleProjects: Project[];
  onOpenVideo: (projectId: string) => void;
  onOpenCredentials: (projectId: string) => void;
}

/**
 * Renders the filtered project cards in a CSS grid.
 *
 * The grid stays a CSS grid at every breakpoint, so adding projects keeps the
 * existing column rhythm; Motion only animates each card to its new grid slot
 * when the filter changes, and `popLayout` lets removed cards exit in place.
 * `popLayout` pops exiting cards to `position: absolute`, so the grid must be
 * `relative`; otherwise they are placed against `<body>` and fly off the grid.
 *
 * @param visibleProjects - Projects that match the active filter category.
 * @param onOpenVideo - Opens the demo video modal for a project id.
 * @param onOpenCredentials - Opens the demo credentials modal for a project id.
 * @returns The animated project grid.
 */
export function PortfolioGrid({
  visibleProjects,
  onOpenVideo,
  onOpenCredentials
}: PortfolioGridProps): JSX.Element {
  const { dictionary, language } = useLanguage();

  return (
    <motion.div
      layout
      transition={{ layout: LAYOUT_SPRING }}
      className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            language={language}
            dictionary={dictionary}
            onOpenVideo={onOpenVideo}
            onOpenCredentials={onOpenCredentials}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
