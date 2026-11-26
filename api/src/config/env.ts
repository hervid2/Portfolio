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
  resendApiKey: string;
}

/**
 * Parses an environment flag; only "true" (any case, trimmed) counts as enabled.
 *
 * @param value - Raw environment value.
 * @param fallbackValue - Value used when the variable is unset or empty.
 * @returns The parsed boolean.
 */
function parseBoolean(value: string | undefined, fallbackValue: boolean): boolean {
  if (!value) {
    return fallbackValue;
  }

  return value.trim().toLowerCase() === "true";
}

/**
 * Returns a trimmed required setting or fails fast when it is missing.
 *
 * @param value - Raw environment value.
 * @param key - Variable name used in the error message.
 * @returns The trimmed value.
 * @throws Error when the value is missing or blank.
 */
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
 * Reads an optional string setting, trimmed, or an empty string when it is unset.
 *
 * @param value - Raw environment value.
 * @returns The trimmed value or "".
 */
function readOptionalString(value: string | undefined): string {
  return value?.trim() || "";
}

/**
 * Parses a positive port number or fails fast when it is invalid.
 *
 * @param value - Raw environment value.
 * @param fallbackValue - Port used when the variable is unset or empty.
 * @param key - Variable name used in the error message.
 * @returns The parsed port.
 * @throws Error when the value is not a positive number.
 */
function parsePort(value: string | undefined, fallbackValue: number, key: string): number {
  const port = Number(value || fallbackValue);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid ${key} configuration`);
  }

  return port;
}

type ServerSettings = Pick<
  EnvironmentConfig,
  "port" | "nodeEnv" | "allowedOrigins" | "databaseUrl"
>;

type MailSettings = Pick<
  EnvironmentConfig,
  | "mailEnabled"
  | "mailFrom"
  | "mailTo"
  | "smtpHost"
  | "smtpPort"
  | "smtpSecure"
  | "smtpUser"
  | "smtpPass"
  | "resendApiKey"
>;

type CaptchaSettings = Pick<EnvironmentConfig, "captchaEnabled" | "turnstileSecretKey">;

/**
 * Reads and validates the server settings (PORT first, then DATABASE_URL).
 *
 * @returns The server part of the environment config.
 * @throws Error when PORT is invalid or DATABASE_URL is missing.
 */
function readServerSettings(): ServerSettings {
  const port = parsePort(process.env.PORT, 4000, "PORT");

  return {
    port,
    nodeEnv: process.env.NODE_ENV || "development",
    allowedOrigins: parseAllowedOrigins(),
    databaseUrl: resolveRequiredString(process.env.DATABASE_URL, "DATABASE_URL")
  };
}

/**
 * Reads the mail settings; when mail is enabled, its SMTP fields are required.
 *
 * @returns The mail part of the environment config.
 * @throws Error when SMTP_PORT is invalid or a required mail setting is missing.
 */
function readMailSettings(): MailSettings {
  const settings: MailSettings = {
    mailEnabled: parseBoolean(process.env.MAIL_ENABLED, false),
    mailFrom: readOptionalString(process.env.MAIL_FROM),
    mailTo: readOptionalString(process.env.MAIL_TO),
    smtpHost: readOptionalString(process.env.SMTP_HOST),
    smtpPort: parsePort(process.env.SMTP_PORT, 587, "SMTP_PORT"),
    smtpSecure: parseBoolean(process.env.SMTP_SECURE, false),
    smtpUser: readOptionalString(process.env.SMTP_USER),
    smtpPass: readOptionalString(process.env.SMTP_PASS),
    resendApiKey: readOptionalString(process.env.RESEND_API_KEY)
  };

  if (settings.mailEnabled) {
    resolveRequiredString(settings.mailFrom, "MAIL_FROM");
    resolveRequiredString(settings.mailTo, "MAIL_TO");
    resolveRequiredString(settings.smtpHost, "SMTP_HOST");
    resolveRequiredString(settings.smtpUser, "SMTP_USER");
    resolveRequiredString(settings.smtpPass, "SMTP_PASS");
  }

  return settings;
}

/**
 * Reads the CAPTCHA settings; when CAPTCHA is enabled, the Turnstile secret is required.
 *
 * @returns The CAPTCHA part of the environment config.
 * @throws Error when CAPTCHA is enabled without TURNSTILE_SECRET_KEY.
 */
function readCaptchaSettings(): CaptchaSettings {
  const captchaEnabled = parseBoolean(process.env.CAPTCHA_ENABLED, false);
  const turnstileSecretKey = readOptionalString(process.env.TURNSTILE_SECRET_KEY);

  if (captchaEnabled) {
    resolveRequiredString(turnstileSecretKey, "TURNSTILE_SECRET_KEY");
  }

  return { captchaEnabled, turnstileSecretKey };
}

/**
 * Reads and validates runtime environment configuration.
 *
 * Validation order (and so the first error thrown): PORT, DATABASE_URL, SMTP_PORT,
 * the mail settings, then the CAPTCHA settings.
 *
 * @returns Validated environment config object.
 */
export function getEnvConfig(): EnvironmentConfig {
  const server = readServerSettings();
  const mail = readMailSettings();
  const captcha = readCaptchaSettings();

  return {
    port: server.port,
    nodeEnv: server.nodeEnv,
    allowedOrigins: server.allowedOrigins,
    databaseUrl: server.databaseUrl,
    mailEnabled: mail.mailEnabled,
    mailFrom: mail.mailFrom,
    mailTo: mail.mailTo,
    smtpHost: mail.smtpHost,
    smtpPort: mail.smtpPort,
    smtpSecure: mail.smtpSecure,
    smtpUser: mail.smtpUser,
    smtpPass: mail.smtpPass,
    captchaEnabled: captcha.captchaEnabled,
    turnstileSecretKey: captcha.turnstileSecretKey,
    resendApiKey: mail.resendApiKey
  };
}
