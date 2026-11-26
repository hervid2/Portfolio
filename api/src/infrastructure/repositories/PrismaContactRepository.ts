import type { ContactRepository } from "../../domain/interfaces/ContactRepository.js";
import type { ContactMessageDTO } from "../../types/contact.js";
import { prisma } from "../database/prismaClient.js";

/**
 * Persists contact messages in MySQL via Prisma ORM.
 */
export class PrismaContactRepository implements ContactRepository {
  /**
   * Stores a contact message in MySQL.
   *
   * @async
   * @param contactMessage - Contact payload to persist.
   * @returns Promise resolved when the row is created.
   * @throws Error when `submittedAt` is not a valid date.
   */
  async save(contactMessage: ContactMessageDTO): Promise<void> {
    const submittedAt = new Date(contactMessage.submittedAt);

    if (Number.isNaN(submittedAt.getTime())) {
      throw new Error("Invalid submittedAt date for contact message");
    }

    await prisma.contactMessage.create({
      data: {
        name: contactMessage.name,
        email: contactMessage.email,
        message: contactMessage.message,
        submittedAt
      }
    });
  }
}
