import cors from "cors";
import express from "express";
import helmet from "helmet";
import { getEnvConfig } from "./config/env.js";
import { errorHandler } from "./interfaces/http/middlewares/errorHandler.js";
import { contactRoutes } from "./interfaces/http/routes/contactRoutes.js";

const envConfig = getEnvConfig();
export const app = express();

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
