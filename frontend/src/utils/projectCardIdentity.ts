/**
 * Shared identity between a project card and the modal it opens.
 *
 * Motion morphs two elements into each other when they declare the same
 * `layoutId`, so the card and its modal must agree on that string. The corner
 * radius is exported as a number because Motion can only correct radius
 * distortion during a morph when the value is set as an inline style, not as a
 * Tailwind class.
 */

/** Corner radius in pixels, matching Tailwind's `rounded-2xl`. */
export const CARD_CORNER_RADIUS = 16;

/**
 * Builds the shared layout id for a project card and its modal counterpart.
 *
 * @param projectId - Unique project identifier.
 * @returns Layout id string shared by the card and its modal panel.
 */
export function buildCardLayoutId(projectId: string): string {
  return `project-card-${projectId}`;
}
