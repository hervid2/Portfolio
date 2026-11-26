/** Shared stroke props for the inline action icons (kept identical to `PlayIcon`). */
const ACTION_ICON_PROPS = {
  className: "h-4 w-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
} as const;

/** Key glyph path, kept apart so the line limit holds. */
const KEY_ICON_PATH =
  "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5" +
  "m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4";

/**
 * Renders the key glyph used by the demo credentials button.
 *
 * @returns Inline SVG key icon.
 */
export function KeyIcon(): JSX.Element {
  return (
    <svg {...ACTION_ICON_PROPS}>
      <path d={KEY_ICON_PATH} />
    </svg>
  );
}
