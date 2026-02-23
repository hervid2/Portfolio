import type { NextFunction, Request, Response } from "express";

/**
 * Handles uncaught API errors and returns safe responses.
 *
 * @param error - Unknown runtime error.
 * @param request - Express request object.
 * @param response - Express response object.
 * @param _next - Express next callback.
 */
export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction
): void {
  const isProduction = process.env.NODE_ENV === "production";
  const message = error instanceof Error ? error.message : "Unexpected server error";

  if (!isProduction) {
    console.error(`[API] ${request.method} ${request.originalUrl}`, error);
  }

  response.status(500).json({
    message: isProduction ? "Internal server error" : message
  });
}
