export interface DemoCredential {
  role: {
    en: string;
    es: string;
  };
  username: string | null;
  password: string | null;
}

/** Whether a project is client work or a personal project (glossary "Project kind", BR-006). */
export type ProjectKind = "client" | "personal";

export interface Project {
  id: string;
  title: string;
  description: {
    en: string;
    es: string;
  };
  stack: string[];
  category: string;
  /** Client work or personal project; required on every card (FR-016). */
  kind: ProjectKind;
  /** Poster frame shown while the card is idle; ideally frame 0 of the preview clip. */
  imageUrl: string;
  /** Muted looping clip played over the poster while the card is hovered or focused. */
  previewVideoUrl?: string;
  liveDemoUrl: string | null;
  /** Shows the cold-start notice on the card when true; absent means false (FR-019). */
  coldStartNotice?: boolean;
  codeUrl: string | null;
  demoCredentials?: DemoCredential[];
  /** YouTube video ID (not full URL) per language, e.g. "dQw4w9WgXcQ". */
  demoVideoId?: {
    en: string;
    es: string;
  };
}
