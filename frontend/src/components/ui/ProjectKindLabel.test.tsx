import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { enDictionary } from "@/i18n/en";
import { esDictionary } from "@/i18n/es";
import { ProjectKindLabel } from "./ProjectKindLabel";
import type { AppDictionary } from "@/types/i18n";
import type { ProjectKind } from "@/types/project";

/** Kind labels per language, as `ProjectCard` passes them. */
const labelsByLanguage = [
  ["EN", enDictionary.portfolio.kind],
  ["ES", esDictionary.portfolio.kind]
] as const;

/**
 * Builds the visible text the label must show for a kind (K-01, K-02).
 *
 * @param kind - Project kind under test.
 * @param labels - Kind labels of the active dictionary.
 * @returns The expected visible text.
 */
function expectedText(kind: ProjectKind, labels: AppDictionary["portfolio"]["kind"]): string {
  return kind === "client" ? labels.client : `${labels.personal} · ${labels.personalQualifier}`;
}

/**
 * Finds the `<p>` whose full text content equals the given text.
 *
 * @param text - Exact visible text.
 * @returns The matching paragraph element.
 */
function getLabelParagraph(text: string): HTMLElement {
  return screen.getByText((_, element) => element?.tagName === "P" && element.textContent === text);
}

describe("AC-001-09 ProjectKindLabel", () => {
  it.each(labelsByLanguage)("AC-001-09 client kind shows K-01 in %s", (_, labels) => {
    render(<ProjectKindLabel kind="client" labels={labels} />);
    expect(getLabelParagraph(expectedText("client", labels))).toBeInTheDocument();
    expect(screen.queryByText("·")).not.toBeInTheDocument();
  });

  it.each(labelsByLanguage)("AC-001-09 personal kind shows K-02 in %s", (_, labels) => {
    render(<ProjectKindLabel kind="personal" labels={labels} />);
    expect(getLabelParagraph(expectedText("personal", labels))).toBeInTheDocument();
  });

  it.each(labelsByLanguage)("AC-001-09 the '·' is aria-hidden in %s", (_, labels) => {
    render(<ProjectKindLabel kind="personal" labels={labels} />);
    expect(screen.getByText("·")).toHaveAttribute("aria-hidden", "true");
  });

  it("AC-001-09 the label has no ARIA role (plain eyebrow text)", () => {
    render(<ProjectKindLabel kind="personal" labels={enDictionary.portfolio.kind} />);
    const label = getLabelParagraph(expectedText("personal", enDictionary.portfolio.kind));
    expect(label).not.toHaveAttribute("role");
  });
});
