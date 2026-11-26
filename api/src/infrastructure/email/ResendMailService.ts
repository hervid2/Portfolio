import { Resend } from "resend";
import type { MailService } from "../../domain/interfaces/MailService.js";
import type { ContactMessageDTO } from "../../types/contact.js";

interface ResendMailServiceConfig {
  apiKey: string;
  mailFrom: string;
  mailTo: string;
}

/**
 * Sends contact notifications via Resend HTTP API.
 */
export class ResendMailService implements MailService {
  private readonly client: Resend;

  /**
   * Creates the Resend client from the given configuration.
   *
   * @param config - Resend API key, sender and recipient.
   */
  constructor(private readonly config: ResendMailServiceConfig) {
    this.client = new Resend(config.apiKey);
  }

  /**
   * Emails a plain-text notification for a new contact message via Resend.
   *
   * @async
   * @param contactMessage - Contact payload to notify about.
   * @returns Promise resolved when Resend accepts the email.
   * @throws Error when Resend returns an error.
   */
  async sendContactNotification(contactMessage: ContactMessageDTO): Promise<void> {
    const { error } = await this.client.emails.send({
      from: this.config.mailFrom,
      to: this.config.mailTo,
      subject: `New portfolio contact from ${contactMessage.name}`,
      text: [
        "You received a new message from your portfolio form.",
        "",
        `Name: ${contactMessage.name}`,
        `Email: ${contactMessage.email}`,
        `Submitted at: ${contactMessage.submittedAt}`,
        "",
        "Message:",
        contactMessage.message
      ].join("\n")
    });

    if (error) {
      throw new Error(`Resend email failed: ${error.message}`);
    }
  }
}
