import { AnimatePresence } from "motion/react";
import { projects } from "@/data/projects";
import { useLanguage } from "@/hooks/useLanguage";
import { CredentialsModal } from "@/components/ui/CredentialsModal";
import { VideoModal } from "@/components/ui/VideoModal";
import type { Project } from "@/types/project";

/** Props for the portfolio modal layer. */
interface PortfolioModalsProps {
  openCredentialsId: string | null;
  openVideoId: string | null;
  onCloseCredentials: () => void;
  onCloseVideo: () => void;
}

/**
 * Looks up the project whose modal is open.
 *
 * @param projectId - Open project id, or `null` when no modal is open.
 * @returns The matching project, or `null` when none is open or found.
 */
function findProject(projectId: string | null): Project | null {
  return projectId ? (projects.find((project) => project.id === projectId) ?? null) : null;
}

/**
 * Renders the demo credentials and demo video modals for the open project, if any.
 *
 * Each modal sits in its own `AnimatePresence`, so it plays its exit animation
 * after its open id is cleared.
 *
 * @param openCredentialsId - Project id whose credentials modal is open, or `null`.
 * @param openVideoId - Project id whose video modal is open, or `null`.
 * @param onCloseCredentials - Closes the credentials modal.
 * @param onCloseVideo - Closes the video modal.
 * @returns The two modal presence wrappers.
 */
export function PortfolioModals({
  openCredentialsId,
  openVideoId,
  onCloseCredentials,
  onCloseVideo
}: PortfolioModalsProps): JSX.Element {
  const { dictionary, language } = useLanguage();

  const activeProject = findProject(openCredentialsId);
  const activeVideoProject = findProject(openVideoId);

  return (
    <>
      <AnimatePresence>
        {activeProject?.demoCredentials ? (
          <CredentialsModal
            key="credentials-modal"
            projectId={activeProject.id}
            onClose={onCloseCredentials}
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
            onClose={onCloseVideo}
            projectTitle={activeVideoProject.title}
            videoId={activeVideoProject.demoVideoId[language]}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
