import type { Request, Response } from "express";
import { SubmitContactMessageUseCase } from "../../../application/use-cases/SubmitContactMessageUseCase.js";
import { InMemoryContactRepository } from "../../../infrastructure/repositories/InMemoryContactRepository.js";
import type { ContactRequestBody } from "../validators/contactSchema.js";

const contactRepository = new InMemoryContactRepository();
const submitContactMessageUseCase = new SubmitContactMessageUseCase(contactRepository);

/**
 * Handles POST /api/contact requests.
 *
 * @async
 * @param request - Express request object.
 * @param response - Express response object.
 * @returns Promise resolved after response is sent.
 */
export async function contactController(
  request: Request<unknown, unknown, ContactRequestBody>,
  response: Response
): Promise<void> {
  await submitContactMessageUseCase.execute({
    name: request.body.name,
    email: request.body.email,
    message: request.body.message,
    submittedAt: new Date().toISOString()
  });

  response.status(201).json({
    message: "Contact message sent successfully"
  });
}
