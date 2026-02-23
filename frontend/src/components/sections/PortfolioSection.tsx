import { projects } from "@/data/projects";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Creates an external project link element with fallback text.
 *
 * @param label - Link label.
 * @param url - Optional destination URL.
 * @param pendingLabel - Fallback label when URL is missing.
 * @returns Link-like visual element.
 */
function renderProjectLink(label: string, url: string | null, pendingLabel: string): JSX.Element {
  if (!url) {
    return (
      <span className="rounded-md border border-border-subtle px-3 py-2 text-xs text-text-secondary">
        {label}: {pendingLabel}
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-md border border-border-subtle px-3 py-2 text-xs text-text-secondary transition-colors hover:border-accent-cyan hover:text-accent-cyan"
    >
      {label}
    </a>
  );
}

/**
 * Renders portfolio cards from typed project data.
 *
 * @returns Portfolio section element.
 */
export function PortfolioSection(): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <section id="portfolio" className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8">
      <header className="mb-10 text-center">
        <h2 className="section-title">{dictionary.portfolio.title}</h2>
        <p className="section-subtitle">{dictionary.portfolio.subtitle}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.id} className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-card shadow-card">
            <img
              src={project.imageUrl}
              alt={`${project.title} preview image`}
              className="h-52 w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-4 p-5">
              <h3 className="text-xl font-bold text-text-primary">{project.title}</h3>
              <p className="text-sm text-text-secondary">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.stack.map((stackItem) => (
                  <span
                    key={`${project.id}-${stackItem}`}
                    className="rounded-full border border-border-subtle bg-surface-muted px-3 py-1 text-xs text-text-secondary"
                  >
                    {stackItem}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {renderProjectLink(
                  dictionary.portfolio.liveDemo,
                  project.liveDemoUrl,
                  dictionary.portfolio.pending
                )}
                {renderProjectLink(dictionary.portfolio.code, project.codeUrl, dictionary.portfolio.pending)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
