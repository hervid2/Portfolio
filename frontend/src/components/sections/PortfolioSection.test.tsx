import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/context/LanguageContext";
import { enDictionary } from "@/i18n/en";
import { esDictionary } from "@/i18n/es";
import { PortfolioSection } from "./PortfolioSection";

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
