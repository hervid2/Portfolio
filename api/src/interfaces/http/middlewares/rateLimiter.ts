import rateLimit from "express-rate-limit";

export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP. Please try again later."
  }
});
