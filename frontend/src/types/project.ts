export interface DemoCredential {
  role: {
    en: string;
    es: string;
  };
  username: string | null;
  password: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: {
    en: string;
    es: string;
  };
  stack: string[];
  category: string;
  imageUrl: string;
  liveDemoUrl: string | null;
  codeUrl: string | null;
  demoCredentials?: DemoCredential[];
  /** YouTube video ID (not full URL) per language, e.g. "dQw4w9WgXcQ". */
  demoVideoId?: {
    en: string;
    es: string;
  };
}
