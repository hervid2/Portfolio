import { enDictionary } from "@/i18n/en";
import { esDictionary } from "@/i18n/es";
import type { AppDictionary, Language } from "@/types/i18n";

export const dictionaries: Record<Language, AppDictionary> = {
  en: enDictionary,
  es: esDictionary
};
