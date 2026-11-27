# Discovery brief — Hernán David Cardona Portfolio (refactor)
Version: 1.0 · Status: Approved (G-Brief, 2026-11-26) · Date: 2026-11-26

> Brownfield project. The portfolio is live at <https://portfolio-hernan-cardona.vercel.app/>
> (frontend) and <https://api-portfolio.hernan-cardona.com> (contact API). This brief documents
> what exists and scopes the refactor backlog PO-1 … PO-12.
> Tags: `[FR]` functional · `[NFR]` non-functional · `[BR]` business rule · `[UI]` interface ·
> `[DATA]` data · `[INT]` integration · `[ACTOR]` · `[ASM]` · `[OQ]` · `[OUT]` out of scope.

## 1. Vision and problem

- **Problem.** The portfolio works, but it doesn't convert recruiters as well as it could. The CV
  can't be downloaded and the email isn't visible. The rendered HTML is empty (`<div id="root"></div>`),
  so crawlers, link previews and AI tools only see the `<title>`. Nobody can see how the projects
  were designed and decided. One project card is outdated (FlyWorkFlow), and nothing tells client
  work apart from personal work.
- **Affected parties.** Hernán (job search) and the recruiters and hiring managers who evaluate him
  in less than two minutes.
- **Current process.** Recruiters land on the site from LinkedIn or GitHub, skim the hero and the
  cards, and then have to find a contact channel. The only one on the page is the contact form.
- **Why now.** Active job search: remote full-stack roles in the US, Canada and LATAM.
- **Success KPIs** (ASM-001):
  - A recruiter reaches the CV in ≤ 1 click from the hero.
  - Viewing the source of the production page shows the project names and the hero copy.
  - The link preview (LinkedIn, Slack, WhatsApp) shows a specific description and an image.
  - Two case studies are published.
  - Every live demo is verified to work with the published credentials.

## 2. Stakeholders and actors

| Stakeholder | Interest | Decision power |
|---|---|---|
| Hernán David Cardona | Owner, developer and product owner of the portfolio | Full (Technical Director) |
| Sushi Burrito owner (client) | Source of the testimonial (PO-11) | Only over the testimonial: whether to give it, the text and the use of their name |

| User role `[ACTOR]` | Goals | Frequency of use | Technical level | Devices |
|---|---|---|---|---|
| Recruiter | Assess fit fast; get the CV and a contact channel | One-off, 1–3 min | Low–medium | Desktop (mainly), mobile |
| Hiring manager / engineer | Judge technical depth: architecture, decisions, code | One-off, 5–15 min | High | Desktop |
| Crawler / AI tool / link unfurler | Index or summarize the content | Automated | N/A | N/A |

## 3. Scope

**Must (MVP of the refactor)**
- PO-1 Download CV (EN/ES) + copyable email in the hero and in contact.
- PO-2 Pre-rendered content (static HTML with the content).
- PO-3 Case studies for FlyWorkFlow and Slicing Edge.
- PO-4 FlyWorkFlow card aligned with the real stack.

**Should**
- PO-5 Highlight the AI assistant in Slicing Edge.
- PO-6 Client / Personal label per project.
- PO-7 Rewrite the hero.
- PO-8 Align About and Skills.
- PO-9 Audit of the 4 demos.
- PO-11 Testimonial from the Sushi Burrito owner.
- **PO-12 (new, 2026-11-26)** An interactive architecture map per project (all 4), opened from a
  "Show interactive architecture map" button (EN/ES) in a modal.

**Could**
- PO-10 Specific meta description + Open Graph image. Low priority in the backlog, but it ships
  together with PO-2.

**Won't (explicit out of scope)** `[OUT]`
- A new visual design or palette: the dark/cyan direction of the approved mockup stays.
- A blog, a CMS, or analytics with a cookie banner.
- Changes to the contact API beyond what a spec requires.
- Adding new projects to the grid (see OQ-003).

**Deadlines.** No fixed deadline (ASM-002). Order: by priority, after spec 000.

## 4. Raw functionality

**User stories**
- `[FR]` As a recruiter I want to download the CV in my language in 1 click so that I can attach it
  to the process (PO-1).
- `[FR]` As a recruiter I want to copy the email in 1 click so that I can write without filling in
  a form (PO-1).
- `[FR]` As a crawler or AI tool I want the HTML to contain the projects and the copy so that I can
  index them (PO-2).
- `[FR]` As a hiring manager I want to read a case study (Problem → Role → Decisions and why →
  Mistakes and how they were solved → Result) so that I can judge judgment, not just stack (PO-3).
- `[FR]` As a hiring manager I want to open an interactive architecture map for each project so
  that I can understand the system without cloning it (PO-12).
- `[FR]` As a recruiter I want to tell client work apart from personal work at a glance (PO-6).

**Main flows**
1. **Hero.** Name → role + stack + product type → CTAs: View my work, Download CV, Copy email.
2. **Card.** Badge Client/Personal → description → stack → Live Demo / Code / Credentials / Video /
   **Architecture map** / **Case study** (FlyWorkFlow and Slicing Edge only).
3. **Case study.** Its own pre-rendered URL, EN/ES, reachable from the card and shareable.

## 5. Detected business rules

- `[BR]` Default language and persistence of the EN/ES preference: already exists (`LanguageContext`).
- `[BR]` The CV offered matches the active language: EN → `Hernan_Cardona_CV_EN_ATS.pdf`,
  ES → `Hernan_Cardona_CV_ES_ATS.pdf`.
- `[BR]` A project is `client` if it was built for and is used by a real client. Today that means
  Sushi Burrito Desktop and Web. A project is `personal` if it is deployed, has no client and uses
  fictional data. Today that means Slicing Edge and FlyWorkFlow. The source of truth is the GitHub
  profile README.
- `[BR]` The testimonial is only published with the owner's explicit permission and their name.
- `[BR]` Contact rate limit: 5 requests / 15 min / IP (already exists).

## 6. Data

`[DATA]`
- **Entities.** Static typed content in `frontend/src/data/`: Project, Skill, DemoCredential.
  New ones: CaseStudy, ArchitectureMap, Testimonial, ProjectKind. Plus ContactMessage, persisted
  with Prisma + MySQL.
- **Volume.** 4 projects, 2 case studies, 4 maps, 1 testimonial.
- **Sensitivity.**
  - The public email (`hdcardonab@gmail.com`) is published by the owner's decision and already
    appears on their GitHub profile.
  - The demo credentials are public accounts with fictional data, published on purpose. They are
    not secrets (Art. 8 does not apply).
  - The contact messages hold personal data (name, email). There is no retention policy (OQ-005).
- **Migration.** N/A.

## 7. Integrations

`[INT]`
- **Google Drive** (CV, public folder `148imaFG3RlljDI06MV-2HyizkXxvyiS7`):
  - EN file `1GWU6MBvnigqTEpdCfcVcLMPqUa60Cf-7`.
  - ES file `1SnzOeIDChiTw8Oiac2KDDpGBrh5jGRun`.
  - Both verified public with HTTP 200 on 2026-11-26.
- **YouTube** (demo videos), **Cloudflare Turnstile** and **Resend/Nodemailer**: already exist.
- **Architecture maps.** Existing sources:
  - FlyWorkFlow: Archify (`docs/architecture/flyworkflow.architecture.json` + HTML on GitHub Pages).
  - Slicing Edge: hand-written HTML in Spanish + PNG in EN/ES.
  - Sushi Burrito Web: `docs/index.html` on GitHub Pages.
  - Sushi Burrito Desktop: none yet.
- **The 4 live demos**, verified on 2026-11-26 (HTTP 200):
  - <https://sushi-burrito-final.vercel.app/> (initial shell "Cargando aplicación...")
  - <https://slicing-edge-e-commerce-web.vercel.app/>
  - <https://flyworkflowapp.vercel.app/> (API on AWS `/health` 200)

## 8. Raw non-functional requirements

`[NFR]`
- **SEO.** The production HTML contains the hero copy, the project names and descriptions, and
  the case studies (PO-2).
- **Link preview.** The page has `og:title`, `og:description` and `og:image` (1200×630) plus a
  `twitter:card` (PO-10).
- **Performance.** Pre-rendering must not make LCP worse; the current target is kept.
  Budget: LCP ≤ 2.5 s on 4G (ASM-003).
- **Accessibility.**
  - WCAG 2.2 AA (GENESIS default).
  - The modals (map, credentials, video) trap focus and close with Esc.
  - The existing `prefers-reduced-motion` support is kept.
- **i18n.** Every new text has EN and ES versions, with type-checked parity.
- **Security.**
  - No secrets in the frontend.
  - Embedded external content (iframes or maps) gets `sandbox` / CSP where applicable.
  - External links use `rel="noopener noreferrer"`.
- **Quality.**
  - Today there are no tests, no ESLint configuration and no CI; spec 000 fixes that.
  - Strict TypeScript and JSDoc on every function (`rules/portfolio_rules.md`).

## 9. Stakeholder's vision of the interface

`[UI]`
- **Visual direction.** The approved one: dark theme, cyan accent, minimal and elegant, high
  contrast. Primary CTA filled cyan, secondary CTA outlined.
- **Hero** (PO-7).
  - Role + stack: "Full Stack Developer · TypeScript · React/Next.js · Node.js/NestJS · PostgreSQL ·
    Java/Spring Boot · AWS".
  - Product type: web apps end to end (SaaS, e-commerce, POS).
  - The word "desktop" is removed from the headline.
  - CTAs: View my work · Download CV · Copy email.
- **Email.** Copy-to-clipboard button with visual "Copied" feedback. No `mailto`
  (owner's decision, 2026-11-26).
- **Architecture map.** "Show interactive architecture map" button, EN/ES, opening a modal per
  project.
- **Case studies.** Pre-rendered pages in the visual language of the site.

## 10. Technical and operational constraints

- **Current stack.**
  - Frontend: React 18, Vite 5, Tailwind 3, `motion`, `react-helmet-async`.
  - API: Express 4, Prisma 5 + MySQL, Zod, Helmet, Turnstile.
- **Hosting.**
  - Frontend on Vercel (`portfolio-hernan-cardona.vercel.app`).
  - API on its own domain (`api-portfolio.hernan-cardona.com`).
  - The root domain `hernan-cardona.com` does not respond (OQ-004).
- **Repository.** Public on GitHub (`hervid2/Portfolio`). Docs, code and commits in English.
- **Budget.** Free tiers. No new paid services (ASM-004).
- **Maintainer.** Hernán, assisted by AI agents under GENESIS.

## 11. Risks

- **R1.** Pre-rendering requires adding routing to the SPA and changing the Vercel build.
  Risk of breaking the production deploy. Mitigation: Vercel preview for each PR, and ADR-0003.
- **R2.** Embedding external maps (GitHub Pages) creates an availability dependency and a
  cross-origin dependency. The FlyWorkFlow HTML weighs ~840 KB. To be decided in ADR-0004.
- **R3.** A demo stops working (cold start, data reseeded) and the recruiter sees an error.
  Mitigation: PO-9 audit and notices on the card.
- **R4.** A CV on Drive can change or lose its public access without a deploy noticing.
  Mitigation: a link check in CI or periodically (to be decided in spec 002).
- **R5.** No tests or CI today: any regression goes straight to production. Mitigation: spec 000
  first.

## Assumptions

| ID | Assumption | Proposed by | Risk if false | Validate with | Status |
|---|---|---|---|---|---|
| ASM-001 | The KPIs in §1 are binary checks and need no analytics | agent | No conversion metrics available | Hernán | Pending |
| ASM-002 | No deadline; priority order PO-High first | agent | Wrong order | Hernán | Pending |
| ASM-003 | LCP budget ≤ 2.5 s (Core Web Vitals "good") | agent | Wrong threshold | Hernán | Pending |
| ASM-004 | Free tiers only; no new paid services | agent | Options left out | Hernán | Pending |
| ASM-005 | The GitHub profile README (`hervid2/hervid2`) is the source of truth for positioning, client/personal and the stack per project | human | Inconsistency across channels | Hernán (confirmed 2026-11-26) | Confirmed |
| ASM-006 | The market is remote US · Canada · LATAM, based in Girón, Colombia (UTC-5) | agent, from the profile | Wrong copy in About/Contact | Hernán (confirmed 2026-11-26) | Confirmed |
| ASM-007 | Case studies are written from each repo's README, `docs/` and `roadmap.md`; LinkedIn is not read automatically (its API does not expose profile posts or projects) | agent | Content missing that only exists on LinkedIn | Hernán (may paste posts) | Pending |
| ASM-008 | The FlyWorkFlow Super Admin account (`camila.rojas@…`) may no longer be valid: its README only lists Admin and Member | agent | Recruiter sees a failed login | Hernán, in the FlyWorkFlow project (outside spec 001) | Open — owner decision 2026-11-27 (spec 001, OQ-001-05): the account stays on the card unchanged and is excluded from the live login audit; `docs/discovery/demo-audit.md` lists it as "not audited — owner investigation pending"; Hernán investigates the Super Admin access directly |
| ASM-009 | The CV button opens the Drive `/view` preview (1 click to see it, download available there) rather than a forced download | agent | A recruiter prefers a direct download | Hernán, in spec 002 | Pending |
| ASM-010 | Pre-rendered HTML is produced in EN (default language); the client applies the stored ES preference after hydration. ES routes are a future idea | agent (G3) | ES content is not indexed | Hernán (accepted 2026-11-26) | Confirmed |
| ASM-011 | Test coverage is reported but not gated; the gate is "every AC has ≥ 1 test" | agent (G3) | Low coverage outside the ACs | Hernán (accepted 2026-11-26) | Confirmed |

## Open questions

| ID | Question | Blocks | Owner | Deadline | Answer |
|---|---|---|---|---|---|
| OQ-001 | Does the Sushi Burrito owner authorize a testimonial with their name? What are the exact text, name and role? | Spec 008 (PO-11) | Hernán → owner (questionnaire D.23) | Before spec 008 | Yes — resolved 2026-11-26. Author: Leonardo Ortiz, owner of Sushi Burrito (Bucaramanga); display "Leonardo Ortiz — owner of Sushi Burrito"; restaurant and city may be named; his LinkedIn recommendation text may be reused. Approved quote and authorized scope recorded in FR-021. Publication in ES and a translated EN version is authorized (EN pre-authorized: spec 008 needs no extra approval). Published data: quote, display name, role, restaurant name only; no contact data; withdrawal possible at any time. The filled questionnaire is accepted by Hernán as the BR-007 written authorization; evidence held privately by Hernán (not in the repo) |
| OQ-002 | Implementation of the maps: embed the existing HTML or build a native component from the `.architecture.json`? | Spec 007 (PO-12) | Hernán | G3 (ADR-0004) | Native React component (ADR-0004 Option A, 2026-11-26) |
| OQ-003 | Should `oakfern_bank_dashboard` (technical assessment, Nov 2026) be added to the portfolio? | Roadmap | Hernán | G-Brief | No — out of scope; future idea in roadmap (2026-11-26) |
| OQ-004 | Should the frontend move to `hernan-cardona.com` (custom domain)? It affects canonical URLs and `og:url` | Spec 004 | Hernán | Before spec 004 | Not now — `vercel.app` stays canonical; future idea in roadmap (2026-11-26) |
| OQ-005 | What is the retention policy for the contact messages stored in MySQL? | NFR privacy | Hernán | G3 | |
| OQ-006 | What do "BA-5" and "LI-6" refer to in the external backlog? Assumed: LI-6 = the LinkedIn recommendation from the Sushi Burrito owner | — | Hernán | G-Brief | Confirmed: LI-6 = LinkedIn recommendation; BA-5 = location/market, resolved by ASM-006 (2026-11-26) |
