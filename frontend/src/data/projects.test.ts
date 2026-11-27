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
