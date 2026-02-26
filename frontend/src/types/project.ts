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
}
