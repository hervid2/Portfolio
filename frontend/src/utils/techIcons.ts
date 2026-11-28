export interface IconSet {
  iconPath: string;
  iconPathDark?: string;
}

const FALLBACK_ICON_PATH = "/assets/icons/tech/javascript.svg";

const techIconPathByLabel: Record<string, IconSet> = {
  react: {
    iconPath: "/assets/icons/tech/react.svg",
    iconPathDark: "/assets/icons/tech/react-dark.svg"
  },
  typescript: {
    iconPath: "/assets/icons/tech/typescript.svg",
    iconPathDark: "/assets/icons/tech/typescript-dark.svg"
  },
  "node.js": {
    iconPath: "/assets/icons/tech/nodejs.svg",
    iconPathDark: "/assets/icons/tech/nodejs-dark.svg"
  },
  express: {
    iconPath: "/assets/icons/tech/express.svg",
    iconPathDark: "/assets/icons/tech/express-dark.svg"
  },
  "tailwind css": {
    iconPath: "/assets/icons/tech/tailwindcss.svg",
    iconPathDark: "/assets/icons/tech/tailwindcss-dark.svg"
  },
  javascript: {
    iconPath: "/assets/icons/tech/javascript.svg"
  },
  "vanilla.js": {
    iconPath: "/assets/icons/tech/javascript.svg"
  },
  java: {
    iconPath: "/assets/icons/tech/java.svg",
    iconPathDark: "/assets/icons/tech/java-dark.svg"
  },
  "spring boot": {
    iconPath: "/assets/icons/tech/spring-boot.svg"
  },
  mysql: {
    iconPath: "/assets/icons/tech/mysql.svg",
    iconPathDark: "/assets/icons/tech/mysql-dark.svg"
  },
  docker: {
    iconPath: "/assets/icons/tech/docker.svg",
    iconPathDark: "/assets/icons/tech/docker-dark.svg"
  },
  git: {
    iconPath: "/assets/icons/tech/git.svg",
    iconPathDark: "/assets/icons/tech/git-dark.svg"
  },
  swing: {
    iconPath: "/assets/icons/tech/java.svg",
    iconPathDark: "/assets/icons/tech/java-dark.svg"
  },
  sql: {
    iconPath: "/assets/icons/tech/mysql.svg",
    iconPathDark: "/assets/icons/tech/mysql-dark.svg"
  },
  websockets: {
    iconPath: "/assets/icons/tech/websockets.svg",
    iconPathDark: "/assets/icons/tech/websockets-dark.svg"
  },
  "next.js": {
    iconPath: "/assets/icons/tech/nextjs.svg",
    iconPathDark: "/assets/icons/tech/nextjs-dark.svg"
  },
  fastify: {
    iconPath: "/assets/icons/tech/fastify.svg",
    iconPathDark: "/assets/icons/tech/fastify-dark.svg"
  },
  postgresql: {
    iconPath: "/assets/icons/tech/postgresql.svg",
    iconPathDark: "/assets/icons/tech/postgresql-dark.svg"
  },
  "google oauth": {
    iconPath: "/assets/icons/tech/google.svg",
    iconPathDark: "/assets/icons/tech/google-dark.svg"
  },
  stripe: {
    iconPath: "/assets/icons/tech/stripe.svg",
    iconPathDark: "/assets/icons/tech/stripe-dark.svg"
  },
  "github actions": {
    iconPath: "/assets/icons/tech/githubactions.svg",
    iconPathDark: "/assets/icons/tech/githubactions-dark.svg"
  },
  scss: {
    iconPath: "/assets/icons/tech/scss.svg",
    iconPathDark: "/assets/icons/tech/scss-dark.svg"
  },
  sass: {
    iconPath: "/assets/icons/tech/scss.svg",
    iconPathDark: "/assets/icons/tech/scss-dark.svg"
  },
  "mapbox gl": {
    iconPath: "/assets/icons/tech/mapbox.svg",
    iconPathDark: "/assets/icons/tech/mapbox-dark.svg"
  },
  zod: {
    iconPath: "/assets/icons/tech/zod.svg",
    iconPathDark: "/assets/icons/tech/zod-dark.svg"
  },
  "react hook form": {
    iconPath: "/assets/icons/tech/react-hook-form.svg",
    iconPathDark: "/assets/icons/tech/react-hook-form-dark.svg"
  },
  vitest: {
    iconPath: "/assets/icons/tech/vitest.svg",
    iconPathDark: "/assets/icons/tech/vitest-dark.svg"
  },
  playwright: {
    iconPath: "/assets/icons/tech/playwright.svg",
    iconPathDark: "/assets/icons/tech/playwright-dark.svg"
  },
  nestjs: {
    iconPath: "/assets/icons/tech/nestjs.svg",
    iconPathDark: "/assets/icons/tech/nestjs-dark.svg"
  },
  prisma: {
    iconPath: "/assets/icons/tech/prisma.svg",
    iconPathDark: "/assets/icons/tech/prisma-dark.svg"
  },
  "upstash redis": {
    iconPath: "/assets/icons/tech/upstash.svg",
    iconPathDark: "/assets/icons/tech/upstash-dark.svg"
  },
  turborepo: {
    iconPath: "/assets/icons/tech/turborepo.svg",
    iconPathDark: "/assets/icons/tech/turborepo-dark.svg"
  },
  vite: {
    iconPath: "/assets/icons/tech/vite.svg",
    iconPathDark: "/assets/icons/tech/vite-dark.svg"
  },
  sequelize: {
    iconPath: "/assets/icons/tech/sequelize.svg",
    iconPathDark: "/assets/icons/tech/sequelize-dark.svg"
  },
  "socket.io": {
    iconPath: "/assets/icons/tech/socketio.svg",
    iconPathDark: "/assets/icons/tech/socketio-dark.svg"
  },
  nginx: {
    iconPath: "/assets/icons/tech/nginx.svg",
    iconPathDark: "/assets/icons/tech/nginx-dark.svg"
  },
  digitalocean: {
    iconPath: "/assets/icons/tech/digitalocean.svg",
    iconPathDark: "/assets/icons/tech/digitalocean-dark.svg"
  },
  "spring data jpa": {
    iconPath: "/assets/icons/tech/spring.svg",
    iconPathDark: "/assets/icons/tech/spring-dark.svg"
  },
  flyway: {
    iconPath: "/assets/icons/tech/flyway.svg",
    iconPathDark: "/assets/icons/tech/flyway-dark.svg"
  },
  "junit 5": {
    iconPath: "/assets/icons/tech/junit5.svg",
    iconPathDark: "/assets/icons/tech/junit5-dark.svg"
  },
  "aws lambda": {
    iconPath: "/assets/icons/tech/generic-tech.svg",
    iconPathDark: "/assets/icons/tech/generic-tech-dark.svg"
  },
  "amazon s3": {
    iconPath: "/assets/icons/tech/generic-tech.svg",
    iconPathDark: "/assets/icons/tech/generic-tech-dark.svg"
  },
  "llm tool calling (groq)": {
    iconPath: "/assets/icons/tech/generic-tech.svg",
    iconPathDark: "/assets/icons/tech/generic-tech-dark.svg"
  },
  "vanilla js": {
    iconPath: "/assets/icons/tech/javascript.svg"
  }
};

/**
 * Resolves the icon set for a technology badge.
 *
 * @param stackLabel - Technology label to resolve.
 * @returns Icon set with light and optional dark path.
 */
export function resolveTechIconPath(stackLabel: string): IconSet {
  return techIconPathByLabel[stackLabel.toLowerCase()] ?? { iconPath: FALLBACK_ICON_PATH };
}

/**
 * Tells whether a technology label has its own entry in the icon map, so it does not
 * fall back to the default icon.
 *
 * @param stackLabel - Technology label as shown on the card (case-insensitive).
 * @returns `true` when the label is an explicit icon-map key.
 */
export function hasTechIcon(stackLabel: string): boolean {
  return Object.prototype.hasOwnProperty.call(techIconPathByLabel, stackLabel.toLowerCase());
}
