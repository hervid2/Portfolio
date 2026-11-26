import type { CaptchaVerifier } from "../../domain/interfaces/CaptchaVerifier.js";
import type { ContactRepository } from "../../domain/interfaces/ContactRepository.js";
import type { MailService } from "../../domain/interfaces/MailService.js";
import type {
  ContactMessageDTO,
  SubmitContactMessageCommand,
  SubmitContactMessageResult
} from "../../types/contact.js";

/**
 * Handles business flow for contact form submissions.
 */
export class SubmitContactMessageUseCase {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly mailService: MailService,
    private readonly captchaVerifier: CaptchaVerifier
  ) {}

  /**
   * Verifies the captcha, then persists the contact message and sends its notification.
   *
   * @async
   * @param command - Parsed contact request data with the captcha token and remote IP.
   * @returns Promise resolved with `accepted`, or `captcha-rejected` when nothing was stored.
   */
  async execute(command: SubmitContactMessageCommand): Promise<SubmitContactMessageResult> {
    const isCaptchaValid = await this.captchaVerifier.verifyToken(
      command.captchaToken,
      command.remoteIp
    );
    if (!isCaptchaValid) {
      return { status: "captcha-rejected" };
    }

    const contactMessage: ContactMessageDTO = {
      name: command.name,
      email: command.email,
      message: command.message,
      submittedAt: new Date().toISOString()
    };
    await this.contactRepository.save(contactMessage);
    await this.mailService.sendContactNotification(contactMessage);
    return { status: "accepted" };
  }
}
