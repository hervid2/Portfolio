import type { ContactMessageDTO } from "../../types/contact.js";

export interface ContactRepository {
  save(contactMessage: ContactMessageDTO): Promise<void>;
}
