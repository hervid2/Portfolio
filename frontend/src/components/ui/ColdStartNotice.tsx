interface ColdStartNoticeProps {
  text: string;
}

/**
 * Renders the static cold-start notice for a demo whose server may wake up slowly.
 *
 * Static plain text with no animation of its own (NFR-004); `text-text-secondary` is an allowed AA
 * token pair for the notice (spec §7, CL-06).
 *
 * @param text - Notice copy of the active dictionary (K-04).
 * @returns Notice paragraph with the `note` role.
 */
export function ColdStartNotice({ text }: ColdStartNoticeProps): JSX.Element {
  return (
    <p role="note" className="text-xs text-text-secondary">
      {text}
    </p>
  );
}
