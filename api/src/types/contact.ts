export interface ContactMessageDTO {
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}

/** Input of `SubmitContactMessageUseCase.execute`: the parsed request plus the captcha data. */
export interface SubmitContactMessageCommand {
  name: string;
  email: string;
  message: string;
  captchaToken: string;
  remoteIp?: string;
}

/** Outcome of a contact submission; a rejected captcha is an expected result, not an error. */
export type SubmitContactMessageResult = { status: "accepted" } | { status: "captcha-rejected" };
