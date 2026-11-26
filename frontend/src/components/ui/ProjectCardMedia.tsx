import { motion } from "motion/react";
import type { useHoverPreviewVideo } from "@/hooks/useHoverPreviewVideo";
import type { Project } from "@/types/project";

interface ProjectCardMediaProps {
  project: Pick<Project, "title" | "imageUrl" | "previewVideoUrl">;
  preview: ReturnType<typeof useHoverPreviewVideo>;
}

/**
 * Renders the card media: the static poster plus, once mounted, the muted preview clip.
 *
 * @param project - Project title, poster URL and optional preview clip URL.
 * @param preview - State and handlers from `useHoverPreviewVideo`, owned by the card.
 * @returns Card media block.
 */
export function ProjectCardMedia({ project, preview }: ProjectCardMediaProps): JSX.Element {
  const { title, imageUrl, previewVideoUrl } = project;
  const { videoRef, isPreviewMounted, isPreviewVisible } = preview;

  return (
    <motion.div layout="position" className="relative h-52 w-full overflow-hidden">
      <img
        src={imageUrl}
        alt={`${title} preview image`}
        className="h-full w-full object-cover"
        loading="lazy"
      />

      {isPreviewMounted && previewVideoUrl ? (
        <video
          ref={videoRef}
          src={previewVideoUrl}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onLoadedData={preview.markPreviewReady}
          onError={preview.markPreviewFailed}
          className={
            "absolute inset-0 h-full w-full object-cover " +
            "transition-opacity duration-500 " +
            (isPreviewVisible ? "opacity-100" : "opacity-0")
          }
        />
      ) : null}
    </motion.div>
  );
}
