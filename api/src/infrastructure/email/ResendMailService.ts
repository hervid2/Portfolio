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

  constructor(private readonly config: ResendMailServiceConfig) {
    this.client = new Resend(config.apiKey);
  }

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
