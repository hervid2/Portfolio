# Spec 001 — Project cards accuracy
Status: Planned (G-Plan 2026-11-27) · Version: 1.3 · Branch: feat/001-project-cards-accuracy ·
FR: FR-014, FR-015, FR-016, FR-019 · BR: BR-006, BR-007, BR-008 · NFR: NFR-002, NFR-003,
NFR-004, NFR-006, NFR-007, NFR-008, NFR-011, NFR-012, NFR-013 · Backlog: PO-4, PO-5, PO-6, PO-9 ·
Debt: DEBT-013 (folded in, OQ-001-07) · Depends on: 000

## 1. Objective
Recruiters and hiring managers judge the portfolio by its four project cards, and today the cards
contradict the GitHub profile README (BR-006): FlyWorkFlow says "Next.js 14" and omits NestJS,
AWS Lambda and S3; Slicing Edge buries its AI assistant mid-sentence; nothing tells client work
apart from personal work; and some demo credentials have never been checked (ASM-008). This spec
makes every card truthful and verifiable: content matches the profile README, each card shows its
project kind, and every published credential and delay notice is backed by a dated demo audit
(`docs/discovery/demo-audit.md`). Three published credentials are named owner exceptions to
that rule: the FlyWorkFlow Super Admin (OQ-001-05, OQ-001-15), kept out of the audit and verified
by the owner on 2026-11-27, and the two Slicing Edge accounts that failed the audit login
(OQ-001-16), kept while the owner fixes them (follow-up OF-1).

## 2. Scope
**Includes**
- **FlyWorkFlow stack and description (PO-4, FR-014):** the stack and EN/ES description in §6 and
  §7, aligned with the profile README; no "Next.js 14" anywhere.
- **Other three cards' stack and description (FR-014, "for each project"):** aligned with the
  profile README as in §6 and §7 (OQ-001-01 answered yes, 2026-11-27).
- **Slicing Edge AI assistant first (PO-5, FR-015):** the description starts with the AI shopping
  assistant and the stack includes the LLM.
- **Project kind (PO-6, FR-016):** a required `kind: ProjectKind` field on `Project`, a bilingual
  kind label on every card, and a new portfolio subtitle.
- **Demo audit (PO-9, FR-019):**
  - The deliverable `docs/discovery/demo-audit.md`, structured as in §8.2, ending with a
    machine-readable summary that the unit tests read (§8.2 item 6).
  - Removing every audited credential the audit does not mark `verified`, except the owner
    exceptions listed in the audit summary's `ownerExceptionUsernames` (OQ-001-15, OQ-001-16).
  - FlyWorkFlow Super Admin (`camila.rojas@flyworkflow.io`): kept on the card unchanged and
    excluded from the live login audit (OQ-001-05). The audit listed it as "not audited — owner
    investigation pending"; since v1.3 it reads "not audited — owner-verified 2026-11-27", because
    the owner states the access works. ASM-008 is closed as "Confirmed by owner, 2026-11-27 (no
    audit login)".
  - Slicing Edge Admin and Customer (`admin@slicing-edge.com`, `customer@example.com`): both
    `failed` at T-14 and kept on the card unchanged as a one-off owner exception (OQ-001-16),
    pending the owner's fix in the Slicing Edge project (follow-up OF-1).
  - A bilingual cold-start notice on each card whose demo the audit measures at > 10 s on first
    load (ASM-001-03).
- **Stack icons (OQ-001-03):** each of the 16 stack labels without an icon-map key (§8.3 D-10)
  gets an explicit key: a brand SVG from a license-clean source (Simple Icons, CC0-1.0, copied as
  static files, no npm dependency), or one neutral generic icon when no license-clean brand icon
  exists. Capped at 2 implementation tasks (CL-19).
- **DEBT-013 (OQ-001-07):** `ProjectCard` accepts a ref (`forwardRef`) so `AnimatePresence
  mode="popLayout"` can measure it; its own task (AC-001-22).
- **Tests:** data-invariant unit tests, a unit test that reads the audit summary, and component
  tests (§10).
- **Documentation:**
  - `docs/glossary.md`: "Cold-start notice" and "Demo audit" (added with v0.1); updated if the plan
    renames `coldStartNotice`.
  - `docs/requirements/business-rules.md`: BR-008 "Live demo audit safety" (promoted from BR-A1,
    OQ-001-10; added with v0.2).
  - `docs/domain/model.md`: the demo audit is the publishing gate for `DemoCredential`; project
    READMEs are informative (OQ-001-06; amended with v0.2).
  - `docs/discovery/brief.md`: ASM-008 row note (added with v0.2); closed with v1.3 ("Confirmed
    by owner, 2026-11-27 (no audit login)").
  - `docs/roadmap.md`: new DEBT items (added with v0.2, §8.3 D-11 … D-13); at G-Merge, row 001
    status and DEBT-013 closed; the "Owner follow-ups (other repos)" table OF-1 … OF-4 (added with
    v1.3).
  - `docs/traceability.md`: rows FR-014, FR-015, FR-016, FR-019 → ACs and tests, at G-Merge.
  - `MEMORY.md`: ASM-008 status (closed, owner-verified 2026-11-27), the owner exceptions and the
    audit date.

**Does not include**
- The hero copy, which still says "web and desktop" (spec 002, FR-017), and About/Skills (spec
  003, FR-018).
- Case-study links, architecture-map buttons and the Sushi Burrito testimonial (specs 006, 007,
  008).
- Filtering the grid by project kind; new categories; adding projects (OQ-003).
- New demo accounts, reseeding demo data, changing demo usernames or their domains (OQ-001-13), or
  any change in the project repositories themselves (their READMEs, seeds or deployments).
  Findings that need such changes are recorded in the audit as follow-ups for Hernán.
- Investigating the FlyWorkFlow Super Admin access (Hernán did it in the FlyWorkFlow project) and
  fixing the Slicing Edge demo accounts (Hernán, follow-up OF-1 in `docs/roadmap.md`).
- Automated or periodic link and demo monitoring (NFR-013 stays a manual check per release).
- Extra per-demo notes such as "the interface opens in Spanish" or "the demo data is shared"
  (OQ-001-08: not in 001).
- The light-theme contrast of the existing accent card buttons (DEBT-021, spec 004), decorative
  stack-icon `alt` text (DEBT-023, spec 004), DEBT-010 (reduced-motion entry animation), DEBT-011
  and DEBT-014 (modals).

## 3. Actors and permissions
| Actor | Role in this spec | Permissions |
|---|---|---|
| Recruiter / hiring manager (visitor) | Reads the cards, opens demos and credentials | Read-only, public site |
| Hernán (owner) | Approves copy, stacks and the audit go-ahead; resolves OQs; fixes demo accounts in the project repos if he wants them kept; investigates the FlyWorkFlow Super Admin outside 001 | Full |
| Auditor (implementer agent via Playwright MCP with Hernán's go-ahead per demo; fallback: Hernán logs in by hand while the auditor records) | Runs the live demo audit (§4.1 B) | Logs in with published demo credentials only, except the FlyWorkFlow Super Admin; read-only actions only (BR-008) |

No new roles or API permissions. The contact API is not touched.

## 4. Flows
### 4.1 Main flow
**A. Visitor reads a card (after this spec)**
1. The visitor reaches the Portfolio section and reads the subtitle (§7, K-03).
2. Each card shows, in this reading order: media, kind label (K-01 or K-02), title, description,
   stack chips, the cold-start notice when flagged (K-04), and the action row.
3. The visitor switches EN ↔ ES: the subtitle, kind label, description and notice change language
   without a reload; title and stack chips do not change (they are proper names).
4. The visitor opens "Demo Credentials": only audit-verified accounts are listed, plus the
   owner exceptions: the FlyWorkFlow Super Admin (OQ-001-05, OQ-001-15) and the two Slicing Edge
   accounts (OQ-001-16).

**B. Live demo audit (task-level activity, needs Hernán's go-ahead per demo)**
1. The first audit task checks that the Playwright MCP server connects. If it does not, Hernán logs
   in by hand while the auditor records (OQ-001-09, CL-16). No new dependency is added.
2. Before any login, Hernán gives an explicit go-ahead per demo.
3. For each project the auditor records, with date and time (UTC-5):
   - for `liveDemoUrl` and `codeUrl`, the final status of
     `curl -sL -o /dev/null -w "%{http_code} %{url_effective}" <url>` (GET, redirects followed;
     a final 2xx passes, NFR-013) and the redirect chain (`curl -sIL <url>` status lines);
   - for `demoVideoId`, the YouTube oEmbed status of the EN and ES ids (200 passes);
   - the first-load latency samples per ASM-001-03 (no login).
4. For each published credential, except the FlyWorkFlow Super Admin, the auditor makes **at most
   one** login attempt per audit run, records the role and the landing page shown, checks that the
   role matches the card label, and logs out. No other form is submitted and nothing is created,
   edited or deleted (BR-008).
5. The auditor writes `docs/discovery/demo-audit.md` (§8.2) and lists, per credential, `verified`,
   `failed` (with the observed message, never a screenshot of real data), `not tested` (with the
   reason) or `not audited — owner investigation pending` (Super Admin only; since v1.3 `not
   audited — owner-verified 2026-11-27`).
6. The data in `frontend/src/data/projects.ts` is updated to match the audit summary: failed or
   untested credentials are removed, except those in `ownerExceptionUsernames` (OQ-001-16);
   `coldStartNotice` is set where the audit says so.

### 4.2 Alternative flows
- **A2. Project without demo credentials** (Sushi Burrito Desktop, or any project whose
  credentials were all removed by the audit): the card shows no credentials button (existing
  behavior of `ProjectCardActions`).
- **A3. Project without live demo** (Sushi Burrito Desktop): the video button replaces the live
  demo link (existing behavior). No first-load latency is measured and no notice is shown.
- **B2. A credential fails but Hernán wants to keep it:** he fixes the account in the project's
  own deployment; the auditor re-tests it (one new attempt) before G-Merge. Until it passes, it
  stays off the card, unless the owner names it as an exception (as the two Slicing Edge accounts,
  OQ-001-16; after 001 their re-audit is a short `/bug`, follow-up OF-1).
- **B3. The demo is slow on one sample only:** the notice is shown if any sample exceeds 10 s
  (ASM-001-03).
- **B4. The audit must be redone** (G-Merge later than 7 days after the audit date): a new audit
  run re-checks links, videos and latency, and logs in again (one attempt per account) only for
  the accounts still published (CL-14).
- **B5. A latency endpoint is unknown** (OQ-001-11 still open): the auditor may discover the public
  API base URL and health route from the deployed frontend's network requests on public pages,
  without logging in; otherwise the latency task waits for Hernán. This blocks only the latency
  samples and the notice decision for that project.

### 4.3 Error flows
- **B-E1. Live demo URL returns a final 4xx/5xx or times out:** recorded as `failed` in the audit;
  the card keeps the link only if a re-check within the same audit run passes; otherwise the
  finding is escalated to Hernán before G-Merge (the spec does not decide to hide a demo on its
  own).
- **B-E2. Login fails:** stop after one attempt for that account in this audit run (FlyWorkFlow
  locks an account for 15 minutes after ten wrong passwords; repeated attempts by the auditor are
  not allowed). Record the visible error message; remove the credential (B2 for recovery),
  unless the owner keeps it as a named exception listed in `ownerExceptionUsernames` (OQ-001-16:
  `admin@slicing-edge.com` and `customer@example.com`, follow-up OF-1).
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
  - Edge case: Slicing Edge's card lists "Docker", which the profile does not list for this
    project → dropped by the approved stack (§6), because only chips the sources support are kept
    and the card is capped at 10 chips (ASM-001-02).
- **BR-007 — Testimonial authorization (applied by analogy to third-party data).** No person's
  name or quote is added by this spec. The client's business name and city ("a restaurant in
  Bucaramanga") already appear on the public profile README and are authorized in FR-021
  (ASM-001-09). The audit never copies data that belongs to a real client (B-E3).
- **BR-008 — Live demo audit safety** (`docs/requirements/business-rules.md`, promoted from
  BR-A1 by OQ-001-10). The live audit performs only: open the demo, at most one login per
  published account per audit run, observe the landing page, log out. It never submits another
  form, never creates, edits or deletes data, never retries a failed login, never uses a
  password-reset link, and never records third-party or real data.
  - Example: FlyWorkFlow Admin login succeeds → note "lands on dashboard, role Admin", log out.
  - Edge case: a password-reset link is offered after a failure → not used.
- **Constitution Title III — "Demo credentials are published only after they are verified."**
  Applied to every credential, with two one-off owner exceptions (no constitution amendment), both
  listed in the audit summary's `ownerExceptionUsernames`:
  - OQ-001-15 (G-Spec, 2026-11-27): the FlyWorkFlow Super Admin (`camila.rojas@flyworkflow.io`)
    stays on the card without an audit login (OQ-001-05). Status: owner-verified — on 2026-11-27
    the owner stated the access works; ASM-008 is closed as "Confirmed by owner, 2026-11-27 (no
    audit login)", and the audit lists it as "not audited — owner-verified 2026-11-27". It stays
    an exception because no audit login verified it.
  - OQ-001-16 (2026-11-27): the Slicing Edge Admin and Customer (`admin@slicing-edge.com`,
    `customer@example.com`) failed at T-14 ("Invalid email or password") and stay on the card,
    pending the owner's fix (follow-up OF-1). The audit lists them as `failed`, published "yes
    (owner exception, OQ-001-16)". The exception ends when a re-audit (a short `/bug` in this
    repo) verifies them or the owner removes them.
  - Edge case: any other `failed` or `not tested` credential is removed (B-E2).

## 6. Data
**Affected entity:** `Project` (`frontend/src/types/project.ts`, `frontend/src/data/projects.ts`).

**New or modified fields**
| Field | Type | Required | Rule |
|---|---|---|---|
| `kind` | `ProjectKind` = `"client" \| "personal"` | Yes | BR-006 table (§5). New type in `frontend/src/types/project.ts`; already in the glossary and domain model |
| `coldStartNotice` | `boolean` (optional, absent = `false`) | No | `true` only for the project ids in the audit summary's `coldStartProjectIds` (FR-019). Name confirmed by the plan (§1.1); the glossary drops its "proposed" note (T-19) |
| `stack` | `string[]` | Yes (existing) | Changed values, §6 table below; ≤ 10 items; official names without version numbers (ASM-001-01) |
| `description` | `{ en; es }` | Yes (existing) | Changed values, §7 K-10 … K-17 |
| `demoCredentials` | `DemoCredential[]` | No (existing) | Exactly the usernames in the audit summary's `verifiedUsernames` plus `ownerExceptionUsernames` for that project (§8.2 item 6) |

**Approved stacks (OQ-001-02, approved as drafted 2026-11-27).** Sources: profile README badges
and text for each project; "repo" means the project's own README.
| Project (`id`) | Current stack | Approved stack (in order) | Source of every chip |
|---|---|---|---|
| `java-desktop-app` | Java, Spring Boot, Swing, SQL | Java, Spring Boot, Swing, Spring Data JPA, Flyway, MySQL, JUnit 5 | Profile badges + profile text ("Java Swing") |
| `sushi-burrito-spa` | Vanilla.js, Node.js, Express, WebSockets, SQL | Vanilla JS, Vite, Node.js, Express, Sequelize, MySQL, Socket.IO, Nginx, DigitalOcean | Profile badges (exactly) |
| `the-slicing-edge` | Next.js, TypeScript, React, Tailwind CSS, Fastify, PostgreSQL, Google OAuth, Stripe, Docker, GitHub Actions | Next.js, Fastify, TypeScript, Prisma, PostgreSQL, LLM tool calling (Groq), Stripe, Upstash Redis, Turborepo, GitHub Actions | Profile badges + profile text (GitHub Actions) + profile header and repo (TypeScript); "LLM tool calling (Groq)" is the profile's Tech stack label (the project badge reads "LLM tool calling"; the provider is kept because FR-015 asks to name it) |
| `flyworkflow-incidents` | Next.js, TypeScript, React, SCSS, Mapbox GL, Zod, React Hook Form, Vitest, Playwright, GitHub Actions | Next.js, NestJS, TypeScript, Prisma, PostgreSQL, AWS Lambda, Amazon S3, Mapbox GL, Playwright, GitHub Actions | Profile badges + FR-014 (S3) + profile header and repo (TypeScript) |

**Validations**
- Type level: `kind` required on every `Project` (`tsc --noEmit`, NFR-006), proven by a typed
  fixture with `// @ts-expect-error` in a test file covered by `npm run typecheck` (CL-12).
- Data-invariant tests (§10): kind per BR-006, approved stacks and copy (constants in the test,
  ASM-001-11), no "Next.js 14", credentials and notice flags equal the audit summary.

**Migrations:** N/A — static typed content, no database. The `id` slugs are not renamed (media and
`projectCardIdentity` depend on them).

## 7. Interface
**Screens:** UI-02 (Portfolio grid and cards); UI-07 (Credentials modal: content only, no layout
change).

**Behavior**
- **Kind label:** a small static text chip (`<p>` or `<span>`) in the card body, above the title,
  built only with Tailwind tokens and existing semantic classes (`ui-tokens-motion` skill; no new
  palette, no hardcoded colors). It is text, so meaning never depends on color alone (WCAG 1.4.1).
  Allowed token pairs (CL-06, AA for `text-xs`):
  - `text-text-secondary` on `bg-surface-muted` with `border-border-subtle` (the stack-chip
    palette; 7.63:1 light, 10.64:1 dark); or
  - `text-accent-cyan-strong` in the light theme and `text-accent-cyan` in the dark theme, with no
    tinted background (4.62:1 on the white card in light).
  - Not allowed: `text-accent-cyan` in the light theme, or any `bg-accent-cyan/*` tint behind
    accent text (3.38–3.58:1, fails AA).
  The "·" in K-02 is wrapped in an element with `aria-hidden="true"`, with the spaces outside it,
  so screen readers read "Personal project deployed" / "Proyecto personal desplegado" as separate
  words (CL-10, ASM-001-15). No ARIA role is added;
  the label stays before the `<h3>` in DOM order (eyebrow pattern). Placement is ASM-001-05.
- **Cold-start notice:** one line of small static text with `role="note"`, placed above the action
  row, only on flagged cards. Color: `text-text-secondary` (CL-06).
- **Motion (NFR-004):** the label and the notice add no motion of their own (no `motion` element,
  no `whileHover`); they sit inside the card's existing `layout="position"` container. DEBT-010
  stays out of scope.
- **Subtitle:** replaces the current portfolio subtitle.
- **Stack chips:** unchanged component (`ProjectStackList`); each label resolves an explicit
  icon-map key (OQ-001-03). The `alt` text is not changed in 001 (decorative `alt=""` is DEBT-023).
- Layout must hold at 360 px and 1280 px with no horizontal page scroll, in both themes; the longer
  descriptions may make cards taller but must not clip text.

**States**
- Empty: N/A (the grid always has data). A card with no published credentials hides the
  credentials button (A2).
- Loading / error: N/A (static content). Images and preview clips keep their current behavior.
- Success: N/A.

**Key copy (EN / ES).** Approved as drafted (OQ-001-02, 2026-11-27).
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
audit records it and the label follows the app). The Super Admin credential is not changed.

## 8. Integrations and contracts
### 8.1 External systems touched (read-only)
| System | URL | Checked 2026-11-27 (no login) |
|---|---|---|
| Profile README | `gh api repos/hervid2/hervid2/readme` | Fetched |
| Sushi Burrito Web demo (demo clone with seeded data, separate from the restaurant's real instance; ASM-001-12) | <https://sushi-burrito-final.vercel.app/>, API `https://api-sushi-burrito.hernan-cardona.com` | 200, 0.34 s (shell only); API health route unknown (OQ-001-11) |
| Slicing Edge demo | <https://slicing-edge-e-commerce-web.vercel.app/> | 200, 1.39 s; public API URL unknown (OQ-001-11) |
| FlyWorkFlow demo | <https://flyworkflowapp.vercel.app/> | 307 (redirect), 1.15 s |
| FlyWorkFlow API health | `https://50s0hvq0me.execute-api.us-east-1.amazonaws.com/health` | 200, 3.29 s (single sample, cold state unknown) |
| 4 code repositories | `github.com/hervid2/{sushiBurritoJava, SushiBurritoFinal, Slicing-edge-e-commerce, flyworkflowapp}` | 200 each |
| Simple Icons (icon source, OQ-001-03) | `https://github.com/simple-icons/simple-icons` (CC0-1.0) | Not fetched yet; the plan lists each file, its source URL and license |

These are availability samples, not the audit: no login, no latency method, no YouTube check.

### 8.2 Deliverable contract: `docs/discovery/demo-audit.md`
Required sections, with these exact headings, in this order (AC-001-13; the unit test matches
them literally):
`## 1. Header`, `## 2. Method`, `## 3. Per-project results`, `## 4. Credentials`,
`## 5. Findings and follow-ups for Hernán`, `## 6. Machine-readable summary`.
1. **Header:** audit date (`YYYY-MM-DD`), auditor, method version, links to this spec, FR-019 and
   BR-008, and the owner confirmations it relies on with their dates (Sushi Burrito Web demo
   clone, OQ-001-04; Slicing Edge non-real data and Stripe test mode, OQ-001-12; both 2026-11-27).
2. **Method:** the BR-008 rules, the link commands of §4.1 B3, and the latency method of
   ASM-001-03.
3. **Per-project results:** one table per project (4) with rows for: live demo URL final status
   and redirect chain, code URL final status, YouTube EN/ES status (where `demoVideoId` exists),
   first-load latency samples (time, endpoint, value) and the resulting `coldStartNotice` decision
   (yes / no / N/A with reason).
4. **Credentials:** one table per project: role label on the card, username, result (`verified` /
   `failed` / `not tested` with reason / `not audited — owner investigation pending`, since v1.3
   `not audited — owner-verified 2026-11-27`), observed role and landing page, published (yes / no /
   yes (owner exception, OQ-001-xx)).
5. **Findings and follow-ups for Hernán**, at least:
   - add the demo accounts to the Sushi Burrito Web and Slicing Edge READMEs (OQ-001-06);
   - state in the `SushiBurritoFinal` README that the linked deployment is a demo clone with
     seeded data, separate from the restaurant's instance (suggestion, other repo; OQ-001-04);
   - FlyWorkFlow Super Admin: owner-verified 2026-11-27, no audit login (ASM-008 closed,
     OQ-001-05, OQ-001-15);
   - Slicing Edge Admin and Customer failed at login; kept as an owner exception (OQ-001-16) until
     the owner fixes the accounts and a re-audit passes (follow-up OF-1);
   - shared-demo integrity: any visitor can lock a FlyWorkFlow account or change a demo password;
     suggest blocking password changes for demo accounts and a scheduled reseed (CL-17).
   Follow-ups that belong to other repositories are also tracked in `docs/roadmap.md` § "Owner
   follow-ups (other repos)" (OF-1 … OF-4, added with v1.3).
6. **Machine-readable summary:** the last section, one fenced `json` block with exactly these
   keys, read by the unit tests (AC-001-13, -14, -15, -16):
   ```json
   {
     "auditDate": "YYYY-MM-DD",
     "verifiedUsernames": { "<project id>": ["<username>"] },
     "ownerExceptionUsernames": {
       "flyworkflow-incidents": ["camila.rojas@flyworkflow.io"],
       "the-slicing-edge": ["admin@slicing-edge.com", "customer@example.com"]
     },
     "coldStartProjectIds": ["<project id>"]
   }
   ```
   Every project id of `projects.ts` appears in `verifiedUsernames` (an empty array when none).

No password, token, cookie or screenshot of a logged-in page is stored beyond the credentials the
card already publishes on purpose.

### 8.3 Recorded discrepancies (do not resolve by guessing)
| # | Where | Finding | Handling |
|---|---|---|---|
| D-1 | FlyWorkFlow card vs profile | Card: "Next.js 14", no NestJS / Lambda / Prisma / PostgreSQL / S3. Profile: Next.js 16, NestJS 11, Lambda + API Gateway + SAM, Prisma + PostgreSQL, S3 | Fixed by §6, §7 (AC-001-01, -02) |
| D-2 | FlyWorkFlow card vs repo README | Card publishes a Super Admin account; the repo README lists only Admin and Member (ASM-008) | Owner decision (OQ-001-05): kept unchanged, not audited; one-off Title III exception confirmed at G-Spec (OQ-001-15). v1.3: owner-verified 2026-11-27, ASM-008 closed (no audit login); the audit lists it as "not audited — owner-verified 2026-11-27" |
| D-3 | Slicing Edge card vs profile | AI assistant is mid-list; card lists React, Tailwind CSS, Google OAuth and Docker as chips but not Prisma, Upstash Redis, Turborepo or the LLM | Fixed by §6, §7 (AC-001-06, -07) |
| D-4 | Slicing Edge repo README | The demo accounts are documented as "Test accounts (after seed)" for local development; production validity unknown | Audit; all accounts stay publishable, including Admin (OQ-001-12: non-real data, Stripe test mode). T-14: both failed; kept as a one-off owner exception (OQ-001-16), owner fix pending (OF-1) |
| D-5 | Sushi Burrito Web card vs profile | Card: "WebSockets", "SQL", "Vanilla.js"; profile: Socket.IO, MySQL, "Vanilla JS", plus Vite, Sequelize, Nginx, DigitalOcean | Fixed by §6 (OQ-001-01 = yes) |
| D-6 | Sushi Burrito Web repo README vs card | The repo README lists no demo credentials; the card publishes three (Admin, Kitchen, Waiter). The repo names the roles Administrador, Mesero, Cocinero | The audit decides (OQ-001-06); README follow-up in §8.2 item 5 |
| D-7 | Sushi Burrito Web demo vs client production | Risk that the demo accounts live in the client's production instance | Resolved (OQ-001-04, owner, 2026-11-27): the linked deployment is a demo clone with seeded data; the restaurant's real instance is a separate repo, VPS and database. Audited normally under BR-008; README suggestion in §8.2 item 5 |
| D-8 | Sushi Burrito Desktop card vs profile | Card: "SQL", no Spring Data JPA / Flyway / JUnit 5; generic description without the client or fallback role | Fixed by §6, §7 (OQ-001-01 = yes) |
| D-9 | Domain model vs practice | `docs/domain/model.md` said each project's README is the source of truth for `DemoCredential`, but two of three READMEs do not list the published accounts | Resolved (OQ-001-06): the domain model now names the demo audit as the publishing gate (amended with v0.2) |
| D-10 | Stack icons | 16 approved labels have no icon-map key and fall back to the JavaScript logo: NestJS, Prisma, AWS Lambda, Amazon S3, LLM tool calling (Groq), Upstash Redis, Turborepo, Vite, Sequelize, Socket.IO, Nginx, DigitalOcean, Spring Data JPA, Flyway, JUnit 5, Vanilla JS (the existing key is `"vanilla.js"`) | OQ-001-03: Simple Icons (CC0) or a neutral generic icon; AC-001-05 |
| D-11 | Accent card buttons | `ACCENT_BUTTON_CLASSES` ("Demo Credentials", "Watch demo") fail AA in the light theme (3.38:1) | Out of scope (OQ-001-14); DEBT-021, target spec 004 |
| D-12 | Production droplet | The droplet runs Node 20.20.1 while development and CI use 22.17 | Out of scope; DEBT-022 (upgrading Node on the server is Hernán's call) |
| D-13 | Stack chip icons | `alt="<label> icon"` next to the visible label is read twice by screen readers (pre-existing) | Out of scope (CL-18); DEBT-023, target spec 004 |

## 9. Applicable non-functional requirements
- **NFR-002:** no new runtime dependency; icon SVGs are static assets copied into
  `frontend/public/assets/icons/tech/` (no npm package) and loaded like the existing ones.
- **NFR-003 (a11y):** the kind label and the notice are text, AA contrast in both themes using the
  token pairs of §7; no new focusable elements; reading order follows §4.1 A step 2.
- **NFR-004 (reduced motion):** the label and the notice are static (§7 Motion); AC-001-12 checks
  them under emulated `prefers-reduced-motion: reduce`.
- **NFR-006 (i18n parity):** K-01 … K-04 in both dictionaries (typed by `AppDictionary`);
  descriptions as `{ en; es }`.
- **NFR-007:** lint, type check, tests and build are green on every PR in CI. Every AC has ≥ 1
  automated test, except the exception below.
- **NFR-008 (code rules):** JSDoc, ≤ 100 chars per line, ≤ 40 lines per function.
- **NFR-011:** external links keep `rel="noopener noreferrer"` (no change expected).
- **NFR-012:** layout verified at 360 px and 1280 px.
- **NFR-013:** every `liveDemoUrl`, `codeUrl` and YouTube id is checked in the audit.

**Recorded-verification exception (spec 001 only, CL-05; approved with G-Spec).** AC-001-12,
AC-001-18 and the live-network part of AC-001-19 are verified by a **recorded verification**
(commands, output, measured contrast ratios or the reviewer's document check, recorded in
`validation.md` or in `demo-audit.md`) instead of an automated test, because they need a real
browser or live third-party endpoints and e2e is spec 004 (ASM-001-10). The exception is one-off,
as in spec 000: it does not amend NFR-007 and does not carry over to later specs. AC-001-21 is
proven by the CI run on the draft PR. Every other AC has an automated test.

## 10. Acceptance criteria
Verification types: **U** unit (Vitest, data invariants or reading the audit summary), **C**
component (Testing Library), **T** type check (`npm run typecheck`), **M** manual evidence recorded
in `validation.md` (Playwright MCP or `curl`; e2e is spec 004), **D** document check by the
reviewer. Each AC names its verification.

**FR-014 — content matches the source of truth**
- **AC-001-01** (U) — Given `projects.ts`, when the FlyWorkFlow project is read, then its `stack`
  equals the approved list in §6, which includes "Next.js", "NestJS", "Prisma", "PostgreSQL",
  "AWS Lambda" and "Amazon S3".
- **AC-001-02** (U) — Given `projects.ts`, when every project's `description.en`,
  `description.es` and `stack` are scanned, then none contains "Next.js 14"; and the FlyWorkFlow
  description in both languages contains "Next.js 16", "NestJS 11", "AWS Lambda", "API Gateway",
  "SAM", "Prisma", "PostgreSQL" and "S3".
- **AC-001-03** (U) — Given `projects.ts`, when each of the other three projects is read, then its
  `stack` equals the approved list in §6 and every project has at most 10 chips.
- **AC-001-04** (U) — Given `projects.ts`, when each project's description is read, then
  `description.en` and `description.es` equal the approved K-10 … K-17 copy (§7).
- **AC-001-05** (U) — Given every label in every project's `stack`, when the label is lowercased,
  then it is an explicit key of the tech-icon map (checked through an exported helper such as
  `hasTechIcon(label)` or the exported map, not by comparing against the fallback path), and the
  entry's `iconPath` and, when declared, `iconPathDark` name files that exist under
  `frontend/public/assets/icons/tech/`. All 16 labels of §8.3 D-10 are covered, including
  "Vanilla JS" (key `"vanilla js"` → `javascript.svg`). A label served by the neutral generic
  icon is still an explicit key pointing to that file.

**FR-015 — Slicing Edge AI assistant first**
- **AC-001-06** (U, C) — Given the Slicing Edge project, when its description is read in EN, then
  the first sentence starts with "AI shopping assistant" and names "Llama 3.3 70B", "Groq" and
  "tool calling"; and in ES the first sentence starts with "Asistente de compras con IA" and names
  the same three terms. And given the card rendered in EN, the description paragraph starts with
  "AI shopping assistant".
- **AC-001-07** (U) — Given the Slicing Edge project, when its `stack` is read, then it contains
  "LLM tool calling (Groq)".

**FR-016 — project kind label and subtitle**
- **AC-001-08** (U, T) — Given `projects.ts`, when each project's `kind` is read, then
  `java-desktop-app` and `sushi-burrito-spa` are `"client"` and `the-slicing-edge` and
  `flyworkflow-incidents` are `"personal"`; and given a typed `Project` fixture without `kind`
  marked `// @ts-expect-error` in a test file, `npm run typecheck` exits 0 (it would fail if
  `kind` became optional).
- **AC-001-09** (C) — Given the portfolio grid in EN, when it renders, then each Sushi Burrito card
  shows the text "Client project" and the Slicing Edge and FlyWorkFlow cards show "Personal
  project · deployed"; and given ES, they show "Proyecto de cliente" and "Proyecto personal ·
  desplegado"; and the "·" is inside an element with `aria-hidden="true"`.
- **AC-001-10** (C) — Given a rendered card, when the language switches EN → ES, then the kind
  label, description and notice (if any) change language without a reload, and the label appears
  before the title in DOM order.
- **AC-001-11** (C) — Given the Portfolio section, when it renders in EN, then the subtitle is K-03
  EN; and in ES it is K-03 ES.
- **AC-001-12** (M, exception §9) — Given the built site in a browser, when the cards are viewed in
  EN and ES, in dark and light themes, at 360 px and 1280 px, and at 360 px in EN and ES with
  `prefers-reduced-motion: reduce` emulated, then the kind label and notice are fully visible and
  not clipped, use only the token pairs of §7, meet AA contrast (the measured ratios are recorded
  in `validation.md`), and the page has no horizontal scroll.

**FR-019 — demo audit and notices**
- **AC-001-13** (U, D) — Given the branch before G-Merge, when `docs/discovery/demo-audit.md` is
  read by a unit test, then it has the six §8.2 section headings, a parseable summary block whose
  `auditDate` is a valid date, and a `verifiedUsernames` entry for every project id in
  `projects.ts`. And the reviewer checks that the document has one table per project (4), one
  credentials row per credential published on `main` at 77db57c (8), an audit date within the last
  7 days before G-Merge, and each credential marked `verified`, `failed`, `not tested` (with a
  reason) or `not audited — owner-verified 2026-11-27` (Super Admin only, v1.3).
- **AC-001-14** (U) — Given `projects.ts` and the audit summary, when the credentials are compared
  per project, then the published usernames equal `verifiedUsernames` plus
  `ownerExceptionUsernames` for that project; so every `failed` or `not tested` credential that is
  not in `ownerExceptionUsernames` is absent from `projects.ts` (the two Slicing Edge accounts stay,
  OQ-001-16).
- **AC-001-15** (U, D) — Given `projects.ts` and the audit summary, when the owner-exception
  credentials are read, then `camila.rojas@flyworkflow.io` (FlyWorkFlow) and
  `admin@slicing-edge.com` and `customer@example.com` (Slicing Edge) are present with their current
  role labels and passwords unchanged, none of them is in `verifiedUsernames`, and
  `ownerExceptionUsernames` holds exactly these three usernames under those two project ids
  (OQ-001-15, OQ-001-16). And the reviewer checks that the audit lists the Super Admin as "not
  audited — owner-verified 2026-11-27" with no login recorded, lists the two Slicing Edge accounts
  as `failed` with published "yes (owner exception, OQ-001-16)", and that the ASM-008 row in
  `docs/discovery/brief.md` is closed as "Confirmed by owner, 2026-11-27 (no audit login)".
- **AC-001-16** (U) — Given `projects.ts` and the audit summary, when `coldStartNotice` is read,
  then it is `true` exactly for the ids in `coldStartProjectIds`, and absent or `false` for every
  other project (including Sushi Burrito Desktop, which has no live demo).
- **AC-001-17** (C) — Given a project with `coldStartNotice: true`, when its card renders in EN,
  then a `role="note"` element shows K-04 EN (ES: K-04 ES); and given a project without the flag,
  no such element is rendered.
- **AC-001-18** (D, exception §9) — Given the audit, when its method and results are reviewed,
  then it records at most one login attempt per account per audit run, no login with the
  FlyWorkFlow Super Admin, no action other than BR-008's, no copied third-party data, and it cites
  the owner confirmations of OQ-001-04 and OQ-001-12 with their date (2026-11-27).
- **AC-001-19** (M, D, exception §9) — Given every `liveDemoUrl`, `codeUrl` and `demoVideoId` (EN
  and ES) in `projects.ts` after the change, when checked with
  `curl -sL -o /dev/null -w "%{http_code} %{url_effective}"` and the YouTube oEmbed endpoint, then
  each final status is 2xx (oEmbed 200), and the results and redirect chains are in the audit.

**Regression and quality**
- **AC-001-20** (C) — Given the grid, when the category filter changes, then each visible card
  still shows its kind label, and the existing `ProjectFilterBar` and `useProjectFilter` tests
  still pass.
- **AC-001-21** (M, CI) — Given the branch, when `npm run format:check`, `lint`, `typecheck`,
  `test` and `build` run with `--prefix frontend`, then all exit 0, and CI's `frontend` job is
  green on the draft PR.
- **AC-001-22** (C) — Given the grid inside `AnimatePresence`, when the filter removes a card, then
  React logs no "Function components cannot be given refs" warning (`console.error` spy), and
  DEBT-013 is closed in the roadmap at G-Merge.

## 11. Assumptions and open questions
| ID | Type | Statement | Owner | Status |
|---|---|---|---|---|
| ASM-001-01 | ASM | Stack chips carry no version numbers ("Next.js", not "Next.js 16"); versions live in the description. Keeps icon-map lookups working. Alternative: versioned chips with a normalizing lookup. Satisfies FR-014's "list Next.js 16, NestJS 11 …" through the description plus chips | agent | Proposed |
| ASM-001-02 | ASM | At most 10 chips per card (today's maximum), so the cards keep their height balance in the grid | agent | Proposed |
| ASM-001-03 | ASM | First-load latency method (CL-03), no login: `curl -s -o /dev/null -w "%{time_starttransfer} %{time_total} %{http_code}"` on a public, unauthenticated endpoint per project. FlyWorkFlow: its API `/health`. Slicing Edge: its public API health or `/docs` URL (OQ-001-11) and the storefront home page. Sushi Burrito Web: the API's health route if one exists (OQ-001-11), else N/A with the reason (always-on droplet). 3 samples per endpoint, each after ≥ 30 min without traffic from the auditor, spread over at least two separate sessions inside the 7-day audit window; separate implementer invocations, or Hernán, may run them. The notice is set if any `time_total` sample > 10 s. Other visitors may warm the backend, so this is a best effort | agent | Proposed |
| ASM-001-04 | ASM | The notice copy (K-04) states no number of seconds, so it stays true when cold-start times change | agent | Proposed |
| ASM-001-05 | ASM | The kind label sits in the card body above the title, not over the media (the hover preview clip would cover it) | agent | Proposed |
| ASM-001-06 | ASM | Kind is a label only; filtering by kind is out of scope | agent | Proposed |
| ASM-001-07 | ASM | Sushi Burrito Desktop has no live demo: the audit covers its code URL and YouTube ids only | agent | Proposed |
| ASM-001-08 | ASM | The audit is a dated point-in-time record; re-audits are manual per release (NFR-013); automation is out of scope | agent | Proposed |
| ASM-001-09 | ASM | Naming the client's business and city ("a restaurant in Bucaramanga") is allowed: it is on the public profile README and authorized in FR-021; no person is named | agent | Proposed |
| ASM-001-10 | ASM | e2e and axe automation stay in spec 004; browser checks here are manual with Playwright MCP (as in spec 000, ASM-000-05) | agent | Proposed |
| ASM-001-11 | ASM | Data-invariant tests compare stacks, copy and kinds against constants in the test file; the reviewer cross-checks them with this spec. Withdrawn for credentials and notices, which the tests read from the audit summary (CL-05) | agent | Proposed |
| ASM-001-12 | ASM | The Sushi Burrito Web deployment linked on the card (`sushi-burrito-final.vercel.app` + `api-sushi-burrito.hernan-cardona.com`) is a demo clone with seeded data; the restaurant's real instance is a separate repo, VPS and database | human | Confirmed (Hernán, 2026-11-27) |
| ASM-001-13 | ASM | All Slicing Edge data is non-real, no real client uses it, and Stripe runs in test mode | human | Confirmed (Hernán, 2026-11-27) |
| ASM-001-14 | ASM | An audit run starts with the preflight task; `auditDate` is the **first** day of the run. Every link, video, login and latency record is dated on or after `auditDate` and within 7 days of it, and G-Merge happens within 7 days of `auditDate`; otherwise §4.2 B4 applies (re-run). Alternative discarded: `auditDate` = last day of the run (evidence up to 14 days old at G-Merge) | human | Confirmed (Hernán, G-Plan 2026-11-27, plan D-1) |
| ASM-001-15 | ASM | K-02 accessible text: the "·" is inside an `aria-hidden="true"` element with the spaces outside it, and no visually hidden comma is added, so the visible text stays "Personal project · deployed" (AC-001-09) and screen readers hear "Personal project deployed" / "Proyecto personal desplegado" as separate words | agent | Accepted (G-Plan 2026-11-27) |
| ASM-001-16 | ASM | Icon file convention (as the existing icons): the light file is the Simple Icons SVG unchanged (default black fill); the `-dark` file is the same SVG with `fill="white"` on the `<svg>` element (as `nextjs-dark.svg`); no brand hex colors. The generic icon follows the same convention | agent | Accepted (G-Plan 2026-11-27) |
| OQ-001-01 | OQ | Align the stack and description of all four cards in 001? | Hernán | Closed 2026-11-27: yes, all four |
| OQ-001-02 | OQ | Approve the proposed stacks (§6) and the EN/ES copy K-01 … K-17 (§7)? | Hernán | Closed 2026-11-27: approved as drafted |
| OQ-001-03 | OQ | Icons for the 16 labels without an icon-map key (§8.3 D-10)? | Hernán | Closed 2026-11-27: brand SVGs from a license-clean source (Simple Icons, CC0, no npm dependency), a neutral generic icon otherwise; ≤ 2 tasks. The plan lists each file, its source and license |
| OQ-001-04 | OQ | Do the Sushi Burrito Web demo accounts live in the restaurant's production instance? | Hernán | Closed 2026-11-27: no; demo clone with seeded data (ASM-001-12). Audit the three accounts normally under BR-008; README suggestion for `SushiBurritoFinal` recorded as a follow-up |
| OQ-001-05 | OQ | FlyWorkFlow Super Admin (`camila.rojas@flyworkflow.io`): remove it even if the login works? | Hernán | Closed 2026-11-27: do not touch it; keep it on the card unchanged; exclude it from the live login audit; the audit lists it as "not audited — owner investigation pending". ASM-008 stays open, owned by Hernán outside 001. Updated 2026-11-27 (v1.3): the owner states the access works; ASM-008 closed as "Confirmed by owner, 2026-11-27 (no audit login)"; the audit row reads "not audited — owner-verified 2026-11-27" |
| OQ-001-06 | OQ | Which gate applies to publishing demo credentials? | Hernán | Closed 2026-11-27: the audit decides; `docs/domain/model.md` amended |
| OQ-001-07 | OQ | Fold DEBT-013 into 001 as its own task? | Hernán | Closed 2026-11-27: yes (AC-001-22) |
| OQ-001-08 | OQ | Add per-demo notes in the credentials modal? | Hernán | Closed 2026-11-27: no, not in 001 |
| OQ-001-09 | OQ | Who runs the live logins? | Hernán | Closed 2026-11-27: the implementer via Playwright MCP with Hernán's go-ahead per demo; fallback: Hernán logs in by hand while the auditor records |
| OQ-001-10 | OQ | Promote BR-A1 to `business-rules.md`? | Hernán | Closed 2026-11-27: yes, as BR-008 "Live demo audit safety" |
| OQ-001-11 | OQ | Which public endpoints measure first-load latency: the Slicing Edge public API URL, and does the Sushi Burrito API have a health route? | Hernán | Closed 2026-11-27: the T-12 proposal is confirmed. Latency endpoints: Sushi Burrito Web `GET https://api-sushi-burrito.hernan-cardona.com/api` (public welcome route; no dedicated health route); Slicing Edge `GET https://slicing-edgeapi-production.up.railway.app/api/health` plus the storefront home `GET https://slicing-edge-e-commerce-web.vercel.app/`; FlyWorkFlow `GET https://50s0hvq0me.execute-api.us-east-1.amazonaws.com/health`. T-16 / T-17 are unblocked (they still need Hernán's go-ahead) |
| OQ-001-12 | OQ | Publish Admin accounts for demos with open public sign-up (Slicing Edge)? | Hernán | Closed 2026-11-27: yes; all Slicing Edge demo accounts stay publishable, including Admin (ASM-001-13), subject to the audit |
| OQ-001-13 | OQ | Keep publishing usernames on their current domains? | Hernán | Closed 2026-11-27: keep exactly as they are (owner states they are not real domains); no reseed follow-up |
| OQ-001-14 | OQ | Fix the light-theme contrast of the accent card buttons in 001? | Hernán | Closed 2026-11-27: no; DEBT-021, target spec 004 |
| OQ-001-15 | OQ | Keeping the FlyWorkFlow Super Admin on the card without verification (OQ-001-05) departs from constitution Title III ("Demo credentials are published only after they are verified"). Confirm it as a one-off, named exception for this spec? | Hernán | Closed 2026-11-27 (G-Spec): confirmed as a one-off owner exception to constitution Title III for the FlyWorkFlow Super Admin credential only, tracked by ASM-008, with no constitution amendment; it ends when Hernán's investigation verifies or removes the account. Updated 2026-11-27 (v1.3): status owner-verified (the owner states the access works; ASM-008 closed, no audit login). The exception stays recorded and the account stays on the card and in `ownerExceptionUsernames` |
| OQ-001-16 | OQ | The Slicing Edge credentials `admin@slicing-edge.com` and `customer@example.com` failed at T-14 ("Invalid email or password", one attempt each). Remove them (B-E2) or keep them? | Hernán | Closed 2026-11-27: keep both on the card unchanged as a one-off owner exception to constitution Title III (as OQ-001-15, no constitution amendment), listed in `ownerExceptionUsernames` under `the-slicing-edge`; T-18 does not remove them. Owner investigation pending (follow-up OF-1 in `docs/roadmap.md`); the exception ends when a re-audit (a short `/bug` in this repo) verifies them or the owner removes them |

## 12. Change log
| Version | Date | Change | Approved by |
|---|---|---|---|
| 0.1 | 2026-11-27 | Initial draft from the roadmap row, FR-014/015/016/019, the profile README (fetched 2026-11-27) and the four project READMEs | — |
| 0.2 | 2026-11-27 | Applied CL-01 … CL-19 and the owner's answers: all four cards aligned; stacks and copy approved; 16 icon labels via Simple Icons or a generic icon (≤ 2 tasks) and a map-key test; Sushi Burrito Web confirmed as a demo clone; Super Admin kept, not audited, ASM-008 open (OQ-001-15 for the Title III exception); Slicing Edge accounts kept; BR-A1 promoted to BR-008; curl-based latency and link methods; audit summary block read by unit tests and a named recorded-verification exception; token pairs, aria-hidden middle dot, NFR-004 checks; DEBT-013 folded in; documentation deliverables and NFR header completed; DEBT-021 … DEBT-023 logged | Answers: Hernán 2026-11-27 · G-Spec pending |
| 1.0 | 2026-11-27 | Approved at G-Spec. OQ-001-15 closed: one-off Title III exception for the FlyWorkFlow Super Admin only (ASM-008, no constitution amendment); §5 and §8.3 D-2 reworded to match. OQ-001-11 stays open (blocks only the latency tasks) | Hernán (G-Spec) |
| 1.1 | 2026-11-27 | G-Plan approved with plan decisions D-1 … D-4. Added ASM-001-14 (audit date = first day of the run, 7-day window including G-Merge), ASM-001-15 (K-02 "·" `aria-hidden`, screen readers hear "Personal project deployed"; §7 reworded, the comma dropped) and ASM-001-16 (light/dark icon file convention); §8.2 names the six exact headings; §6 `coldStartNotice` name confirmed. Status → Planned | Hernán (G-Plan) |
| 1.2 | 2026-11-27 | OQ-001-11 closed: the latency endpoints proposed at T-12 are confirmed (Sushi Burrito Web API `/api`, Slicing Edge API `/api/health` plus storefront home, FlyWorkFlow API `/health`); no behavior change | Hernán |
| 1.3 | 2026-11-27 | Owner decisions after T-14 … T-16. OQ-001-16 added and closed: the two failed Slicing Edge credentials stay on the card as a one-off Title III owner exception (in `ownerExceptionUsernames`; follow-up OF-1). OQ-001-15 / ASM-008: the owner states the FlyWorkFlow Super Admin access works; ASM-008 closed "Confirmed by owner, 2026-11-27 (no audit login)"; audit row "not audited — owner-verified 2026-11-27"; still an exception. §1, §2, §4.1, §4.2 B2, §4.3 B-E2, §5, §8.2 items 4–6, §8.3 D-2 / D-4, AC-001-13 … -15 reworded; roadmap "Owner follow-ups (other repos)" OF-1 … OF-4 added | Hernán |
