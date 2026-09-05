import { motion } from "motion/react";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { resolveTechIconPath } from "@/utils/techIcons";
import {
  gridItemVariants,
  HOVER_LIFT_Y,
  HOVER_SPRING,
  LAYOUT_SPRING,
  REPLAY_VIEWPORT
} from "@/utils/motionPresets";
import { CARD_CORNER_RADIUS, buildCardLayoutId } from "@/utils/projectCardIdentity";
import type { Project } from "@/types/project";
import type { AppDictionary, Language } from "@/types/i18n";

interface ProjectCardProps {
  project: Project;
  language: Language;
  dictionary: AppDictionary;
  onOpenVideo: (projectId: string) => void;
  onOpenCredentials: (projectId: string) => void;
}

interface ProjectLinkProps {
  label: string;
  url: string | null;
  pendingLabel: string;
  iconPath: string;
  iconPathDark?: string;
}

const INTERACTIVE_BASE_CLASSES =
  "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs " +
  "transition-[color,background-color,border-color] duration-200";

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
function ProjectLink({
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
      <span
        className={`${INTERACTIVE_BASE_CLASSES} border-border-subtle text-text-secondary`}
      >
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
        `${INTERACTIVE_BASE_CLASSES} border-border-subtle text-text-secondary ` +
        "hover:border-accent-cyan hover:bg-surface-muted hover:text-accent-cyan"
      }
    >
      {icon}
      {label}
    </motion.a>
  );
}

/**
 * Renders a single animated project card.
 *
 * The outer element owns the layout animation so the card can reflow smoothly
 * when the grid is filtered and when the EN/ES dictionary swaps the description
 * for text of a different length. Its `layoutId` is shared with the modals so
 * an opening modal grows out of this card.
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
  const hasCredentials = Boolean(project.demoCredentials && project.demoCredentials.length > 0);

  return (
    <motion.article
      layout
      layoutId={buildCardLayoutId(project.id)}
      variants={gridItemVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={REPLAY_VIEWPORT}
      whileHover={{ y: HOVER_LIFT_Y, transition: HOVER_SPRING }}
      transition={{ layout: LAYOUT_SPRING }}
      style={{ borderRadius: CARD_CORNER_RADIUS }}
      className={
        "flex flex-col overflow-hidden border border-border-subtle bg-surface-card " +
        "shadow-card transition-[border-color,box-shadow] duration-300 " +
        "hover:border-accent-cyan hover:shadow-[0_20px_45px_rgba(16,217,229,0.2)]"
      }
    >
      <motion.div layout="position" className="relative">
        <img
          src={project.imageUrl}
          alt={`${project.title} preview image`}
          className="h-52 w-full object-cover"
          loading="lazy"
        />
      </motion.div>

      <motion.div layout="position" className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="text-xl font-bold text-text-primary">{project.title}</h3>
        <p className="text-sm text-text-secondary">{project.description[language]}</p>

        <div className="flex flex-wrap gap-2">
          {project.stack.map((stackItem) => {
            const iconSet = resolveTechIconPath(stackItem);

            return (
              <motion.span
                key={`${project.id}-${stackItem}`}
                whileHover={{ y: -2, transition: HOVER_SPRING }}
                className={
                  "inline-flex items-center gap-2 rounded-full border border-border-subtle " +
                  "bg-surface-muted px-3 py-1 text-xs text-text-secondary " +
                  "transition-[color,border-color] duration-200 hover:border-accent-cyan " +
                  "hover:text-accent-cyan"
                }
              >
                <ThemeIcon
                  iconPath={iconSet.iconPath}
                  iconPathDark={iconSet.iconPathDark}
                  alt={`${stackItem} icon`}
                  className="h-4 w-4 object-contain"
                />
                {stackItem}
              </motion.span>
            );
          })}
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.liveDemoUrl ? (
            <ProjectLink
              label={dictionary.portfolio.liveDemo}
              url={project.liveDemoUrl}
              pendingLabel={dictionary.portfolio.pending}
              iconPath="/assets/icons/actions/demo.svg"
              iconPathDark="/assets/icons/actions/demo-dark.svg"
            />
          ) : project.demoVideoId ? (
            <motion.button
              type="button"
              onClick={() => onOpenVideo(project.id)}
              whileHover={{ y: -2, transition: HOVER_SPRING }}
              className={
                `${INTERACTIVE_BASE_CLASSES} border-accent-cyan/40 bg-accent-cyan/5 ` +
                "font-semibold text-accent-cyan hover:border-accent-cyan hover:bg-accent-cyan/10"
              }
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
              </svg>
              {dictionary.portfolio.watchDemo}
            </motion.button>
          ) : (
            <ProjectLink
              label={dictionary.portfolio.liveDemo}
              url={null}
              pendingLabel={dictionary.portfolio.pending}
              iconPath="/assets/icons/actions/demo.svg"
              iconPathDark="/assets/icons/actions/demo-dark.svg"
            />
          )}

          <ProjectLink
            label={dictionary.portfolio.code}
            url={project.codeUrl}
            pendingLabel={dictionary.portfolio.pending}
            iconPath="/assets/icons/actions/code.svg"
            iconPathDark="/assets/icons/actions/code-dark.svg"
          />

          {hasCredentials ? (
            <motion.button
              type="button"
              onClick={() => onOpenCredentials(project.id)}
              whileHover={{ y: -2, transition: HOVER_SPRING }}
              className={
                `${INTERACTIVE_BASE_CLASSES} border-accent-cyan/40 bg-accent-cyan/5 ` +
                "font-semibold text-accent-cyan hover:border-accent-cyan hover:bg-accent-cyan/10"
              }
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
              {dictionary.portfolio.credentialsTitle}
            </motion.button>
          ) : null}
        </div>
      </motion.div>
    </motion.article>
  );
}
