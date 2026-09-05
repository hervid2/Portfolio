import type { Project, DemoCredential } from "@/types/project";

export const projects: Project[] = [
  {
    id: "java-desktop-app",
    title: "Sushi Burrito Desktop app",
    description: {
      en: "A desktop solution built with Java focused on workflow efficiency and consistent UX.",
      es: "Una solución de escritorio en Java enfocada en la eficiencia de flujos de trabajo y una experiencia de usuario consistente."
    },
    stack: ["Java", "Spring Boot", "Swing", "SQL"],
    category: "Desktop",
    imageUrl:
      "/assets/images/projects/java-desktop-app.webp",
    liveDemoUrl: null,
    codeUrl: "https://github.com/hervid2/sushiBurritoJava",
    demoVideoId: {
      en: "inrgfaGwJEE",
      es: "sSIvLiMbzEM"
    }
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
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Fastify", "PostgreSQL", "Google OAuth", "Stripe", "Docker", "GitHub Actions"],
    category: "E-commerce",
    imageUrl:
      "/assets/images/projects/slicing-edge.png",
    liveDemoUrl: "https://slicing-edge-e-commerce-web.vercel.app/",
    codeUrl: "https://github.com/hervid2/Slicing-edge-e-commerce",
    demoCredentials: [
      {
        role: { en: "Admin", es: "Administrador" },
        username: "admin@slicing-edge.com",
        password: "admin123456"
      },
      {
        role: { en: "Customer", es: "Cliente" },
        username: "customer@example.com",
        password: "customer123456"
      }
    ]
  },
  {
    id: "flyworkflow-incidents",
    title: "FlyWorkFlow Incident Management",
    description: {
      en: "Incident management platform for construction projects, built with Next.js 14 and TypeScript. Features Mapbox GL map visualization with geolocated reports, an analytics dashboard with KPIs and trend charts (Recharts), role-based access control, Zustand state management and an E2E suite with Vitest and Playwright.",
      es: "Plataforma de gestión de incidencias para proyectos de construcción, construida con Next.js 14 y TypeScript. Incluye visualización en mapa con Mapbox GL y reportes geolocalizados, dashboard analítico con KPIs y gráficas de tendencia (Recharts), control de acceso por roles, gestión de estado con Zustand y suite E2E con Vitest y Playwright."
    },
    stack: ["Next.js", "TypeScript", "React", "SCSS", "Mapbox GL", "Zod", "React Hook Form", "Vitest", "Playwright", "GitHub Actions"],
    category: "Web App",
    imageUrl:
      "/assets/images/projects/flyworkflow.webp",
    liveDemoUrl: "https://flyworkflowapp.vercel.app/",
    codeUrl: "https://github.com/hervid2/flyworkflowapp",
    demoCredentials: [
      {
        role: { en: "Super Admin", es: "Superadministrador" },
        username: "camila.rojas@flyworkflow.io",
        password: "FlyWorkFlow2026!"
      },
      {
        role: { en: "Admin", es: "Administrador" },
        username: "isabela.nieto@constructoradelvalle.com",
        password: "FlyWorkFlow2026!"
      },
      {
        role: { en: "Member", es: "Miembro" },
        username: "diego.salazar@constructoradelvalle.com",
        password: "FlyWorkFlow2026!"
      }
    ]
  }
];
