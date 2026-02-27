export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
  captchaToken: string;
}

export interface ContactResponse {
  message: string;
}
