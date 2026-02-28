import { app } from "./app.js";
import { getEnvConfig } from "./config/env.js";
import { prisma } from "./infrastructure/database/prismaClient.js";

const envConfig = getEnvConfig();

async function bootstrap(): Promise<void> {
  await prisma.$connect();
  console.info("[API] Database connection established");
  console.info(
    `[API] Runtime config: env=${envConfig.nodeEnv}, origins=${envConfig.allowedOrigins.length}, mail=${envConfig.mailEnabled}, captcha=${envConfig.captchaEnabled}`
  );

  app.listen(envConfig.port, () => {
    console.info(`[API] Server running on port ${envConfig.port}`);
  });
}

void bootstrap().catch((error: unknown) => {
  console.error("[API] Failed to start server", error);
  process.exit(1);
});

async function shutdown(): Promise<void> {
  await prisma.$disconnect();
  console.info("[API] Database connection closed");
}

process.on("SIGINT", () => {
  void shutdown().finally(() => process.exit(0));
});

process.on("SIGTERM", () => {
  void shutdown().finally(() => process.exit(0));
});
