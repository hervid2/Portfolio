import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { enDictionary } from "@/i18n/en";
import { esDictionary } from "@/i18n/es";
import { ColdStartNotice } from "./ColdStartNotice";

/** K-04 notice text per language, as `ProjectCardBody` passes it. */
const noticeByLanguage = [
  ["EN", enDictionary.portfolio.coldStartNotice],
  ["ES", esDictionary.portfolio.coldStartNotice]
] as const;

describe("AC-001-17 ColdStartNotice", () => {
  it.each(noticeByLanguage)("AC-001-17 renders K-04 as role='note' in %s", (_, text) => {
    render(<ColdStartNotice text={text} />);
    const note = screen.getByRole("note");
    expect(note).toHaveTextContent(text);
    expect(note.tagName).toBe("P");
  });

  it("AC-001-17 uses the allowed token pair text-text-secondary (CL-06)", () => {
    render(<ColdStartNotice text={enDictionary.portfolio.coldStartNotice} />);
    expect(screen.getByRole("note")).toHaveClass("text-xs", "text-text-secondary");
  });
});
