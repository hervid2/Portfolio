import { motion } from "motion/react";
import { ColdStartNotice } from "@/components/ui/ColdStartNotice";
import { ProjectCardActions } from "@/components/ui/ProjectCardActions";
import { ProjectKindLabel } from "@/components/ui/ProjectKindLabel";
import { ProjectStackList } from "@/components/ui/ProjectStackList";
import type { Project } from "@/types/project";
import type { AppDictionary, Language } from "@/types/i18n";

interface ProjectCardBodyProps {
  project: Project;
  language: Language;
  dictionary: AppDictionary;
  onOpenVideo: (projectId: string) => void;
  onOpenCredentials: (projectId: string) => void;
}

/**
 * Renders the text part of a project card: kind label, title, description, stack chips and
 * a footer with the cold-start notice (only when the project is flagged) above the actions.
 *
 * The footer wrapper owns `mt-auto`, so the notice stays glued to the action row instead of
 * splitting the free space with the actions' own auto margin (plan §1.5). The label and the
 * notice are plain elements inside the `layout="position"` container (NFR-004).
 *
 * @param project - Project data to render.
 * @param language - Active language used to pick localized copy.
 * @param dictionary - Active dictionary for UI labels.
 * @param onOpenVideo - Opens the demo video modal for a project id.
 * @param onOpenCredentials - Opens the demo credentials modal for a project id.
 * @returns Card body element.
 */
export function ProjectCardBody({
  project,
  language,
  dictionary,
  onOpenVideo,
  onOpenCredentials
}: ProjectCardBodyProps): JSX.Element {
  const { portfolio } = dictionary;

  return (
    <motion.div layout="position" className="flex flex-1 flex-col gap-4 p-5">
      <ProjectKindLabel kind={project.kind} labels={portfolio.kind} />
      <h3 className="text-xl font-bold text-text-primary">{project.title}</h3>
      <p className="text-sm text-text-secondary">{project.description[language]}</p>
      <ProjectStackList projectId={project.id} stack={project.stack} />
      <div className="mt-auto flex flex-col gap-3">
        {project.coldStartNotice ? <ColdStartNotice text={portfolio.coldStartNotice} /> : null}
        <ProjectCardActions
          project={project}
          dictionary={dictionary}
          onOpenVideo={onOpenVideo}
          onOpenCredentials={onOpenCredentials}
        />
      </div>
    </motion.div>
  );
}
