import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getEnvConfig } from "./env.js";

/**
 * Characterization test of `getEnvConfig` before the D-1 split (plan §1.6, R-5).
 * Every key the function reads is stubbed, so a local `api/.env` never leaks in (R-9).
 * All values are fake placeholders.
 */

/** Every environment key `getEnvConfig` reads. */
const ENV_KEYS = [
  "PORT",
  "NODE_ENV",
  "ALLOWED_ORIGINS",
  "DATABASE_URL",
  "MAIL_ENABLED",
  "MAIL_FROM",
  "MAIL_TO",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "CAPTCHA_ENABLED",
  "TURNSTILE_SECRET_KEY",
  "RESEND_API_KEY"
] as const;

type EnvKey = (typeof ENV_KEYS)[number];

/** Minimal environment: only the one required key. */
const MINIMAL_ENV: Partial<Record<EnvKey, string>> = {
  DATABASE_URL: "mysql://user:pass@localhost:3306/portfolio"
};

/** A fully populated environment with mail and captcha on, padded with spaces. */
const FULL_ENV: Record<EnvKey, string> = {
  PORT: "8080",
  NODE_ENV: "production",
  ALLOWED_ORIGINS: " https://a.example.com , ,https://b.example.com ",
  DATABASE_URL: "  mysql://user:pass@db:3306/portfolio  ",
  MAIL_ENABLED: " TRUE ",
  MAIL_FROM: " from@example.com ",
  MAIL_TO: " to@example.com ",
  SMTP_HOST: " smtp.example.com ",
  SMTP_PORT: "465",
  SMTP_SECURE: "true",
  SMTP_USER: " smtp-user ",
  SMTP_PASS: " smtp-pass ",
  CAPTCHA_ENABLED: "True",
  TURNSTILE_SECRET_KEY: " turnstile-secret ",
  RESEND_API_KEY: " resend-key "
};

/**
 * Stubs every key `getEnvConfig` reads: keys in `values` get that value, the rest are unset.
 *
 * @param values - Environment values to apply.
 */
function stubEnvironment(values: Partial<Record<EnvKey, string>>): void {
  for (const key of ENV_KEYS) {
    vi.stubEnv(key, values[key]);
  }
}

describe("getEnvConfig (D-1 characterization)", () => {
  beforeEach(() => {
    stubEnvironment(MINIMAL_ENV);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("applies the defaults when only DATABASE_URL is set", () => {
    expect(getEnvConfig()).toEqual({
      port: 4000,
      nodeEnv: "development",
      allowedOrigins: ["http://localhost:5173"],
      databaseUrl: "mysql://user:pass@localhost:3306/portfolio",
      mailEnabled: false,
      mailFrom: "",
      mailTo: "",
      smtpHost: "",
      smtpPort: 587,
      smtpSecure: false,
      smtpUser: "",
      smtpPass: "",
      captchaEnabled: false,
      turnstileSecretKey: "",
      resendApiKey: ""
    });
  });

  it("treats empty strings like unset keys for the defaults", () => {
    stubEnvironment({ ...MINIMAL_ENV, PORT: "", SMTP_PORT: "", ALLOWED_ORIGINS: "" });

    const config = getEnvConfig();

    expect(config.port).toBe(4000);
    expect(config.smtpPort).toBe(587);
    expect(config.allowedOrigins).toEqual(["http://localhost:5173"]);
  });

  it("parses and trims a fully populated environment", () => {
    stubEnvironment(FULL_ENV);

    expect(getEnvConfig()).toEqual({
      port: 8080,
      nodeEnv: "production",
      allowedOrigins: ["https://a.example.com", "https://b.example.com"],
      databaseUrl: "mysql://user:pass@db:3306/portfolio",
      mailEnabled: true,
      mailFrom: "from@example.com",
      mailTo: "to@example.com",
      smtpHost: "smtp.example.com",
      smtpPort: 465,
      smtpSecure: true,
      smtpUser: "smtp-user",
      smtpPass: "smtp-pass",
      captchaEnabled: true,
      turnstileSecretKey: "turnstile-secret",
      resendApiKey: "resend-key"
    });
  });

  it.each(["false", "yes", "1", "on"])('treats flag value "%s" as disabled', (flag) => {
    stubEnvironment({ ...MINIMAL_ENV, MAIL_ENABLED: flag, SMTP_SECURE: flag });

    const config = getEnvConfig();

    expect(config.mailEnabled).toBe(false);
    expect(config.smtpSecure).toBe(false);
  });

  it.each(["", "   "])('fails fast when DATABASE_URL is "%s"', (databaseUrl) => {
    stubEnvironment({ DATABASE_URL: databaseUrl });

    expect(() => getEnvConfig()).toThrow("Missing DATABASE_URL configuration");
  });

  it("fails fast when DATABASE_URL is unset", () => {
    stubEnvironment({});

    expect(() => getEnvConfig()).toThrow("Missing DATABASE_URL configuration");
  });

  it.each(["0", "-1", "abc"])('fails fast on PORT "%s"', (port) => {
    stubEnvironment({ ...MINIMAL_ENV, PORT: port });

    expect(() => getEnvConfig()).toThrow("Invalid PORT configuration");
  });

  it("checks PORT before DATABASE_URL", () => {
    stubEnvironment({ PORT: "0" });

    expect(() => getEnvConfig()).toThrow("Invalid PORT configuration");
  });

  it.each(["0", "-25", "abc"])('fails fast on SMTP_PORT "%s"', (smtpPort) => {
    stubEnvironment({ ...MINIMAL_ENV, SMTP_PORT: smtpPort });

    expect(() => getEnvConfig()).toThrow("Invalid SMTP_PORT configuration");
  });

  it.each(["MAIL_FROM", "MAIL_TO", "SMTP_HOST", "SMTP_USER", "SMTP_PASS"] as const)(
    "fails fast when mail is on without %s",
    (key) => {
      stubEnvironment({ ...FULL_ENV, [key]: "  " });

      expect(() => getEnvConfig()).toThrow(`Missing ${key} configuration`);
    }
  );

  it("does not require mail settings when mail is off", () => {
    stubEnvironment({ ...FULL_ENV, MAIL_ENABLED: "false", SMTP_HOST: "" });

    expect(getEnvConfig().smtpHost).toBe("");
  });

  it("fails fast when captcha is on without TURNSTILE_SECRET_KEY", () => {
    stubEnvironment({ ...MINIMAL_ENV, CAPTCHA_ENABLED: "true" });

    expect(() => getEnvConfig()).toThrow("Missing TURNSTILE_SECRET_KEY configuration");
  });

  it("does not require TURNSTILE_SECRET_KEY when captcha is off", () => {
    stubEnvironment({ ...FULL_ENV, CAPTCHA_ENABLED: "false", TURNSTILE_SECRET_KEY: "" });

    expect(getEnvConfig().turnstileSecretKey).toBe("");
  });
});
