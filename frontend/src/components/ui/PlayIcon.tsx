/** Shared stroke props for the inline action icons (kept identical to `KeyIcon`). */
const ACTION_ICON_PROPS = {
  className: "h-4 w-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
} as const;

/**
 * Renders the play glyph used by the "watch demo" button.
 *
 * @returns Inline SVG play icon.
 */
export function PlayIcon(): JSX.Element {
  return (
    <svg {...ACTION_ICON_PROPS}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
    </svg>
  );
}
