import type { Request, Response } from "express";
import { SubmitContactMessageUseCase } from "../../../application/use-cases/SubmitContactMessageUseCase.js";
import { getEnvConfig } from "../../../config/env.js";
import { NoopCaptchaVerifier } from "../../../infrastructure/captcha/NoopCaptchaVerifier.js";
import { TurnstileCaptchaVerifier } from "../../../infrastructure/captcha/TurnstileCaptchaVerifier.js";
import { NoopMailService } from "../../../infrastructure/email/NoopMailService.js";
import { NodemailerMailService } from "../../../infrastructure/email/NodemailerMailService.js";
import { PrismaContactRepository } from "../../../infrastructure/repositories/PrismaContactRepository.js";
import type { ContactRequestBody } from "../validators/contactSchema.js";

const envConfig = getEnvConfig();
const contactRepository = new PrismaContactRepository();
const mailService = envConfig.mailEnabled
  ? new NodemailerMailService({
      mailFrom: envConfig.mailFrom,
      mailTo: envConfig.mailTo,
      smtpHost: envConfig.smtpHost,
      smtpPort: envConfig.smtpPort,
      smtpSecure: envConfig.smtpSecure,
      smtpUser: envConfig.smtpUser,
      smtpPass: envConfig.smtpPass
    })
  : new NoopMailService();
const captchaVerifier = envConfig.captchaEnabled
  ? new TurnstileCaptchaVerifier({
      secretKey: envConfig.turnstileSecretKey
    })
  : new NoopCaptchaVerifier();
const submitContactMessageUseCase = new SubmitContactMessageUseCase(contactRepository, mailService);

/**
 * Handles POST /api/contact requests.
 *
 * @async
 * @param request - Express request object.
 * @param response - Express response object.
 * @returns Promise resolved after response is sent.
 */
export async function contactController(
  request: Request<unknown, unknown, ContactRequestBody>,
  response: Response
): Promise<void> {
  if (envConfig.captchaEnabled) {
    const isCaptchaValid = await captchaVerifier.verifyToken(request.body.captchaToken, request.ip);

    if (!isCaptchaValid) {
      response.status(400).json({
        message: "Captcha validation failed"
      });
      return;
    }
  }

  await submitContactMessageUseCase.execute({
    name: request.body.name,
    email: request.body.email,
    message: request.body.message,
    submittedAt: new Date().toISOString()
  });

  response.status(201).json({
    message: "Contact message sent successfully"
  });
}
