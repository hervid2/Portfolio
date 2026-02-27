import type { CaptchaVerifier } from "../../domain/interfaces/CaptchaVerifier.js";

/**
 * Captcha verifier fallback used when captcha validation is disabled.
 */
export class NoopCaptchaVerifier implements CaptchaVerifier {
  async verifyToken(_token: string): Promise<boolean> {
    return true;
  }
}
