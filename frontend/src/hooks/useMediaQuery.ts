import { useEffect, useState } from "react";

/**
 * Tracks whether a CSS media query currently matches the browser environment.
 *
 * Reading the match from JavaScript—instead of relying only on Tailwind
 * breakpoints—lets behaviour, not just styling, react to device capabilities
 * such as pointer type or the reduced motion preference.
 *
 * @param query - Media query string, e.g. `(hover: hover)`.
 * @returns True while the query matches, updating on every change.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", handleChange);

    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
