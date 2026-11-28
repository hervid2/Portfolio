import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/context/LanguageContext";
import { projects } from "@/data/projects";
import { PortfolioGrid } from "./PortfolioGrid";
import type { Project } from "@/types/project";

/** The React warning DEBT-013 tracks for a ref passed to a plain function component. */
const REF_WARNING = "Function components cannot be given refs";

/**
 * Builds the grid inside the real `LanguageProvider`.
 *
 * @param visibleProjects - Projects the active filter shows.
 * @returns The grid element.
 */
function gridElement(visibleProjects: Project[]): JSX.Element {
  return (
    <LanguageProvider>
      <PortfolioGrid
        visibleProjects={visibleProjects}
        onOpenVideo={vi.fn()}
        onOpenCredentials={vi.fn()}
      />
    </LanguageProvider>
  );
}

describe("AC-001-22 PortfolioGrid ref forwarding", () => {
  it("AC-001-22 removing a card (4 → 3) logs no function-component ref warning", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const allProjects = projects.slice(0, 4);
    expect(allProjects).toHaveLength(4);

    const { rerender } = render(gridElement(allProjects));
    rerender(gridElement(allProjects.slice(0, 3)));

    const refWarnings = errorSpy.mock.calls.filter((call) =>
      call.some((argument) => String(argument).includes(REF_WARNING))
    );
    expect(refWarnings).toEqual([]);
  });

  // jsdom has no layout, so this only guards the class; the browser frame trace
  // (T-11a) is the real proof that exiting cards stay in their slot.
  it("AC-001-22 the grid is a positioned parent for popLayout exits", () => {
    const { container } = render(gridElement(projects.slice(0, 2)));

    const grid = container.querySelector("article")?.parentElement;
    expect(grid).toHaveClass("relative", "grid");
  });
});
