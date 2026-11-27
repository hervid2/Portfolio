# Spec 001 — Project cards accuracy
Status: Draft · Version: 0.1 · Branch: feat/001-project-cards-accuracy ·
FR: FR-014, FR-015, FR-016, FR-019 · BR: BR-006, BR-007 · NFR: NFR-003, NFR-006, NFR-011,
NFR-012, NFR-013 · Backlog: PO-4, PO-5, PO-6, PO-9 · Debt candidate: DEBT-013 (OQ-001-07) ·
Depends on: 000

## 1. Objective
Recruiters and hiring managers judge the portfolio by its four project cards, and today the cards
contradict the GitHub profile README (BR-006): FlyWorkFlow says "Next.js 14" and omits NestJS,
AWS Lambda and S3; Slicing Edge buries its AI assistant mid-sentence; nothing tells client work
apart from personal work; and some demo credentials have never been checked (ASM-008). This spec
makes every card truthful and verifiable: content matches the profile README, each card shows its
project kind, and every published credential and delay notice is backed by a dated demo audit
(`docs/discovery/demo-audit.md`).

## 2. Scope
**Includes**
- **FlyWorkFlow stack and description (PO-4, FR-014):** the stack and EN/ES description in §6 and
  §7, aligned with the profile README; no "Next.js 14" anywhere.
- **Other three cards' stack and description (FR-014, "for each project"):** aligned with the
  profile README as proposed in §6 and §7. Subject to **OQ-001-01** (the roadmap row names only
  FlyWorkFlow; FR-014 covers every project).
- **Slicing Edge AI assistant first (PO-5, FR-015):** the description starts with the AI shopping
  assistant and the stack includes the LLM.
- **Project kind (PO-6, FR-016):** a required `kind: ProjectKind` field on `Project`, a bilingual
  kind label on every card, and a new portfolio subtitle.
- **Demo audit (PO-9, FR-019):**
  - The deliverable `docs/discovery/demo-audit.md`, structured as in §8.2.
  - Removing every credential the audit does not verify.
  - Resolving ASM-008 (FlyWorkFlow Super Admin), see OQ-001-05.
  - A bilingual cold-start notice on each card whose demo the audit measures at > 10 s on first
    load.
- **Stack icons:** every new stack label gets a dedicated icon instead of today's JavaScript
  fallback, subject to **OQ-001-03**.
- **Tests:** data-invariant unit tests and component tests for every AC (§10).
- **Glossary:** new terms "Cold-start notice" and "Demo audit" (added with this spec).

**Does not include**
- The hero copy, which still says "web and desktop" (spec 002, FR-017), and About/Skills (spec
  003, FR-018).
- Case-study links, architecture-map buttons and the Sushi Burrito testimonial (specs 006, 007,
  008).
- Filtering the grid by project kind; new categories; adding projects (OQ-003).
- New demo accounts, reseeding demo data, or any change in the project repositories themselves
  (their READMEs, seeds or deployments). Findings that need such changes are recorded in the
  audit as follow-ups for Hernán.
- Automated or periodic link and demo monitoring (NFR-013 stays a manual check per release).
- Extra per-demo notes such as "the interface opens in Spanish" or "the demo data is shared"
  (OQ-001-08).
- DEBT-010 (reduced-motion entry animation), DEBT-011 and DEBT-014 (modals). DEBT-013 only if
  OQ-001-07 says so.

## 3. Actors and permissions
| Actor | Role in this spec | Permissions |
|---|---|---|
| Recruiter / hiring manager (visitor) | Reads the cards, opens demos and credentials | Read-only, public site |
| Hernán (owner) | Approves copy, stacks and the audit go-ahead; resolves OQs; fixes demo accounts in the project repos if he wants them kept | Full |
| Auditor (implementer agent with Hernán's go-ahead, or Hernán) | Runs the live demo audit (§4.1 B) | Logs in with published demo credentials only; read-only actions only (BR-A1, §5) |

No new roles or API permissions. The contact API is not touched.

## 4. Flows
### 4.1 Main flow
**A. Visitor reads a card (after this spec)**
1. The visitor reaches the Portfolio section and reads the subtitle (§7, K-03).
2. Each card shows, in this reading order: media, kind label (K-01 or K-02), title, description,
   stack chips, the cold-start notice when flagged (K-04), and the action row.
3. The visitor switches EN ↔ ES: the subtitle, kind label, description and notice change language
   without a reload; title and stack chips do not change (they are proper names).
4. The visitor opens "Demo Credentials": only audit-verified accounts are listed.

**B. Live demo audit (task-level activity, needs Hernán's go-ahead)**
1. Before any login, Hernán gives an explicit go-ahead per demo; Sushi Burrito Web only after
   OQ-001-04 is resolved.
2. For each project the auditor records, with date and time (UTC-5):
   - the HTTP status of `liveDemoUrl` and `codeUrl` (`curl -sI`, 2xx/3xx passes, NFR-013);
   - for `demoVideoId`, the YouTube oEmbed status of the EN and ES ids (200 passes);
   - the first-load latency per the method in ASM-001-03.
3. For each published credential the auditor makes **one** login attempt, records the role and
   the landing page shown, checks that the role matches the card label, and logs out. No other
   form is submitted and nothing is created, edited or deleted (BR-A1).
4. The auditor writes `docs/discovery/demo-audit.md` (§8.2) and lists, per credential, `verified`
   or `failed` (with the observed message, never a screenshot of real data).
5. The data in `frontend/src/data/projects.ts` is updated to match the audit: failed or
   unverified credentials are removed; `coldStartNotice` is set where the audit says so.

### 4.2 Alternative flows
- **A2. Project without demo credentials** (Sushi Burrito Desktop, or any project whose
  credentials were all removed by the audit): the card shows no credentials button (existing
  behavior of `ProjectCardActions`).
- **A3. Project without live demo** (Sushi Burrito Desktop): the video button replaces the live
  demo link (existing behavior). No first-load latency is measured and no notice is shown.
- **B2. A credential fails but Hernán wants to keep it:** he fixes the account in the project's
  own deployment; the auditor re-tests it (one new attempt) before G-Merge. Until it passes, it
  stays off the card.
- **B3. The demo is slow on one sample only:** the notice is shown if any sample exceeds 10 s
  (ASM-001-03).

### 4.3 Error flows
- **B-E1. Live demo URL returns 4xx/5xx or times out:** recorded as `failed` in the audit; the
  card keeps the link only if a re-check within the same audit run passes; otherwise the finding
  is escalated to Hernán before G-Merge (the spec does not decide to hide a demo on its own).
- **B-E2. Login fails:** stop after one attempt for that account (FlyWorkFlow locks an account
  after ten wrong passwords; repeated attempts by the auditor are not allowed). Record the
  visible error message; remove the credential (B2 for recovery).
- **B-E3. The login lands on data that looks real** (real names, real invoices, a real client's
  revenue): log out immediately, record "possible production data" without copying any of it,
  remove the credential and escalate to Hernán (BR-007, constitution Title III).
- **B-E4. A YouTube id is unavailable:** recorded as `failed`; escalated to Hernán (the spec does
  not pick a replacement video).

## 5. Applicable business rules
- **BR-006 — Source of truth for public positioning.** Card stack, description and kind must match
  the profile README (`hervid2/hervid2`), fetched on 2026-11-27. If the project's own README
  disagrees, the profile wins and the difference is reported (§8.3).
  - Example: FlyWorkFlow profile badge "Next.js 16" → the description says "Next.js 16"; the card
    saying "Next.js 14" is a violation.
  - Example: profile kind table → Sushi Burrito Desktop `client`, Sushi Burrito Web `client`,
    Slicing Edge `personal`, FlyWorkFlow `personal`.
  - Edge case: Slicing Edge's card lists "Docker", which the profile does not list → dropped by the
    proposed stack (§6), because only chips the sources support are kept and the card is capped at
    10 chips (ASM-001-02).
- **BR-007 — Testimonial authorization (applied by analogy to third-party data).** No person's
  name or quote is added by this spec. The client's business name and city ("a restaurant in
  Bucaramanga") already appear on the public profile README and are authorized in FR-021
  (ASM-001-10). The audit never copies data that belongs to a real client (B-E3).
- **Constitution Title III — "Demo credentials are published only after they are verified."**
  - Example: Super Admin `camila.rojas@flyworkflow.io` is not in the FlyWorkFlow README → not
    published unless OQ-001-05 says otherwise and the audit verifies it.
- **BR-A1 (audit safety, local to this spec; proposed for promotion to `business-rules.md` at
  G-Spec):** the live audit performs only: open the demo, one login per published account,
  observe the landing page, log out. It never submits another form, never creates, edits or
  deletes data, never retries a failed login, and never records third-party or real data.
  - Example: FlyWorkFlow Admin login succeeds → note "lands on dashboard, role Admin", log out.
  - Edge case: a password-reset link is offered after a failure → not used.

## 6. Data
**Affected entity:** `Project` (`frontend/src/types/project.ts`, `frontend/src/data/projects.ts`).

**New or modified fields**
| Field | Type | Required | Rule |
|---|---|---|---|
| `kind` | `ProjectKind` = `"client" \| "personal"` | Yes | BR-006 table (§5). New type in `frontend/src/types/project.ts`; already in the glossary and domain model |
| `coldStartNotice` | `boolean` (optional, absent = `false`) | No | `true` only where `demo-audit.md` measured a first load > 10 s (FR-019). Name proposed; the plan may refine it but must update the glossary |
| `stack` | `string[]` | Yes (existing) | Changed values, §6 table below; ≤ 10 items; official names without version numbers (ASM-001-01) |
| `description` | `{ en; es }` | Yes (existing) | Changed values, §7 K-10 … K-17 |
| `demoCredentials` | `DemoCredential[]` | No (existing) | Only accounts marked `verified` in `demo-audit.md` |

**Proposed stacks (for Hernán's approval, OQ-001-02).** Sources: profile README badges and text
for each project; "repo" means the project's own README.
| Project (`id`) | Current stack | Proposed stack (in order) | Source of every chip |
|---|---|---|---|
| `java-desktop-app` | Java, Spring Boot, Swing, SQL | Java, Spring Boot, Swing, Spring Data JPA, Flyway, MySQL, JUnit 5 | Profile badges + profile text ("Java Swing") |
| `sushi-burrito-spa` | Vanilla.js, Node.js, Express, WebSockets, SQL | Vanilla JS, Vite, Node.js, Express, Sequelize, MySQL, Socket.IO, Nginx, DigitalOcean | Profile badges (exactly) |
| `the-slicing-edge` | Next.js, TypeScript, React, Tailwind CSS, Fastify, PostgreSQL, Google OAuth, Stripe, Docker, GitHub Actions | Next.js, Fastify, TypeScript, Prisma, PostgreSQL, LLM tool calling (Groq), Stripe, Upstash Redis, Turborepo, GitHub Actions | Profile badges + profile text (GitHub Actions) + repo (TypeScript); "LLM tool calling (Groq)" is the profile's Tech stack label |
| `flyworkflow-incidents` | Next.js, TypeScript, React, SCSS, Mapbox GL, Zod, React Hook Form, Vitest, Playwright, GitHub Actions | Next.js, NestJS, TypeScript, Prisma, PostgreSQL, AWS Lambda, Amazon S3, Mapbox GL, Playwright, GitHub Actions | Profile badges + FR-014 (S3) + repo (TypeScript) |

**Validations**
- Type level: `kind` required on every `Project` (`tsc --noEmit`, NFR-006).
- Data-invariant tests (§10): kind per BR-006, approved stacks and copy, no "Next.js 14",
  credentials ⊆ the audit's verified list, notice flags = the audit's flagged list.

**Migrations:** N/A — static typed content, no database. The `id` slugs are not renamed (media and
`projectCardIdentity` depend on them).

## 7. Interface
**Screens:** UI-02 (Portfolio grid and cards); UI-07 (Credentials modal: content only, no layout
change).

**Behavior**
- **Kind label:** a small text chip in the card body, above the title, built only with Tailwind
  tokens and existing semantic classes (`ui-tokens-motion` skill; no new palette, no hardcoded
  colors). It is text, so meaning never depends on color alone (WCAG 1.4.1). It must meet AA
  contrast in both themes (NFR-003). Placement is ASM-001-05.
- **Cold-start notice:** one line of small text with `role="note"`, placed above the action row,
  only on flagged cards. Token colors only.
- **Subtitle:** replaces the current portfolio subtitle.
- **Stack chips:** unchanged component (`ProjectStackList`); each new label resolves a dedicated
  icon (OQ-001-03). The `alt` stays `"<label> icon"`.
- Layout must hold at 360 px and 1280 px with no horizontal page scroll, in both themes; the longer
  descriptions may make cards taller but must not clip text.

**States**
- Empty: N/A (the grid always has data). A card with no verified credentials hides the
  credentials button (A2).
- Loading / error: N/A (static content). Images and preview clips keep their current behavior.
- Success: N/A.

**Key copy (EN / ES).** Proposed; approved at G-Spec (OQ-001-02).
| Key | EN | ES |
|---|---|---|
| K-01 kind client | Client project | Proyecto de cliente |
| K-02 kind personal | Personal project · deployed | Proyecto personal · desplegado |
| K-03 portfolio subtitle | A selection of client work and personal projects deployed to production. | Una selección de trabajo para clientes y proyectos personales desplegados en producción. |
| K-04 cold-start notice | Heads-up: the first load may be slow while the demo server wakes up. | Aviso: la primera carga puede ser lenta mientras el servidor de la demo se activa. |

Descriptions (`Project.description`):
| Key | Project | EN | ES |
|---|---|---|---|
| K-10 / K-11 | `java-desktop-app` | The restaurant's first point-of-sale system, built in Java Swing over MySQL and in daily use Jun–Dec 2025; now the fallback for the web POS. Refactored in eight documented iterations to Spring Boot 3.3, Spring Data JPA, Flyway migrations, BCrypt, JUnit 5 and Mockito tests, and a self-contained installer (jpackage, jlink). | El primer sistema POS del restaurante, construido en Java Swing sobre MySQL y en uso diario jun–dic 2025; hoy es el respaldo del POS web. Refactorizado en ocho iteraciones documentadas a Spring Boot 3.3, Spring Data JPA, migraciones Flyway, BCrypt, pruebas con JUnit 5 y Mockito, y un instalador autocontenido (jpackage, jlink). |
| K-12 / K-13 | `sushi-burrito-spa` | Point-of-sale system in daily use at a restaurant in Bucaramanga, Colombia, since January 2026. Waiters take orders per table, the kitchen works from a live board over Socket.IO, and admins handle invoices and revenue reports. JWT auth with three roles; SPA on Vercel, API on a DigitalOcean droplet behind Nginx. | Sistema POS en uso diario en un restaurante de Bucaramanga, Colombia, desde enero de 2026. Los meseros toman pedidos por mesa, la cocina trabaja desde un tablero en vivo con Socket.IO y los administradores gestionan facturas y reportes de ingresos. Autenticación JWT con tres roles; SPA en Vercel y API en un droplet de DigitalOcean detrás de Nginx. |
| K-14 / K-15 | `the-slicing-edge` | AI shopping assistant (Llama 3.3 70B on Groq) that uses server-side tool calling to search products, recommend items and track orders. E-commerce for premium kitchen knives with Stripe Checkout and webhook-confirmed orders, Auth.js v5 with Google OAuth and roles, and a Turborepo monorepo sharing Prisma and Zod between a Next.js 15 storefront and a Fastify 5 API. | Asistente de compras con IA (Llama 3.3 70B en Groq) que usa tool calling en el servidor para buscar productos, recomendar artículos y rastrear pedidos. E-commerce de cuchillos de cocina premium con Stripe Checkout y pedidos confirmados por webhook, Auth.js v5 con Google OAuth y roles, y un monorepo Turborepo que comparte Prisma y Zod entre una tienda en Next.js 15 y una API en Fastify 5. |
| K-16 / K-17 | `flyworkflow-incidents` | Multi-tenant incident management for construction sites: a geolocated incident map (Mapbox GL, 2D/3D) and an 11-widget analytics dashboard. Next.js 16 on Vercel; a NestJS 11 API on AWS Lambda behind API Gateway, deployed with SAM; Prisma + PostgreSQL; browser uploads go straight to S3 through presigned URLs. Playwright E2E in CI against a real backend. | Gestión de incidencias multi-tenant para obras de construcción: mapa de incidencias geolocalizadas (Mapbox GL, 2D/3D) y un dashboard analítico de 11 widgets. Next.js 16 en Vercel; API NestJS 11 en AWS Lambda detrás de API Gateway, desplegada con SAM; Prisma + PostgreSQL; las subidas van del navegador directo a S3 con URLs prefirmadas. E2E con Playwright en CI contra un backend real. |

Every fact above is stated in the profile README (2026-11-27); none is new. Credential role labels
keep their current EN/ES text unless the audit observes a different role name in the app (then the
audit records it and the label follows the app).

## 8. Integrations and contracts
### 8.1 External systems touched (read-only)
| System | URL | Checked 2026-11-27 (no login) |
|---|---|---|
| Profile README | `gh api repos/hervid2/hervid2/readme` | Fetched |
| Sushi Burrito Web demo | <https://sushi-burrito-final.vercel.app/> | 200, 0.34 s (shell only) |
| Slicing Edge demo | <https://slicing-edge-e-commerce-web.vercel.app/> | 200, 1.39 s |
| FlyWorkFlow demo | <https://flyworkflowapp.vercel.app/> | 307 (redirect), 1.15 s |
| FlyWorkFlow API health | `https://50s0hvq0me.execute-api.us-east-1.amazonaws.com/health` | 200, 3.29 s (single sample, cold state unknown) |
| 4 code repositories | `github.com/hervid2/{sushiBurritoJava, SushiBurritoFinal, Slicing-edge-e-commerce, flyworkflowapp}` | 200 each |

These are availability samples, not the audit: no login, no latency method, no YouTube check.

### 8.2 Deliverable contract: `docs/discovery/demo-audit.md`
Required sections (AC-001-13):
1. Header: date, auditor, method version, links to this spec and FR-019.
2. Method: the BR-A1 rules and the latency method of ASM-001-03.
3. One table per project with rows for: live demo URL status, code URL status, YouTube EN/ES
   status (where `demoVideoId` exists), first-load latency samples (time, value) and the resulting
   `coldStartNotice` decision (yes / no / N/A).
4. One credentials table per project: role label on the card, username, result (`verified` /
   `failed` / `not tested` with reason), observed role and landing page, published (yes / no).
5. Findings and follow-ups for Hernán (e.g. "add the demo accounts to the project README").
No password, token, cookie or screenshot of a logged-in page is stored beyond the credentials the
card already publishes on purpose.

### 8.3 Recorded discrepancies (do not resolve by guessing)
| # | Where | Finding | Handling |
|---|---|---|---|
| D-1 | FlyWorkFlow card vs profile | Card: "Next.js 14", no NestJS / Lambda / Prisma / PostgreSQL / S3. Profile: Next.js 16, NestJS 11, Lambda + API Gateway + SAM, Prisma + PostgreSQL, S3 | Fixed by §6, §7 (AC-001-01, -02) |
| D-2 | FlyWorkFlow card vs repo README | Card publishes a Super Admin account; the repo README lists only Admin and Member (ASM-008) | OQ-001-05 + audit |
| D-3 | Slicing Edge card vs profile | AI assistant is mid-list; card lists React, Tailwind CSS, Google OAuth and Docker as chips but not Prisma, Upstash Redis, Turborepo or the LLM | Fixed by §6, §7 (AC-001-06, -07) |
| D-4 | Slicing Edge repo README | The demo accounts are documented as "Test accounts (after seed)" for local development; production validity unknown | Audit |
| D-5 | Sushi Burrito Web card vs profile | Card: "WebSockets", "SQL", "Vanilla.js"; profile: Socket.IO, MySQL, "Vanilla JS", plus Vite, Sequelize, Nginx, DigitalOcean | Fixed by §6 if OQ-001-01 = yes |
| D-6 | Sushi Burrito Web repo README vs card | The repo README lists no demo credentials; the card publishes three (Admin, Kitchen, Waiter). The repo names the roles Administrador, Mesero, Cocinero | OQ-001-06 + audit |
| D-7 | Sushi Burrito Web demo vs client production | The profile links the same URL as "Live demo" and says the restaurant uses the web POS daily. If the demo accounts live in the client's production instance, an Admin login could expose real invoices and revenue and allow voiding invoices; this contradicts the glossary ("fictional data") | **OQ-001-04 (blocks auditing this demo)** |
| D-8 | Sushi Burrito Desktop card vs profile | Card: "SQL", no Spring Data JPA / Flyway / JUnit 5; generic description without the client or fallback role | Fixed by §6, §7 if OQ-001-01 = yes |
| D-9 | Domain model vs practice | `docs/domain/model.md` says each project's README is the source of truth for `DemoCredential`, but two of three READMEs do not list the published accounts | OQ-001-06 |
| D-10 | Stack icons | Labels without an entry in `utils/techIcons.ts` fall back to the JavaScript logo (e.g. a JS logo next to "NestJS") | OQ-001-03 |

## 9. Applicable non-functional requirements
- **NFR-003 (a11y):** the kind label and the notice are text, AA contrast in both themes; no new
  focusable elements; reading order follows §4.1 A step 2.
- **NFR-006 (i18n parity):** K-01 … K-04 in both dictionaries (typed by `AppDictionary`);
  descriptions as `{ en; es }`.
- **NFR-008 (code rules):** JSDoc, ≤ 100 chars per line, ≤ 40 lines per function.
- **NFR-011:** external links keep `rel="noopener noreferrer"` (no change expected).
- **NFR-012:** layout verified at 360 px and 1280 px.
- **NFR-013:** every `liveDemoUrl`, `codeUrl` and YouTube id is checked in the audit.
- **NFR-002:** no new runtime dependency; any icon SVGs are static assets loaded lazily like the
  existing ones.

## 10. Acceptance criteria
Verification types: **U** unit (Vitest, data invariants), **C** component (Testing Library),
**M** manual evidence recorded in `validation.md` (Playwright MCP or `curl`; e2e is spec 004),
**D** document check by the reviewer.

**FR-014 — content matches the source of truth**
- **AC-001-01** (U) — Given `projects.ts`, when the FlyWorkFlow project is read, then its `stack`
  equals the approved list in §6, which includes "Next.js", "NestJS", "Prisma", "PostgreSQL",
  "AWS Lambda" and "Amazon S3".
- **AC-001-02** (U) — Given `projects.ts`, when every project's `description.en`,
  `description.es` and `stack` are scanned, then none contains "Next.js 14"; and the FlyWorkFlow
  description in both languages contains "Next.js 16", "NestJS 11", "AWS Lambda", "API Gateway",
  "SAM", "Prisma", "PostgreSQL" and "S3".
- **AC-001-03** (U) — Given `projects.ts`, when each of the other three projects is read, then its
  `stack` equals the approved list in §6 and every project has at most 10 chips. *(Applies if
  OQ-001-01 = yes.)*
- **AC-001-04** (U) — Given `projects.ts`, when each project's description is read, then
  `description.en` and `description.es` equal the approved K-10 … K-17 copy (§7) for the projects
  in scope, and both are non-empty for all projects.
- **AC-001-05** (U) — Given every label in every project's `stack`, when `resolveTechIconPath`
  resolves it, then it returns a dedicated icon (not the fallback path) and the referenced file
  exists under `frontend/public/assets/icons/tech/`. *(Form depends on OQ-001-03.)*

**FR-015 — Slicing Edge AI assistant first**
- **AC-001-06** (U, C) — Given the Slicing Edge project, when its description is read in EN, then
  the first sentence starts with "AI shopping assistant" and names "Llama 3.3 70B", "Groq" and
  "tool calling"; and in ES the first sentence starts with "Asistente de compras con IA" and names
  the same three terms. And given the card rendered in EN, the description paragraph starts with
  "AI shopping assistant".
- **AC-001-07** (U) — Given the Slicing Edge project, when its `stack` is read, then it contains
  "LLM tool calling (Groq)".

**FR-016 — project kind label and subtitle**
- **AC-001-08** (U) — Given `projects.ts`, when each project's `kind` is read, then
  `java-desktop-app` and `sushi-burrito-spa` are `"client"` and `the-slicing-edge` and
  `flyworkflow-incidents` are `"personal"`; and a `Project` without `kind` fails `tsc`.
- **AC-001-09** (C) — Given the portfolio grid in EN, when it renders, then each Sushi Burrito card
  shows the text "Client project" and the Slicing Edge and FlyWorkFlow cards show "Personal
  project · deployed"; and given ES, they show "Proyecto de cliente" and "Proyecto personal ·
  desplegado".
- **AC-001-10** (C) — Given a rendered card, when the language switches EN → ES, then the kind
  label, description and notice (if any) change language without a reload, and the label appears
  before the title in DOM order.
- **AC-001-11** (C) — Given the Portfolio section, when it renders in EN, then the subtitle is K-03
  EN; and in ES it is K-03 ES.
- **AC-001-12** (M) — Given the built site in a browser, when the cards are viewed in EN and ES, in
  dark and light themes, at 360 px and 1280 px, then the kind label and notice are legible (AA
  contrast checked with the browser's contrast tool or axe), use only token classes, and the page
  has no horizontal scroll.

**FR-019 — demo audit and notices**
- **AC-001-13** (D) — Given the branch before G-Merge, when `docs/discovery/demo-audit.md` is
  opened, then it has every section of §8.2, one table per project (4), one row per credential
  published on `main` at 77db57c (8), a date within the last 7 days before G-Merge, and each
  credential marked `verified`, `failed` or `not tested` with a reason.
- **AC-001-14** (U, D) — Given `projects.ts` and the audit, when the credentials are compared,
  then every credential on a card is marked `verified` in the audit, and every `failed` or
  `not tested` credential is absent from `projects.ts`. (The unit test asserts the published
  usernames equal a `VERIFIED_DEMO_USERNAMES` list in the test; the reviewer checks that list
  against the audit.)
- **AC-001-15** (U) — Given `projects.ts`, when the FlyWorkFlow credentials are read, then
  `camila.rojas@flyworkflow.io` (Super Admin) is absent, unless OQ-001-05 is answered "keep" and
  the audit marks it `verified`; ASM-008 is closed in `docs/discovery/brief.md` and `MEMORY.md`
  with the result.
- **AC-001-16** (U, D) — Given `projects.ts` and the audit, when `coldStartNotice` is read, then it
  is `true` exactly for the projects whose audit records a first-load sample > 10 s, and absent or
  `false` for every other project (including Sushi Burrito Desktop, which has no live demo).
- **AC-001-17** (C) — Given a project with `coldStartNotice: true`, when its card renders in EN,
  then a `role="note"` element shows K-04 EN (ES: K-04 ES); and given a project without the flag,
  no such element is rendered.
- **AC-001-18** (D) — Given the audit, when its method and results are reviewed, then it records
  at most one login attempt per account, no action other than BR-A1's, no copied third-party data,
  and no login on Sushi Burrito Web before OQ-001-04 was resolved (the resolution date is cited).
- **AC-001-19** (M, D) — Given every `liveDemoUrl`, `codeUrl` and `demoVideoId` (EN and ES) in
  `projects.ts` after the change, when checked with `curl -sI` and the YouTube oEmbed endpoint,
  then each returns 2xx/3xx (oEmbed 200), and the results are in the audit.

**Regression and quality**
- **AC-001-20** (C) — Given the grid, when the category filter changes, then each visible card
  still shows its kind label, and the existing `ProjectFilterBar` and `useProjectFilter` tests
  still pass.
- **AC-001-21** (M) — Given the branch, when `npm run format:check`, `lint`, `typecheck`, `test`
  and `build` run with `--prefix frontend`, then all exit 0, and CI's `frontend` job is green on
  the draft PR.
- **AC-001-22** (C) — *(Only if OQ-001-07 = yes.)* Given the grid inside `AnimatePresence`, when
  the filter removes a card, then React logs no "Function components cannot be given refs"
  warning (`console.error` spy) and DEBT-013 is closed in the roadmap.

## 11. Assumptions and open questions
| ID | Type | Statement | Owner | Status |
|---|---|---|---|---|
| ASM-001-01 | ASM | Stack chips carry no version numbers ("Next.js", not "Next.js 16"); versions live in the description. Keeps `resolveTechIconPath` lookups working. Alternative: versioned chips with a normalizing lookup. Satisfies FR-014's "list Next.js 16, NestJS 11 …" through the description plus chips | agent | Proposed |
| ASM-001-02 | ASM | At most 10 chips per card (today's maximum), so the cards keep their height balance in the grid | agent | Proposed |
| ASM-001-03 | ASM | First-load latency method: the time from navigation to the first successful backend response seen in the browser's network panel (API health or the login response), sampled 3 times at different times of day, each after ≥ 30 min without traffic from the auditor. The notice is set if any sample > 10 s. Other visitors may warm the backend, so this is a best effort | agent | Proposed |
| ASM-001-04 | ASM | The notice copy (K-04) states no number of seconds, so it stays true when cold-start times change | agent | Proposed |
| ASM-001-05 | ASM | The kind label sits in the card body above the title, not over the media (the hover preview clip would cover it) | agent | Proposed |
| ASM-001-06 | ASM | Kind is a label only; filtering by kind is out of scope | agent | Proposed |
| ASM-001-07 | ASM | Sushi Burrito Desktop has no live demo: the audit covers its code URL and YouTube ids only | agent | Proposed |
| ASM-001-08 | ASM | The audit is a dated point-in-time record; re-audits are manual per release (NFR-013); automation is out of scope | agent | Proposed |
| ASM-001-09 | ASM | Naming the client's business and city ("a restaurant in Bucaramanga") is allowed: it is on the public profile README and authorized in FR-021; no person is named | agent | Proposed |
| ASM-001-10 | ASM | e2e and axe automation stay in spec 004; browser checks here are manual with Playwright MCP (as in spec 000, ASM-000-05) | agent | Proposed |
| ASM-001-11 | ASM | Data-invariant tests compare against constants in the test file (approved stacks, copy, verified usernames, flagged ids); the reviewer cross-checks those constants with this spec and the audit | agent | Proposed |
| OQ-001-01 | OQ | The roadmap row names only the FlyWorkFlow stack, but FR-014 says "for each project". Align the stack and description of all four cards in 001? | Hernán | Open — recommended: yes (D-5, D-8 are BR-006 violations today) |
| OQ-001-02 | OQ | Approve the proposed stacks (§6) and the EN/ES copy K-01 … K-17 (§7)? | Hernán | Open — recommended: approve as drafted, edits welcome |
| OQ-001-03 | OQ | About 15 proposed stack labels have no icon entry (NestJS, Prisma, AWS Lambda, Amazon S3, LLM tool calling (Groq), Upstash Redis, Turborepo, Vite, Sequelize, Socket.IO, Nginx, DigitalOcean, Spring Data JPA, Flyway, JUnit 5) and would show the JavaScript logo. Add brand SVGs (e.g. from Simple Icons, CC0, no npm dependency) for each, or use one neutral generic icon for labels without a logo? | Hernán | Open — recommended: brand SVGs where a license-clean source exists (light and dark variants), a neutral generic icon otherwise (some brands, e.g. AWS, may not be available); the plan lists each file, its source and license |
| OQ-001-04 | OQ | Do the Sushi Burrito Web demo accounts (`admin@demo.com`, `kitchen@demo.com`, `waiter@demo.com`) live in the restaurant's production instance with real data? (D-7) | Hernán | Open — **blocks the audit of that demo**. Recommended: if yes, remove the three credentials from the card (keep the live link and the demo video if one exists) and log a follow-up for a separate demo instance; if no, audit them normally |
| OQ-001-05 | OQ | FlyWorkFlow Super Admin (`camila.rojas@flyworkflow.io`): remove it even if the login works? | Hernán | Open — recommended: remove; the project README deliberately lists only Admin and Member, and a super admin is a cross-tenant privileged role in a shared demo |
| OQ-001-06 | OQ | `docs/domain/model.md` makes each project's README the source of truth for demo credentials, but Sushi Burrito Web lists none and Slicing Edge lists them as local seed accounts (D-9). Which gate applies? | Hernán | Open — recommended: the audit is the publishing gate (constitution Title III); amend the domain model wording; adding the accounts to those READMEs is a follow-up in those repos |
| OQ-001-07 | OQ | Fold DEBT-013 (`ProjectCard` without `forwardRef` under `AnimatePresence mode="popLayout"`) into 001 as its own task? | Hernán | Open — recommended: yes, it is a small change in a component this spec already edits (AC-001-22). Leave DEBT-010 out (it spans 32 elements) |
| OQ-001-08 | OQ | Add short per-demo notes in the credentials modal (FlyWorkFlow opens in Spanish; demo data is shared; ten wrong passwords lock an account)? | Hernán | Open — recommended: not in 001 (FR-019 covers only the delay notice); candidate for a later spec |
| OQ-001-09 | OQ | Who runs the live logins: the implementer through Playwright MCP after your go-ahead, or you by hand with the auditor recording? | Hernán | Open — recommended: implementer via Playwright MCP, one go-ahead per demo, you available for B-E3 escalations |

## 12. Change log
| Version | Date | Change | Approved by |
|---|---|---|---|
| 0.1 | 2026-11-27 | Initial draft from the roadmap row, FR-014/015/016/019, the profile README (fetched 2026-11-27) and the four project READMEs | — |
