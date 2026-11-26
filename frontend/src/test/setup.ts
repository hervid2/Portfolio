import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/**
 * Builds a `MediaQueryList` stub for jsdom, which does not implement `window.matchMedia`.
 *
 * @param query - The media query string being evaluated.
 * @returns A non-matching `MediaQueryList` with no-op listeners.
 */
function createMediaQueryList(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false
  };
}

if (typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: createMediaQueryList
  });
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
