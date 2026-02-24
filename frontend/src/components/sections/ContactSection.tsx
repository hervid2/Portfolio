import type { FormEvent } from "react";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { useContactForm } from "@/hooks/useContactForm";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Prevents default form action and calls contact form submit handler.
 *
 * @async
 * @param event - Form submit event.
 * @param submitForm - Async submit callback.
 * @returns Promise resolved when submit action ends.
 */
async function handleSubmit(
  event: FormEvent<HTMLFormElement>,
  submitForm: () => Promise<void>
): Promise<void> {
  event.preventDefault();
  await submitForm();
}

/**
 * Renders contact section and submission form connected to backend API.
 *
 * @returns Contact section element.
 */
export function ContactSection(): JSX.Element {
  const { dictionary } = useLanguage();
  const { values, submissionState, errorMessage, updateField, submitForm } = useContactForm();

  return (
    <section id="contact" className="mx-auto w-full max-w-4xl px-5 py-24 md:px-8">
      <header className="text-center">
        <h2 className="section-title">{dictionary.contact.title}</h2>
        <p className="section-subtitle">{dictionary.contact.subtitle}</p>
      </header>

      <div className="mt-10 rounded-2xl border border-border-subtle bg-surface-card p-6">
        <h3 className="text-lg font-semibold text-text-primary">{dictionary.contact.altContactTitle}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-md border border-border-subtle px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-cyan hover:text-accent-cyan"
            rel="noopener noreferrer"
            target="_blank"
          >
            <ThemeIcon
              iconPath="/assets/icons/social/github.svg"
              iconPathDark="/assets/icons/social/github-dark.svg"
              alt="GitHub icon"
              className="h-4 w-4 object-contain"
            />
            GitHub
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-md border border-border-subtle px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-cyan hover:text-accent-cyan"
            rel="noopener noreferrer"
            target="_blank"
          >
            <ThemeIcon
              iconPath="/assets/icons/social/linkedin.svg"
              alt="LinkedIn icon"
              className="h-4 w-4 object-contain"
            />
            LinkedIn
          </a>
        </div>
      </div>

      <form
        className="mt-8 space-y-4"
        onSubmit={(event) => {
          void handleSubmit(event, submitForm);
        }}
      >
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold text-text-primary">
            {dictionary.contact.nameLabel}
          </label>
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-lg border border-border-subtle bg-surface-card px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-accent-cyan"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-text-primary">
            {dictionary.contact.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-lg border border-border-subtle bg-surface-card px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-accent-cyan"
            placeholder="name@email.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-semibold text-text-primary">
            {dictionary.contact.messageLabel}
          </label>
          <textarea
            id="message"
            rows={5}
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            className="w-full rounded-lg border border-border-subtle bg-surface-card px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-accent-cyan"
            placeholder="Write your message here..."
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={submissionState === "loading"}
          aria-label="Send contact message"
        >
          {submissionState === "loading" ? "Sending..." : dictionary.contact.submitLabel}
        </button>

        {submissionState === "success" && (
          <p className="text-sm font-semibold text-accent-cyan">{dictionary.contact.successMessage}</p>
        )}

        {submissionState === "error" && (
          <p className="text-sm font-semibold text-red-400">
            {errorMessage || dictionary.contact.errorMessage}
          </p>
        )}
      </form>
    </section>
  );
}
