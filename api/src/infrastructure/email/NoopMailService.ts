import type { MailService } from "../../domain/interfaces/MailService.js";
import type { ContactMessageDTO } from "../../types/contact.js";

/**
 * Mail service fallback used when email notifications are disabled.
 */
export class NoopMailService implements MailService {
  /**
   * Skips the notification because email is disabled.
   *
   * @async
   * @param _contactMessage - Ignored contact payload.
   * @returns Promise resolved immediately.
   */
  async sendContactNotification(_contactMessage: ContactMessageDTO): Promise<void> {
    return Promise.resolve();
  }
}
