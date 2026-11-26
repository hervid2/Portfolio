import { motion } from "motion/react";
import { useLanguage } from "@/hooks/useLanguage";
import type { ContactFormValues } from "@/types/contact";
import { fadeUpVariants } from "@/utils/motionPresets";

/** Contact form fields typed by the visitor (the captcha token is set by Turnstile). */
export type ContactFieldName = Exclude<keyof ContactFormValues, "captchaToken">;

interface ContactFormFieldProps {
  fieldName: ContactFieldName;
  value: string;
  onChange: (fieldName: ContactFieldName, fieldValue: string) => void;
}

const FIELD_INPUT_CLASS =
  "w-full rounded-lg border border-border-subtle bg-surface-card px-4 py-3 text-sm " +
  "text-text-primary outline-none transition-colors focus:border-accent-cyan";

/**
 * Renders one labelled contact form field: a text input for the name, an email input for
 * the email and a 5-row textarea for the message.
 *
 * @param props - Component props.
 * @param props.fieldName - Field to render; also its element id.
 * @param props.value - Current field value.
 * @param props.onChange - Receives the field name and its new value.
 * @returns Animated field wrapper element.
 */
export function ContactFormField({
  fieldName,
  value,
  onChange
}: ContactFormFieldProps): JSX.Element {
  const { dictionary } = useLanguage();
  const label = dictionary.contact[`${fieldName}Label`];
  const placeholder = dictionary.contact[`${fieldName}Placeholder`];

  return (
    <motion.div variants={fadeUpVariants}>
      <label htmlFor={fieldName} className="mb-2 block text-sm font-semibold text-text-primary">
        {label}
      </label>
      {fieldName === "message" ? (
        <textarea
          id={fieldName}
          rows={5}
          value={value}
          onChange={(event) => onChange(fieldName, event.target.value)}
          className={FIELD_INPUT_CLASS}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={fieldName}
          type={fieldName === "email" ? "email" : "text"}
          value={value}
          onChange={(event) => onChange(fieldName, event.target.value)}
          className={FIELD_INPUT_CLASS}
          placeholder={placeholder}
        />
      )}
    </motion.div>
  );
}
