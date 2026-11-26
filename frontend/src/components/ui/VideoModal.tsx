import { motion } from "motion/react";
import type { MotionProps } from "motion/react";
import { useModalBehavior } from "@/hooks/useModalBehavior";
import { CARD_CORNER_RADIUS, buildCardLayoutId } from "@/utils/projectCardIdentity";
import { LAYOUT_SPRING } from "@/utils/motionPresets";

interface VideoModalProps {
  projectId: string;
  onClose: () => void;
  projectTitle: string;
  videoId: string;
}

/** Fade of the full-screen backdrop on mount and unmount. */
const BACKDROP_FADE: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

/** Delayed fade of the panel content, so it appears after the morph settles. */
const CONTENT_FADE: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.15, duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};

/** Classes for the full-screen backdrop that dims the page. */
const BACKDROP_CLASSES =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm";

/** Classes for the dialog panel that morphs out of the project card. */
const PANEL_CLASSES =
  "relative w-full max-w-3xl border border-border-subtle bg-surface-card " +
  "shadow-[0_25px_60px_rgba(0,0,0,0.5)]";

/** Classes for the header close button. */
const CLOSE_BUTTON_CLASSES =
  "flex-shrink-0 rounded-lg p-1.5 text-text-secondary transition-colors " +
  "hover:bg-surface-muted hover:text-text-primary";

/** Browser features the YouTube embed may use. */
const PLAYER_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

/**
 * Renders the modal header: the project title and the close button.
 *
 * @param projectTitle - Project title shown in the header.
 * @param onClose - Called when the close button is used.
 * @returns Header element.
 */
function renderHeader(projectTitle: string, onClose: () => void): JSX.Element {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h3 className="text-sm font-bold text-text-primary">{projectTitle}</h3>
      <button type="button" onClick={onClose} className={CLOSE_BUTTON_CLASSES} aria-label="Close">
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Renders the 16:9 YouTube player with autoplay.
 *
 * @param projectTitle - Project title used in the iframe title.
 * @param videoId - YouTube video id to embed.
 * @returns Player container element.
 */
function renderPlayer(projectTitle: string, videoId: string): JSX.Element {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
        title={`${projectTitle} demo video`}
        allow={PLAYER_ALLOW}
        allowFullScreen
      />
    </div>
  );
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
  useModalBehavior(onClose);

  return (
    <motion.div {...BACKDROP_FADE} className={BACKDROP_CLASSES} onClick={onClose}>
      <motion.div
        layoutId={buildCardLayoutId(projectId)}
        transition={{ layout: LAYOUT_SPRING }}
        style={{ borderRadius: CARD_CORNER_RADIUS }}
        role="dialog"
        aria-modal="true"
        aria-label={`${projectTitle} demo video`}
        className={PANEL_CLASSES}
        onClick={(event) => event.stopPropagation()}
      >
        <motion.div {...CONTENT_FADE} className="p-4">
          {renderHeader(projectTitle, onClose)}
          {renderPlayer(projectTitle, videoId)}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
