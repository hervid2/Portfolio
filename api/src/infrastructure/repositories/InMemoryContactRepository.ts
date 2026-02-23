import type { ContactRepository } from "../../domain/interfaces/ContactRepository.js";
import type { ContactMessageDTO } from "../../types/contact.js";

/**
 * Stores contact messages in memory for development and portfolio demo usage.
 */
export class InMemoryContactRepository implements ContactRepository {
  private readonly messages: ContactMessageDTO[] = [];

  /**
   * Saves a contact message in memory storage.
   *
   * @async
   * @param contactMessage - Contact payload to persist.
   * @returns Promise resolved when the message is stored.
   */
  async save(contactMessage: ContactMessageDTO): Promise<void> {
    this.messages.push(contactMessage);
  }
}
