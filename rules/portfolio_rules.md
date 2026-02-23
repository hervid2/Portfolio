# Portfolio Dev — Rules for Cascade

Stack: React + TypeScript + Vite + Tailwind CSS (frontend) · Node.js + Express + TypeScript (API)

---

## Primary Goal

Build a professional full-stack portfolio as a sales showcase, preserving the visual direction from the
approved mockup (dark theme, cyan accent, minimal and elegant composition).

---

## Structure

```txt
frontend/src/
  app/                   # router, providers, global setup
  components/layout/     # Navbar, Footer
  components/sections/   # Hero, About, Projects, Skills, Contact
  components/ui/         # Button, Card, Input, Badge, etc.
  hooks/                 # useScrollSpy, useTheme, useContactForm
  context/               # ThemeContext, LanguageContext
  services/              # http client, api modules
  data/                  # projects.ts, skills.ts (typed static content)
  i18n/                  # en.ts, es.ts dictionaries
  types/                 # shared frontend types
  utils/                 # validators.ts, helpers.ts

api/src/
  config/                # env, constants
  domain/                # entities, interfaces
  application/           # use-cases
  infrastructure/        # repositories, mailer provider
  interfaces/http/
    controllers/         # contactController.ts
    middlewares/         # errorHandler, rateLimiter, validateRequest
    routes/              # contactRoutes.ts
    validators/          # zod schemas / request contracts
  types/                 # DTOs and API contracts
```

---

## Naming — Always in English, Always Semantic

- Variables: `camelCase`, descriptive. `featuredProjects`, `isMenuOpen`, `hasScrolledPastHero`
- Constants: `UPPER_SNAKE_CASE`. `MAX_FORM_LENGTH`
- Functions: `verb + noun`. `sendContactEmail`, `filterProjectsByTag`, `toggleDarkMode`
- Components: `PascalCase`. File name must match component name. `ProjectCard.tsx`
- Hooks: always prefix with `use`. `useScrollSpy`, `useContactForm`
- No single-letter vars, no abbreviations, no `data2`, no `handleStuff`, no `fn`

---

## Code Style

- Max line length: 100 chars
- Max function length: 40 lines (split if longer)
- Prefer early returns to reduce nesting
- Named exports for utils/hooks/services · Default exports for page-level components only
- No `console.log` in committed files · No commented-out dead code
- Strict TypeScript required in frontend and API (`strict: true`, `noImplicitAny: true`)

---

## JSDoc — Required on Every Function

All functions (components, hooks, utils, controllers, services) must have a JSDoc block in English.

```ts
/**
 * Filters an array of projects by a given technology tag.
 *
 * @param projects - Full list of project objects.
 * @param tag - Technology tag to filter by (e.g. "React").
 * @returns Projects that include the given tag.
 */
export function filterProjectsByTag(projects: Project[], tag: string): Project[] {
  return projects.filter((project) =>
    project.tags.map((item) => item.toLowerCase()).includes(tag.toLowerCase())
  );
}
```

For async functions add `@async` and `@returns {Promise<...>}`.
For hooks include `@param` for each argument and `@returns` describing the returned value/object.
For React components document each prop with `@param` entries.

---

## Visual Fidelity to Mockup (Mandatory)

- Keep the approved visual language: dark layout, cyan accent, high contrast typography.
- Preserve section hierarchy and spacing rhythm from the mockup:
  Home, Portfolio, About, Contact.
- Navbar must include EN/ES language switch and active section highlight.
- Primary CTA style must match the mockup look (filled cyan), secondary CTA outlined.
- Do not introduce random palettes or visual styles that break design consistency.

---

## React Architecture

- One component per file, single responsibility only
- Keep rendering in components, logic in hooks/services
- Always destructure props in function signature
- Lazy-load non-critical sections with `React.lazy` + `Suspense`
- Memoize expensive values with `useMemo` and stable handlers with `useCallback`
- Context API only for truly global state (theme, language)

---

## Tailwind

- Define all colors, spacing, shadows, and fonts as tokens in `tailwind.config.ts`
- Never hardcode brand colors inline
- `darkMode: 'class'`
- Class order: layout → sizing → spacing → typography → colors → borders → effects → transitions → responsive → dark

```tsx
// ✅
<button className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold text-black bg-accent-cyan border border-accent-cyan transition-colors duration-200 hover:bg-accent-cyan-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan">
```

- Extract repeated patterns with `@apply` using semantic classes (`.btn-primary`, `.section-title`)
- Mobile-first only: base styles first, then `md:` and `lg:`

---

## API (Node.js / Express + TypeScript)

- All secrets in `.env` — never hardcode; always provide `.env.example`
- CORS restricted to allowed domains (environment-based whitelist)
- Rate limit `/api/contact`: max 5 requests / 15 min / IP using `express-rate-limit`
- Validate and sanitize all request fields (schema validation required)
- Use `helmet` for HTTP security headers
- Centralized error handler middleware (never handle errors inline in routes)
- Never expose stack traces in production responses
- Validate environment variables at bootstrap and fail fast on invalid config

---

## SOLID and Backend Layering

- SRP: controllers, services, and repositories each with one responsibility
- OCP: extend behavior via interfaces/adapters, not by rewriting core modules
- LSP: implementations must honor declared contracts
- ISP: small focused interfaces (`EmailService`, `ContactRepository`)
- DIP: use-cases depend on interfaces, not concrete providers

---

## Accessibility

- All `<img>` must have descriptive `alt`
- Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`
- All interactive elements must be keyboard navigable
- Icon-only buttons must include `aria-label`
- Form inputs must have associated `<label>`
- External links must include `rel="noopener noreferrer"`

---

## SEO & Performance

- Manage head tags with `react-helmet-async` (title, description, OG)
- Include `robots.txt` and `sitemap.xml` in `/public`
- Prefer WebP/AVIF images with `loading="lazy"`
- Use `font-display: swap` for web fonts
- Lighthouse target >= 90 before deploy

---

## Git

- Conventional Commits: `feat(hero): add scroll animation` · `fix(contact): resolve cors policy`
- Imperative mood: "add", "fix", "remove" (not "added" or "fixing")
- Never commit directly to `main`
- Branches: `main` · `dev` · `feat/<name>` · `fix/<name>`
