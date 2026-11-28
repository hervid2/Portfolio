import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/context/LanguageContext";
import { projects } from "@/data/projects";
import { enDictionary } from "@/i18n/en";
import { esDictionary } from "@/i18n/es";
import { PortfolioSection } from "./PortfolioSection";
import type { Project } from "@/types/project";
import type { AppDictionary } from "@/types/i18n";

/** The `localStorage` key `LanguageProvider` reads the stored language from (BR-001). */
const STORAGE_KEY = "portfolio-language";

/** Renders the portfolio section inside the real `LanguageProvider`. */
function renderSection(): void {
  render(
    <LanguageProvider>
      <PortfolioSection />
    </LanguageProvider>
  );
}

describe("AC-001-11 PortfolioSection subtitle", () => {
  it("AC-001-11 in EN the subtitle is K-03 EN", () => {
    renderSection();
    expect(screen.getByText(enDictionary.portfolio.subtitle)).toBeInTheDocument();
  });

  it("AC-001-11 with stored 'es' the subtitle is K-03 ES", () => {
    localStorage.setItem(STORAGE_KEY, "es");
    renderSection();
    expect(screen.getByText(esDictionary.portfolio.subtitle)).toBeInTheDocument();
  });
});

/**
 * Builds the visible kind label text a project's card must show (K-01, K-02).
 *
 * @param project - Project whose `kind` picks the label.
 * @param dictionary - Active dictionary.
 * @returns The expected label text.
 */
function expectedLabel(project: Project, dictionary: AppDictionary): string {
  const { kind } = dictionary.portfolio;
  return project.kind === "client" ? kind.client : `${kind.personal} · ${kind.personalQualifier}`;
}

/**
 * Finds the project whose title a card's `<h3>` shows.
 *
 * @param card - Rendered card `<article>`.
 * @returns The matching project.
 */
function projectOfCard(card: HTMLElement): Project {
  const title = within(card).getByRole("heading", { level: 3 }).textContent;
  const project = projects.find((item) => item.title === title);
  if (!project) {
    throw new Error(`No project titled ${title ?? "(empty)"}`);
  }
  return project;
}

/**
 * Asserts that every rendered card shows the kind label of its own project.
 *
 * @param dictionary - Active dictionary.
 * @returns Nothing.
 */
function expectEachCardLabelled(dictionary: AppDictionary): void {
  for (const card of screen.getAllByRole("article")) {
    const text = expectedLabel(projectOfCard(card), dictionary);
    const matcher = (_: string, element: Element | null): boolean =>
      element?.tagName === "P" && element.textContent === text;
    expect(within(card).getByText(matcher)).toBeInTheDocument();
  }
}

describe("AC-001-09 PortfolioSection grid kind labels", () => {
  it("AC-001-09 in EN each of the four cards shows its own kind label", () => {
    renderSection();
    expect(screen.getAllByRole("article")).toHaveLength(projects.length);
    expectEachCardLabelled(enDictionary);
  });

  it("AC-001-09 with stored 'es' each of the four cards shows its own kind label", () => {
    localStorage.setItem(STORAGE_KEY, "es");
    renderSection();
    expect(screen.getAllByRole("article")).toHaveLength(projects.length);
    expectEachCardLabelled(esDictionary);
  });
});

describe("AC-001-20 PortfolioSection filtering keeps the kind labels", () => {
  const categories = [...new Set(projects.map((project) => project.category))];

  it.each(categories)(
    "AC-001-20 after filtering by '%s' each visible card is labelled",
    async (category) => {
      renderSection();
      fireEvent.click(screen.getByRole("button", { name: category }));
      const expected = projects.filter((project) => project.category === category).length;
      await waitFor(() => expect(screen.getAllByRole("article")).toHaveLength(expected));
      expectEachCardLabelled(enDictionary);
    }
  );

  it("AC-001-20 back to 'all' in ES every card is labelled again", async () => {
    localStorage.setItem(STORAGE_KEY, "es");
    renderSection();
    fireEvent.click(screen.getByRole("button", { name: categories[0] }));
    fireEvent.click(screen.getByRole("button", { name: esDictionary.portfolio.filterAll }));
    await waitFor(() => expect(screen.getAllByRole("article")).toHaveLength(projects.length));
    expectEachCardLabelled(esDictionary);
  });
});
