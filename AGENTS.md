# AGENTS.md — Hernán David Cardona Portfolio
> Operating code for any AI agent. Concise by design: when in doubt, consult the linked documents.

## Project
A bilingual (EN/ES) personal portfolio that helps Hernán David Cardona get hired for remote
full-stack roles in the US, Canada and LATAM.
- **Frontend:** a React SPA on Vercel (`frontend/`).
- **API:** an Express contact API (`api/`).
- **Status:** live in production; under an SDD refactor (roadmap specs 000–008).

## Supreme Law (summary of docs/governance/GENESIS.md)
1. No approved spec, no code. Plan before Build.
2. Don't invent: ask, or record ASM / OQ.
3. Traceability: everything has an ID; every AC has its test.
4. Verify before declaring; provide evidence.
5. Minimal changes; one task, one commit.
6. Security by default; secrets never in the repository.
7. Destructive or costly actions → human confirmation.
8. At most 3 self-correction cycles; then escalate.
9. Spec-Anchored: if behavior changes, the spec comes first.
10. Context travels through files; update MEMORY.md.

Project-specific rules:
- The conversation with Hernán is in **Spanish**; docs, code and commits are in **English**.
- **Mentor mode is on.**
- The GitHub profile README (`hervid2/hervid2`) is the source of truth for positioning (BR-006).

## Reading order when starting a session
AGENTS.md → MEMORY.md → active spec (specs/NNN-*/) → documents that spec references.

## Document map
| I need… | I read… |
|---|---|
| Non-negotiable principles | docs/constitution.md |
| Vocabulary and names | docs/glossary.md |
| What the system does | docs/requirements/ (functional, non-functional, business-rules, roles-permissions) |
| Domain and data | docs/domain/model.md |
| Look and feel, screens | docs/ux/ui-brief.md |
| Why it is built this way | docs/architecture/overview.md, docs/adr/ |
| What's next | docs/roadmap.md |
| Requirement → test | docs/traceability.md |
| Discovery context | docs/discovery/brief.md |
| Full agent rules | docs/governance/GENESIS.md |

## Stack and versions
- **Frontend:** React 18.3, TypeScript 5.6 (strict), Vite 5.4, Tailwind CSS 3.4, `motion` 13, `react-helmet-async` 2.
- **API:** Node.js, Express 4, Zod 3, Prisma 5 + MySQL, Helmet, express-rate-limit, Cloudflare Turnstile, Resend / Nodemailer.
- **Decisions:**
  - Pre-rendering: a custom Vite SSG pipeline (ADR-0003, Option C).
  - Architecture maps: a native SVG component (ADR-0004).
- **Tooling:** ESLint 10, Prettier 3, Vitest 3 (+ Testing Library in the frontend).
- **Node:** 22.x locally (22.17).

## Project commands
Run from the repository root.

| Action | Command |
|---|---|
| Install dependencies | `npm ci --prefix frontend` · `npm ci --prefix api` |
| Development environment | `npm run dev --prefix frontend` (port 5173) · `npm run dev --prefix api` (port 4000) |
| Tests (all / one file) | `npm test --prefix frontend` · `npm test --prefix frontend -- <path>` · `npm test --prefix api` |
| Lint | `npm run lint --prefix frontend` · `npm run lint --prefix api` |
| Format / format check | `npm run format --prefix <pkg>` · `npm run format:check --prefix <pkg>` (`frontend` or `api`) |
| Type check | `npm run typecheck --prefix frontend` · `npm run typecheck --prefix api` |
| Build | `npm run build --prefix frontend` · `npm run build --prefix api` |
| Preview production build | `npm run preview --prefix frontend` |
| e2e | defined in spec 004 (Playwright) |
| API diagnostics (manual) | `npm run test:e2e --prefix api` · `test:persistence` · `test:smtp` |

## Repository structure
```text
frontend/src/   components/{layout,sections,ui} · context · hooks · data · i18n · services · types · utils
api/src/        config · domain · application · infrastructure · interfaces/http · scripts · types
docs/           governance · constitution · glossary · roadmap · traceability · discovery · requirements ·
                domain · ux · architecture · adr
specs/NNN-slug/ spec · clarifications · plan · tasks · validation
.harness/       canonical agents, commands, skills, mcp.md (IDE-agnostic)
.claude/        Claude Code adapters (generated from .harness/)
```

## Code conventions
Full rules: docs/constitution.md, Title II and Title IV.
- **TypeScript:** strict. JSDoc in English on every function, hook and component.
- **Size limits:** ≤ 100 chars per line; ≤ 40 lines per function.
- **Naming:**
  - Semantic English names, taken from the glossary.
  - Components in PascalCase, in a file with the same name.
  - Hooks start with `use`.
  - Named exports, except for page or route components.
- **Strings:** every user-visible string lives in `frontend/src/i18n/{en,es}.ts` or is a `{ en; es }` field in `frontend/src/data/`.
- **Tailwind:** tokens only; mobile-first; class order as set in the constitution.
- **Commits:** Conventional Commits ending in an id: the task id (`feat(portfolio): description [T-03]`);
  the spec id for spec-level commits with no task (`docs(spec): close spec 001 [001]`); the bug slug
  for /bug fixes (`fix(api): description [BUG-<slug>]`).

## Agents and commands
- **Agents** (`.harness/agents/`):
  - coordinator: the main session.
  - planner, implementer, reviewer: subagents.
- **Commands:** /feature, /sdd-specify, /sdd-clarify, /sdd-plan, /sdd-tasks, /sdd-implement, /sdd-validate, /sdd-status, /bug, /adr, /memory
  - Inline (main session, they need the human): /feature, /sdd-specify, /sdd-status, /bug, /memory.
  - The rest fork into their subagent.
- **Skills** (`.harness/skills/`): `i18n-dictionaries`, `project-data`, `ui-tokens-motion`, `testing-conventions`.
- **MCP:** Playwright only (`.harness/mcp.md`).
- **Limitation:** Claude Code cannot restrict a subagent's edits to specific paths, so per-role path limits are instructions, not enforcement. Reviewers check them in the diff.

## Mandatory verification after each change
- Per touched package (`frontend` and/or `api`): `npm run format:check`, `npm run lint`,
  `npm run typecheck`, `npm test` (or the affected test files) and `npm run build`,
  each with `--prefix <pkg>`.
- UI changes: check in the browser (Playwright MCP) in EN and ES, dark and light themes, at 360 px and 1280 px.
- Route or pre-render changes: `curl` the built HTML and confirm the content is there.
- `api/` changes: the API does not auto-deploy. The last G-Merge item is "deployed to the droplet
  and verified in production" (steps in `.harness/agents/coordinator.md`, Procedure 4).

## Forbidden
- Committing to `main`; force push; pushing without asking.
- Secrets in the repo, including in `.env.example`.
- New dependencies outside an approved plan.
- Editing any file outside the approved plan, even a one-class change, before Hernán approves it;
  record the dated approval in `tasks.md` (spec 001: T-11a / C-01).
- Copy that contradicts the GitHub profile README.
- Hardcoded brand colors or new palettes.
- Publishing third-party personal data without consent (BR-007).
- Touching the Vercel settings or DNS: Hernán does that.

## Tool adapters
- `.harness/` is the source of truth.
- For Claude Code:
  - `CLAUDE.md` imports this file.
  - `.harness/agents/*.md` → `.claude/agents/*.md`, with the frontmatter translated to Claude Code fields.
  - `.harness/commands/*.md` → `.claude/commands/*.md`.
  - `.harness/skills/*` → `.claude/skills/*`.
  - `.harness/mcp.md` → `.mcp.json`.
- **To regenerate:** edit `.harness/`, then ask an agent to "regenerate the Claude Code adapters from .harness/ following AGENTS.md § Tool adapters".
- If Hernán switches tools, repeat only this step (GENESIS §G4.7).
