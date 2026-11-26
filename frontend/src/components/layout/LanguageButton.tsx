import { useLanguage } from "@/hooks/useLanguage";
import type { Language } from "@/types/i18n";

interface LanguageButtonProps {
  value: Language;
}

/**
 * Renders one language toggle button, highlighted when its language is active.
 *
 * @param props - Component props.
 * @param props.value - Language this button selects.
 * @returns Language button element.
 */
export function LanguageButton({ value }: LanguageButtonProps): JSX.Element {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      type="button"
      className={`rounded-lg px-3 py-1 text-xs font-bold uppercase ${
        language === value ? "bg-accent-cyan text-black" : "text-text-secondary"
      }`}
      onClick={() => setLanguage(value)}
    >
      {value.toUpperCase()}
    </button>
  );
}
