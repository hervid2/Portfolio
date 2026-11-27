import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
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
