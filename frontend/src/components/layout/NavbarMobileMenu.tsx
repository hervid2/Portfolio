import { useLanguage } from "@/hooks/useLanguage";
import { NAV_SECTION_IDS, type NavSectionId } from "@/components/layout/NavbarSectionLinks";

interface NavbarMobileMenuProps {
  onNavigate: (sectionId: NavSectionId) => void;
}

/**
 * Renders the mobile section menu of the navbar.
 *
 * @param props - Component props.
 * @param props.onNavigate - Called with the section id of the clicked item.
 * @returns Mobile navigation element.
 */
export function NavbarMobileMenu({ onNavigate }: NavbarMobileMenuProps): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <nav
      id="mobile-menu"
      className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 pb-4 md:hidden"
    >
      {NAV_SECTION_IDS.map((sectionId) => (
        <button
          key={sectionId}
          type="button"
          onClick={() => onNavigate(sectionId)}
          className={
            "rounded-lg px-3 py-2 text-left text-sm font-semibold text-text-secondary " +
            "hover:bg-surface-card hover:text-accent-cyan"
          }
        >
          {dictionary.nav[sectionId]}
        </button>
      ))}
    </nav>
  );
}
