import { motion } from "motion/react";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { HOVER_SPRING } from "@/utils/motionPresets";

interface ProjectLinkProps {
  label: string;
  url: string | null;
  pendingLabel: string;
  iconPath: string;
  iconPathDark?: string;
}

/** Base classes shared by every project card link and action button. */
export const INTERACTIVE_BASE_CLASSES =
  "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs " +
  "transition-[color,background-color,border-color] duration-200";

/** Neutral link classes, shared by the link and its placeholder. */
const NEUTRAL_LINK_CLASSES = `${INTERACTIVE_BASE_CLASSES} border-border-subtle text-text-secondary`;

/**
 * Renders an external project link, or a muted placeholder when no URL exists.
 *
 * @param label - Link label.
 * @param url - Destination URL, or null when the link is not published yet.
 * @param pendingLabel - Fallback text shown when the URL is missing.
 * @param iconPath - Light theme icon path.
 * @param iconPathDark - Optional dark theme icon path.
 * @returns Link element or placeholder span.
 */
export function ProjectLink({
  label,
  url,
  pendingLabel,
  iconPath,
  iconPathDark
}: ProjectLinkProps): JSX.Element {
  const icon = (
    <ThemeIcon
      iconPath={iconPath}
      iconPathDark={iconPathDark}
      alt={`${label} icon`}
      className="h-4 w-4 object-contain"
    />
  );

  if (!url) {
    return (
      <span className={NEUTRAL_LINK_CLASSES}>
        {icon}
        {label}: {pendingLabel}
      </span>
    );
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2, transition: HOVER_SPRING }}
      className={
        `${NEUTRAL_LINK_CLASSES} ` +
        "hover:border-accent-cyan hover:bg-surface-muted hover:text-accent-cyan"
      }
    >
      {icon}
      {label}
    </motion.a>
  );
}
