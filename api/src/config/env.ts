import dotenv from "dotenv";

dotenv.config();

interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  allowedOrigins: string[];
}

/**
 * Parses ALLOWED_ORIGINS from environment variables.
 *
 * @returns A sanitized list of allowed CORS origins.
 */
function parseAllowedOrigins(): string[] {
  const rawOrigins = process.env.ALLOWED_ORIGINS || "http://localhost:5173";

  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

/**
 * Reads and validates runtime environment configuration.
 *
 * @returns Validated environment config object.
 */
export function getEnvConfig(): EnvironmentConfig {
  const port = Number(process.env.PORT || 4000);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error("Invalid PORT configuration");
  }

  return {
    port,
    nodeEnv: process.env.NODE_ENV || "development",
    allowedOrigins: parseAllowedOrigins()
  };
}
