import { motion } from "motion/react";
import { ALL_CATEGORIES_KEY } from "@/hooks/useProjectFilter";
import { LAYOUT_SPRING } from "@/utils/motionPresets";

interface ProjectFilterBarProps {
  categories: string[];
  activeCategory: string;
  allLabel: string;
  groupLabel: string;
  onSelect: (category: string) => void;
}

/** Shared layout id for the pill that slides between active filter chips. */
const ACTIVE_PILL_LAYOUT_ID = "portfolio-filter-pill";

/**
 * Renders the category filter chips for the portfolio grid.
 *
 * The active chip is marked by a single pill element that carries a shared
 * `layoutId`, so Motion slides it between chips instead of re-rendering it in
 * place. Category names come from the project data, so new categories appear
 * here without any change to this component.
 *
 * @param categories - Category keys, starting with the "all" sentinel.
 * @param activeCategory - Currently selected category key.
 * @param allLabel - Localized label for the "all" sentinel.
 * @param groupLabel - Localized accessible name for the filter group.
 * @param onSelect - Called with the category key when a chip is activated.
 * @returns Animated filter bar element.
 */
export function ProjectFilterBar({
  categories,
  activeCategory,
  allLabel,
  groupLabel,
  onSelect
}: ProjectFilterBarProps): JSX.Element {
  return (
    <div role="group" aria-label={groupLabel} className="mb-10 flex flex-wrap justify-center gap-2">
      {categories.map((category) => {
        const isActive = category === activeCategory;
        const label = category === ALL_CATEGORIES_KEY ? allLabel : category;

        return (
          <button
            key={category}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(category)}
            className={
              "relative rounded-full border border-border-subtle px-4 py-2 text-xs " +
              "font-semibold transition-colors duration-200 " +
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
              "focus-visible:outline-accent-cyan " +
              (isActive ? "text-accent-cyan" : "text-text-secondary hover:text-accent-cyan")
            }
          >
            {isActive ? (
              <motion.span
                layoutId={ACTIVE_PILL_LAYOUT_ID}
                transition={LAYOUT_SPRING}
                className="absolute -inset-px rounded-full border border-accent-cyan bg-accent-cyan/10"
              />
            ) : null}
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
