import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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
 * Returns the project with the given id.
 *
 * @param id - The project id.
 * @returns The matching project.
 */
function projectById(id: string): Project {
  const project = projects.find((candidate) => candidate.id === id);
  if (!project) {
    throw new Error(`Unknown project id: ${id}`);
  }
  return project;
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
    expect(projectById("flyworkflow-incidents").stack).toEqual(
      APPROVED_STACK_BY_ID["flyworkflow-incidents"]
    );
  });

  it("AC-001-01 the FlyWorkFlow stack names the backend, data and AWS chips", () => {
    const stack = projectById("flyworkflow-incidents").stack;
    for (const label of ["Next.js", "NestJS", "Prisma", "PostgreSQL", "AWS Lambda", "Amazon S3"]) {
      expect(stack).toContain(label);
    }
  });
});

describe("AC-001-03 other project stacks", () => {
  it.each(["java-desktop-app", "sushi-burrito-spa", "the-slicing-edge"])(
    "AC-001-03 the %s stack equals the approved §6 list in order",
    (id) => {
      expect(projectById(id).stack).toEqual(APPROVED_STACK_BY_ID[id]);
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
    expect(projectById("the-slicing-edge").stack).toContain("LLM tool calling (Groq)");
  });
});

/** Approved EN/ES description per project id, byte for byte from spec 001 §7 K-10 … K-17. */
const APPROVED_DESCRIPTION_BY_ID: Record<string, { en: string; es: string }> = {
  // K-10 / K-11
  "java-desktop-app": {
    en: "The restaurant's first point-of-sale system, built in Java Swing over MySQL and in daily use Jun–Dec 2025; now the fallback for the web POS. Refactored in eight documented iterations to Spring Boot 3.3, Spring Data JPA, Flyway migrations, BCrypt, JUnit 5 and Mockito tests, and a self-contained installer (jpackage, jlink).",
    es: "El primer sistema POS del restaurante, construido en Java Swing sobre MySQL y en uso diario jun–dic 2025; hoy es el respaldo del POS web. Refactorizado en ocho iteraciones documentadas a Spring Boot 3.3, Spring Data JPA, migraciones Flyway, BCrypt, pruebas con JUnit 5 y Mockito, y un instalador autocontenido (jpackage, jlink)."
  },
  // K-12 / K-13
  "sushi-burrito-spa": {
    en: "Point-of-sale system in daily use at a restaurant in Bucaramanga, Colombia, since January 2026. Waiters take orders per table, the kitchen works from a live board over Socket.IO, and admins handle invoices and revenue reports. JWT auth with three roles; SPA on Vercel, API on a DigitalOcean droplet behind Nginx.",
    es: "Sistema POS en uso diario en un restaurante de Bucaramanga, Colombia, desde enero de 2026. Los meseros toman pedidos por mesa, la cocina trabaja desde un tablero en vivo con Socket.IO y los administradores gestionan facturas y reportes de ingresos. Autenticación JWT con tres roles; SPA en Vercel y API en un droplet de DigitalOcean detrás de Nginx."
  },
  // K-14 / K-15
  "the-slicing-edge": {
    en: "AI shopping assistant (Llama 3.3 70B on Groq) that uses server-side tool calling to search products, recommend items and track orders. E-commerce for premium kitchen knives with Stripe Checkout and webhook-confirmed orders, Auth.js v5 with Google OAuth and roles, and a Turborepo monorepo sharing Prisma and Zod between a Next.js 15 storefront and a Fastify 5 API.",
    es: "Asistente de compras con IA (Llama 3.3 70B en Groq) que usa tool calling en el servidor para buscar productos, recomendar artículos y rastrear pedidos. E-commerce de cuchillos de cocina premium con Stripe Checkout y pedidos confirmados por webhook, Auth.js v5 con Google OAuth y roles, y un monorepo Turborepo que comparte Prisma y Zod entre una tienda en Next.js 15 y una API en Fastify 5."
  },
  // K-16 / K-17
  "flyworkflow-incidents": {
    en: "Multi-tenant incident management for construction sites: a geolocated incident map (Mapbox GL, 2D/3D) and an 11-widget analytics dashboard. Next.js 16 on Vercel; a NestJS 11 API on AWS Lambda behind API Gateway, deployed with SAM; Prisma + PostgreSQL; browser uploads go straight to S3 through presigned URLs. Playwright E2E in CI against a real backend.",
    es: "Gestión de incidencias multi-tenant para obras de construcción: mapa de incidencias geolocalizadas (Mapbox GL, 2D/3D) y un dashboard analítico de 11 widgets. Next.js 16 en Vercel; API NestJS 11 en AWS Lambda detrás de API Gateway, desplegada con SAM; Prisma + PostgreSQL; las subidas van del navegador directo a S3 con URLs prefirmadas. E2E con Playwright en CI contra un backend real."
  }
};

/** Terms the FlyWorkFlow description must name in both languages (AC-001-02, PO-4). */
const FLYWORKFLOW_DESCRIPTION_TERMS = [
  "Next.js 16",
  "NestJS 11",
  "AWS Lambda",
  "API Gateway",
  "SAM",
  "Prisma",
  "PostgreSQL",
  "S3"
];

/** Terms the Slicing Edge first sentence must name in both languages (AC-001-06). */
const SLICING_EDGE_FIRST_SENTENCE_TERMS = ["Llama 3.3 70B", "Groq", "tool calling"];

/**
 * The stale FlyWorkFlow framework version (PO-4). Built from parts so that the task check
 * (grep for that version across frontend/src) only flags data, never this test.
 */
const STALE_NEXT_VERSION = ["Next.js", "14"].join(" ");

/**
 * Returns the first sentence of a text: everything up to the first period followed by
 * whitespace, so decimals such as "3.3" do not end the sentence.
 *
 * @param text - The text to split.
 * @returns The first sentence, including its final period.
 */
function firstSentence(text: string): string {
  return text.split(/(?<=\.)\s/)[0];
}

describe("AC-001-04 approved descriptions", () => {
  it.each(Object.keys(APPROVED_DESCRIPTION_BY_ID))(
    "AC-001-04 the %s description equals the approved EN/ES copy",
    (id) => {
      expect(projectById(id).description).toEqual(APPROVED_DESCRIPTION_BY_ID[id]);
    }
  );
});

describe("AC-001-02 no stale versions and FlyWorkFlow terms", () => {
  it("AC-001-02 no description or stack contains the stale Next.js version", () => {
    for (const project of projects) {
      const texts = [project.description.en, project.description.es, ...project.stack];
      for (const text of texts) {
        expect(text).not.toContain(STALE_NEXT_VERSION);
      }
    }
  });

  it.each(["en", "es"] as const)(
    "AC-001-02 the FlyWorkFlow %s description names the deployment terms",
    (language) => {
      const description = projectById("flyworkflow-incidents").description[language];
      for (const term of FLYWORKFLOW_DESCRIPTION_TERMS) {
        expect(description).toContain(term);
      }
    }
  );
});

describe("AC-001-06 Slicing Edge AI assistant first", () => {
  it.each([
    ["en", "AI shopping assistant"],
    ["es", "Asistente de compras con IA"]
  ] as const)("AC-001-06 the %s first sentence leads with the assistant", (language, start) => {
    const sentence = firstSentence(projectById("the-slicing-edge").description[language]);
    expect(sentence.slice(0, start.length)).toBe(start);
    for (const term of SLICING_EDGE_FIRST_SENTENCE_TERMS) {
      expect(sentence).toContain(term);
    }
  });
});

/** Shape of the machine-readable summary in `docs/discovery/demo-audit.md` (spec 001 §8.2). */
interface AuditSummary {
  auditDate: string;
  verifiedUsernames: Record<string, string[]>;
  ownerExceptionUsernames: Record<string, string[]>;
  coldStartProjectIds: string[];
}

/** Absolute path of the demo audit deliverable (spec 001 §8.2). */
const AUDIT_PATH = resolve(__dirname, "../../../docs/discovery/demo-audit.md");

/** The six §8.2 section headings, in order (AC-001-13). */
const AUDIT_HEADINGS = [
  "## 1. Header",
  "## 2. Method",
  "## 3. Per-project results",
  "## 4. Credentials",
  "## 5. Findings and follow-ups for Hernán",
  "## 6. Machine-readable summary"
];

/** The exact keys of the summary block (plan §4: extra or missing keys fail). */
const AUDIT_SUMMARY_KEYS = [
  "auditDate",
  "ownerExceptionUsernames",
  "coldStartProjectIds",
  "verifiedUsernames"
].sort();

/** The one owner-exception credential, unchanged (OQ-001-15, AC-001-15). */
const OWNER_EXCEPTION_CREDENTIAL = {
  role: { en: "Super Admin", es: "Superadministrador" },
  username: "camila.rojas@flyworkflow.io",
  password: "FlyWorkFlow2026!"
};

/** The audit document's text. */
const auditText = readFileSync(AUDIT_PATH, "utf8");

/**
 * Parses the last fenced `json` block of the audit document (plan §4).
 *
 * @param text - The audit document's text.
 * @returns The parsed summary object.
 */
function parseAuditSummary(text: string): AuditSummary {
  const blocks = [...text.matchAll(/```json\r?\n([\s\S]*?)```/g)];
  const last = blocks.at(-1);
  if (!last) {
    throw new Error("No json block in demo-audit.md");
  }
  return JSON.parse(last[1]) as AuditSummary;
}

/** The parsed audit summary. */
const auditSummary = parseAuditSummary(auditText);

/**
 * Returns the published usernames of a project, sorted.
 *
 * @param project - The project.
 * @returns Its credential usernames, sorted.
 */
function publishedUsernames(project: Project): (string | null)[] {
  return (project.demoCredentials ?? []).map((credential) => credential.username).sort();
}

describe("AC-001-13 demo audit document", () => {
  it("AC-001-13 has the six §8.2 headings in order", () => {
    const lines = auditText.split(/\r?\n/).map((line) => line.trimEnd());
    const headings = lines.filter((line) => line.startsWith("## "));
    expect(headings).toEqual(AUDIT_HEADINGS);
  });

  it("AC-001-13 the summary has exactly the §8.2 keys and a valid auditDate", () => {
    expect(Object.keys(auditSummary).sort()).toEqual(AUDIT_SUMMARY_KEYS);
    expect(auditSummary.auditDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const parsed = new Date(`${auditSummary.auditDate}T00:00:00Z`);
    expect(parsed.toISOString().slice(0, 10)).toBe(auditSummary.auditDate);
  });

  it("AC-001-13 verifiedUsernames has an entry for every project id", () => {
    const ids = projects.map((project) => project.id).sort();
    expect(Object.keys(auditSummary.verifiedUsernames).sort()).toEqual(ids);
  });
});

describe("AC-001-14 published credentials match the audit", () => {
  it.each(projects.map((project) => project.id))(
    "AC-001-14 %s publishes exactly the verified plus owner-exception usernames",
    (id) => {
      const expected = [
        ...(auditSummary.verifiedUsernames[id] ?? []),
        ...(auditSummary.ownerExceptionUsernames[id] ?? [])
      ].sort();
      expect(publishedUsernames(projectById(id))).toEqual(expected);
    }
  );
});

describe("AC-001-15 owner-exception credential", () => {
  it("AC-001-15 the exception set is exactly the FlyWorkFlow Super Admin", () => {
    expect(auditSummary.ownerExceptionUsernames).toEqual({
      "flyworkflow-incidents": [OWNER_EXCEPTION_CREDENTIAL.username]
    });
  });

  it("AC-001-15 the Super Admin is published with its role label and password unchanged", () => {
    const credentials = projectById("flyworkflow-incidents").demoCredentials ?? [];
    const superAdmin = credentials.find(
      (credential) => credential.username === OWNER_EXCEPTION_CREDENTIAL.username
    );
    expect(superAdmin).toEqual(OWNER_EXCEPTION_CREDENTIAL);
  });

  it("AC-001-15 the owner-exception username is not in verifiedUsernames", () => {
    const verified = Object.values(auditSummary.verifiedUsernames).flat();
    expect(verified).not.toContain(OWNER_EXCEPTION_CREDENTIAL.username);
  });
});

describe("AC-001-16 cold-start notice flags", () => {
  it.each(projects.map((project) => project.id))(
    "AC-001-16 %s sets coldStartNotice exactly when listed in coldStartProjectIds",
    (id) => {
      const expected = auditSummary.coldStartProjectIds.includes(id);
      expect(projectById(id).coldStartNotice === true).toBe(expected);
    }
  );

  it("AC-001-16 every coldStartProjectIds entry is a known project id", () => {
    const ids = projects.map((project) => project.id);
    for (const id of auditSummary.coldStartProjectIds) {
      expect(ids).toContain(id);
    }
  });
});
