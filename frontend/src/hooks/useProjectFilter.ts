import { useCallback, useMemo, useState } from "react";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";

/** Sentinel category meaning "no filter applied". */
export const ALL_CATEGORIES_KEY = "all";

interface UseProjectFilterResult {
  categories: string[];
  activeCategory: string;
  visibleProjects: Project[];
  selectCategory: (category: string) => void;
}

/**
 * Derives the available project categories from static data and filters the
 * visible project list by the selected one.
 *
 * Categories are computed from the data source rather than hardcoded, so a new
 * project introducing a new category becomes a filter option automatically.
 *
 * @returns Category list, active category, filtered projects and a stable setter.
 */
export function useProjectFilter(): UseProjectFilterResult {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES_KEY);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(projects.map((project) => project.category)));

    return [ALL_CATEGORIES_KEY, ...uniqueCategories];
  }, []);

  const visibleProjects = useMemo(() => {
    if (activeCategory === ALL_CATEGORIES_KEY) {
      return projects;
    }

    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  const selectCategory = useCallback((category: string): void => {
    setActiveCategory(category);
  }, []);

  return { categories, activeCategory, visibleProjects, selectCategory };
}
