/**
 * Persistence smoke test for Prisma/MySQL.
 *
 * Run in terminal (from the `api` folder) with one command:
 * npx tsx src/scripts/persistenceSmokeTest.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type TestResult = {
  name: string;
  ok: boolean;
  details?: string;
};

type CheckRunner = (name: string, action: () => Promise<void>) => Promise<void>;

/**
 * Builds a check runner that records each named check into `results`.
 *
 * @param results - List that receives one entry per check, in run order.
 * @returns Runner: a thrown error in the check body marks it as failed.
 */
function createCheckRunner(results: TestResult[]): CheckRunner {
  return async (name, action) => {
    try {
      await action();
      results.push({ name, ok: true });
    } catch (error) {
      const details = error instanceof Error ? error.message : "Unknown error";
      results.push({ name, ok: false, details });
    }
  };
}

/**
 * Counts the rows of every table, one check per model.
 *
 * @async
 * @param test - Check runner that records each result.
 * @returns Promise resolved when every count check is recorded.
 */
async function runCountChecks(test: CheckRunner): Promise<void> {
  await test("Count Language", async () => {
    await prisma.language.count();
  });
  await test("Count ProjectCategory", async () => {
    await prisma.projectCategory.count();
  });
  await test("Count Project", async () => {
    await prisma.project.count();
  });
  await test("Count ProjectDescription", async () => {
    await prisma.projectDescription.count();
  });
  await test("Count Technology", async () => {
    await prisma.technology.count();
  });
  await test("Count ProjectTechnology", async () => {
    await prisma.projectTechnology.count();
  });
  await test("Count Skill", async () => {
    await prisma.skill.count();
  });
  await test("Count SocialPlatform", async () => {
    await prisma.socialPlatform.count();
  });
  await test("Count ProfileSocialLink", async () => {
    await prisma.profileSocialLink.count();
  });
  await test("Count ContactMessage", async () => {
    await prisma.contactMessage.count();
  });
}

/**
 * Reads a project with its relations loaded.
 *
 * @async
 * @param test - Check runner that records each result.
 * @returns Promise resolved when both relation checks are recorded.
 */
async function runRelationChecks(test: CheckRunner): Promise<void> {
  await test("Project with category + descriptions(language)", async () => {
    await prisma.project.findFirst({
      include: {
        category: true,
        descriptions: {
          include: {
            language: true
          }
        }
      }
    });
  });

  await test("Project with technologies(technology)", async () => {
    await prisma.project.findFirst({
      include: {
        technologies: {
          include: {
            technology: true
          }
        }
      }
    });
  });
}

/**
 * Creates, reads back and deletes one contact message.
 *
 * @async
 * @param test - Check runner that records each result.
 * @returns Promise resolved when the three round-trip checks are recorded.
 */
async function runContactRoundTrip(test: CheckRunner): Promise<void> {
  let createdContactId: bigint | null = null;

  await test("Create ContactMessage", async () => {
    const created = await prisma.contactMessage.create({
      data: {
        name: "Persistence Smoke Test",
        email: "smoke.test@example.com",
        message: "Automated smoke test for persistence layer."
      }
    });

    createdContactId = created.id;
  });

  await test("Read created ContactMessage", async () => {
    if (!createdContactId) {
      throw new Error("No created contact id available");
    }

    const found = await prisma.contactMessage.findUnique({ where: { id: createdContactId } });

    if (!found) {
      throw new Error("Created contact message not found");
    }
  });

  await test("Delete created ContactMessage", async () => {
    if (!createdContactId) {
      throw new Error("No created contact id available");
    }

    await prisma.contactMessage.delete({ where: { id: createdContactId } });
  });
}

/**
 * Prints one PASS/FAIL line per check and the summary; sets a failing exit code if needed.
 *
 * @param results - Recorded checks, in run order.
 * @returns Nothing; the output goes to the console.
 */
function printSummary(results: TestResult[]): void {
  const failed = results.filter((result) => !result.ok);

  console.log("\n=== Persistence Smoke Test Results ===");

  for (const result of results) {
    if (result.ok) {
      console.log(`PASS - ${result.name}`);
    } else {
      console.log(`FAIL - ${result.name} | ${result.details}`);
    }
  }

  console.log(`\nSummary: ${results.length - failed.length}/${results.length} passed`);

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

/**
 * Runs the persistence checks and prints a pass/fail summary.
 *
 * @async
 * @returns Promise resolved when the summary is printed.
 */
async function run(): Promise<void> {
  const results: TestResult[] = [];
  const test = createCheckRunner(results);

  await runCountChecks(test);
  await runRelationChecks(test);
  await runContactRoundTrip(test);
  printSummary(results);
}

run()
  .catch((error: unknown) => {
    console.error("Unexpected error in persistence smoke test", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
