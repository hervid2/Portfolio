import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import { ALL_CATEGORIES_KEY, useProjectFilter } from "./useProjectFilter";

/** Unique project categories in first-appearance order, derived from the data. */
const dataCategories = Array.from(new Set(projects.map((project) => project.category)));

/**
 * Renders the hook, selects a category and returns the projects it makes visible.
 *
 * @param category - The category key to select.
 * @returns The visible projects after the selection.
 */
function visibleFor(category: string): typeof projects {
  const { result } = renderHook(() => useProjectFilter());
  act(() => result.current.selectCategory(category));
  return result.current.visibleProjects;
}

describe("AC-000-05(b) useProjectFilter", () => {
  it("AC-000-05(b) categories are 'all' plus the unique data categories in order", () => {
    const { result } = renderHook(() => useProjectFilter());
    expect(ALL_CATEGORIES_KEY).toBe("all");
    expect(result.current.categories).toEqual(["all", ...dataCategories]);
  });

  it("AC-000-05(b) 'all' is active by default and shows every project in data order", () => {
    const { result } = renderHook(() => useProjectFilter());
    expect(result.current.activeCategory).toBe("all");
    expect(result.current.visibleProjects).toEqual(projects);
  });

  it("AC-000-05(b) selecting 'all' again restores every project in data order", () => {
    const { result } = renderHook(() => useProjectFilter());
    act(() => result.current.selectCategory(dataCategories[0]));
    act(() => result.current.selectCategory("all"));
    expect(result.current.visibleProjects).toEqual(projects);
  });

  it.each(dataCategories)("AC-000-05(b) category %s shows only its projects", (category) => {
    const expected = projects.filter((project) => project.category === category);
    const visible = visibleFor(category);
    expect(visible).toEqual(expected);
    expect(visible.length).toBeGreaterThan(0);
  });

  it("AC-000-05(b) the union over categories equals all projects", () => {
    const union = dataCategories.flatMap((category) => visibleFor(category));
    const byId = (list: typeof projects): string[] => list.map((p) => p.id).sort();
    expect(union).toHaveLength(projects.length);
    expect(byId(union)).toEqual(byId(projects));
  });
});
