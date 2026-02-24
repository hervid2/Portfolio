import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Language } from "@/types/i18n";

type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "portfolio-theme";

/**
 * Resolves the initial theme mode from localStorage.
 *
 * @returns Theme mode to initialize UI.
 */
function resolveInitialTheme(): ThemeMode {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light") {
    return "light";
  }

  return "dark";
}

/**
 * Scrolls smoothly to an element section by id.
 *
 * @param sectionId - Target section id.
 */
function scrollToSection(sectionId: string): void {
  const sectionElement = document.getElementById(sectionId);

  if (!sectionElement) {
    return;
  }

  sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Renders the top navigation bar with language switch and section links.
 *
 * @returns Navbar element.
 */
export function Navbar(): JSX.Element {
  const { dictionary, language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => resolveInitialTheme());

  useEffect(() => {
    const htmlElement = document.documentElement;

    if (themeMode === "light") {
      htmlElement.classList.add("theme-light");
      window.localStorage.setItem(THEME_STORAGE_KEY, "light");
      return;
    }

    htmlElement.classList.remove("theme-light");
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
  }, [themeMode]);

  /**
   * Updates active language from toggle buttons.
   *
   * @param nextLanguage - Language selected by the user.
   */
  function handleLanguageChange(nextLanguage: Language): void {
    setLanguage(nextLanguage);
  }

  /**
   * Toggles between dark and light visual themes.
   */
  function toggleThemeMode(): void {
    setThemeMode((previousMode) => (previousMode === "dark" ? "light" : "dark"));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-base/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="font-display text-xl font-semibold text-text-primary"
        >
          <span className="mr-2 text-accent-cyan">&lt;/&gt;</span>
          Hernán David Cardona
        </button>

        <nav className="hidden gap-8 text-sm font-semibold text-text-secondary md:flex">
          <button type="button" onClick={() => scrollToSection("home")} className="hover:text-accent-cyan">
            {dictionary.nav.home}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("portfolio")}
            className="hover:text-accent-cyan"
          >
            {dictionary.nav.portfolio}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("about")}
            className="hover:text-accent-cyan"
          >
            {dictionary.nav.about}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="hover:text-accent-cyan"
          >
            {dictionary.nav.contact}
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-border-subtle px-3 py-2 text-xs font-semibold text-text-secondary md:hidden"
            onClick={() => setIsMenuOpen((previousState) => !previousState)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            Menu
          </button>

          <div className="flex items-center rounded-xl border border-border-subtle bg-surface-card p-1">
            <button
              type="button"
              className={`rounded-lg px-3 py-1 text-xs font-bold uppercase ${
                language === "en" ? "bg-accent-cyan text-black" : "text-text-secondary"
              }`}
              onClick={() => handleLanguageChange("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-1 text-xs font-bold uppercase ${
                language === "es" ? "bg-accent-cyan text-black" : "text-text-secondary"
              }`}
              onClick={() => handleLanguageChange("es")}
            >
              ES
            </button>
          </div>

          <button
            type="button"
            onClick={toggleThemeMode}
            className="rounded-lg border border-border-subtle bg-surface-card px-3 py-2 text-text-secondary transition-colors hover:border-accent-cyan hover:text-accent-cyan"
            aria-label={themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={themeMode === "dark" ? "Light mode" : "Dark mode"}
          >
            {themeMode === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 pb-4 md:hidden">
          <button
            type="button"
            onClick={() => {
              scrollToSection("home");
              setIsMenuOpen(false);
            }}
            className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-text-secondary hover:bg-surface-card hover:text-accent-cyan"
          >
            {dictionary.nav.home}
          </button>
          <button
            type="button"
            onClick={() => {
              scrollToSection("portfolio");
              setIsMenuOpen(false);
            }}
            className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-text-secondary hover:bg-surface-card hover:text-accent-cyan"
          >
            {dictionary.nav.portfolio}
          </button>
          <button
            type="button"
            onClick={() => {
              scrollToSection("about");
              setIsMenuOpen(false);
            }}
            className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-text-secondary hover:bg-surface-card hover:text-accent-cyan"
          >
            {dictionary.nav.about}
          </button>
          <button
            type="button"
            onClick={() => {
              scrollToSection("contact");
              setIsMenuOpen(false);
            }}
            className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-text-secondary hover:bg-surface-card hover:text-accent-cyan"
          >
            {dictionary.nav.contact}
          </button>
        </nav>
      )}
    </header>
  );
}
