import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "java-desktop-app",
    title: "Sushi Burrito Desktop app",
    description: {
      en: "A desktop solution built with Java focused on workflow efficiency and consistent UX.",
      es: "Una solución de escritorio en Java enfocada en la eficiencia de flujos de trabajo y una experiencia de usuario consistente."
    },
    stack: ["Java", "Swing", "SQL"],
    category: "Desktop",
    imageUrl:
      "/assets/images/projects/java-desktop-app.webp",
    liveDemoUrl: null,
    codeUrl: "https://github.com/hervid2/sushiBurritoJava"
  },
  {
    id: "sushi-burrito-spa",
    title: "Sushi Burrito Web App",
    description: {
      en: "Single-page app for restaurant operations with real-time updates via WebSockets.",
      es: "Aplicación web de una sola página para operaciones de restaurante con actualizaciones en tiempo real mediante WebSockets."
    },
    stack: ["Vanilla.js", "Node.js", "Express", "WebSockets", "SQL"],
    category: "Web SPA",
    imageUrl:
      "/assets/images/projects/sushi-burrito-web-app.webp",
    liveDemoUrl: null,
    codeUrl: "https://github.com/hervid2/SushiBurritoFinal"
  },
  {
    id: "the-slicing-edge",
    title: "The Slicing Edge",
    description: {
      en: "E-commerce platform for kitchen knives, built for scalability and conversion.",
      es: "Plataforma e-commerce para cuchillos de cocina, diseñada para escalar y convertir."
    },
    stack: ["React", "TypeScript", "Node.js", "Express", "SQL"],
    category: "E-commerce",
    imageUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80",
    liveDemoUrl: null,
    codeUrl: null
  }
];
