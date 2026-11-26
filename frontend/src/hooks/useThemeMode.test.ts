import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useThemeMode } from "./useThemeMode";

/** localStorage key the hook reads and writes (the persisted contract of BR-002). */
const THEME_STORAGE_KEY = "portfolio-theme";

/** Class the hook toggles on `<html>` for the light theme. */
const LIGHT_THEME_CLASS = "theme-light";

/**
 * Reports whether the light-theme class is currently set on `<html>`.
 *
 * @returns True when `<html>` carries the light-theme class.
 */
function hasLightClass(): boolean {
  return document.documentElement.classList.contains(LIGHT_THEME_CLASS);
}

afterEach(() => {
  document.documentElement.classList.remove(LIGHT_THEME_CLASS);
});

describe("AC-000-05(f) useThemeMode", () => {
  it("AC-000-05(f) stored 'light' returns light and sets theme-light on <html>", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.themeMode).toBe("light");
    expect(hasLightClass()).toBe(true);
  });

  it("AC-000-05(f) nothing stored returns dark without theme-light", () => {
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.themeMode).toBe("dark");
    expect(hasLightClass()).toBe(false);
  });

  it("AC-000-05(f) an unknown stored value ('blue') falls back to dark", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "blue");
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.themeMode).toBe("dark");
    expect(hasLightClass()).toBe(false);
  });

  it("AC-000-05(f) toggling persists the new value and updates <html>", () => {
    const { result } = renderHook(() => useThemeMode());
    act(() => result.current.toggleThemeMode());
    expect(result.current.themeMode).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(hasLightClass()).toBe(true);

    act(() => result.current.toggleThemeMode());
    expect(result.current.themeMode).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(hasLightClass()).toBe(false);
  });
});
