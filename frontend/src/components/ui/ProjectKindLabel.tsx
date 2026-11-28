import type { AppDictionary } from "@/types/i18n";
import type { ProjectKind } from "@/types/project";

interface ProjectKindLabelProps {
  kind: ProjectKind;
  labels: AppDictionary["portfolio"]["kind"];
}

/** Stack-chip palette in a `rounded-md` shape (plan D-2; spec §7 first allowed token pair). */
const LABEL_CLASSES =
  "inline-flex w-fit items-center gap-1 rounded-md border border-border-subtle " +
  "bg-surface-muted px-2 py-0.5 text-xs font-semibold text-text-secondary";

/**
 * Renders the static eyebrow that tells client work from a deployed personal project.
 *
 * The "·" separator is markup, hidden from assistive technology, with the spaces kept
 * outside it so screen readers hear two separate words (ASM-001-15).
 *
 * @param kind - Project kind (glossary "Project kind").
 * @param labels - Kind labels of the active dictionary (K-01, K-02).
 * @returns Kind label paragraph.
 */
export function ProjectKindLabel({ kind, labels }: ProjectKindLabelProps): JSX.Element {
  if (kind === "client") {
    return <p className={LABEL_CLASSES}>{labels.client}</p>;
  }

  return (
    <p className={LABEL_CLASSES}>
      {labels.personal} <span aria-hidden="true">·</span> {labels.personalQualifier}
    </p>
  );
}
