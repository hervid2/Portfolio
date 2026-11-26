import type { FormEvent, MutableRefObject } from "react";
import { motion } from "motion/react";
import { ContactFormField } from "@/components/sections/ContactFormField";
import type { ContactFieldName } from "@/components/sections/ContactFormField";
import { useLanguage } from "@/hooks/useLanguage";
import type { SubmissionState } from "@/hooks/useContactForm";
import type { ContactFormValues } from "@/types/contact";
import { fadeUpVariants, HOVER_LIFT_Y_SMALL, HOVER_SPRING } from "@/utils/motionPresets";

const CONTACT_FIELD_NAMES: readonly ContactFieldName[] = ["name", "email", "message"];

interface ContactFormProps {
  values: ContactFormValues;
  submissionState: SubmissionState;
  errorMessage: string;
  updateField: (fieldName: keyof ContactFormValues, fieldValue: string) => void;
  submitForm: () => Promise<void>;
  isTurnstileEnabled: boolean;
  turnstileContainerRef: MutableRefObject<HTMLDivElement | null>;
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

interface ContactFormStatusProps {
  submissionState: SubmissionState;
  errorMessage: string;
}

/**
 * Renders the success message or the error message after a submission, or nothing otherwise.
 *
 * @param props - Component props.
 * @param props.submissionState - Current submission state.
 * @param props.errorMessage - Specific error message; the generic one is used when empty.
 * @returns Status paragraph, or null while idle or loading.
 */
function ContactFormStatus({
  submissionState,
  errorMessage
}: ContactFormStatusProps): JSX.Element | null {
  const { dictionary } = useLanguage();

  if (submissionState === "success") {
    return (
      <p className="text-sm font-semibold text-accent-cyan">{dictionary.contact.successMessage}</p>
    );
  }

  if (submissionState === "error") {
    return (
      <p className="text-sm font-semibold text-red-400">
        {errorMessage || dictionary.contact.errorMessage}
      </p>
    );
  }

  return null;
}

/**
 * Renders the contact form: the three fields, the Turnstile container, the submit button and
 * the success or error message.
 *
 * @param props - Component props (form state and handlers from `useContactForm`).
 * @returns Form element.
 */
export function ContactForm(props: ContactFormProps): JSX.Element {
  const { values, submissionState, errorMessage, updateField, submitForm } = props;
  const { dictionary } = useLanguage();

  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={(event) => {
        void handleSubmit(event, submitForm);
      }}
    >
      {CONTACT_FIELD_NAMES.map((fieldName) => (
        <ContactFormField
          key={fieldName}
          fieldName={fieldName}
          value={values[fieldName]}
          onChange={updateField}
        />
      ))}

      {/* Left unanimated on purpose: Turnstile mounts its widget into this
          node imperatively, and wrapping it in a transform would interfere. */}
      {props.isTurnstileEnabled && (
        <div ref={props.turnstileContainerRef} className="min-h-[65px]" />
      )}

      <motion.button
        type="submit"
        className="btn-primary"
        disabled={submissionState === "loading"}
        aria-label="Send contact message"
        variants={fadeUpVariants}
        whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
      >
        {submissionState === "loading"
          ? dictionary.contact.sendingLabel
          : dictionary.contact.submitLabel}
      </motion.button>

      <ContactFormStatus submissionState={submissionState} errorMessage={errorMessage} />
    </form>
  );
}
