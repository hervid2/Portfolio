import { useLanguage } from "@/hooks/useLanguage";
import type { Language } from "@/types/i18n";

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

  /**
   * Updates active language from toggle buttons.
   *
   * @param nextLanguage - Language selected by the user.
   */
  function handleLanguageChange(nextLanguage: Language): void {
    setLanguage(nextLanguage);
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
      </div>
    </header>
  );
}
