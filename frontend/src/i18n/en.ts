import type { AppDictionary } from "@/types/i18n";

export const enDictionary: AppDictionary = {
  nav: {
    home: "Home",
    portfolio: "Portfolio",
    about: "About Me",
    contact: "Get in Touch"
  },
  hero: {
    role: "Full-stack Developer",
    statement: "I build elegant and efficient software solutions for the web.",
    ctaPrimary: "View My Work",
    ctaSecondary: "Get in Touch"
  },
  portfolio: {
    title: "My Portfolio",
    subtitle: "A selection of professional projects.",
    liveDemo: "Live Demo",
    code: "Code",
    pending: "Link pending"
  },
  about: {
    title: "About Me",
    bioParagraphOne:
      "I'm Hernán David Cardona, a full-stack developer focused on building reliable and user-centered digital products.",
    bioParagraphTwo:
      "I enjoy designing clean frontend experiences and robust backend architecture with security, performance, and maintainability in mind.",
    skillsTitle: "My Skills"
  },
  contact: {
    title: "Get in Touch",
    subtitle:
      "Have a project in mind or want to collaborate? Send me a message and I will get back to you soon.",
    altContactTitle: "Other ways to connect",
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    submitLabel: "Send Message",
    successMessage: "Your message has been sent successfully.",
    errorMessage: "Could not send the message. Please try again."
  },
  footer: {
    rights: "All rights reserved."
  }
};
