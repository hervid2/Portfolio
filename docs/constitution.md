# Constitution — Hernán David Cardona Portfolio
Version: 1.0.0 · Ratified: 2026-11-26 · Subordinate to: docs/governance/GENESIS.md

## Preamble
This portfolio exists to help Hernán David Cardona get hired for remote full-stack roles in the US, Canada and LATAM. It is built for recruiters and hiring managers. Every page must prove claims with evidence (demos, code, case studies, architecture), and the repository itself is part of the showcase.

## Title I — Product principles (prioritized)
1. **Truthfulness over polish.** Nothing on the site may contradict the GitHub profile README (BR-006) or show a broken demo or link.
2. **Recruiter time is the scarcest resource.** CV, email and the best work are one click from the hero.
3. **Evidence over adjectives.** Prefer numbers, outcomes and links to "scalable, elegant, modern".
4. **Visual consistency with the approved mockup:** dark theme, cyan accent, minimal composition.
5. **Bilingual by construction:** EN and ES always ship together.

## Title II — Technical principles
- **Architecture:** a static-first React frontend on Vercel (ADR-0001, ADR-0003) and a layered Express contact API (ADR-0002).
- **Stack and versions:**
  - Frontend: React, TypeScript (strict), Vite, Tailwind CSS 3, `motion`. Routing and pre-rendering: a custom Vite SSG pipeline (ADR-0003, Option C). Architecture maps: a native SVG component (ADR-0004).
  - API: Node.js, Express 4, Zod, Prisma 5 + MySQL, Helmet, express-rate-limit, Turnstile, Resend/Nodemailer.
  - Versions are pinned in each `package.json`.
- **Folder and module structure:**
  - Frontend `src/`: `components/{layout,sections,ui}`, `context`, `hooks`, `data`, `i18n`, `services`, `types`, `utils`.
  - API `src/`: `config`, `domain`, `application`, `infrastructure`, `interfaces/http/{controllers,middlewares,routes,validators}`, `types`.
- **Testing strategy:**
  - Vitest + Testing Library (unit and component) and Playwright + axe (e2e).
  - Every AC has ≥ 1 automated test.
  - Coverage is reported, not gated (ASM-011).
- **Code style and tools:**
  - ESLint (flat config) and TypeScript `strict: true` / `noImplicitAny: true`.
  - Max 100 chars per line; max 40 lines per function; early returns.
  - Named exports for utils, hooks and services; default exports only for page or route components.
- **Error handling, logging and observability:**
  - API: a centralized error handler; no stack traces in production; env validated at startup (fail fast).
  - Frontend: user-facing errors are inline and bilingual; no `console.log` in committed code.

## Title III — Non-negotiable rules
- **Security and privacy:**
  - No secrets in code, logs, commits or docs; `.env.example` always maintained.
  - `TURNSTILE_SECRET_KEY` and all API secrets stay server-side.
  - CORS allow-list; contact rate limit of 5 requests / 15 min / IP; every request is validated with a schema.
  - External links use `rel="noopener noreferrer"`; iframes use `sandbox`.
- **Data:**
  - Content lives in typed files under `frontend/src/data/`.
  - Every user-visible string is a `{ en; es }` pair or comes from a typed dictionary.
  - Demo credentials are published only after they are verified.
- **Applicable regulatory compliance:**
  - Personal data from the contact form is handled per the retention policy (OQ-005).
  - Third-party quotes are published only with written consent (BR-007).
  - This is not legal advice.
- **Project-specific prohibitions:**
  - No new color palettes outside the Tailwind tokens; no hardcoded brand colors.
  - No content that contradicts the profile README.
  - No paid services without approval (ASM-004).

## Title IV — Conventions
- **Languages:**
  - Docs, code, identifiers and commits in English.
  - UI in EN/ES.
  - Conversation with the owner in Spanish.
- **Naming** (from the glossary):
  - `camelCase` variables; `UPPER_SNAKE_CASE` constants.
  - `verbNoun` functions; `PascalCase` components, with the file named after the component.
  - Hooks prefixed with `use`.
  - No abbreviations or single-letter names.
- **JSDoc:** required in English on every function, hook and component (`@param` for each prop or argument, `@returns`, `@async` where it applies).
- **Tailwind:**
  - Tokens in `tailwind.config.ts`; `darkMode: 'class'`; mobile-first.
  - Class order: layout → sizing → spacing → typography → colors → borders → effects → transitions → responsive → dark.
  - Repeated patterns go into `@apply` semantic classes.
- **React:**
  - One component per file.
  - Logic in hooks or services, rendering in components.
  - Destructured props.
  - Context only for truly global state.
  - Lazy-load non-critical UI.
- **Git:**
  - Protected `main`; `feat/NNN-slug`, `fix/…`, `chore/…` branches.
  - Conventional Commits with the task id (`feat(portfolio): … [T-03]`).
  - One logical commit per task; no force push.
- **Formats:** dates like "Jun–Oct 2026"; time zone UTC-5.

## Title V — Quality
- **Definition of Ready and Definition of Done:** GENESIS §C.5–C.6, plus:
  - (a) Every UI change is verified in both languages and both themes.
  - (b) Every route change is verified on the Vercel preview before G-Merge.
  - (c) External URLs added by a spec are checked to be reachable (NFR-013).

## Title VI — Collaboration with agents
- **Mentor mode:** active.
- **Autonomy level:** the Implementer works autonomously within an approved plan.
- **Additional project-specific stops:**
  - (1) Any change to the Vercel project settings or to DNS: the owner applies it.
  - (2) Upgrading Node, or any global tool, on the owner's machine.
  - (3) Publishing any third-party personal data.

## Amendment log
| Version | Date | Change | Reason | Approved by |
|---|---|---|---|---|
| 1.0.0 | 2026-11-26 | Initial version, distilled from `rules/portfolio_rules.md` and the brief | Genesis G3 | Hernán (G-Foundational) |
