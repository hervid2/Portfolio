import { describe, expect, it } from "vitest";

import { projects } from "@/data/projects";
import type { Project, ProjectKind } from "@/types/project";

/** Expected kind per project id, from the profile README kind table (BR-006, spec §5). */
const EXPECTED_KIND_BY_ID: Record<string, ProjectKind> = {
  "java-desktop-app": "client",
  "sushi-burrito-spa": "client",
  "the-slicing-edge": "personal",
  "flyworkflow-incidents": "personal"
};

/** Approved stack per project id, in order, from spec 001 §6 (OQ-001-02, ASM-001-11). */
const APPROVED_STACK_BY_ID: Record<string, string[]> = {
  "java-desktop-app": [
    "Java",
    "Spring Boot",
    "Swing",
    "Spring Data JPA",
    "Flyway",
    "MySQL",
    "JUnit 5"
  ],
  "sushi-burrito-spa": [
    "Vanilla JS",
    "Vite",
    "Node.js",
    "Express",
    "Sequelize",
    "MySQL",
    "Socket.IO",
    "Nginx",
    "DigitalOcean"
  ],
  "the-slicing-edge": [
    "Next.js",
    "Fastify",
    "TypeScript",
    "Prisma",
    "PostgreSQL",
    "LLM tool calling (Groq)",
    "Stripe",
    "Upstash Redis",
    "Turborepo",
    "GitHub Actions"
  ],
  "flyworkflow-incidents": [
    "Next.js",
    "NestJS",
    "TypeScript",
    "Prisma",
    "PostgreSQL",
    "AWS Lambda",
    "Amazon S3",
    "Mapbox GL",
    "Playwright",
    "GitHub Actions"
  ]
};

/** Maximum number of stack chips per card (spec 001 §6, ASM-001-02). */
const MAX_STACK_CHIPS = 10;

/**
 * Returns the stack of the project with the given id.
 *
 * @param id - The project id.
 * @returns The project's stack labels.
 */
function stackOf(id: string): string[] {
  const project = projects.find((candidate) => candidate.id === id);
  if (!project) {
    throw new Error(`Unknown project id: ${id}`);
  }
  return project.stack;
}

/**
 * Typed fixture with every required `Project` field except `kind`. If `kind` ever becomes
 * optional, the directive below is unused and `npm run typecheck` fails (AC-001-08, CL-12).
 */
// @ts-expect-error -- kind is required (AC-001-08)
const fixtureWithoutKind: Project = {
  id: "fixture-without-kind",
  title: "Fixture",
  description: { en: "Fixture description", es: "Descripción de prueba" },
  stack: [],
  category: "Web App",
  imageUrl: "/assets/images/projects/fixture.webp",
  liveDemoUrl: null,
  codeUrl: null
};

describe("AC-001-08 project kind", () => {
  it("AC-001-08 each project id maps to its BR-006 kind", () => {
    const kindById = Object.fromEntries(projects.map((project) => [project.id, project.kind]));
    expect(kindById).toEqual(EXPECTED_KIND_BY_ID);
  });

  it("AC-001-08 a Project fixture without kind is a type error", () => {
    expect(fixtureWithoutKind.id).toBe("fixture-without-kind");
  });
});

describe("AC-001-01 FlyWorkFlow stack", () => {
  it("AC-001-01 the FlyWorkFlow stack equals the approved §6 list in order", () => {
    expect(stackOf("flyworkflow-incidents")).toEqual(APPROVED_STACK_BY_ID["flyworkflow-incidents"]);
  });

  it("AC-001-01 the FlyWorkFlow stack names the backend, data and AWS chips", () => {
    const stack = stackOf("flyworkflow-incidents");
    for (const label of ["Next.js", "NestJS", "Prisma", "PostgreSQL", "AWS Lambda", "Amazon S3"]) {
      expect(stack).toContain(label);
    }
  });
});

describe("AC-001-03 other project stacks", () => {
  it.each(["java-desktop-app", "sushi-burrito-spa", "the-slicing-edge"])(
    "AC-001-03 the %s stack equals the approved §6 list in order",
    (id) => {
      expect(stackOf(id)).toEqual(APPROVED_STACK_BY_ID[id]);
    }
  );

  it("AC-001-03 every project has at most 10 stack chips", () => {
    for (const project of projects) {
      expect(project.stack.length).toBeLessThanOrEqual(MAX_STACK_CHIPS);
    }
  });
});

describe("AC-001-07 Slicing Edge LLM chip", () => {
  it("AC-001-07 the Slicing Edge stack contains 'LLM tool calling (Groq)'", () => {
    expect(stackOf("the-slicing-edge")).toContain("LLM tool calling (Groq)");
  });
});
