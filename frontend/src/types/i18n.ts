export type Language = "en" | "es";

export interface AppDictionary {
  nav: {
    home: string;
    portfolio: string;
    about: string;
    contact: string;
  };
  hero: {
    role: string;
    statement: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  portfolio: {
    title: string;
    subtitle: string;
    liveDemo: string;
    code: string;
    pending: string;
  };
  about: {
    title: string;
    bioParagraphOne: string;
    bioParagraphTwo: string;
    bioParagraphThree: string;
    skillsTitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
    altContactTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendingLabel: string;
    submitLabel: string;
    requiredFieldsMessage: string;
    successMessage: string;
    errorMessage: string;
  };
  footer: {
    rights: string;
  };
}
