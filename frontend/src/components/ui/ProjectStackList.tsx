import { motion } from "motion/react";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { HOVER_SPRING } from "@/utils/motionPresets";
import { resolveTechIconPath } from "@/utils/techIcons";

interface ProjectStackListProps {
  projectId: string;
  stack: string[];
}

/**
 * Renders the project's technology stack as a wrap of icon chips.
 *
 * @param projectId - Project id, used to build stable chip keys.
 * @param stack - Technology names, in display order.
 * @returns Stack chip list.
 */
export function ProjectStackList({ projectId, stack }: ProjectStackListProps): JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {stack.map((stackItem) => {
        const iconSet = resolveTechIconPath(stackItem);

        return (
          <motion.span
            key={`${projectId}-${stackItem}`}
            whileHover={{ y: -2, transition: HOVER_SPRING }}
            className={
              "inline-flex items-center gap-2 rounded-full border border-border-subtle " +
              "bg-surface-muted px-3 py-1 text-xs text-text-secondary " +
              "transition-[color,border-color] duration-200 hover:border-accent-cyan " +
              "hover:text-accent-cyan"
            }
          >
            <ThemeIcon
              iconPath={iconSet.iconPath}
              iconPathDark={iconSet.iconPathDark}
              alt={`${stackItem} icon`}
              className="h-4 w-4 object-contain"
            />
            {stackItem}
          </motion.span>
        );
      })}
    </div>
  );
}
