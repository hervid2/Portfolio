import { Router } from "express";
import { contactController } from "../controllers/contactController.js";
import { contactRateLimiter } from "../middlewares/rateLimiter.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { contactSchema } from "../validators/contactSchema.js";

export const contactRoutes = Router();

contactRoutes.post(
  "/contact",
  contactRateLimiter,
  validateRequest(contactSchema),
  async (request, response, next) => {
    try {
      await contactController(request, response);
    } catch (error) {
      next(error);
    }
  }
);
