import { createContext, useMemo, useState, type ReactNode } from "react";
import { dictionaries } from "@/i18n/dictionaries";
import type { AppDictionary, Language } from "@/types/i18n";

const STORAGE_KEY = "portfolio-language";

interface LanguageContextValue {
  language: Language;
  dictionary: AppDictionary;
  setLanguage: (nextLanguage: Language) => void;
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/**
 * Resolves initial language preference from localStorage.
 *
 * @returns A valid supported language.
 */
function resolveInitialLanguage(): Language {
  const storedLanguage = window.localStorage.getItem(STORAGE_KEY);

  if (storedLanguage === "es" || storedLanguage === "en") {
    return storedLanguage;
  }

  return "en";
}

/**
 * Provides internationalization dictionary and language state for the app.
 *
 * @param props - Provider props.
 * @param props.children - Child nodes to wrap with language context.
 * @returns Context provider element.
 */
export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
  const [language, updateLanguage] = useState<Language>(() => resolveInitialLanguage());

  /**
   * Sets the active language and persists it in local storage.
   *
   * @param nextLanguage - New language to activate.
   */
  function setLanguage(nextLanguage: Language): void {
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    updateLanguage(nextLanguage);
  }

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      dictionary: dictionaries[language],
      setLanguage
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
