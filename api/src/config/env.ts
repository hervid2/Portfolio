import dotenv from "dotenv";

dotenv.config();

interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  allowedOrigins: string[];
  databaseUrl: string;
  mailEnabled: boolean;
  mailFrom: string;
  mailTo: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  captchaEnabled: boolean;
  turnstileSecretKey: string;
}

function parseBoolean(value: string | undefined, fallbackValue: boolean): boolean {
  if (!value) {
    return fallbackValue;
  }

  return value.trim().toLowerCase() === "true";
}

function resolveRequiredString(value: string | undefined, key: string): string {
  const resolved = value?.trim();

  if (!resolved) {
    throw new Error(`Missing ${key} configuration`);
  }

  return resolved;
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
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const mailEnabled = parseBoolean(process.env.MAIL_ENABLED, false);
  const mailFrom = process.env.MAIL_FROM?.trim() || "";
  const mailTo = process.env.MAIL_TO?.trim() || "";
  const smtpHost = process.env.SMTP_HOST?.trim() || "";
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = parseBoolean(process.env.SMTP_SECURE, false);
  const smtpUser = process.env.SMTP_USER?.trim() || "";
  const smtpPass = process.env.SMTP_PASS?.trim() || "";
  const captchaEnabled = parseBoolean(process.env.CAPTCHA_ENABLED, false);
  const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY?.trim() || "";

  if (Number.isNaN(port) || port <= 0) {
    throw new Error("Invalid PORT configuration");
  }

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL configuration");
  }

  if (Number.isNaN(smtpPort) || smtpPort <= 0) {
    throw new Error("Invalid SMTP_PORT configuration");
  }

  if (mailEnabled) {
    resolveRequiredString(mailFrom, "MAIL_FROM");
    resolveRequiredString(mailTo, "MAIL_TO");
    resolveRequiredString(smtpHost, "SMTP_HOST");
    resolveRequiredString(smtpUser, "SMTP_USER");
    resolveRequiredString(smtpPass, "SMTP_PASS");
  }

  if (captchaEnabled) {
    resolveRequiredString(turnstileSecretKey, "TURNSTILE_SECRET_KEY");
  }

  return {
    port,
    nodeEnv: process.env.NODE_ENV || "development",
    allowedOrigins: parseAllowedOrigins(),
    databaseUrl,
    mailEnabled,
    mailFrom,
    mailTo,
    smtpHost,
    smtpPort,
    smtpSecure,
    smtpUser,
    smtpPass,
    captchaEnabled,
    turnstileSecretKey
  };
}
