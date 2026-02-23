import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";

/**
 * Creates an express middleware for request body validation.
 *
 * @param schema - Zod schema used to validate request payload.
 * @returns Express middleware function.
 */
export function validateRequest(schema: AnyZodObject) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const parsedResult = schema.safeParse(request.body);

    if (!parsedResult.success) {
      response.status(400).json({
        message: "Invalid request payload",
        issues: parsedResult.error.issues
      });
      return;
    }

    request.body = parsedResult.data;
    next();
  };
}
