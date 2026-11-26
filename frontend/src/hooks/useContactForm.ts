import { useCallback, useState } from "react";
import { sendContactMessage } from "@/services/api/contactApi";
import { useLanguage } from "@/hooks/useLanguage";
import type { ContactFormValues } from "@/types/contact";
import type { AppDictionary } from "@/types/i18n";

/** Lifecycle of a contact form submission. */
export type SubmissionState = "idle" | "loading" | "success" | "error";

interface UseContactFormResult {
  values: ContactFormValues;
  submissionState: SubmissionState;
  errorMessage: string;
  updateField: (fieldName: keyof ContactFormValues, fieldValue: string) => void;
  submitForm: () => Promise<void>;
}

/**
 * Creates initial contact form values.
 *
 * @returns Empty form state.
 */
function createInitialValues(): ContactFormValues {
  return {
    name: "",
    email: "",
    message: "",
    captchaToken: ""
  };
}

/**
 * Checks the client-side preconditions for submitting the contact form.
 *
 * @param values - Current form values.
 * @param captchaEnabled - Whether a Turnstile token is required.
 * @param dictionary - Active dictionary used for the error copy.
 * @returns The localized error message, or `null` when the form can be sent.
 */
function resolveValidationError(
  values: ContactFormValues,
  captchaEnabled: boolean,
  dictionary: AppDictionary
): string | null {
  if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
    return dictionary.contact.requiredFieldsMessage;
  }

  if (captchaEnabled && !values.captchaToken.trim()) {
    return dictionary.contact.captchaRequiredMessage;
  }

  return null;
}

/**
 * Provides local state and submission logic for the contact form.
 *
 * @returns Contact form state and handlers.
 */
export function useContactForm(): UseContactFormResult {
  const { dictionary } = useLanguage();
  const captchaEnabled = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY?.toString().trim());
  const [values, setValues] = useState<ContactFormValues>(() => createInitialValues());
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  /**
   * Updates a specific contact form field. Stable across renders: it only calls `setValues`.
   *
   * @param fieldName - Field key to update.
   * @param fieldValue - New value for the field.
   */
  const updateField = useCallback(
    (fieldName: keyof ContactFormValues, fieldValue: string): void => {
      setValues((previousValues) => ({
        ...previousValues,
        [fieldName]: fieldValue
      }));
    },
    []
  );

  /**
   * Sends form values to API and handles submission state.
   *
   * @async
   * @returns Promise that resolves after API call completion.
   */
  async function submitForm(): Promise<void> {
    const validationError = resolveValidationError(values, captchaEnabled, dictionary);
    if (validationError) {
      setSubmissionState("error");
      setErrorMessage(validationError);
      return;
    }

    try {
      setSubmissionState("loading");
      setErrorMessage("");
      await sendContactMessage(values);
      setSubmissionState("success");
      setValues(createInitialValues());
    } catch (error) {
      setSubmissionState("error");
      const fallbackMessage =
        error instanceof Error ? error.message : dictionary.contact.errorMessage;
      setErrorMessage(fallbackMessage);
    }
  }

  return { values, submissionState, errorMessage, updateField, submitForm };
}
