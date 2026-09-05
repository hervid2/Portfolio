import { useState, useEffect } from "react";
import type { DemoCredential } from "@/types/project";
import type { AppDictionary, Language } from "@/types/i18n";

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  credentials: DemoCredential[];
  language: Language;
  dictionary: AppDictionary;
}

interface CredentialRowProps {
  label: string;
  value: string;
  copyKey: string;
  copiedKey: string | null;
  onCopy: (value: string, key: string) => void;
}

function CredentialRow({ label, value, copyKey, copiedKey, onCopy }: CredentialRowProps): JSX.Element {
  const isCopied = copiedKey === copyKey;

  return (
    <div className="flex items-center gap-2">
      <span className="w-7 flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-text-secondary/50">
        {label.slice(0, 4)}
      </span>
      <code className="flex-1 overflow-x-auto rounded bg-surface-card px-2 py-1.5 text-xs text-text-secondary">
        {value}
      </code>
      <button
        onClick={() => onCopy(value, copyKey)}
        className="flex-shrink-0 rounded-md p-1.5 text-text-secondary transition-colors hover:bg-surface-card hover:text-accent-cyan"
        aria-label={`Copy ${label}`}
      >
        {isCopied ? (
          <svg className="h-3.5 w-3.5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}

/**
 * Overlay modal that displays demo credentials for a project.
 * Closes on backdrop click or Escape key.
 */
export function CredentialsModal({
  isOpen,
  onClose,
  projectTitle,
  credentials,
  language,
  dictionary
}: CredentialsModalProps): JSX.Element | null {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleCopy(value: string, key: string): Promise<void> {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border-subtle bg-surface-card shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
                {dictionary.portfolio.credentialsTitle}
              </p>
              <h3 className="mt-1 text-lg font-bold text-text-primary">{projectTitle}</h3>
            </div>
            <button
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

          <div className="space-y-3">
            {credentials.map((cred, index) => (
              <div
                key={`${cred.role.en}-${index}`}
                className="rounded-xl border border-border-subtle bg-surface-muted p-4"
              >
                <p className="mb-3 text-xs font-semibold text-accent-cyan">{cred.role[language]}</p>
                {cred.username !== null ? (
                  <div className="space-y-2">
                    <CredentialRow
                      label="User"
                      value={cred.username}
                      copyKey={`${index}-user`}
                      copiedKey={copiedKey}
                      onCopy={handleCopy}
                    />
                    <CredentialRow
                      label={dictionary.portfolio.passwordLabel}
                      value={cred.password ?? ""}
                      copyKey={`${index}-pass`}
                      copiedKey={copiedKey}
                      onCopy={handleCopy}
                    />
                  </div>
                ) : (
                  <p className="text-xs italic text-text-secondary/50">
                    {dictionary.portfolio.pendingCredentials}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
