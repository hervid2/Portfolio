import { skills } from "@/data/skills";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Renders the personal profile and dynamic skills section.
 *
 * @returns About section element.
 */
export function AboutSection(): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <section id="about" className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8">
      <h2 className="section-title text-center">{dictionary.about.title}</h2>
      <div className="mt-12 grid items-start gap-10 md:grid-cols-[240px_1fr]">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"
          alt="Portrait of Hernán David Cardona"
          className="h-60 w-60 rounded-full border-2 border-accent-cyan object-cover"
          loading="lazy"
        />

        <div>
          <p className="text-lg leading-relaxed text-text-secondary">{dictionary.about.bioParagraphOne}</p>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{dictionary.about.bioParagraphTwo}</p>
        </div>
      </div>

      <h3 className="mt-16 text-center font-display text-3xl font-semibold text-text-primary">
        {dictionary.about.skillsTitle}
      </h3>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="rounded-full border border-border-subtle bg-surface-muted px-4 py-2 text-sm font-medium text-text-secondary"
          >
            {skill.label}
          </span>
        ))}
      </div>
    </section>
  );
}
