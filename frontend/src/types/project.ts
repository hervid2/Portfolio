export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  category: string;
  imageUrl: string;
  liveDemoUrl: string | null;
  codeUrl: string | null;
}
