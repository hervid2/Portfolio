import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLanguage } from "@/hooks/useLanguage";
import { enDictionary } from "@/i18n/en";
import { esDictionary } from "@/i18n/es";
import type { Language } from "@/types/i18n";
import { LanguageProvider } from "./LanguageContext";

/** The `localStorage` key the provider reads and writes (BR-001). */
const STORAGE_KEY = "portfolio-language";

/** Captured `setLanguage` from the latest probe render. */
let setLanguageRef: ((nextLanguage: Language) => void) | undefined;

/**
 * Test-only consumer that prints the active `nav.home` label and captures `setLanguage`.
 *
 * @returns A paragraph with the dictionary's home label.
 */
function LanguageProbe(): JSX.Element {
  const { dictionary, setLanguage } = useLanguage();
  setLanguageRef = setLanguage;
  return <p data-testid="probe">{dictionary.nav.home}</p>;
}

/** Renders the probe inside `LanguageProvider`. */
function renderProbe(): void {
  render(
    <LanguageProvider>
      <LanguageProbe />
    </LanguageProvider>
  );
}

describe("AC-000-05(e) LanguageProvider", () => {
  it("AC-000-05(e) stored 'es' resolves to the Spanish dictionary", () => {
    localStorage.setItem(STORAGE_KEY, "es");
    renderProbe();
    expect(screen.getByTestId("probe")).toHaveTextContent(esDictionary.nav.home);
  });

  it("AC-000-05(e) an unsupported stored value 'fr' falls back to English", () => {
    localStorage.setItem(STORAGE_KEY, "fr");
    renderProbe();
    expect(screen.getByTestId("probe")).toHaveTextContent(enDictionary.nav.home);
  });

  it("AC-000-05(e) no stored value falls back to English", () => {
    renderProbe();
    expect(screen.getByTestId("probe")).toHaveTextContent(enDictionary.nav.home);
  });

  it("AC-000-05(e) setLanguage('es') persists 'es' and switches the dictionary", () => {
    renderProbe();
    act(() => setLanguageRef?.("es"));
    expect(localStorage.getItem(STORAGE_KEY)).toBe("es");
    expect(screen.getByTestId("probe")).toHaveTextContent(esDictionary.nav.home);
  });
});
