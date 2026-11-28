import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "../data/projects";
import { hasTechIcon, resolveTechIconPath } from "./techIcons";

/** Absolute path of `frontend/public`, where the icon URLs are served from. */
const publicDir = resolve(__dirname, "../../public");

/**
 * Maps a public icon URL (e.g. `/assets/icons/tech/vite.svg`) to its file on disk.
 *
 * @param iconUrl - Root-relative icon URL from the icon map.
 * @returns Absolute file path inside `frontend/public`.
 */
function toPublicFile(iconUrl: string): string {
  return `${publicDir}${iconUrl}`;
}

/** The 12 brand labels from plan §1.3 that use Simple Icons glyphs (T-04). */
const simpleIconsLabels = [
  "NestJS",
  "Prisma",
  "Upstash Redis",
  "Turborepo",
  "Vite",
  "Sequelize",
  "Socket.IO",
  "Nginx",
  "DigitalOcean",
  "Spring Data JPA",
  "Flyway",
  "JUnit 5"
] as const;

describe("AC-001-05 techIcons brand labels (Simple Icons)", () => {
  it.each(simpleIconsLabels)("AC-001-05 '%s' is an explicit icon-map key", (label) => {
    expect(hasTechIcon(label)).toBe(true);
  });

  it.each(simpleIconsLabels)("AC-001-05 '%s' light and dark files exist", (label) => {
    const { iconPath, iconPathDark } = resolveTechIconPath(label);
    expect(iconPathDark).toBeDefined();
    expect(existsSync(toPublicFile(iconPath))).toBe(true);
    expect(existsSync(toPublicFile(iconPathDark ?? ""))).toBe(true);
  });

  it.each(simpleIconsLabels)("AC-001-05 '%s' dark file sets fill=\"white\"", (label) => {
    const { iconPathDark } = resolveTechIconPath(label);
    const svg = readFileSync(toPublicFile(iconPathDark ?? ""), "utf8");
    expect(svg).toContain('fill="white"');
  });

  it("AC-001-05 an unknown label has no explicit key (it only gets the fallback)", () => {
    expect(hasTechIcon("Unknown Tech")).toBe(false);
  });
});

/** The 16 labels of spec §8.3 D-10 that had no icon-map key before spec 001. */
const d10Labels = [
  ...simpleIconsLabels,
  "AWS Lambda",
  "Amazon S3",
  "LLM tool calling (Groq)",
  "Vanilla JS"
] as const;

/** Labels that use the repository's own neutral generic icon (plan §1.3, D-3). */
const genericLabels = ["AWS Lambda", "Amazon S3", "LLM tool calling (Groq)"] as const;

/** Every distinct stack label used by the project cards, in data order. */
const allStackLabels = [...new Set(projects.flatMap((project) => project.stack))];

describe("AC-001-05 techIcons cover every stack label", () => {
  it("AC-001-05 the D-10 list has 16 labels and all of them appear in a stack", () => {
    expect(d10Labels).toHaveLength(16);
    d10Labels.forEach((label) => expect(allStackLabels).toContain(label));
  });

  it.each(d10Labels)("AC-001-05 D-10 label '%s' is an explicit icon-map key", (label) => {
    expect(hasTechIcon(label)).toBe(true);
  });

  it.each(allStackLabels)("AC-001-05 stack label '%s' is an explicit icon-map key", (label) => {
    expect(hasTechIcon(label)).toBe(true);
  });

  it.each(allStackLabels)("AC-001-05 stack label '%s' icon files exist", (label) => {
    const { iconPath, iconPathDark } = resolveTechIconPath(label);
    expect(existsSync(toPublicFile(iconPath))).toBe(true);
    if (iconPathDark !== undefined) {
      expect(existsSync(toPublicFile(iconPathDark))).toBe(true);
    }
  });

  it("AC-001-05 'Vanilla JS' resolves to the existing javascript.svg", () => {
    expect(resolveTechIconPath("Vanilla JS")).toEqual({
      iconPath: "/assets/icons/tech/javascript.svg"
    });
  });

  it.each(genericLabels)("AC-001-05 '%s' resolves to the generic icon pair", (label) => {
    expect(resolveTechIconPath(label)).toEqual({
      iconPath: "/assets/icons/tech/generic-tech.svg",
      iconPathDark: "/assets/icons/tech/generic-tech-dark.svg"
    });
  });
});

describe("AC-001-05 generic icon files (D-3, ASM-001-16)", () => {
  const files = ["generic-tech.svg", "generic-tech-dark.svg"] as const;

  /**
   * Reads a generic icon file from the public tech icons folder.
   *
   * @param name - File name inside `assets/icons/tech/`.
   * @returns The SVG source.
   */
  const readIcon = (name: string): string =>
    readFileSync(toPublicFile(`/assets/icons/tech/${name}`), "utf8");

  it.each(files)("AC-001-05 %s is a titled 24x24 img with only svg/title/path", (name) => {
    const svg = readIcon(name);
    expect(svg).toContain('viewBox="0 0 24 24"');
    expect(svg).toContain('role="img"');
    expect(svg).toContain("<title>Technology</title>");
    const tags = [...svg.matchAll(/<([a-zA-Z][\w:-]*)/g)].map((match) => match[1]);
    expect(new Set(tags)).toEqual(new Set(["svg", "title", "path"]));
  });

  it.each(files)("AC-001-05 %s has no script, external ref or hex color", (name) => {
    const svg = readIcon(name);
    expect(svg).not.toMatch(/script|href|url\(|style|on\w+=/i);
    expect(svg).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });

  it('AC-001-05 only the dark file sets fill="white"', () => {
    expect(readIcon("generic-tech.svg")).not.toContain("fill=");
    expect(readIcon("generic-tech-dark.svg")).toContain('fill="white"');
  });
});
