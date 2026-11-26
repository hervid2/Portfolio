import { useLanguage } from "@/hooks/useLanguage";
import type { Language } from "@/types/i18n";
import type { ThemeMode } from "@/types/theme";

interface NavbarControlsProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
}

interface LanguageButtonProps {
  value: Language;
}

/**
 * Renders one language toggle button, highlighted when its language is active.
 *
 * @param props - Component props.
 * @param props.value - Language this button selects.
 * @returns Language button element.
 */
function LanguageButton({ value }: LanguageButtonProps): JSX.Element {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      type="button"
      className={`rounded-lg px-3 py-1 text-xs font-bold uppercase ${
        language === value ? "bg-accent-cyan text-black" : "text-text-secondary"
      }`}
      onClick={() => setLanguage(value)}
    >
      {value.toUpperCase()}
    </button>
  );
}

/**
 * Renders the navbar controls: mobile menu toggle, language switch and theme toggle.
 *
 * @param props - Component props.
 * @param props.isMenuOpen - Whether the mobile menu is open.
 * @param props.onToggleMenu - Opens or closes the mobile menu.
 * @param props.themeMode - Current theme mode.
 * @param props.onToggleTheme - Switches between dark and light themes.
 * @returns Controls container element.
 */
export function NavbarControls({
  isMenuOpen,
  onToggleMenu,
  themeMode,
  onToggleTheme
}: NavbarControlsProps): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className={
          "rounded-lg border border-border-subtle px-3 py-2 text-xs font-semibold " +
          "text-text-secondary md:hidden"
        }
        onClick={onToggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        Menu
      </button>

      <div className="flex items-center rounded-xl border border-border-subtle bg-surface-card p-1">
        <LanguageButton value="en" />
        <LanguageButton value="es" />
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        className={
          "rounded-lg border border-border-subtle bg-surface-card px-3 py-2 text-text-secondary " +
          "transition-colors hover:border-accent-cyan hover:text-accent-cyan"
        }
        aria-label={themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={themeMode === "dark" ? "Light mode" : "Dark mode"}
      >
        {themeMode === "dark" ? "☀" : "☾"}
      </button>
    </div>
  );
}
