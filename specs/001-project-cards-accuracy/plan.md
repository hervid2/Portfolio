# Plan — Spec 001
Spec: `specs/001-project-cards-accuracy/spec.md` v1.1 (Planned, G-Plan 2026-11-27) ·
Planned: 2026-11-27 · Status: Approved (G-Plan 2026-11-27, Hernán; D-1 … D-4 as recommended)

Checked on 2026-11-27 (Art. 14): `npm view simple-icons version license time` → latest 16.38.1
(published 2026-11-22, CC0-1.0). The icons are copied from **16.37.0** (published 2026-11-08, more
than two weeks old), whose `package.json` also declares `CC0-1.0`. Each slug below was fetched from
`https://cdn.jsdelivr.net/npm/simple-icons@16.37.0/icons/<slug>.svg` (HTTP 200, `<title>` checked).
`awslambda`, `amazons3` and `groq` return 404 in 16.37.0 and 16.38.1, so those three labels use the
neutral generic icon. **No npm dependency is added** (§7).

Code read for this plan: `frontend/src/types/{project,i18n}.ts`, `data/projects.ts`,
`utils/techIcons.ts`, `components/ui/{ProjectCard,ProjectCardActions,ProjectStackList,ThemeIcon}.tsx`,
`components/sections/{PortfolioGrid,PortfolioSection}.tsx`, `context/LanguageContext.tsx`,
`i18n/{en,es,dictionaries.test}.ts`, `test/setup.ts`, `vitest.config.ts`, `tsconfig.json`,
`styles/index.css`, `tailwind.config.ts`, `.github/workflows/ci.yml`, and the installed
`framer-motion` viewport feature.

## 1. Technical approach (and discarded alternatives)

### 1.1 Data model: `kind` and `coldStartNotice`
- `frontend/src/types/project.ts` gains
  `export type ProjectKind = "client" | "personal";` and two fields on `Project`:
  - `kind: ProjectKind` — **required** (FR-016, glossary "Project kind").
  - `coldStartNotice?: boolean` — optional; absent means `false` (FR-019).
- **Name kept: `coldStartNotice`.** It is the glossary term and says what the card shows. The
  glossary row loses its "name proposed" note (T-19).
  - *Discarded:* `hasColdStart` / `slowFirstLoad`. They describe the server, not the card
    content, and would force a glossary rename for no gain.
  - *Discarded:* a `coldStartNotice: { en; es }` text field per project. K-04 is one shared
    sentence (ASM-001-04), so per-project copy would duplicate it four times; the flag plus one
    dictionary key keeps EN/ES parity in one place.
- `kind` sits right after `category` in each object, and `coldStartNotice` (only where the audit
  says so) right after `liveDemoUrl`, so diffs stay local.
- **Type-level proof (AC-001-08, CL-12):** a fixture in `frontend/src/data/projects.test.ts`
  carries **every** other required field and omits only `kind`, under
  `// @ts-expect-error -- kind is required (AC-001-08)`. If `kind` ever becomes optional, the
  directive is unused and `tsc -b` fails. The fixture is used in an assertion
  (`expect(fixture.id).toBe(...)`) so `no-unused-vars` stays quiet. `tsconfig.json` includes `src`,
  so `npm run typecheck --prefix frontend` checks it (and so does `npm run build`).

### 1.2 Stacks and descriptions
- Stacks: exactly the "Approved stack" column of spec §6, in that order, ≤ 10 chips, no versions
  (ASM-001-01, ASM-001-02).
- Descriptions: exactly K-10 … K-17 of spec §7, copied byte for byte. The `max-len` relaxation for
  `src/data/**` strings (spec 000, ASM-000-01) already covers the long lines.
- Credentials are **not** touched in these tasks; they change only in T-18, from the audit summary.

### 1.3 Tech icons (OQ-001-03, two tasks)
- `frontend/src/utils/techIcons.ts` gains 16 explicit keys (table below) and exports
  `hasTechIcon(stackLabel: string): boolean` (`stackLabel.toLowerCase() in techIconPathByLabel`).
  `resolveTechIconPath` and `FALLBACK_ICON_PATH` stay as they are. Existing keys stay, even the
  ones no stack uses after 001 (`vanilla.js`, `sql`, `websockets`, …): removing them is cleanup
  outside the spec. Today only `ProjectStackList` calls `resolveTechIconPath`.
  - *Discarded:* exporting the whole map. A helper keeps the map private and is what AC-001-05
    names first.
- **File convention (ASM-001-16):** same as the existing icons, which are Simple Icons glyphs:
  the light file is the upstream SVG unchanged (default black fill); the `-dark` file is the same
  SVG with `fill="white"` on the `<svg>` element (as `nextjs-dark.svg`). No brand hex colors.
- **Generic icon:** one original 24×24 single-path glyph (a neutral outline cube), authored in this
  repository, `role="img"`, `<title>Technology</title>`, no brand shapes. Light = default fill,
  dark = `fill="white"`. License: the repository's own (original work, no third-party rights).
  - *Discarded:* Lucide or another ISC/MIT icon set. License-clean, but it needs a notice file for
    one glyph; an original glyph needs none.
  - *Discarded:* reusing `javascript.svg` (the current fallback). It is a brand logo and would say
    "JavaScript" next to "AWS Lambda".

| Label (as on the card) | Map key | Files (in `frontend/public/assets/icons/tech/`) | Source | License |
|---|---|---|---|---|
| NestJS | `nestjs` | `nestjs.svg`, `nestjs-dark.svg` | `simple-icons@16.37.0/icons/nestjs.svg` | CC0-1.0 |
| Prisma | `prisma` | `prisma.svg`, `prisma-dark.svg` | `…/icons/prisma.svg` | CC0-1.0 |
| Upstash Redis | `upstash redis` | `upstash.svg`, `upstash-dark.svg` | `…/icons/upstash.svg` | CC0-1.0 |
| Turborepo | `turborepo` | `turborepo.svg`, `turborepo-dark.svg` | `…/icons/turborepo.svg` | CC0-1.0 |
| Vite | `vite` | `vite.svg`, `vite-dark.svg` | `…/icons/vite.svg` | CC0-1.0 |
| Sequelize | `sequelize` | `sequelize.svg`, `sequelize-dark.svg` | `…/icons/sequelize.svg` | CC0-1.0 |
| Socket.IO | `socket.io` | `socketio.svg`, `socketio-dark.svg` | `…/icons/socketdotio.svg` | CC0-1.0 |
| Nginx | `nginx` | `nginx.svg`, `nginx-dark.svg` | `…/icons/nginx.svg` | CC0-1.0 |
| DigitalOcean | `digitalocean` | `digitalocean.svg`, `digitalocean-dark.svg` | `…/icons/digitalocean.svg` | CC0-1.0 |
| Spring Data JPA | `spring data jpa` | `spring.svg`, `spring-dark.svg` | `…/icons/spring.svg` (Spring project logo) | CC0-1.0 |
| Flyway | `flyway` | `flyway.svg`, `flyway-dark.svg` | `…/icons/flyway.svg` | CC0-1.0 |
| JUnit 5 | `junit 5` | `junit5.svg`, `junit5-dark.svg` | `…/icons/junit5.svg` | CC0-1.0 |
| AWS Lambda | `aws lambda` | `generic-tech.svg`, `generic-tech-dark.svg` | Original (no Simple Icons entry: `awslambda` 404) | Repository's own |
| Amazon S3 | `amazon s3` | `generic-tech.svg`, `generic-tech-dark.svg` | Original (`amazons3` 404) | Repository's own |
| LLM tool calling (Groq) | `llm tool calling (groq)` | `generic-tech.svg`, `generic-tech-dark.svg` | Original (`groq` 404) | Repository's own |
| Vanilla JS | `vanilla js` | `javascript.svg` (existing, no dark variant, as the `vanilla.js` key) | Existing file | Unchanged |

Full source URL prefix: `https://cdn.jsdelivr.net/npm/simple-icons@16.37.0/icons/`. Simple Icons
licenses the SVG drawings as CC0; the marks remain their owners' trademarks and are used
nominatively next to the technology name, as the existing icons are. 26 new files (12 brand pairs
+ 1 generic pair).

### 1.4 i18n keys (NFR-006)
`AppDictionary.portfolio` (`frontend/src/types/i18n.ts`) gains, and `en.ts` / `es.ts` fill:

| Key | EN | ES | Spec |
|---|---|---|---|
| `portfolio.kind.client` | Client project | Proyecto de cliente | K-01 |
| `portfolio.kind.personal` | Personal project | Proyecto personal | K-02 (first part) |
| `portfolio.kind.personalQualifier` | deployed | desplegado | K-02 (after the "·") |
| `portfolio.coldStartNotice` | Heads-up: the first load may be slow while the demo server wakes up. | Aviso: la primera carga puede ser lenta mientras el servidor de la demo se activa. | K-04 |
| `portfolio.subtitle` (existing, value changes) | A selection of client work and personal projects deployed to production. | Una selección de trabajo para clientes y proyectos personales desplegados en producción. | K-03 |

- K-02 is split so the component can wrap only the "·" in `aria-hidden="true"` (CL-10). The
  middle dot is markup, not dictionary text. The existing `dictionaries.test.ts` parity and
  non-empty checks cover the new keys; T-06 adds one test that pins K-01 … K-04 to the approved
  literals, so component tests can read the dictionary (testing-conventions rule 3).
  - *Discarded:* one string "Personal project · deployed" split at runtime on "·". Fragile, and
    it hides markup in copy.

### 1.5 Card UI
- **New `ProjectKindLabel`** (`components/ui/ProjectKindLabel.tsx`): a `<p>` eyebrow.
  - Classes: `inline-flex w-fit items-center gap-1 rounded-md border border-border-subtle
    bg-surface-muted px-2 py-0.5 text-xs font-semibold text-text-secondary` — the first allowed
    pair of spec §7 (7.63:1 light, 10.64:1 dark). The `rounded-md` shape and no icon keep it
    distinct from the `rounded-full` stack chips.
  - Personal: `{personal} <span aria-hidden="true">·</span> {personalQualifier}`, with the spaces
    **outside** the hidden span so the accessible text keeps a word break (ASM-001-15).
  - *Discarded:* the accent eyebrow (`text-accent-cyan-strong` light / `text-accent-cyan` dark).
    The light theme is `html.theme-light` and Tailwind's `dark:` variant is not wired to it
    (`darkMode: "class"` expects `.dark`, which the app never sets; no `dark:` class exists in
    `src/`). A per-theme color would need a new CSS rule for one label; using
    `accent-cyan-strong` in both themes would leave the pairs spec §7 allows.
- **New `ColdStartNotice`** (`components/ui/ColdStartNotice.tsx`): `<p role="note"
  className="text-xs text-text-secondary">{text}</p>`.
- **New `ProjectCardBody`** (`components/ui/ProjectCardBody.tsx`): the current
  `<motion.div layout="position">` moves here unchanged, plus the label and the notice, in the
  spec §4.1 A order: label, `<h3>`, description, `ProjectStackList`, then a footer
  `<div className="mt-auto flex flex-col gap-3">` holding the notice (when flagged) and
  `ProjectCardActions`.
  - Why the footer wrapper: `ProjectCardActions` has `mt-auto`; two auto margins in one flex
    column split the free space, so the notice would float. Inside the wrapper the actions'
    `mt-auto` has no free space and is inert. Cards without a notice render the same box as today.
  - Why extract: `ProjectCard` is close to the 40-line limit (NFR-008) and gains `forwardRef`
    in T-11. *Discarded:* putting everything in `ProjectCard` (breaks `max-lines-per-function`).
- **Motion (NFR-004):** the label and the notice are plain elements inside the existing
  `layout="position"` container; no `motion.*`, no `whileHover`.
- **DEBT-013 (AC-001-22):** `ProjectCard` becomes
  `export const ProjectCard = forwardRef<HTMLElement, ProjectCardProps>(function ProjectCard(...)
  {...})` and passes `ref` to `motion.article`. JSDoc stays on the `const`. *Discarded:* changing
  `AnimatePresence` to `mode="sync"` (changes the exit animation; the debt entry prefers
  `forwardRef`).

### 1.6 Demo audit (FR-019, BR-008)
- **Deliverable:** `docs/discovery/demo-audit.md`, with exactly these headings (the unit test
  matches them):
  `## 1. Header`, `## 2. Method`, `## 3. Per-project results`, `## 4. Credentials`,
  `## 5. Findings and follow-ups for Hernán`, `## 6. Machine-readable summary`. Contents per spec
  §8.2; section 6 holds one fenced `json` block with exactly `auditDate`, `verifiedUsernames`,
  `ownerExceptionUsernames`, `coldStartProjectIds`.
- **Audit run and date (ASM-001-14, decision D-1):** a run starts with the preflight task (T-12).
  `auditDate` is the **first** day of the run; every link, video, login and latency record is
  dated on or after it and within 7 days of it, and G-Merge must happen within 7 days of
  `auditDate`, otherwise spec §4.2 B4 applies (re-run). *Discarded:* `auditDate` = last day of
  the run, which lets the oldest evidence be up to 14 days old at G-Merge.
- **Procedure** (each step is its own task; spec §4.1 B, §4.2, §4.3):
  1. **Preflight (T-12, no login; needs Hernán's go-ahead to start the run):**
     - check that the Playwright MCP server connects; if not, record it and switch the login
       tasks to the fallback (Hernán logs in by hand, the auditor records);
     - write sections 1–2 (header with the OQ-001-04 / OQ-001-12 owner confirmations dated
       2026-11-27, BR-008 rules, the exact commands);
     - for every `liveDemoUrl` and `codeUrl`:
       `curl -sL -o /dev/null -w "%{http_code} %{url_effective}" <url>` and `curl -sIL <url>`
       (status lines only) — final 2xx passes (NFR-013);
     - for every `demoVideoId` (EN, ES):
       `curl -s -o /dev/null -w "%{http_code}" "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json"`
       — 200 passes;
     - OQ-001-11 (spec §4.2 B5): open the Slicing Edge and Sushi Burrito Web frontends' **public**
       pages with the Playwright MCP, read the network requests, and record the API base URL and
       any health route found. No login, no form. The result is a proposal; OQ-001-11 closes when
       Hernán confirms it (or gives the URLs).
     - Any final 4xx/5xx or oEmbed failure: one re-check in the same run; if it still fails, stop
       and escalate to Hernán (B-E1, B-E4).
  2. **Logins, one task per demo (T-13 Sushi Burrito Web, T-14 Slicing Edge, T-15 FlyWorkFlow;
     each needs Hernán's explicit go-ahead for that demo):** at most one attempt per published
     account; record role and landing page; log out. FlyWorkFlow: Admin and Member only; the
     Super Admin row is written as `not audited — owner investigation pending` with no login.
     Failure → visible message only, no retry, no reset link (B-E2). Real-looking data → log out,
     record "possible production data" without copying, escalate (B-E3). No screenshot of a
     logged-in page is stored.
  3. **Latency, two sessions (T-16, T-17; need Hernán's go-ahead and OQ-001-11 closed):**
     `curl -s -o /dev/null -w "%{time_starttransfer} %{time_total} %{http_code}" <endpoint>` per
     ASM-001-03, each sample after ≥ 30 min without traffic from the auditor; 3 samples per
     endpoint over the two sessions (session 1 takes 2, session 2 takes 1, or 1 + 2), sessions in
     separate implementer invocations. Notice = yes if any `time_total` > 10 s.
  4. **Close (T-18, no live access):** findings (spec §8.2 item 5, at least the four listed
     follow-ups), the summary block, then `projects.ts` is set from the summary and the
     audit-summary tests are added.
- Commands run from Git Bash on Hernán's machine; times are recorded in UTC-5 (constitution
  Title IV).

## 2. Files to create / modify
| Path | Action | Reason |
|---|---|---|
| `specs/001-project-cards-accuracy/spec.md` | Modify | Done before implementation: v1.0 at G-Spec (OQ-001-15 closed); v1.1 at G-Plan with ASM-001-14 … -16 and the six §8.2 headings (§8, D-4) |
| `frontend/src/types/project.ts` | Modify | `ProjectKind`, `kind`, `coldStartNotice?` (AC-001-08, -16) |
| `frontend/src/data/projects.ts` | Modify | `kind`, stacks, descriptions (T-01 … T-03); credentials and `coldStartNotice` from the audit (T-18) |
| `frontend/src/data/projects.test.ts` | Create | Data invariants AC-001-01 … -04, -06 (U), -07, -08; audit summary AC-001-13 (U), -14, -15, -16 |
| `frontend/src/utils/techIcons.ts` | Modify | 16 keys, `hasTechIcon` (AC-001-05) |
| `frontend/src/utils/techIcons.test.ts` | Create | AC-001-05 (map keys and files exist) |
| `frontend/public/assets/icons/tech/{nestjs,prisma,upstash,turborepo,vite,sequelize,socketio,nginx,digitalocean,spring,flyway,junit5}{,-dark}.svg` | Create (24) | Brand icons, §1.3 table |
| `frontend/public/assets/icons/tech/generic-tech{,-dark}.svg` | Create (2) | Neutral generic icon, §1.3 |
| `frontend/src/types/i18n.ts` | Modify | `portfolio.kind`, `portfolio.coldStartNotice` |
| `frontend/src/i18n/en.ts`, `frontend/src/i18n/es.ts` | Modify | K-01 … K-04 (§1.4) |
| `frontend/src/i18n/dictionaries.test.ts` | Modify | Pins K-01 … K-04 to the approved literals |
| `frontend/src/components/ui/ProjectKindLabel.tsx` (+ `.test.tsx`) | Create | Kind label (AC-001-09) |
| `frontend/src/components/ui/ColdStartNotice.tsx` (+ `.test.tsx`) | Create | Notice (AC-001-17) |
| `frontend/src/components/ui/ProjectCardBody.tsx` | Create | Card body with label, notice and footer (§1.5) |
| `frontend/src/components/ui/ProjectCard.tsx` | Modify | Uses `ProjectCardBody` (T-09); `forwardRef` (T-11) |
| `frontend/src/components/ui/ProjectCard.test.tsx` | Create | AC-001-06 (C), -10, -17 |
| `frontend/src/components/sections/PortfolioSection.test.tsx` | Create | AC-001-11 (T-06), -09 and -20 (T-10) |
| `frontend/src/components/sections/PortfolioGrid.test.tsx` | Create | AC-001-22 |
| `frontend/src/test/setup.ts` | Modify only if needed | `IntersectionObserver` shim, only if a component test fails without it (R-7) |
| `docs/discovery/demo-audit.md` | Create | The demo audit (T-12 … T-18) |
| `docs/glossary.md` | Modify | "Cold-start notice": name final, drop "proposed" (T-19) |
| `docs/traceability.md` | Modify | FR-014, FR-015, FR-016, FR-019 → ACs and tests (T-19) |
| `docs/roadmap.md` | Modify | DEBT-013 → Closed (T-19); row 001 status at G-Merge (coordinator, P-03) |
| `MEMORY.md` | Modify | ASM-008 status (open, owner investigation) and the audit date (T-19) |
| `docs/discovery/brief.md` | No change expected | ASM-008 row already has the owner note (spec v0.2); reviewer checks it (AC-001-15) |

Not touched: `api/`, `ProjectCardActions.tsx`, `ProjectStackList.tsx`, `CredentialsModal.tsx`,
`PortfolioGrid.tsx`, Vercel settings, the project repositories.

## 3. Data changes and migrations (with rollback strategy)
- No database and no migration: static typed content (spec §6). `id` slugs are not renamed.
- `kind` is required, so a project without it fails `tsc` (the build fails before deploy).
- **Credentials:** after T-18, each project's `demoCredentials` equals `verifiedUsernames[id]` +
  `ownerExceptionUsernames[id]` (role labels follow the app if the audit observed a different
  name). A project left with no credentials drops the property (or keeps `[]`); the button hides
  either way (A2). `java-desktop-app` keeps no credentials.
- **Rollback:**
  - Before merge: `git revert <task commit>`; every task is one commit.
  - After merge: revert the merge commit on a `fix/` branch and merge it; Vercel redeploys `main`.
    The API is not touched.
  - A removed credential is **not** restored by a revert alone: Title III requires a passing
    re-test first (spec §4.2 B2). If a revert would re-publish removed credentials, the revert
    PR also removes them again.
  - Icon files are additive; leaving them after a revert is harmless.

## 4. Contracts (API, events, interfaces)
- **No API contract change.** The contact API is not touched.
- **TypeScript contracts:**
  ```ts
  export type ProjectKind = "client" | "personal";
  // Project: kind: ProjectKind; coldStartNotice?: boolean;
  export function hasTechIcon(stackLabel: string): boolean;
  // AppDictionary["portfolio"]:
  //   kind: { client: string; personal: string; personalQualifier: string };
  //   coldStartNotice: string;
  ```
- **Component props:**
  - `ProjectKindLabel({ kind, labels })` — `labels: AppDictionary["portfolio"]["kind"]`.
  - `ColdStartNotice({ text })`.
  - `ProjectCardBody` — the same props as `ProjectCard` (`project`, `language`, `dictionary`,
    `onOpenVideo`, `onOpenCredentials`).
  - `ProjectCard` — unchanged props; now also accepts `ref` (`HTMLElement`).
- **Document contract:** `docs/discovery/demo-audit.md` headings and summary keys (§1.6, spec
  §8.2). The summary block is the last fenced `json` block in the file; the test parses it with
  `JSON.parse` and fails on extra or missing keys.

## 5. UI components
| Component | New / changed | Screen | Notes |
|---|---|---|---|
| `ProjectKindLabel` | New | UI-02 | `<p>` eyebrow before the `<h3>`, chip palette tokens, "·" `aria-hidden`; no motion; no ARIA role |
| `ColdStartNotice` | New | UI-02 | `<p role="note">`, `text-xs text-text-secondary`; only when `coldStartNotice` |
| `ProjectCardBody` | New (extracted) | UI-02 | Body order: label, title, description, stack, footer (notice, actions) |
| `ProjectCard` | Changed | UI-02 | Renders media + `ProjectCardBody`; `forwardRef` |
| `PortfolioSection` | Copy only | UI-02 | Subtitle text comes from the dictionary (K-03); no code change |
| `CredentialsModal` | Content only | UI-07 | Lists whatever `demoCredentials` holds after T-18; no code change |

Layout target: 360 px and 1280 px, both themes, no horizontal scroll; longer descriptions make
cards taller, never clipped (checked in validation, AC-001-12).

## 6. Testing strategy (unit, integration, e2e) mapped to each AC
Unit and component tests: Vitest 3 + Testing Library, names start with the AC id
(testing-conventions rule 5). Data-invariant tests compare against constants in the test file,
copied from spec §6 and §7 (ASM-001-11 — a deliberate exception to "read expected lists from
`src/data/`", because the data is what is under test); credentials and notices are compared with
the audit summary, never with constants. Files are read with `node:fs` and paths built from
`import.meta.url` (`new URL("../../../docs/discovery/demo-audit.md", import.meta.url)` from
`src/data/`, `new URL("../../public" + iconPath, import.meta.url)` from `src/utils/`). CI checks
out the whole repository, so `docs/` is present in the `frontend` job.

| AC | Type | Test (file → case) | Task |
|---|---|---|---|
| AC-001-01 | U | `data/projects.test.ts` → FlyWorkFlow stack equals the §6 list | T-02 |
| AC-001-02 | U | `data/projects.test.ts` → no "Next.js 14" in any description/stack; FlyWorkFlow EN/ES contain the 8 terms | T-03 |
| AC-001-03 | U | `data/projects.test.ts` → other three stacks equal §6; every stack ≤ 10 | T-02 |
| AC-001-04 | U | `data/projects.test.ts` → each `description.en/.es` equals K-10 … K-17 | T-03 |
| AC-001-05 | U | `utils/techIcons.test.ts` → every label in every stack: `hasTechIcon` true; `iconPath` and declared `iconPathDark` files exist; the 16 D-10 labels listed explicitly, incl. `"vanilla js"` → `javascript.svg` | T-04, T-05 |
| AC-001-06 | U, C | U: `data/projects.test.ts` → first sentence EN starts "AI shopping assistant", ES "Asistente de compras con IA", both name the 3 terms. C: `ui/ProjectCard.test.tsx` → EN card description starts "AI shopping assistant" | T-03, T-09 |
| AC-001-07 | U | `data/projects.test.ts` → Slicing Edge stack contains "LLM tool calling (Groq)" | T-02 |
| AC-001-08 | U, T | `data/projects.test.ts` → kinds per BR-006; `@ts-expect-error` fixture (checked by `npm run typecheck`) | T-01 |
| AC-001-09 | C | `ui/ProjectKindLabel.test.tsx` → EN/ES text per kind; "·" in an `aria-hidden="true"` element. `sections/PortfolioSection.test.tsx` → the 4 cards in EN and ES show the right label | T-07, T-10 |
| AC-001-10 | C | `ui/ProjectCard.test.tsx` → rerender `language="es"`: label, description and notice switch; label precedes the `<h3>` (`compareDocumentPosition`) | T-09 |
| AC-001-11 | C | `sections/PortfolioSection.test.tsx` → subtitle equals K-03 in EN and (with stored language `es`) in ES | T-06 |
| AC-001-12 | M (exception §9) | Recorded in `validation.md`: browser matrix EN/ES × dark/light × 360/1280 + reduced motion at 360, measured contrast ratios, no horizontal scroll | P-02 |
| AC-001-13 | U, D | U: `data/projects.test.ts` → the six headings, parseable summary, valid `auditDate`, an entry per project id. D: reviewer checks tables, 8 credential rows, date window, statuses | T-18, P-02 |
| AC-001-14 | U | `data/projects.test.ts` → per project, published usernames = verified + owner exception | T-18 |
| AC-001-15 | U, D | U: `data/projects.test.ts` → Super Admin present with role and password unchanged; only username in `ownerExceptionUsernames`; not in `verifiedUsernames`. D: audit row and `brief.md` ASM-008 note | T-18, P-02 |
| AC-001-16 | U | `data/projects.test.ts` → `Boolean(coldStartNotice)` equals membership in `coldStartProjectIds` for every project; every listed id exists; `java-desktop-app` not listed | T-18 |
| AC-001-17 | C | `ui/ColdStartNotice.test.tsx` → `role="note"` with K-04 EN/ES. `ui/ProjectCard.test.tsx` → flagged fixture renders the note; unflagged renders none | T-08, T-09 |
| AC-001-18 | D (exception §9) | Reviewer checks the audit method and results (one attempt per account, no Super Admin login, BR-008 only, no copied data, OQ-001-04/-12 cited with date) | P-02 |
| AC-001-19 | M, D (exception §9) | Commands and results in `demo-audit.md` (T-12); validation re-runs the curl and oEmbed commands on the final data | T-12, P-02 |
| AC-001-20 | C | `sections/PortfolioSection.test.tsx` → click a category: each visible card shows its label; existing `ProjectFilterBar` / `useProjectFilter` tests stay green | T-10 |
| AC-001-21 | M, CI | The five commands locally on each task; CI `frontend` job green on the draft PR | every task, P-01 |
| AC-001-22 | C | `sections/PortfolioGrid.test.tsx` → `vi.spyOn(console, "error")`; render 4 projects, rerender with 3; no call containing "Function components cannot be given refs" | T-11 |

- Fixtures: component tests that need a flagged project build one with
  `{ ...projects[n], coldStartNotice: true }`, so they never depend on the audit outcome.
- e2e: none (spec 004, ASM-001-10). Browser checks use the Playwright MCP (AGENTS.md).

## 7. New dependencies (justification per Art. 10)
**None.** No npm package is added to `frontend/` or `api/`; `package.json` and the lockfiles do not
change.
- Icons: copied SVG files from `simple-icons@16.37.0` via jsDelivr (CC0-1.0), not the
  `simple-icons` package (≈ 4 MB of icons and data for 12 glyphs). *Discarded:* adding
  `simple-icons` as a dev dependency to import paths at build time (a dependency for static files
  that never change).
- Tests use `node:fs`, `node:url` (Node built-ins) and the existing Testing Library.
- The Playwright MCP is a tool, not a dependency (AGENTS.md, `.harness/mcp.md`).

## 8. Risks and mitigations
| ID | Risk | Mitigation |
|---|---|---|
| R-1 | The Playwright MCP does not connect (it failed in the clarify session and in this one) | T-12 checks it first; fallback per OQ-001-09: Hernán logs in by hand while the auditor records. Link, video and latency checks use `curl` and do not need it |
| R-2 | The 7-day window expires before G-Merge (latency needs two sessions and OQ-001-11) | Audit tasks run after all code tasks; T-12 … T-18 planned over ≤ 3 days; if G-Merge slips past `auditDate` + 7, run spec §4.2 B4 (re-run, one login per still-published account) |
| R-3 | A login locks or alters a shared demo account | One attempt per account per run, no retries, no other form, no reset link (BR-008); Hernán's go-ahead per demo |
| R-4 | A login shows real-looking data | B-E3: log out, record without copying, remove the credential, escalate (BR-007, Title III) |
| R-5 | OQ-001-11 stays open | Only T-16/T-17 and the notice decision wait; T-12 proposes endpoints from public network requests (B5). If unresolved by T-18, the affected project's notice is "N/A — endpoint unknown" and no notice is set; Hernán decides before G-Merge |
| R-6 | `ProjectCard` exceeds 40 lines after the change | `ProjectCardBody` extraction (§1.5); lint enforces it |
| R-7 | Component tests hit `whileInView` without `IntersectionObserver` in jsdom | The installed `framer-motion` viewport feature returns early when `IntersectionObserver` is undefined (`features/viewport/index.mjs:58`), so no shim is expected. If a test still fails on it, add the shim to `src/test/setup.ts` in that task (testing-conventions rule 4) |
| R-8 | `import.meta.url` is not a `file:` URL under Vitest's jsdom environment | Vitest serves modules from disk with `file:` URLs; if T-04 finds otherwise, switch to `path.resolve(process.cwd(), ...)` (cwd is `frontend/` in local runs and CI) and note it in the evidence |
| R-9 | `forwardRef` lets `popLayout` measure the exiting card, so the filter exit animation changes | Expected improvement (DEBT-013); checked in the browser in validation (AC-001-12 matrix includes a filter change) |
| R-10 | Longer descriptions clip or overflow at 360 px | No fixed heights in the card; validated at 360 px EN/ES (AC-001-12) |
| R-11 | Audit-summary tests make the suite red before the audit exists | They are added only in T-18, together with the summary, so every commit stays green |
| R-12 | Icon trademarks | CC0 covers the drawings; marks are used nominatively beside the name, as the existing icons; no brand colors added |
| R-13 | A demo link or video fails in the audit | B-E1/B-E4: re-check once, then escalate; the plan never hides a demo or swaps a video on its own |

**Decisions (approved by Hernán at G-Plan, 2026-11-27, all as recommended)**
- **D-1 — `auditDate` = first day of the audit run** (ASM-001-14). **Decided.** The 7-day window
  covers every audit record and G-Merge. Discarded: last day of the run (evidence may be up to 14
  days old at G-Merge).
- **D-2 — Kind label uses the stack-chip palette** (`text-text-secondary` on `bg-surface-muted`,
  `border-border-subtle`, `rounded-md`; §1.5). **Decided.** Discarded: accent eyebrow, which needs
  a new theme-conditional CSS rule because `dark:` is not wired to `html.theme-light`.
- **D-3 — Neutral generic icon drawn in the repo** (AWS Lambda, Amazon S3, LLM tool calling
  (Groq); §1.3). **Decided.** Discarded: an ISC/MIT icon set glyph with a notice file.
- **D-4 — Spec v1.1 (minor):** ASM-001-14 (audit date and window, §1.6), ASM-001-15 (K-02
  accessible text: the "·" is `aria-hidden` with spaces outside it; no visually hidden comma, so
  AC-001-09's visible-text check holds; screen readers hear "Personal project deployed") and
  ASM-001-16 (icon light/dark file convention, §1.3); the six exact §8.2 headings. **Applied**
  (spec v1.1, status Planned).

## 9. New or affected ADRs
- **No new ADR.** The changes follow existing patterns: typed static data, dictionary keys,
  semantic Tailwind tokens, static icon files.
- ADR-0001 (static-first frontend): respected — content stays in typed files.
- ADR-0003 (custom Vite SSG): not affected — no route or pre-render change in 001. When 002/004
  build the pre-render, the new label and notice are plain text and pre-render as is.
- ADR-0004 (native SVG architecture maps): not affected (specs 006/007).

Next step: G-Plan approved (2026-11-27); `/sdd-implement 001` starting with T-01 (`tasks.md`).
