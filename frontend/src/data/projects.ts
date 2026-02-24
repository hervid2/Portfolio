import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "java-desktop-app",
    title: "Java Desktop Application",
    description:
      "A desktop solution built with Java focused on workflow efficiency and consistent UX.",
    stack: ["Java", "Swing", "SQL"],
    category: "Desktop",
    imageUrl:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1400&q=80",
    liveDemoUrl: null,
    codeUrl: null
  },
  {
    id: "sushi-burrito-spa",
    title: "Sushi Burrito Web App",
    description:
      "Single-page app for restaurant operations with real-time updates via WebSockets.",
    stack: ["Vanilla.js", "Node.js", "Express", "WebSockets", "SQL"],
    category: "Web SPA",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
    liveDemoUrl: null,
    codeUrl: null
  },
  {
    id: "the-slicing-edge",
    title: "The Slicing Edge",
    description:
      "E-commerce platform for kitchen knives, built for scalability and conversion.",
    stack: ["React", "TypeScript", "Node.js", "Express", "SQL"],
    category: "E-commerce",
    imageUrl:
      "https://images.unsplash.com/photo-1594385208974-2cbf7c5f2f1f?auto=format&fit=crop&w=1400&q=80",
    liveDemoUrl: null,
    codeUrl: null
  }
];
