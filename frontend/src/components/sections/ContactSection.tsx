import { useCallback } from "react";
import { motion } from "motion/react";
import { ContactAlternatives } from "@/components/sections/ContactAlternatives";
import { ContactForm } from "@/components/sections/ContactForm";
import { useContactForm } from "@/hooks/useContactForm";
import { useLanguage } from "@/hooks/useLanguage";
import { useTurnstileWidget } from "@/hooks/useTurnstileWidget";
import { createStaggerContainer, fadeUpVariants, REPLAY_VIEWPORT } from "@/utils/motionPresets";

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
  const handleCaptchaToken = useCallback(
    (token: string) => updateField("captchaToken", token),
    [updateField]
  );
  const turnstileContainerRef = useTurnstileWidget(turnstileSiteKey, handleCaptchaToken);

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

      <ContactAlternatives />

      <ContactForm
        values={values}
        submissionState={submissionState}
        errorMessage={errorMessage}
        updateField={updateField}
        submitForm={submitForm}
        isTurnstileEnabled={turnstileSiteKey.length > 0}
        turnstileContainerRef={turnstileContainerRef}
      />
    </motion.section>
  );
}
