import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { projects } from "@/data/projects";
import { enDictionary } from "@/i18n/en";
import { esDictionary } from "@/i18n/es";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types/project";
import type { AppDictionary, Language } from "@/types/i18n";

/**
 * Finds a project in `src/data/projects.ts` by id.
 *
 * @param id - Project id slug.
 * @returns The matching project.
 */
function getProject(id: string): Project {
  const project = projects.find((item) => item.id === id);
  if (!project) {
    throw new Error(`Missing project ${id}`);
  }
  return project;
}

/** Slicing Edge as published: a personal project without the cold-start flag. */
const slicingEdge = getProject("the-slicing-edge");

/** Fixture derived from real data with the cold-start flag on (FR-019). */
const flaggedProject: Project = { ...slicingEdge, coldStartNotice: true };

/** Dictionary per language, as `PortfolioGrid` passes it from `useLanguage()`. */
const dictionaries: Record<Language, AppDictionary> = { en: enDictionary, es: esDictionary };

/**
 * Builds the card element for a project in a language.
 *
 * @param project - Project to render.
 * @param language - Active language.
 * @returns The card element.
 */
function cardElement(project: Project, language: Language): JSX.Element {
  return (
    <ProjectCard
      project={project}
      language={language}
      dictionary={dictionaries[language]}
      onOpenVideo={vi.fn()}
      onOpenCredentials={vi.fn()}
    />
  );
}

/**
 * Builds the visible text of the personal kind label (K-02).
 *
 * @param dictionary - Active dictionary.
 * @returns The expected label text.
 */
function personalLabel(dictionary: AppDictionary): string {
  const { kind } = dictionary.portfolio;
  return `${kind.personal} · ${kind.personalQualifier}`;
}

/**
 * Finds the `<p>` whose full text content equals the given text.
 *
 * @param text - Exact visible text.
 * @returns The matching paragraph element.
 */
function getParagraph(text: string): HTMLElement {
  return screen.getByText((_, element) => element?.tagName === "P" && element.textContent === text);
}

describe("AC-001-06 ProjectCard description", () => {
  it("AC-001-06 the Slicing Edge EN description paragraph starts with the AI assistant", () => {
    render(cardElement(slicingEdge, "en"));
    const description = getParagraph(slicingEdge.description.en);
    expect(description.textContent?.startsWith("AI shopping assistant")).toBe(true);
  });
});

describe("AC-001-10 ProjectCard language switch and order", () => {
  it("AC-001-10 EN → ES rerender switches the label, description and notice", () => {
    const { rerender } = render(cardElement(flaggedProject, "en"));
    expect(getParagraph(personalLabel(enDictionary))).toBeInTheDocument();
    expect(getParagraph(flaggedProject.description.en)).toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveTextContent(enDictionary.portfolio.coldStartNotice);

    rerender(cardElement(flaggedProject, "es"));
    expect(getParagraph(personalLabel(esDictionary))).toBeInTheDocument();
    expect(getParagraph(flaggedProject.description.es)).toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveTextContent(esDictionary.portfolio.coldStartNotice);
    expect(screen.queryByText(flaggedProject.description.en)).not.toBeInTheDocument();
  });

  it("AC-001-10 the kind label precedes the <h3> title in DOM order", () => {
    render(cardElement(slicingEdge, "en"));
    const label = getParagraph(personalLabel(enDictionary));
    const title = screen.getByRole("heading", { level: 3, name: slicingEdge.title });
    const position = label.compareDocumentPosition(title);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("AC-001-17 ProjectCard cold-start notice", () => {
  it("AC-001-17 a flagged project shows K-04 EN as role='note'", () => {
    render(cardElement(flaggedProject, "en"));
    expect(screen.getByRole("note")).toHaveTextContent(enDictionary.portfolio.coldStartNotice);
  });

  it("AC-001-17 a flagged project shows K-04 ES as role='note'", () => {
    render(cardElement(flaggedProject, "es"));
    expect(screen.getByRole("note")).toHaveTextContent(esDictionary.portfolio.coldStartNotice);
  });

  it("AC-001-17 an unflagged project renders no note", () => {
    render(cardElement(slicingEdge, "en"));
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  it("AC-001-17 the notice sits before the action row in the footer", () => {
    render(cardElement(flaggedProject, "en"));
    const note = screen.getByRole("note");
    const codeLabel = enDictionary.portfolio.code;
    const code = screen.getByRole("link", { name: (name) => name.endsWith(codeLabel) });
    expect(note.compareDocumentPosition(code) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
