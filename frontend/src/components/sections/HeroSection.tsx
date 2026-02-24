import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Scrolls to a selected section in the page.
 *
 * @param sectionId - Section id to navigate to.
 */
function jumpToSection(sectionId: string): void {
  const sectionElement = document.getElementById(sectionId);

  if (!sectionElement) {
    return;
  }

  sectionElement.scrollIntoView({ behavior: "smooth" });
}

/**
 * Renders hero section with profile headline and CTA buttons.
 *
 * @returns Hero section element.
 */
export function HeroSection(): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <section
      id="home"
      className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl items-center justify-center px-5 py-10 md:px-8"
    >
      <div className="w-full max-w-3xl text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight text-text-primary md:text-7xl">
          Hernán David Cardona
        </h1>
        <p className="mt-5 font-display text-4xl font-semibold text-accent-cyan md:text-5xl">
          {dictionary.hero.role}
        </p>
        <p className="mx-auto mt-7 max-w-2xl text-xl text-text-secondary">{dictionary.hero.statement}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button type="button" className="btn-primary" onClick={() => jumpToSection("portfolio")}>
            {dictionary.hero.ctaPrimary}
          </button>
          <button type="button" className="btn-secondary" onClick={() => jumpToSection("contact")}>
            {dictionary.hero.ctaSecondary}
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-text-secondary">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:text-accent-cyan"
            rel="noopener noreferrer"
            target="_blank"
            aria-label="Visit GitHub profile"
          >
            <ThemeIcon
              iconPath="/assets/icons/social/github.svg"
              iconPathDark="/assets/icons/social/github-dark.svg"
              alt="GitHub icon"
              className="h-[18px] w-[18px] object-contain"
            />
            GitHub
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:text-accent-cyan"
            rel="noopener noreferrer"
            target="_blank"
            aria-label="Visit LinkedIn profile"
          >
            <ThemeIcon
              iconPath="/assets/icons/social/linkedin.svg"
              alt="LinkedIn icon"
              className="h-[18px] w-[18px] object-contain"
            />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
