interface CredentialRowProps {
  label: string;
  value: string;
  copyKey: string;
  copiedKey: string | null;
  onCopy: (value: string, key: string) => void;
}

/** Classes for the abbreviated field label in the row gutter. */
const LABEL_CLASSES =
  "w-7 flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-text-secondary/50";

/** Classes for the credential value box. */
const VALUE_CLASSES =
  "flex-1 overflow-x-auto rounded bg-surface-card px-2 py-1.5 text-xs text-text-secondary";

/** Classes for the copy-to-clipboard button. */
const COPY_BUTTON_CLASSES =
  "flex-shrink-0 rounded-md p-1.5 text-text-secondary transition-colors " +
  "hover:bg-surface-card hover:text-accent-cyan";

/**
 * Renders the copy button icon: a check mark while confirmed, a copy glyph otherwise.
 *
 * @param isCopied - Whether this row is showing copy confirmation.
 * @returns Inline SVG icon.
 */
function renderCopyIcon(isCopied: boolean): JSX.Element {
  if (isCopied) {
    return (
      <svg
        className="h-3.5 w-3.5 text-green-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }

  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

/**
 * Renders one credential value with a copy-to-clipboard control.
 *
 * @param label - Field label, abbreviated in the gutter.
 * @param value - Credential value to display and copy.
 * @param copyKey - Unique key identifying this row for copy feedback.
 * @param copiedKey - Key of the row currently showing copy confirmation.
 * @param onCopy - Called with the value and key when the copy button is used.
 * @returns Credential row element.
 */
export function CredentialRow({
  label,
  value,
  copyKey,
  copiedKey,
  onCopy
}: CredentialRowProps): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <span className={LABEL_CLASSES}>{label.slice(0, 4)}</span>
      <code className={VALUE_CLASSES}>{value}</code>
      <button
        type="button"
        onClick={() => onCopy(value, copyKey)}
        className={COPY_BUTTON_CLASSES}
        aria-label={`Copy ${label}`}
      >
        {renderCopyIcon(copiedKey === copyKey)}
      </button>
    </div>
  );
}
