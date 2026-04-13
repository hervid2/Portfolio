import type { Project, DemoCredential } from "@/types/project";

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
    liveDemoUrl: "https://sushi-burrito-final.vercel.app/",
    codeUrl: "https://github.com/hervid2/SushiBurritoFinal",
    demoCredentials: [
      {
        role: { en: "Admin", es: "Administrador" },
        username: "admin@demo.com",
        password: "AdminPassword123!"
      },
      {
        role: { en: "Kitchen", es: "Cocina" },
        username: "kitchen@demo.com",
        password: "KitchenPassword123!"
      },
      {
        role: { en: "Waiter", es: "Mesero" },
        username: "waiter@demo.com",
        password: "WaiterPassword123!"
      }
    ]
  },
  {
    id: "the-slicing-edge",
    title: "Slicing Edge E-commerce App",
    description: {
      en: "A full-stack e-commerce platform for premium kitchen knives, built with Next.js 15, Fastify and PostgreSQL. Features Google OAuth, Stripe payments, AI chatbot assistant, admin dashboard and CI/CD pipeline via GitHub Actions.",
      es: "Plataforma e-commerce full-stack para cuchillos de cocina premium, construida con Next.js 15, Fastify y PostgreSQL. Incluye Google OAuth, pagos con Stripe, chatbot con IA, panel de administración y pipeline CI/CD con GitHub Actions."
    },
    stack: ["Next.js", "TypeScript", "Fastify", "PostgreSQL", "Google OAuth", "Stripe", "GitHub Actions"],
    category: "E-commerce",
    imageUrl:
      "/assets/images/projects/slicing-edge.png",
    liveDemoUrl: "https://slicing-edge-e-commerce-web.vercel.app/",
    codeUrl: "https://github.com/hervid2/Slicing-edge-e-commerce",
    demoCredentials: [
      {
        role: { en: "Admin", es: "Administrador" },
        username: null,
        password: null
      },
      {
        role: { en: "User", es: "Usuario" },
        username: null,
        password: null
      }
    ]
  }
];
