/**
 * End-to-end test for the contact form API flow.
 *
 * Prerequisites:
 * 1) API server running locally on http://localhost:4000
 * 2) DATABASE_URL configured in `.env`
 *
 * Run in terminal (from the `api` folder) with one command:
 * npm run test:e2e
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_BASE_URL = process.env.E2E_API_BASE_URL?.trim() || "http://localhost:4000";

interface ContactApiResponse {
  message: string;
}

async function run(): Promise<void> {
  const healthResponse = await fetch(`${API_BASE_URL}/health`);

  if (!healthResponse.ok) {
    throw new Error(`Health check failed with status ${healthResponse.status}`);
  }

  const uniqueEmail = `e2e.${Date.now()}@example.com`;
  const payload = {
    name: "E2E Contact Tester",
    email: uniqueEmail,
    message: "This is an automated E2E contact test message from the API suite.",
    captchaToken: "e2e-captcha-token"
  };

  const submitResponse = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const submitBody = (await submitResponse.json()) as ContactApiResponse;

  if (!submitResponse.ok) {
    throw new Error(`Contact submit failed (${submitResponse.status}): ${submitBody.message}`);
  }

  const savedMessage = await prisma.contactMessage.findFirst({
    where: {
      email: uniqueEmail
    },
    orderBy: {
      id: "desc"
    }
  });

  if (!savedMessage) {
    throw new Error("Contact message was accepted by API but not found in database");
  }

  await prisma.contactMessage.delete({
    where: {
      id: savedMessage.id
    }
  });

  console.log("E2E contact test passed:");
  console.log(`- API response: ${submitBody.message}`);
  console.log(`- Persisted email: ${savedMessage.email}`);
  console.log(`- Cleanup: deleted test message ID ${savedMessage.id.toString()}`);
}

run()
  .catch((error: unknown) => {
    console.error("E2E contact test failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
