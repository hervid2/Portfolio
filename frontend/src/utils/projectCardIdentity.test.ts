import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import { buildCardLayoutId } from "./projectCardIdentity";

describe("AC-000-05(c) buildCardLayoutId", () => {
  it("AC-000-05(c) returns 'project-card-<id>'", () => {
    expect(buildCardLayoutId("sushi-burrito-spa")).toBe("project-card-sushi-burrito-spa");
  });

  it("AC-000-05(c) is deterministic for the same id", () => {
    for (const project of projects) {
      expect(buildCardLayoutId(project.id)).toBe(buildCardLayoutId(project.id));
    }
  });

  it("AC-000-05(c) yields one unique layout id per project", () => {
    const layoutIds = projects.map((project) => buildCardLayoutId(project.id));
    expect(new Set(layoutIds).size).toBe(projects.length);
  });
});
