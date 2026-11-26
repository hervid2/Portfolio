import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NoopMailService } from "../../infrastructure/email/NoopMailService.js";
// Prettier keeps single-specifier imports on one line; this one is over 100 chars.
// prettier-ignore
import {
  InMemoryContactRepository
} from "../../infrastructure/repositories/InMemoryContactRepository.js";
import type { SubmitContactMessageCommand } from "../../types/contact.js";
import { SubmitContactMessageUseCase } from "./SubmitContactMessageUseCase.js";

/** Fixed clock so the stamped `submittedAt` is deterministic. */
const NOW = new Date("2026-11-26T12:00:00.000Z");

/** A valid command as the controller builds it from a parsed request. */
const command: SubmitContactMessageCommand = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello, I would like to talk about a role.",
  captchaToken: "token-123",
  remoteIp: "203.0.113.7"
};

/**
 * Builds the use case with spies on the in-memory repository and the no-op mail service, and a
 * fake captcha verifier that resolves to the given verdict.
 *
 * @param captchaVerdict - What the fake verifier resolves to.
 * @returns The use case and its spies.
 */
function setup(captchaVerdict: boolean) {
  const repository = new InMemoryContactRepository();
  const mailService = new NoopMailService();
  const saveSpy = vi.spyOn(repository, "save");
  const sendSpy = vi.spyOn(mailService, "sendContactNotification");
  const verifier = { verifyToken: vi.fn().mockResolvedValue(captchaVerdict) };
  const useCase = new SubmitContactMessageUseCase(repository, mailService, verifier);
  return { useCase, saveSpy, sendSpy, verifier };
}

describe("AC-000-06(b) SubmitContactMessageUseCase", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("AC-000-06(b) accepted captcha: saves, then mails the DTO with submittedAt", async () => {
    const { useCase, saveSpy, sendSpy, verifier } = setup(true);

    const result = await useCase.execute(command);

    const expectedDto = {
      name: command.name,
      email: command.email,
      message: command.message,
      submittedAt: NOW.toISOString()
    };
    expect(result).toEqual({ status: "accepted" });
    expect(verifier.verifyToken).toHaveBeenCalledWith(command.captchaToken, command.remoteIp);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(expectedDto);
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(expectedDto);
    expect(saveSpy.mock.invocationCallOrder[0]).toBeLessThan(
      sendSpy.mock.invocationCallOrder[0] ?? 0
    );
  });

  it("AC-000-06(b) rejected captcha: captcha-rejected, nothing saved or mailed", async () => {
    const { useCase, saveSpy, sendSpy, verifier } = setup(false);

    const result = await useCase.execute(command);

    expect(result).toEqual({ status: "captcha-rejected" });
    expect(verifier.verifyToken).toHaveBeenCalledWith(command.captchaToken, command.remoteIp);
    expect(saveSpy).not.toHaveBeenCalled();
    expect(sendSpy).not.toHaveBeenCalled();
  });
});
