import { describe, expect, it } from "vitest";
import { enDictionary } from "./en";
import { esDictionary } from "./es";

/**
 * Tells whether a value is a nested node (plain object or array) rather than a leaf.
 *
 * @param value - Any dictionary value.
 * @returns `true` when the value has child keys to walk.
 */
function isNode(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Collects every key path of a dictionary at any depth, as dot-separated strings.
 *
 * @param node - The dictionary (or sub-tree) to walk.
 * @param prefix - The path of `node` inside the root dictionary.
 * @returns The sorted list of every key path, including intermediate nodes.
 */
function collectKeyPaths(node: unknown, prefix = ""): string[] {
  if (!isNode(node)) return [];
  const paths = Object.entries(node).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return [path, ...collectKeyPaths(value, path)];
  });
  return paths.sort();
}

/**
 * Collects the paths of every leaf that is an empty (or whitespace-only) string.
 *
 * @param node - The dictionary (or sub-tree) to walk.
 * @param prefix - The path of `node` inside the root dictionary.
 * @returns The list of paths whose value is an empty string.
 */
function collectEmptyStringPaths(node: unknown, prefix = ""): string[] {
  if (typeof node === "string") return node.trim() === "" ? [prefix] : [];
  if (!isNode(node)) return [];
  return Object.entries(node).flatMap(([key, value]) =>
    collectEmptyStringPaths(value, prefix ? `${prefix}.${key}` : key)
  );
}

describe("AC-000-05(a) EN/ES dictionaries", () => {
  it("AC-000-05(a) en and es have deep-equal key sets", () => {
    expect(collectKeyPaths(esDictionary)).toEqual(collectKeyPaths(enDictionary));
  });

  it("AC-000-05(a) en has no empty string at any depth", () => {
    expect(collectEmptyStringPaths(enDictionary)).toEqual([]);
  });

  it("AC-000-05(a) es has no empty string at any depth", () => {
    expect(collectEmptyStringPaths(esDictionary)).toEqual([]);
  });
});

describe("AC-000-05(a) dictionary walkers detect drift", () => {
  it("AC-000-05(a) a nested key missing in one dictionary changes the key set", () => {
    const reference = { nav: { home: "Home", about: "About" } };
    const drifted = { nav: { home: "Inicio" } };
    expect(collectKeyPaths(drifted)).not.toEqual(collectKeyPaths(reference));
    expect(collectKeyPaths(reference)).toContain("nav.about");
  });

  it("AC-000-05(a) an empty string at depth is reported by its path", () => {
    const dictionary = { contact: { form: { name: "Name", email: "  " } }, list: ["", "x"] };
    expect(collectEmptyStringPaths(dictionary)).toEqual(["contact.form.email", "list.0"]);
  });
});

describe("AC-001-11 spec 001 copy K-01 … K-04 is pinned to the approved literals", () => {
  it("AC-001-11 en portfolio copy matches spec §7 byte for byte", () => {
    const { kind, coldStartNotice, subtitle } = enDictionary.portfolio;
    expect(kind.client).toBe("Client project");
    expect(kind.personal).toBe("Personal project");
    expect(kind.personalQualifier).toBe("deployed");
    expect(subtitle).toBe(
      "A selection of client work and personal projects deployed to production."
    );
    expect(coldStartNotice).toBe(
      "Heads-up: the first load may be slow while the demo server wakes up."
    );
  });

  it("AC-001-11 es portfolio copy matches spec §7 byte for byte", () => {
    const { kind, coldStartNotice, subtitle } = esDictionary.portfolio;
    expect(kind.client).toBe("Proyecto de cliente");
    expect(kind.personal).toBe("Proyecto personal");
    expect(kind.personalQualifier).toBe("desplegado");
    expect(subtitle).toBe(
      "Una selección de trabajo para clientes y proyectos personales desplegados en producción."
    );
    expect(coldStartNotice).toBe(
      "Aviso: la primera carga puede ser lenta mientras el servidor de la demo se activa."
    );
  });
});
