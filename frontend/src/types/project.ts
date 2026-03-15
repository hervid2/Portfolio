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
}
