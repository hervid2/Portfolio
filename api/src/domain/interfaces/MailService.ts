import type { ContactMessageDTO } from "../../types/contact.js";

export interface MailService {
  sendContactNotification(contactMessage: ContactMessageDTO): Promise<void>;
}
