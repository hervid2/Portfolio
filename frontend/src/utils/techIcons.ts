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
