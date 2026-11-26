import { motion } from "motion/react";
import { ProjectCardActions } from "@/components/ui/ProjectCardActions";
import { ProjectCardMedia } from "@/components/ui/ProjectCardMedia";
import { ProjectStackList } from "@/components/ui/ProjectStackList";
import { useHoverPreviewVideo } from "@/hooks/useHoverPreviewVideo";
import {
  gridItemVariants,
  HOVER_LIFT_Y,
  HOVER_SPRING,
  LAYOUT_SPRING,
  REPLAY_VIEWPORT
} from "@/utils/motionPresets";
import { CARD_CORNER_RADIUS, buildCardLayoutId } from "@/utils/projectCardIdentity";
import type { FocusEvent } from "react";
import type { Project } from "@/types/project";
import type { AppDictionary, Language } from "@/types/i18n";

interface ProjectCardProps {
  project: Project;
  language: Language;
  dictionary: AppDictionary;
  onOpenVideo: (projectId: string) => void;
  onOpenCredentials: (projectId: string) => void;
}

/** Motion props, inline style and classes that are the same for every card. */
const CARD_STATIC_PROPS = {
  layout: true,
  variants: gridItemVariants,
  initial: "hidden",
  whileInView: "visible",
  exit: "exit",
  viewport: REPLAY_VIEWPORT,
  whileHover: { y: HOVER_LIFT_Y, transition: HOVER_SPRING },
  transition: { layout: LAYOUT_SPRING },
  style: { borderRadius: CARD_CORNER_RADIUS },
  className:
    "flex flex-col overflow-hidden border border-border-subtle bg-surface-card " +
    "shadow-card transition-[border-color,box-shadow] duration-300 " +
    "hover:border-accent-cyan hover:shadow-[0_20px_45px_rgba(16,217,229,0.2)]"
} as const;

/**
 * Renders a single animated project card.
 *
 * The outer element owns the layout animation so the card can reflow smoothly
 * when the grid is filtered and when the EN/ES dictionary swaps the description
 * for text of a different length. Its `layoutId` is shared with the modals so
 * an opening modal grows out of this card.
 *
 * Pointing at the card—or reaching it with the keyboard—crossfades the static
 * poster into a muted looping clip, and leaving it fades the poster back in.
 *
 * @param project - Project data to render.
 * @param language - Active language used to pick localized copy.
 * @param dictionary - Active dictionary for UI labels.
 * @param onOpenVideo - Opens the demo video modal for a project id.
 * @param onOpenCredentials - Opens the demo credentials modal for a project id.
 * @returns Animated project card element.
 */
export function ProjectCard({
  project,
  language,
  dictionary,
  onOpenVideo,
  onOpenCredentials
}: ProjectCardProps): JSX.Element {
  const preview = useHoverPreviewVideo(project.previewVideoUrl);

  /**
   * Stops the preview only once focus leaves the card entirely.
   *
   * Blur bubbles from every focusable child, so moving between the card links
   * would otherwise restart the clip on each hop.
   *
   * @param event - Blur event bubbled from a focusable descendant.
   * @returns Nothing.
   */
  function handleCardBlur(event: FocusEvent<HTMLElement>): void {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    preview.stopPreview();
  }

  return (
    <motion.article
      {...CARD_STATIC_PROPS}
      layoutId={buildCardLayoutId(project.id)}
      onPointerEnter={preview.startPreview}
      onPointerLeave={preview.stopPreview}
      onFocus={preview.startPreview}
      onBlur={handleCardBlur}
    >
      <ProjectCardMedia project={project} preview={preview} />

      <motion.div layout="position" className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="text-xl font-bold text-text-primary">{project.title}</h3>
        <p className="text-sm text-text-secondary">{project.description[language]}</p>
        <ProjectStackList projectId={project.id} stack={project.stack} />
        <ProjectCardActions
          project={project}
          dictionary={dictionary}
          onOpenVideo={onOpenVideo}
          onOpenCredentials={onOpenCredentials}
        />
      </motion.div>
    </motion.article>
  );
}
