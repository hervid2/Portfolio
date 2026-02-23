import { useLanguage } from "@/hooks/useLanguage";

/**
 * Renders the site footer with copyright information.
 *
 * @returns Footer element.
 */
export function Footer(): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <footer className="border-t border-border-subtle py-8">
      <p className="text-center text-sm text-text-secondary">
        © {new Date().getFullYear()} Hernán David Cardona. {dictionary.footer.rights}
      </p>
    </footer>
  );
}
