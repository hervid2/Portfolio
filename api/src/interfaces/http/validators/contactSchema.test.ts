import { describe, expect, it } from "vitest";
import { contactSchema } from "./contactSchema.js";

/** Domain appended to a local part to build emails of an exact length. */
const EMAIL_DOMAIN = "@example.com";

/** A request body that satisfies every BR-003 rule. */
const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello, I would like to talk about a role.",
  captchaToken: "token-123"
};

/**
 * Parses the valid body with the given fields overridden.
 *
 * @param overrides - Fields to replace in the valid body.
 * @returns The `safeParse` result.
 */
function parseWith(overrides: Record<string, unknown>) {
  return contactSchema.safeParse({ ...validBody, ...overrides });
}

/**
 * Builds a syntactically valid email of exactly `length` characters.
 *
 * @param length - Total length of the email, domain included.
 * @returns The email address.
 */
function emailOfLength(length: number): string {
  return "a".repeat(length - EMAIL_DOMAIN.length) + EMAIL_DOMAIN;
}

describe("AC-000-06(a) contactSchema at the BR-003 boundaries", () => {
  it('AC-000-06(a) name "A" (1 char) is invalid', () => {
    expect(parseWith({ name: "A" }).success).toBe(false);
  });

  it('AC-000-06(a) name "Al" (2 chars) is valid', () => {
    expect(parseWith({ name: "Al" }).success).toBe(true);
  });

  it('AC-000-06(a) name "  A  " is invalid after trimming', () => {
    expect(parseWith({ name: "  A  " }).success).toBe(false);
  });

  it("AC-000-06(a) email with a bad format is invalid", () => {
    expect(parseWith({ email: "not-an-email" }).success).toBe(false);
  });

  it("AC-000-06(a) email of 121 chars is invalid", () => {
    const email = emailOfLength(121);
    expect(email).toHaveLength(121);
    expect(parseWith({ email }).success).toBe(false);
  });

  it("AC-000-06(a) message of 9 chars is invalid", () => {
    expect(parseWith({ message: "a".repeat(9) }).success).toBe(false);
  });

  it("AC-000-06(a) message of 10 chars is valid", () => {
    expect(parseWith({ message: "a".repeat(10) }).success).toBe(true);
  });

  it("AC-000-06(a) message of 1200 chars is valid", () => {
    expect(parseWith({ message: "a".repeat(1200) }).success).toBe(true);
  });

  it("AC-000-06(a) message of 1201 chars is invalid", () => {
    expect(parseWith({ message: "a".repeat(1201) }).success).toBe(false);
  });

  it("AC-000-06(a) missing name is invalid", () => {
    const { name: _omitted, ...withoutName } = validBody;
    expect(contactSchema.safeParse(withoutName).success).toBe(false);
  });

  it('AC-000-06(a) missing captchaToken is valid and defaults to ""', () => {
    const { captchaToken: _omitted, ...withoutToken } = validBody;
    const result = contactSchema.safeParse(withoutToken);
    expect(result.success).toBe(true);
    expect(result.data?.captchaToken).toBe("");
  });
});
