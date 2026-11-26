import type { FormEvent, MutableRefObject } from "react";
import { motion } from "motion/react";
import { ContactFormField } from "@/components/sections/ContactFormField";
import type { ContactFieldName } from "@/components/sections/ContactFormField";
import { ContactFormStatus } from "@/components/sections/ContactFormStatus";
import { useLanguage } from "@/hooks/useLanguage";
import type { SubmissionState } from "@/hooks/useContactForm";
import type { ContactFormValues } from "@/types/contact";
import type { AppDictionary } from "@/types/i18n";
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

/**
 * Renders the animated submit button, disabled and relabeled while the submission is loading.
 *
 * @param submissionState - Current submission state.
 * @param contact - Contact section dictionary with the submit and sending labels.
 * @returns Submit button element.
 */
function renderSubmitButton(
  submissionState: SubmissionState,
  contact: AppDictionary["contact"]
): JSX.Element {
  return (
    <motion.button
      type="submit"
      className="btn-primary"
      disabled={submissionState === "loading"}
      aria-label="Send contact message"
      variants={fadeUpVariants}
      whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
    >
      {submissionState === "loading" ? contact.sendingLabel : contact.submitLabel}
    </motion.button>
  );
}

/**
 * Renders the contact form: the three fields, the Turnstile container, the submit button and
 * the success or error message.
 *
 * @param props - Component props (form state and handlers from `useContactForm`).
 * @param props.values - Current field values.
 * @param props.submissionState - Current submission state.
 * @param props.errorMessage - Specific error message shown after a failed submission.
 * @param props.updateField - Updates one field value.
 * @param props.submitForm - Submits the form.
 * @param props.isTurnstileEnabled - Whether the Turnstile container is rendered.
 * @param props.turnstileContainerRef - Ref of the node Turnstile mounts its widget into.
 * @returns Form element.
 */
export function ContactForm({
  values,
  submissionState,
  errorMessage,
  updateField,
  submitForm,
  isTurnstileEnabled,
  turnstileContainerRef
}: ContactFormProps): JSX.Element {
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
      {isTurnstileEnabled && <div ref={turnstileContainerRef} className="min-h-[65px]" />}

      {renderSubmitButton(submissionState, dictionary.contact)}

      <ContactFormStatus submissionState={submissionState} errorMessage={errorMessage} />
    </form>
  );
}
