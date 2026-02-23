import { useState } from "react";
import { sendContactMessage } from "@/services/api/contactApi";
import type { ContactFormValues } from "@/types/contact";

type SubmissionState = "idle" | "loading" | "success" | "error";

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
    message: ""
  };
}

/**
 * Provides local state and submission logic for the contact form.
 *
 * @returns Contact form state and handlers.
 */
export function useContactForm(): UseContactFormResult {
  const [values, setValues] = useState<ContactFormValues>(() => createInitialValues());
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  /**
   * Updates a specific contact form field.
   *
   * @param fieldName - Field key to update.
   * @param fieldValue - New value for the field.
   */
  function updateField(fieldName: keyof ContactFormValues, fieldValue: string): void {
    setValues((previousValues) => ({
      ...previousValues,
      [fieldName]: fieldValue
    }));
  }

  /**
   * Sends form values to API and handles submission state.
   *
   * @async
   * @returns Promise that resolves after API call completion.
   */
  async function submitForm(): Promise<void> {
    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      setSubmissionState("error");
      setErrorMessage("Please complete all fields before sending.");
      return;
    }

    try {
      setSubmissionState("loading");
      setErrorMessage("");
      await sendContactMessage(values);
      setSubmissionState("success");
      setValues(createInitialValues());
    } catch (error) {
      const fallbackMessage = error instanceof Error ? error.message : "Failed to send message.";
      setSubmissionState("error");
      setErrorMessage(fallbackMessage);
    }
  }

  return {
    values,
    submissionState,
    errorMessage,
    updateField,
    submitForm
  };
}
