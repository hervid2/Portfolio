import { app } from "./app.js";
import { getEnvConfig } from "./config/env.js";
import { prisma } from "./infrastructure/database/prismaClient.js";
import { logger } from "./infrastructure/logging/logger.js";

const envConfig = getEnvConfig();

/**
 * Connects to the database, logs the runtime config and starts the HTTP server.
 *
 * @returns A promise that resolves once the server has been told to listen.
 */
async function bootstrap(): Promise<void> {
  await prisma.$connect();
  logger.info("[API] Database connection established");
  logger.info(
    `[API] Runtime config: env=${envConfig.nodeEnv}, ` +
      `origins=${envConfig.allowedOrigins.length}, ` +
      `mail=${envConfig.mailEnabled}, captcha=${envConfig.captchaEnabled}`
  );

  app.listen(envConfig.port, () => {
    logger.info(`[API] Server running on port ${envConfig.port}`);
  });
}

void bootstrap().catch((error: unknown) => {
  logger.error("[API] Failed to start server", error);
  process.exit(1);
});

/**
 * Closes the database connection before the process exits.
 *
 * @returns A promise that resolves once the connection is closed.
 */
async function shutdown(): Promise<void> {
  await prisma.$disconnect();
  logger.info("[API] Database connection closed");
}

process.on("SIGINT", () => {
  void shutdown().finally(() => process.exit(0));
});

process.on("SIGTERM", () => {
  void shutdown().finally(() => process.exit(0));
});
