import type { CaptchaVerifier } from "../../domain/interfaces/CaptchaVerifier.js";

/**
 * Captcha verifier fallback used when captcha validation is disabled.
 */
export class NoopCaptchaVerifier implements CaptchaVerifier {
  /**
   * Accepts every token because captcha validation is disabled.
   *
   * @async
   * @param _token - Ignored captcha token.
   * @returns Promise resolved with `true`.
   */
  async verifyToken(_token: string): Promise<boolean> {
    return true;
  }
}
