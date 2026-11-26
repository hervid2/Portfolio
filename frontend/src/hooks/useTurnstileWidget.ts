import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
      remove: (widgetId: string) => void;
    };
  }
}

/**
 * Builds the Turnstile render options: a solved challenge reports its token, and an expired
 * or failed one reports an empty token.
 *
 * @param siteKey - Public Turnstile site key.
 * @param onToken - Receives the captcha token, or "" when it expires or errors.
 * @returns Options for `window.turnstile.render`.
 */
function buildRenderOptions(
  siteKey: string,
  onToken: (token: string) => void
): TurnstileRenderOptions {
  return {
    sitekey: siteKey,
    callback: (token: string) => {
      onToken(token);
    },
    "expired-callback": () => {
      onToken("");
    },
    "error-callback": () => {
      onToken("");
    }
  };
}

/**
 * Mounts the Cloudflare Turnstile widget into the returned container once the script is
 * available (polling every 300 ms until then), and removes it on unmount. Does nothing when
 * the site key is empty.
 *
 * @param siteKey - Public Turnstile site key; "" disables the widget.
 * @param onToken - Receives the captcha token; must be stable to avoid re-mounting the widget.
 * @returns Ref to attach to the widget container element.
 */
export function useTurnstileWidget(
  siteKey: string,
  onToken: (token: string) => void
): MutableRefObject<HTMLDivElement | null> {
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (siteKey.length === 0) {
      return;
    }

    let pollingIntervalId: ReturnType<typeof setInterval> | undefined;

    /**
     * Renders the widget once the Turnstile script and the container exist, then stops polling.
     */
    const renderWidget = (): void => {
      if (!window.turnstile || !turnstileContainerRef.current || turnstileWidgetIdRef.current) {
        return;
      }

      turnstileWidgetIdRef.current = window.turnstile.render(
        turnstileContainerRef.current,
        buildRenderOptions(siteKey, onToken)
      );

      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
        pollingIntervalId = undefined;
      }
    };

    renderWidget();

    if (!turnstileWidgetIdRef.current) {
      pollingIntervalId = setInterval(renderWidget, 300);
    }

    return () => {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }

      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
      }

      turnstileWidgetIdRef.current = null;
    };
  }, [siteKey, onToken]);

  return turnstileContainerRef;
}
