import cors from "cors";
import express from "express";
import helmet from "helmet";
import { getEnvConfig } from "./config/env.js";
import { errorHandler } from "./interfaces/http/middlewares/errorHandler.js";
import { contactRoutes } from "./interfaces/http/routes/contactRoutes.js";

const envConfig = getEnvConfig();
export const app = express();

// Production: one nginx on the same host proxies to localhost:4000 and sets X-Forwarded-For.
// Trust only loopback peers, so request.ip is the visitor (rate limit, Turnstile remoteip).
// Fail-safe: a non-loopback peer is never trusted. Revisit if the proxy topology changes.
app.set("trust proxy", "loopback");

app.use(helmet());
app.use(
  cors({
    origin: envConfig.allowedOrigins
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/health", (_request, response) => {
  response.status(200).json({ message: "API is healthy" });
});

app.use("/api", contactRoutes);
app.use(errorHandler);
