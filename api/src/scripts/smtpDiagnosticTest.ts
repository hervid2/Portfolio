/**
 * SMTP diagnostic test.
 *
 * Runs SMTP connectivity/auth verification and sends one direct test email
 * using current environment variables from `.env`.
 *
 * Run (from `api` folder):
 * npm run test:smtp
 */
import nodemailer from "nodemailer";
import { getEnvConfig } from "../config/env.js";

async function run(): Promise<void> {
  const env = getEnvConfig();

  if (!env.mailEnabled) {
    throw new Error("MAIL_ENABLED is false. Set MAIL_ENABLED=true in .env to test SMTP sending.");
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  await transporter.verify();
  console.log("SMTP verify passed.");

  const info = await transporter.sendMail({
    from: env.mailFrom,
    to: env.mailTo,
    subject: "Portfolio SMTP Diagnostic Test",
    text: [
      "This is a direct SMTP diagnostic email from your portfolio API.",
      "",
      `From: ${env.mailFrom}`,
      `To: ${env.mailTo}`,
      `Host: ${env.smtpHost}:${env.smtpPort}`,
      `Secure: ${String(env.smtpSecure)}`,
      `Timestamp: ${new Date().toISOString()}`
    ].join("\n")
  });

  console.log("SMTP send completed.");
  console.log(`messageId: ${info.messageId}`);
  console.log(`accepted: ${info.accepted.join(",") || "<none>"}`);
  console.log(`rejected: ${info.rejected.join(",") || "<none>"}`);
  console.log(`response: ${info.response}`);
}

run().catch((error: unknown) => {
  console.error("SMTP diagnostic failed", error);
  process.exitCode = 1;
});
