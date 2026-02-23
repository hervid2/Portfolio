import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

/**
 * Exposes language state and dictionary from the language context.
 *
 * @returns The language context value.
 * @throws Error when used outside of LanguageProvider.
 */
export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
