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
