import { useState } from "react";
import { motion } from "motion/react";
import type { MotionProps } from "motion/react";
import { CredentialRow } from "@/components/ui/CredentialRow";
import { useModalBehavior } from "@/hooks/useModalBehavior";
import { CARD_CORNER_RADIUS, buildCardLayoutId } from "@/utils/projectCardIdentity";
import { LAYOUT_SPRING } from "@/utils/motionPresets";
import type { DemoCredential } from "@/types/project";
import type { AppDictionary, Language } from "@/types/i18n";

interface CredentialsModalProps {
  projectId: string;
  onClose: () => void;
  projectTitle: string;
  credentials: DemoCredential[];
  language: Language;
  dictionary: AppDictionary;
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
  "relative w-full max-w-md border border-border-subtle bg-surface-card " +
  "shadow-[0_25px_60px_rgba(0,0,0,0.5)]";

/** Classes for the header close button. */
const CLOSE_BUTTON_CLASSES =
  "flex-shrink-0 rounded-lg p-1.5 text-text-secondary transition-colors " +
  "hover:bg-surface-muted hover:text-text-primary";

/**
 * Renders the modal header: the section eyebrow, the project title and the close button.
 *
 * @param eyebrow - Localized modal title shown above the project title.
 * @param projectTitle - Project title shown in the header.
 * @param onClose - Called when the close button is used.
 * @returns Header element.
 */
function renderHeader(eyebrow: string, projectTitle: string, onClose: () => void): JSX.Element {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-lg font-bold text-text-primary">{projectTitle}</h3>
      </div>
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
 * Renders one demo account: its localized role and either its rows or the pending notice.
 *
 * @param credential - Demo account to render.
 * @param language - Active language used to pick the localized role name.
 * @param dictionary - Active dictionary for the password and pending labels.
 * @param copiedKey - Key of the row currently showing copy confirmation.
 * @param onCopy - Copies a value and marks its row as copied.
 * @returns Credential card element.
 */
function renderCredential(
  credential: DemoCredential,
  language: Language,
  dictionary: AppDictionary,
  copiedKey: string | null,
  onCopy: (value: string, key: string) => void
): JSX.Element {
  return (
    <div
      key={credential.role.en}
      className="rounded-xl border border-border-subtle bg-surface-muted p-4"
    >
      <p className="mb-3 text-xs font-semibold text-accent-cyan">{credential.role[language]}</p>
      {credential.username !== null ? (
        <div className="space-y-2">
          <CredentialRow
            label="User"
            value={credential.username}
            copyKey={`${credential.role.en}-user`}
            copiedKey={copiedKey}
            onCopy={onCopy}
          />
          <CredentialRow
            label={dictionary.portfolio.passwordLabel}
            value={credential.password ?? ""}
            copyKey={`${credential.role.en}-pass`}
            copiedKey={copiedKey}
            onCopy={onCopy}
          />
        </div>
      ) : (
        <p className="text-xs italic text-text-secondary/50">
          {dictionary.portfolio.pendingCredentials}
        </p>
      )}
    </div>
  );
}

/**
 * Overlay modal that displays demo credentials for a project.
 *
 * Mounting is controlled by an `AnimatePresence` in the parent, so this
 * component is always in its open state while rendered. The panel shares its
 * `layoutId` with the originating project card so the modal grows out of it.
 * Closes on backdrop click or Escape.
 *
 * @param projectId - Project id used to pair the morph with its source card.
 * @param onClose - Called when the modal requests to close.
 * @param projectTitle - Project title shown in the header.
 * @param credentials - Demo credentials to list.
 * @param language - Active language used to pick localized role names.
 * @param dictionary - Active dictionary for UI labels.
 * @returns Animated modal element.
 */
export function CredentialsModal({
  projectId,
  onClose,
  projectTitle,
  credentials,
  language,
  dictionary
}: CredentialsModalProps): JSX.Element {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  useModalBehavior(onClose);

  /**
   * Copies a credential value and shows transient confirmation on its row.
   *
   * @async
   * @param value - Value to write to the clipboard.
   * @param key - Row key used to target the confirmation state.
   * @returns {Promise<void>} Resolves once the value is copied.
   */
  async function handleCopy(value: string, key: string): Promise<void> {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  return (
    <motion.div {...BACKDROP_FADE} className={BACKDROP_CLASSES} onClick={onClose}>
      <motion.div
        layoutId={buildCardLayoutId(projectId)}
        transition={{ layout: LAYOUT_SPRING }}
        style={{ borderRadius: CARD_CORNER_RADIUS }}
        role="dialog"
        aria-modal="true"
        aria-label={`${dictionary.portfolio.credentialsTitle} — ${projectTitle}`}
        className={PANEL_CLASSES}
        onClick={(event) => event.stopPropagation()}
      >
        <motion.div {...CONTENT_FADE} className="p-6">
          {renderHeader(dictionary.portfolio.credentialsTitle, projectTitle, onClose)}
          <div className="space-y-3">
            {credentials.map((credential) =>
              renderCredential(credential, language, dictionary, copiedKey, handleCopy)
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
