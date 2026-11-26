import { useState } from "react";
import { NavbarControls } from "@/components/layout/NavbarControls";
import { NavbarMobileMenu } from "@/components/layout/NavbarMobileMenu";
import { NavbarSectionLinks, type NavSectionId } from "@/components/layout/NavbarSectionLinks";
import { useThemeMode } from "@/hooks/useThemeMode";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { themeMode, toggleThemeMode } = useThemeMode();

  /**
   * Scrolls to the chosen section and closes the mobile menu.
   *
   * @param sectionId - Target section id.
   */
  function handleMobileNavigate(sectionId: NavSectionId): void {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  }

  return (
    <header
      className={
        "sticky top-0 z-50 border-b border-border-subtle bg-surface-base/95 backdrop-blur-sm"
      }
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="font-display text-xl font-semibold text-text-primary"
        >
          <span className="mr-2 text-accent-cyan">&lt;/&gt;</span>
          Hernán David Cardona
        </button>

        <NavbarSectionLinks onNavigate={scrollToSection} />

        <NavbarControls
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setIsMenuOpen((previousState) => !previousState)}
          themeMode={themeMode}
          onToggleTheme={toggleThemeMode}
        />
      </div>

      {isMenuOpen && <NavbarMobileMenu onNavigate={handleMobileNavigate} />}
    </header>
  );
}
