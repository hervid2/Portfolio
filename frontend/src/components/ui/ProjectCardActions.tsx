import { motion } from "motion/react";
import { KeyIcon } from "@/components/ui/KeyIcon";
import { PlayIcon } from "@/components/ui/PlayIcon";
import { INTERACTIVE_BASE_CLASSES, ProjectLink } from "@/components/ui/ProjectLink";
import { HOVER_SPRING } from "@/utils/motionPresets";
import type { Project } from "@/types/project";
import type { AppDictionary } from "@/types/i18n";

interface ProjectCardActionsProps {
  project: Project;
  dictionary: AppDictionary;
  onOpenVideo: (projectId: string) => void;
  onOpenCredentials: (projectId: string) => void;
}

/** Classes for the highlighted buttons that open a modal. */
const ACCENT_BUTTON_CLASSES =
  `${INTERACTIVE_BASE_CLASSES} border-accent-cyan/40 bg-accent-cyan/5 ` +
  "font-semibold text-accent-cyan hover:border-accent-cyan hover:bg-accent-cyan/10";

/**
 * Renders a highlighted action button that opens one of the project modals.
 *
 * @param icon - Leading icon element.
 * @param label - Visible button label.
 * @param onClick - Click handler.
 * @returns Animated button element.
 */
function renderAccentButton(icon: JSX.Element, label: string, onClick: () => void): JSX.Element {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2, transition: HOVER_SPRING }}
      className={ACCENT_BUTTON_CLASSES}
    >
      {icon}
      {label}
    </motion.button>
  );
}

/**
 * Renders the card actions: the demo link or video button, the code link and,
 * when the project has demo accounts, the credentials button.
 *
 * @param project - Project whose links and modals are offered.
 * @param dictionary - Active dictionary for the action labels.
 * @param onOpenVideo - Opens the demo video modal for a project id.
 * @param onOpenCredentials - Opens the demo credentials modal for a project id.
 * @returns Card action row.
 */
export function ProjectCardActions({
  project,
  dictionary,
  onOpenVideo,
  onOpenCredentials
}: ProjectCardActionsProps): JSX.Element {
  const { portfolio } = dictionary;
  const hasCredentials = Boolean(project.demoCredentials && project.demoCredentials.length > 0);
  const showsVideoButton = !project.liveDemoUrl && Boolean(project.demoVideoId);

  return (
    <div className="mt-auto flex flex-wrap gap-2">
      {showsVideoButton ? (
        renderAccentButton(<PlayIcon />, portfolio.watchDemo, () => onOpenVideo(project.id))
      ) : (
        <ProjectLink
          label={portfolio.liveDemo}
          url={project.liveDemoUrl || null}
          pendingLabel={portfolio.pending}
          iconPath="/assets/icons/actions/demo.svg"
          iconPathDark="/assets/icons/actions/demo-dark.svg"
        />
      )}

      <ProjectLink
        label={portfolio.code}
        url={project.codeUrl}
        pendingLabel={portfolio.pending}
        iconPath="/assets/icons/actions/code.svg"
        iconPathDark="/assets/icons/actions/code-dark.svg"
      />

      {hasCredentials
        ? renderAccentButton(<KeyIcon />, portfolio.credentialsTitle, () =>
            onOpenCredentials(project.id)
          )
        : null}
    </div>
  );
}
