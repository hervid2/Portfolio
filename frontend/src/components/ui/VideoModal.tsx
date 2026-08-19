import { useEffect } from "react";
import { motion } from "motion/react";
import { CARD_CORNER_RADIUS, buildCardLayoutId } from "@/utils/projectCardIdentity";
import { LAYOUT_SPRING } from "@/utils/motionPresets";

interface VideoModalProps {
  projectId: string;
  onClose: () => void;
  projectTitle: string;
  videoId: string;
}

/**
 * Overlay modal that plays a YouTube demo video for a project.
 *
 * Mounting is controlled by an `AnimatePresence` in the parent, so this
 * component is always in its open state while rendered. The panel shares its
 * `layoutId` with the originating project card, which makes the modal grow out
 * of that card instead of appearing abruptly. Closes on backdrop click or
 * Escape; unmounting the iframe stops playback.
 *
 * @param projectId - Project id used to pair the morph with its source card.
 * @param onClose - Called when the modal requests to close.
 * @param projectTitle - Project title shown in the header.
 * @param videoId - YouTube video id to embed.
 * @returns Animated modal element.
 */
export function VideoModal({
  projectId,
  onClose,
  projectTitle,
  videoId
}: VideoModalProps): JSX.Element {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        layoutId={buildCardLayoutId(projectId)}
        transition={{ layout: LAYOUT_SPRING }}
        style={{ borderRadius: CARD_CORNER_RADIUS }}
        role="dialog"
        aria-modal="true"
        aria-label={`${projectTitle} demo video`}
        className="relative w-full max-w-3xl border border-border-subtle bg-surface-card shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.2 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-text-primary">{projectTitle}</h3>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
              aria-label="Close"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
              title={`${projectTitle} demo video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
