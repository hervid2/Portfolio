import { useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { motion } from "motion/react";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { useContactForm } from "@/hooks/useContactForm";
import { useLanguage } from "@/hooks/useLanguage";
import {
  createStaggerContainer,
  fadeUpVariants,
  HOVER_LIFT_Y_SMALL,
  HOVER_SPRING,
  REPLAY_VIEWPORT
} from "@/utils/motionPresets";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

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
 * Sits below the fold, so it animates on scroll with `whileInView` reusing the
 * site-wide spring and stagger rhythm. The Turnstile container is deliberately
 * left out of the animation, since the widget is mounted into it imperatively.
 *
 * @returns Contact section element.
 */
export function ContactSection(): JSX.Element {
  const { dictionary } = useLanguage();
  const { values, submissionState, errorMessage, updateField, submitForm } = useContactForm();
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.toString().trim() || "";
  const isTurnstileEnabled = turnstileSiteKey.length > 0;
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isTurnstileEnabled) {
      return;
    }

    let pollingIntervalId: ReturnType<typeof setInterval> | undefined;

    const renderWidget = (): void => {
      if (!window.turnstile || !turnstileContainerRef.current || turnstileWidgetIdRef.current) {
        return;
      }

      turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token: string) => {
          updateField("captchaToken", token);
        },
        "expired-callback": () => {
          updateField("captchaToken", "");
        },
        "error-callback": () => {
          updateField("captchaToken", "");
        }
      });

      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
        pollingIntervalId = undefined;
      }
    };

    renderWidget();

    if (!turnstileWidgetIdRef.current) {
      pollingIntervalId = setInterval(renderWidget, 300);
    }

    return () => {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }

      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
      }

      turnstileWidgetIdRef.current = null;
    };
  }, [isTurnstileEnabled, turnstileSiteKey]);

  return (
    <motion.section
      id="contact"
      variants={createStaggerContainer()}
      initial="hidden"
      whileInView="visible"
      viewport={REPLAY_VIEWPORT}
      className="mx-auto w-full max-w-4xl px-5 py-24 md:px-8"
    >
      <motion.header variants={fadeUpVariants} className="text-center">
        <h2 className="section-title">{dictionary.contact.title}</h2>
        <p className="section-subtitle">{dictionary.contact.subtitle}</p>
      </motion.header>

      <motion.div
        variants={fadeUpVariants}
        className="mt-10 rounded-2xl border border-border-subtle bg-surface-card p-6"
      >
        <h3 className="text-lg font-semibold text-text-primary">{dictionary.contact.altContactTitle}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <motion.a
            href="https://github.com/hervid2"
            className={
              "inline-flex items-center gap-2 rounded-md border border-border-subtle px-3 py-2 " +
              "transition-[color,border-color] duration-200 hover:border-accent-cyan " +
              "hover:text-accent-cyan"
            }
            rel="noopener noreferrer"
            target="_blank"
            whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
          >
            <ThemeIcon
              iconPath="/assets/icons/social/github.svg"
              iconPathDark="/assets/icons/social/github-dark.svg"
              alt="GitHub icon"
              className="h-4 w-4 object-contain"
            />
            GitHub
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/hern%C3%A1n-david-cardona-becerra/"
            className={
              "inline-flex items-center gap-2 rounded-md border border-border-subtle px-3 py-2 " +
              "transition-[color,border-color] duration-200 hover:border-accent-cyan " +
              "hover:text-accent-cyan"
            }
            rel="noopener noreferrer"
            target="_blank"
            whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
          >
            <ThemeIcon
              iconPath="/assets/icons/social/linkedin.svg"
              alt="LinkedIn icon"
              className="h-4 w-4 object-contain"
            />
            LinkedIn
          </motion.a>
        </div>
      </motion.div>

      <form
        className="mt-8 space-y-4"
        onSubmit={(event) => {
          void handleSubmit(event, submitForm);
        }}
      >
        <motion.div variants={fadeUpVariants}>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold text-text-primary">
            {dictionary.contact.nameLabel}
          </label>
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-lg border border-border-subtle bg-surface-card px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-accent-cyan"
            placeholder={dictionary.contact.namePlaceholder}
          />
        </motion.div>

        <motion.div variants={fadeUpVariants}>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-text-primary">
            {dictionary.contact.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-lg border border-border-subtle bg-surface-card px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-accent-cyan"
            placeholder={dictionary.contact.emailPlaceholder}
          />
        </motion.div>

        <motion.div variants={fadeUpVariants}>
          <label htmlFor="message" className="mb-2 block text-sm font-semibold text-text-primary">
            {dictionary.contact.messageLabel}
          </label>
          <textarea
            id="message"
            rows={5}
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            className="w-full rounded-lg border border-border-subtle bg-surface-card px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-accent-cyan"
            placeholder={dictionary.contact.messagePlaceholder}
          />
        </motion.div>

        {/* Left unanimated on purpose: Turnstile mounts its widget into this
            node imperatively, and wrapping it in a transform would interfere. */}
        {isTurnstileEnabled && (
          <div ref={turnstileContainerRef} className="min-h-[65px]" />
        )}

        <motion.button
          type="submit"
          className="btn-primary"
          disabled={submissionState === "loading"}
          aria-label="Send contact message"
          variants={fadeUpVariants}
          whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
        >
          {submissionState === "loading" ? dictionary.contact.sendingLabel : dictionary.contact.submitLabel}
        </motion.button>

        {submissionState === "success" && (
          <p className="text-sm font-semibold text-accent-cyan">{dictionary.contact.successMessage}</p>
        )}

        {submissionState === "error" && (
          <p className="text-sm font-semibold text-red-400">
            {errorMessage || dictionary.contact.errorMessage}
          </p>
        )}
      </form>
    </motion.section>
  );
}
