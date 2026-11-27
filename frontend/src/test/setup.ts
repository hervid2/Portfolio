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

/**
 * No-op `IntersectionObserver` for jsdom, which does not implement it. `motion`'s `whileInView`
 * observes elements on mount; the stub never reports an intersection (plan 001 R-7).
 */
class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds: ReadonlyArray<number> = [0];
  /** Starts observing nothing. */
  observe(): void {}
  /** Stops observing nothing. */
  unobserve(): void {}
  /** Disconnects nothing. */
  disconnect(): void {}
  /**
   * Returns no pending entries.
   *
   * @returns An empty list.
   */
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof window.IntersectionObserver !== "function") {
  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    writable: true,
    value: IntersectionObserverStub
  });
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
