import { useLanguage } from "@/hooks/useLanguage";

/** Section ids reachable from the navbar, in display order. */
export const NAV_SECTION_IDS = ["home", "portfolio", "about", "contact"] as const;

/** Id of a section reachable from the navbar. */
export type NavSectionId = (typeof NAV_SECTION_IDS)[number];

interface NavbarSectionLinksProps {
  onNavigate: (sectionId: NavSectionId) => void;
}

/**
 * Renders the desktop section links of the navbar.
 *
 * @param props - Component props.
 * @param props.onNavigate - Called with the section id of the clicked link.
 * @returns Desktop navigation element.
 */
export function NavbarSectionLinks({ onNavigate }: NavbarSectionLinksProps): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <nav className="hidden gap-8 text-sm font-semibold text-text-secondary md:flex">
      {NAV_SECTION_IDS.map((sectionId) => (
        <button
          key={sectionId}
          type="button"
          onClick={() => onNavigate(sectionId)}
          className="hover:text-accent-cyan"
        >
          {dictionary.nav[sectionId]}
        </button>
      ))}
    </nav>
  );
}
