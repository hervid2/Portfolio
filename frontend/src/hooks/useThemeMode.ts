import { useEffect, useState } from "react";
import type { ThemeMode } from "@/types/theme";

const THEME_STORAGE_KEY = "portfolio-theme";

/**
 * Resolves the initial theme mode from localStorage.
 *
 * @returns Theme mode to initialize UI.
 */
function resolveInitialTheme(): ThemeMode {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light") {
    return "light";
  }

  return "dark";
}

/** Value returned by {@link useThemeMode}. */
export interface ThemeModeState {
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}

/**
 * Holds the theme mode, applies it to `<html>` and persists it in localStorage (BR-002).
 *
 * @returns Current theme mode and a toggle between dark and light.
 */
export function useThemeMode(): ThemeModeState {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => resolveInitialTheme());

  useEffect(() => {
    const htmlElement = document.documentElement;

    if (themeMode === "light") {
      htmlElement.classList.add("theme-light");
      window.localStorage.setItem(THEME_STORAGE_KEY, "light");
      return;
    }

    htmlElement.classList.remove("theme-light");
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
  }, [themeMode]);

  /**
   * Toggles between dark and light visual themes.
   */
  function toggleThemeMode(): void {
    setThemeMode((previousMode) => (previousMode === "dark" ? "light" : "dark"));
  }

  return { themeMode, toggleThemeMode };
}
