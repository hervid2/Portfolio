import type { CaptchaVerifier } from "../../domain/interfaces/CaptchaVerifier.js";

interface TurnstileCaptchaVerifierConfig {
  secretKey: string;
}

interface TurnstileVerifyResponse {
  success: boolean;
}

/**
 * Verifies Cloudflare Turnstile tokens against the official siteverify API.
 */
export class TurnstileCaptchaVerifier implements CaptchaVerifier {
  constructor(private readonly config: TurnstileCaptchaVerifierConfig) {}

  async verifyToken(token: string, remoteIp?: string): Promise<boolean> {
    const body = new URLSearchParams({
      secret: this.config.secretKey,
      response: token
    });

    if (remoteIp) {
      body.append("remoteip", remoteIp);
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString()
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as TurnstileVerifyResponse;
    return payload.success;
  }
}
