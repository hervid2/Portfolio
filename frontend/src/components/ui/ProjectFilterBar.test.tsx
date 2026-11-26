import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { projects } from "@/data/projects";
import { ALL_CATEGORIES_KEY } from "@/hooks/useProjectFilter";
import { enDictionary } from "@/i18n/en";
import { ProjectFilterBar } from "./ProjectFilterBar";

/** Category keys as the portfolio passes them: the "all" sentinel, then unique data categories. */
const categories = [
  ALL_CATEGORIES_KEY,
  ...Array.from(new Set(projects.map((project) => project.category)))
];

const allLabel = enDictionary.portfolio.filterAll;
const groupLabel = enDictionary.portfolio.filterLabel;

/**
 * Renders the filter bar with the data-derived categories.
 *
 * @param activeCategory - The category key to mark as active.
 * @returns The `onSelect` mock passed to the component.
 */
function renderBar(activeCategory: string): ReturnType<typeof vi.fn> {
  const onSelect = vi.fn();
  render(
    <ProjectFilterBar
      categories={categories}
      activeCategory={activeCategory}
      allLabel={allLabel}
      groupLabel={groupLabel}
      onSelect={onSelect}
    />
  );
  return onSelect;
}

describe("AC-000-05(d) ProjectFilterBar", () => {
  it("AC-000-05(d) renders one button per category inside the labelled group", () => {
    renderBar(ALL_CATEGORIES_KEY);
    const group = screen.getByRole("group", { name: groupLabel });
    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(categories.length);
  });

  it("AC-000-05(d) the 'all' chip text equals allLabel", () => {
    renderBar(ALL_CATEGORIES_KEY);
    expect(screen.getAllByRole("button")[0]).toHaveTextContent(allLabel);
  });

  it.each(categories)("AC-000-05(d) aria-pressed is true only on active chip %s", (active) => {
    renderBar(active);
    const pressed = screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("aria-pressed") === "true");
    expect(pressed).toHaveLength(1);
    expect(pressed[0]).toBe(screen.getAllByRole("button")[categories.indexOf(active)]);
  });

  it.each(categories)("AC-000-05(d) clicking chip %s calls onSelect with its key", (category) => {
    const onSelect = renderBar(ALL_CATEGORIES_KEY);
    fireEvent.click(screen.getAllByRole("button")[categories.indexOf(category)]);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(category);
  });
});
