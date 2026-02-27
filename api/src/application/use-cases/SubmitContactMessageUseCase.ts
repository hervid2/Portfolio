import type { ContactRepository } from "../../domain/interfaces/ContactRepository.js";
import type { MailService } from "../../domain/interfaces/MailService.js";
import type { ContactMessageDTO } from "../../types/contact.js";

/**
 * Handles business flow for contact form submissions.
 */
export class SubmitContactMessageUseCase {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly mailService: MailService
  ) {}

  /**
   * Persists contact message data using the configured repository.
   *
   * @async
   * @param payload - Incoming contact request data.
   * @returns Promise resolved when operation completes.
   */
  async execute(payload: ContactMessageDTO): Promise<void> {
    await this.contactRepository.save(payload);
    await this.mailService.sendContactNotification(payload);
  }
}
