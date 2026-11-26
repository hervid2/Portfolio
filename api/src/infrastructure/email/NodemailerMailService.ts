import nodemailer from "nodemailer";
import type { MailService } from "../../domain/interfaces/MailService.js";
import type { ContactMessageDTO } from "../../types/contact.js";

interface NodemailerMailServiceConfig {
  mailFrom: string;
  mailTo: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
}

/**
 * Sends contact notifications with SMTP via nodemailer.
 */
export class NodemailerMailService implements MailService {
  private readonly transporter;

  /**
   * Creates the SMTP transporter from the given configuration.
   *
   * @param config - Sender, recipient and SMTP connection settings.
   */
  constructor(private readonly config: NodemailerMailServiceConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass
      }
    });
  }

  /**
   * Emails a plain-text notification for a new contact message via SMTP.
   *
   * @async
   * @param contactMessage - Contact payload to notify about.
   * @returns Promise resolved when the SMTP server accepts the email.
   */
  async sendContactNotification(contactMessage: ContactMessageDTO): Promise<void> {
    await this.transporter.sendMail({
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
  }
}
