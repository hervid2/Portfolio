import { useState } from "react";
import { projects } from "@/data/projects";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { useLanguage } from "@/hooks/useLanguage";
import { CredentialsModal } from "@/components/ui/CredentialsModal";

interface IconSet {
  iconPath: string;
  iconPathDark?: string;
}

const techIconPathByLabel: Record<string, IconSet> = {
  react: {
    iconPath: "/assets/icons/tech/react.svg",
    iconPathDark: "/assets/icons/tech/react-dark.svg"
  },
  typescript: {
    iconPath: "/assets/icons/tech/typescript.svg",
    iconPathDark: "/assets/icons/tech/typescript-dark.svg"
  },
  "node.js": {
    iconPath: "/assets/icons/tech/nodejs.svg",
    iconPathDark: "/assets/icons/tech/nodejs-dark.svg"
  },
  express: {
    iconPath: "/assets/icons/tech/express.svg",
    iconPathDark: "/assets/icons/tech/express-dark.svg"
  },
  "tailwind css": {
    iconPath: "/assets/icons/tech/tailwindcss.svg",
    iconPathDark: "/assets/icons/tech/tailwindcss-dark.svg"
  },
  javascript: {
    iconPath: "/assets/icons/tech/javascript.svg"
  },
  "vanilla.js": {
    iconPath: "/assets/icons/tech/javascript.svg"
  },
  java: {
    iconPath: "/assets/icons/tech/java.svg",
    iconPathDark: "/assets/icons/tech/java-dark.svg"
  },
  mysql: {
    iconPath: "/assets/icons/tech/mysql.svg",
    iconPathDark: "/assets/icons/tech/mysql-dark.svg"
  },
  docker: {
    iconPath: "/assets/icons/tech/docker.svg",
    iconPathDark: "/assets/icons/tech/docker-dark.svg"
  },
  git: {
    iconPath: "/assets/icons/tech/git.svg",
    iconPathDark: "/assets/icons/tech/git-dark.svg"
  },
  swing: {
    iconPath: "/assets/icons/tech/java.svg",
    iconPathDark: "/assets/icons/tech/java-dark.svg"
  },
  sql: {
    iconPath: "/assets/icons/tech/mysql.svg",
    iconPathDark: "/assets/icons/tech/mysql-dark.svg"
  },
  websockets: {
    iconPath: "/assets/icons/tech/websockets.svg",
    iconPathDark: "/assets/icons/tech/websockets-dark.svg"
  },
  "next.js": {
    iconPath: "/assets/icons/tech/nextjs.svg",
    iconPathDark: "/assets/icons/tech/nextjs-dark.svg"
  },
  fastify: {
    iconPath: "/assets/icons/tech/fastify.svg",
    iconPathDark: "/assets/icons/tech/fastify-dark.svg"
  },
  postgresql: {
    iconPath: "/assets/icons/tech/postgresql.svg",
    iconPathDark: "/assets/icons/tech/postgresql-dark.svg"
  },
  "google oauth": {
    iconPath: "/assets/icons/tech/google.svg",
    iconPathDark: "/assets/icons/tech/google-dark.svg"
  },
  stripe: {
    iconPath: "/assets/icons/tech/stripe.svg",
    iconPathDark: "/assets/icons/tech/stripe-dark.svg"
  },
  "github actions": {
    iconPath: "/assets/icons/tech/githubactions.svg",
    iconPathDark: "/assets/icons/tech/githubactions-dark.svg"
  }
};

/**
 * Resolves icon path for a technology badge.
 *
 * @param stackLabel - Technology label to resolve.
 * @returns Icon set with light and optional dark path.
 */
function resolveTechIconPath(stackLabel: string): IconSet {
  return techIconPathByLabel[stackLabel.toLowerCase()] ?? { iconPath: "/assets/icons/tech/javascript.svg" };
}

/**
 * Creates an external project link element with fallback text.
 *
 * @param label - Link label.
 * @param url - Optional destination URL.
 * @param pendingLabel - Fallback label when URL is missing.
 * @returns Link-like visual element.
 */
function renderProjectLink(
  label: string,
  url: string | null,
  pendingLabel: string,
  iconPath: string,
  iconPathDark?: string
): JSX.Element {
  if (!url) {
    return (
      <span className="inline-flex items-center gap-2 rounded-md border border-border-subtle px-3 py-2 text-xs text-text-secondary transition-colors duration-200 hover:border-accent-cyan hover:text-accent-cyan">
        <ThemeIcon iconPath={iconPath} iconPathDark={iconPathDark} alt={`${label} icon`} className="h-4 w-4 object-contain" />
        {label}: {pendingLabel}
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-md border border-border-subtle px-3 py-2 text-xs text-text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-cyan hover:bg-surface-muted hover:text-accent-cyan"
    >
      <ThemeIcon iconPath={iconPath} iconPathDark={iconPathDark} alt={`${label} icon`} className="h-4 w-4 object-contain" />
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
  const { dictionary, language } = useLanguage();
  const [openCredentialsId, setOpenCredentialsId] = useState<string | null>(null);

  const activeProject = openCredentialsId
    ? projects.find((p) => p.id === openCredentialsId)
    : null;

  return (
    <section id="portfolio" className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8">
      <header className="mb-10 text-center">
        <h2 className="section-title">{dictionary.portfolio.title}</h2>
        <p className="section-subtitle">{dictionary.portfolio.subtitle}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.id}
            className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent-cyan hover:shadow-[0_20px_45px_rgba(16,217,229,0.2)]"
          >
            <div className="relative">
              <img
                src={project.imageUrl}
                alt={`${project.title} preview image`}
                className="h-52 w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-4 p-5">
              <h3 className="text-xl font-bold text-text-primary">{project.title}</h3>
              <p className="text-sm text-text-secondary">{project.description[language]}</p>

              <div className="flex flex-wrap gap-2">
                {project.stack.map((stackItem) => {
                  const iconSet = resolveTechIconPath(stackItem);

                  return (
                    <span
                      key={`${project.id}-${stackItem}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3 py-1 text-xs text-text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-cyan hover:text-accent-cyan"
                    >
                      <ThemeIcon
                        iconPath={iconSet.iconPath}
                        iconPathDark={iconSet.iconPathDark}
                        alt={`${stackItem} icon`}
                        className="h-4 w-4 object-contain"
                      />
                      {stackItem}
                    </span>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                {renderProjectLink(
                  dictionary.portfolio.liveDemo,
                  project.liveDemoUrl,
                  dictionary.portfolio.pending,
                  "/assets/icons/actions/demo.svg",
                  "/assets/icons/actions/demo-dark.svg"
                )}
                {renderProjectLink(
                  dictionary.portfolio.code,
                  project.codeUrl,
                  dictionary.portfolio.pending,
                  "/assets/icons/actions/code.svg",
                  "/assets/icons/actions/code-dark.svg"
                )}
                {project.demoCredentials && project.demoCredentials.length > 0 ? (
                  <button
                    onClick={() => setOpenCredentialsId(project.id)}
                    className="inline-flex items-center gap-2 rounded-md border border-accent-cyan/40 bg-accent-cyan/5 px-3 py-2 text-xs font-semibold text-accent-cyan transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-cyan hover:bg-accent-cyan/10"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                    </svg>
                    {dictionary.portfolio.credentialsTitle}
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {activeProject?.demoCredentials ? (
        <CredentialsModal
          isOpen={openCredentialsId !== null}
          onClose={() => setOpenCredentialsId(null)}
          projectTitle={activeProject.title}
          credentials={activeProject.demoCredentials}
          language={language}
          dictionary={dictionary}
        />
      ) : null}
    </section>
  );
}
