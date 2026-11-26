import { useLanguage } from "@/hooks/useLanguage";
import type { SubmissionState } from "@/hooks/useContactForm";

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
export function ContactFormStatus({
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
