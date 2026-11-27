import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import type { Express } from "express";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

/**
 * Regression test for BUG-api-trust-proxy (PE-02). Production runs behind one nginx on the
 * same host (`proxy_pass http://localhost:4000`), so the app must take the client IP from
 * `X-Forwarded-For` only when the TCP peer is loopback. Requests use invalid bodies: the rate
 * limiter runs before validation, so no request reaches the database, mail or CAPTCHA.
 */

/** Fake environment: mail and CAPTCHA off, so the no-op adapters are wired. */
const FAKE_ENV: Record<string, string> = {
  PORT: "4000",
  NODE_ENV: "test",
  ALLOWED_ORIGINS: "http://localhost:5173",
  DATABASE_URL: "mysql://user:pass@localhost:3306/portfolio",
  MAIL_ENABLED: "false",
  MAIL_FROM: "",
  MAIL_TO: "",
  SMTP_HOST: "",
  SMTP_PORT: "587",
  SMTP_SECURE: "false",
  SMTP_USER: "",
  SMTP_PASS: "",
  CAPTCHA_ENABLED: "false",
  TURNSTILE_SECRET_KEY: "",
  RESEND_API_KEY: ""
};

/** The contact limit: 5 requests per window per client IP (NFR-010). */
const CONTACT_LIMIT = 5;

let app: Express;
let server: Server;
let baseUrl: string;

/**
 * Posts an empty body to the contact route as if forwarded by nginx for `clientIp`.
 *
 * @param clientIp - Value nginx writes in `X-Forwarded-For`.
 * @returns The HTTP status code.
 */
async function postContactFrom(clientIp: string): Promise<number> {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": clientIp },
    body: "{}"
  });
  await response.arrayBuffer();
  return response.status;
}

beforeAll(async () => {
  for (const [key, value] of Object.entries(FAKE_ENV)) {
    vi.stubEnv(key, value);
  }
  ({ app } = await import("./app.js"));
  server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", () => resolve()));
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  // Unstub only at the end: the app module reads its config once, at import time.
  vi.unstubAllEnvs();
});

describe("BUG-api-trust-proxy app trust proxy setting", () => {
  it("BUG-api-trust-proxy trusts loopback peers (127.0.0.1, ::1) and no public IP", () => {
    const trustProxy = app.get("trust proxy fn") as (address: string, hop: number) => boolean;

    expect(trustProxy("127.0.0.1", 0)).toBe(true);
    expect(trustProxy("::1", 0)).toBe(true);
    expect(trustProxy("::ffff:127.0.0.1", 0)).toBe(true);
    expect(trustProxy("203.0.113.7", 0)).toBe(false);
    expect(trustProxy("10.0.0.1", 0)).toBe(false);
  });
});

describe("BUG-api-trust-proxy contact rate limiter keys on the forwarded client IP", () => {
  it("BUG-api-trust-proxy one IP over the limit gets 429; another IP is not blocked", async () => {
    const statuses: number[] = [];
    for (let attempt = 0; attempt < CONTACT_LIMIT; attempt += 1) {
      statuses.push(await postContactFrom("198.51.100.10"));
    }

    expect(statuses).toEqual(Array(CONTACT_LIMIT).fill(400));
    expect(await postContactFrom("198.51.100.10")).toBe(429);
    expect(await postContactFrom("198.51.100.20")).toBe(400);
  });
});
