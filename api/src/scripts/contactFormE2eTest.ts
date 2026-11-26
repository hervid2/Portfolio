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

/**
 * Fails when the API health endpoint does not answer with a 2xx status.
 *
 * @async
 * @returns Promise resolved when the API is healthy.
 */
async function checkHealth(): Promise<void> {
  const healthResponse = await fetch(`${API_BASE_URL}/health`);

  if (!healthResponse.ok) {
    throw new Error(`Health check failed with status ${healthResponse.status}`);
  }
}

/**
 * Submits a test contact message and fails when the API rejects it.
 *
 * @async
 * @param email - Unique sender email used later to find the stored row.
 * @returns The API response body.
 */
async function submitContact(email: string): Promise<ContactApiResponse> {
  const payload = {
    name: "E2E Contact Tester",
    email,
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

  return submitBody;
}

/**
 * Finds the latest stored message for `email`, deletes it and returns it.
 *
 * @async
 * @param email - Sender email of the submitted test message.
 * @returns The stored message, as it was before deletion.
 */
async function findAndDeleteSavedMessage(email: string) {
  const savedMessage = await prisma.contactMessage.findFirst({
    where: {
      email
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

  return savedMessage;
}

/**
 * Checks health, submits a contact message and confirms it was stored.
 *
 * @async
 * @returns Promise resolved when every step passes.
 */
async function run(): Promise<void> {
  await checkHealth();

  const uniqueEmail = `e2e.${Date.now()}@example.com`;
  const submitBody = await submitContact(uniqueEmail);
  const savedMessage = await findAndDeleteSavedMessage(uniqueEmail);

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
