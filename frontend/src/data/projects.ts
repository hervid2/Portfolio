import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "java-desktop-app",
    title: "Sushi Burrito Desktop app",
    description: {
      en: "The restaurant's first point-of-sale system, built in Java Swing over MySQL and in daily use Jun–Dec 2025; now the fallback for the web POS. Refactored in eight documented iterations to Spring Boot 3.3, Spring Data JPA, Flyway migrations, BCrypt, JUnit 5 and Mockito tests, and a self-contained installer (jpackage, jlink).",
      es: "El primer sistema POS del restaurante, construido en Java Swing sobre MySQL y en uso diario jun–dic 2025; hoy es el respaldo del POS web. Refactorizado en ocho iteraciones documentadas a Spring Boot 3.3, Spring Data JPA, migraciones Flyway, BCrypt, pruebas con JUnit 5 y Mockito, y un instalador autocontenido (jpackage, jlink)."
    },
    stack: ["Java", "Spring Boot", "Swing", "Spring Data JPA", "Flyway", "MySQL", "JUnit 5"],
    category: "Desktop",
    kind: "client",
    imageUrl: "/assets/images/projects/java-desktop-app.webp",
    previewVideoUrl: "/assets/videos/projects/java-desktop-app.mp4",
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
      en: "Point-of-sale system in daily use at a restaurant in Bucaramanga, Colombia, since January 2026. Waiters take orders per table, the kitchen works from a live board over Socket.IO, and admins handle invoices and revenue reports. JWT auth with three roles; SPA on Vercel, API on a DigitalOcean droplet behind Nginx.",
      es: "Sistema POS en uso diario en un restaurante de Bucaramanga, Colombia, desde enero de 2026. Los meseros toman pedidos por mesa, la cocina trabaja desde un tablero en vivo con Socket.IO y los administradores gestionan facturas y reportes de ingresos. Autenticación JWT con tres roles; SPA en Vercel y API en un droplet de DigitalOcean detrás de Nginx."
    },
    stack: [
      "Vanilla JS",
      "Vite",
      "Node.js",
      "Express",
      "Sequelize",
      "MySQL",
      "Socket.IO",
      "Nginx",
      "DigitalOcean"
    ],
    category: "Web SPA",
    kind: "client",
    imageUrl: "/assets/images/projects/sushi-burrito-web-app.webp",
    previewVideoUrl: "/assets/videos/projects/sushi-burrito-spa.mp4",
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
      en: "AI shopping assistant (Llama 3.3 70B on Groq) that uses server-side tool calling to search products, recommend items and track orders. E-commerce for premium kitchen knives with Stripe Checkout and webhook-confirmed orders, Auth.js v5 with Google OAuth and roles, and a Turborepo monorepo sharing Prisma and Zod between a Next.js 15 storefront and a Fastify 5 API.",
      es: "Asistente de compras con IA (Llama 3.3 70B en Groq) que usa tool calling en el servidor para buscar productos, recomendar artículos y rastrear pedidos. E-commerce de cuchillos de cocina premium con Stripe Checkout y pedidos confirmados por webhook, Auth.js v5 con Google OAuth y roles, y un monorepo Turborepo que comparte Prisma y Zod entre una tienda en Next.js 15 y una API en Fastify 5."
    },
    stack: [
      "Next.js",
      "Fastify",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "LLM tool calling (Groq)",
      "Stripe",
      "Upstash Redis",
      "Turborepo",
      "GitHub Actions"
    ],
    category: "E-commerce",
    kind: "personal",
    imageUrl: "/assets/images/projects/slicing-edge.png",
    previewVideoUrl: "/assets/videos/projects/the-slicing-edge.mp4",
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
      en: "Multi-tenant incident management for construction sites: a geolocated incident map (Mapbox GL, 2D/3D) and an 11-widget analytics dashboard. Next.js 16 on Vercel; a NestJS 11 API on AWS Lambda behind API Gateway, deployed with SAM; Prisma + PostgreSQL; browser uploads go straight to S3 through presigned URLs. Playwright E2E in CI against a real backend.",
      es: "Gestión de incidencias multi-tenant para obras de construcción: mapa de incidencias geolocalizadas (Mapbox GL, 2D/3D) y un dashboard analítico de 11 widgets. Next.js 16 en Vercel; API NestJS 11 en AWS Lambda detrás de API Gateway, desplegada con SAM; Prisma + PostgreSQL; las subidas van del navegador directo a S3 con URLs prefirmadas. E2E con Playwright en CI contra un backend real."
    },
    stack: [
      "Next.js",
      "NestJS",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "AWS Lambda",
      "Amazon S3",
      "Mapbox GL",
      "Playwright",
      "GitHub Actions"
    ],
    category: "Web App",
    kind: "personal",
    imageUrl: "/assets/images/projects/flyworkflow.webp",
    previewVideoUrl: "/assets/videos/projects/flyworkflow-incidents.mp4",
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
