/**
 * Minimal operational logger for the API (CL-03).
 *
 * It is the only console sink in production code: every other module calls `logger.*`, so
 * `no-console` stays an error everywhere else. Each method forwards its arguments unchanged,
 * so the output is byte-identical to the former direct `console` calls.
 */
export const logger = {
  /**
   * Logs an informational message.
   *
   * @param args - Values forwarded unchanged to `console.info`.
   */
  info(...args: unknown[]): void {
    // eslint-disable-next-line no-console -- the API logger is the only console sink (CL-03)
    console.info(...args);
  },

  /**
   * Logs a warning.
   *
   * @param args - Values forwarded unchanged to `console.warn`.
   */
  warn(...args: unknown[]): void {
    // eslint-disable-next-line no-console -- the API logger is the only console sink (CL-03)
    console.warn(...args);
  },

  /**
   * Logs an error.
   *
   * @param args - Values forwarded unchanged to `console.error`.
   */
  error(...args: unknown[]): void {
    // eslint-disable-next-line no-console -- the API logger is the only console sink (CL-03)
    console.error(...args);
  }
};
