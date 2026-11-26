# Functional requirements

> Writing patterns (EARS):
> - Ubiquitous: "The system shall <response>."
> - Event-driven: "When <trigger>, the system shall <response>."
> - State-driven: "While <state>, the system shall <response>."
> - Optional: "Where <feature is enabled>, the system shall <response>."
> - Unwanted behavior: "If <unwanted condition>, then the system shall <response>."
>
> FR-001 … FR-009 document the system as built (brownfield, reverse-engineered 2026-11-26).
> FR-010 onward come from the refactor backlog PO-1 … PO-12 (docs/discovery/brief.md).

## FR-001 — Single-page sections and navigation
- **Actor(s):** Visitor
- **Priority:** Must
- **Requirement:** The system shall render the sections Home, Portfolio, About and Contact on one page. When the visitor selects a navbar entry, the system shall scroll to that section and highlight it as active.
- **Related rules:** —
- **Acceptance criteria (summary):** Each navbar entry scrolls to its section; the active entry is highlighted.
- **Origin:** Existing code (`App.tsx`, `Navbar.tsx`)
- **Status:** Implemented

## FR-002 — Language switch (EN/ES)
- **Actor(s):** Visitor
- **Priority:** Must
- **Requirement:** When the visitor selects a language, the system shall render all UI text in that language and persist the choice for later visits.
- **Related rules:** BR-001
- **Acceptance criteria (summary):** Switching changes every dictionary string; reload keeps the choice.
- **Origin:** Existing code (`LanguageContext.tsx`)
- **Status:** Implemented

## FR-003 — Theme switch (dark/light)
- **Actor(s):** Visitor
- **Priority:** Should
- **Requirement:** When the visitor toggles the theme, the system shall switch between dark and light modes and persist the choice.
- **Related rules:** BR-002
- **Acceptance criteria (summary):** Toggle applies `theme-light`; reload keeps the choice.
- **Origin:** Existing code (`ThemeIcon.tsx`)
- **Status:** Implemented

## FR-004 — Project grid with category filter
- **Actor(s):** Visitor
- **Priority:** Must
- **Requirement:** The system shall show one card per project from typed static data. When the visitor selects a category, the system shall show only projects of that category, and "All" shall show every project.
- **Related rules:** —
- **Acceptance criteria (summary):** Categories derive from data; filtering is exact.
- **Origin:** Existing code (`PortfolioSection.tsx`, `useProjectFilter.ts`)
- **Status:** Implemented

## FR-005 — Hover preview clip
- **Actor(s):** Visitor
- **Priority:** Could
- **Requirement:** While a card is hovered or focused, the system shall play its muted looping preview clip over the poster. If the device has no hover or the visitor prefers reduced motion, then the system shall show only the poster.
- **Related rules:** —
- **Acceptance criteria (summary):** See README "Implemented scope".
- **Origin:** Existing code (`useHoverPreviewVideo.ts`)
- **Status:** Implemented

## FR-006 — Demo credentials modal
- **Actor(s):** Visitor
- **Priority:** Should
- **Requirement:** Where a project has demo credentials, when the visitor opens them, the system shall show each role with its username and password in a modal.
- **Related rules:** —
- **Acceptance criteria (summary):** Modal lists every credential in the active language.
- **Origin:** Existing code (`CredentialsModal.tsx`)
- **Status:** Implemented

## FR-007 — Demo video modal
- **Actor(s):** Visitor
- **Priority:** Could
- **Requirement:** Where a project has a demo video, when the visitor opens it, the system shall play the YouTube video for the active language in a modal.
- **Related rules:** BR-001
- **Acceptance criteria (summary):** EN shows the EN video id; ES shows the ES id.
- **Origin:** Existing code (`VideoModal.tsx`)
- **Status:** Implemented

## FR-008 — Contact form
- **Actor(s):** Visitor
- **Priority:** Must
- **Requirement:** When the visitor submits name, email, message and a valid CAPTCHA, the system shall validate the input, store the contact message, send an email notification and confirm success. If validation, CAPTCHA or delivery fails, then the system shall show an error without losing the typed input.
- **Related rules:** BR-003, BR-004
- **Acceptance criteria (summary):** Valid submit returns success; invalid returns field error; 6th request in 15 min is rejected.
- **Origin:** Existing code (`api/`, `ContactSection.tsx`)
- **Status:** Implemented

## FR-009 — Skills grid
- **Actor(s):** Visitor
- **Priority:** Should
- **Requirement:** The system shall show the skills from typed static data with an icon and label, using the dark icon variant when it exists for the active theme.
- **Related rules:** —
- **Acceptance criteria (summary):** One item per skill entry.
- **Origin:** Existing code (`AboutSection.tsx`, `data/skills.ts`)
- **Status:** Implemented

## FR-010 — Download CV in the active language
- **Actor(s):** Recruiter
- **Priority:** Must
- **Requirement:** The system shall offer a "Download CV" action in the hero and in the contact section. When the visitor activates it, the system shall open the CV for the active language in a new tab.
- **Related rules:** BR-005
- **Acceptance criteria (summary):** EN → EN CV URL; ES → ES CV URL; reachable in 1 click from the hero.
- **Origin:** PO-1; brief §7, ASM-009
- **Status:** Approved

## FR-011 — Copy public email
- **Actor(s):** Recruiter
- **Priority:** Must
- **Requirement:** The system shall show the public email as text in the hero and in the contact section. When the visitor activates the copy button, the system shall copy the email to the clipboard and confirm visually. If the clipboard is unavailable, then the system shall keep the email selectable as text.
- **Related rules:** —
- **Acceptance criteria (summary):** 1 click copies `PUBLIC_EMAIL`; a "Copied" confirmation appears; no `mailto`.
- **Origin:** PO-1; owner decision 2026-11-26
- **Status:** Approved

## FR-012 — Pre-rendered content
- **Actor(s):** Crawler / AI tool / link unfurler
- **Priority:** Must
- **Requirement:** The system shall serve, for every public route, HTML that already contains that route's primary text content (hero copy, project titles and descriptions, case study text) before any JavaScript runs.
- **Related rules:** —
- **Acceptance criteria (summary):** `curl` of each production route shows the content in the HTML.
- **Origin:** PO-2
- **Status:** Approved

## FR-013 — Case studies
- **Actor(s):** Hiring manager
- **Priority:** Must
- **Requirement:** The system shall publish a case study page with its own URL for FlyWorkFlow and for Slicing Edge, structured as Problem → Role → Decisions and why → Mistakes and how they were solved → Result, in EN and ES. When the visitor activates "Read case study" on the card, the system shall navigate to that page.
- **Related rules:** BR-006
- **Acceptance criteria (summary):** Both pages exist, are pre-rendered and linked from their cards.
- **Origin:** PO-3; ASM-007
- **Status:** Approved

## FR-014 — Project card content matches the source of truth
- **Actor(s):** Recruiter, hiring manager
- **Priority:** Must
- **Requirement:** The system shall show, for each project, a description and stack consistent with the GitHub profile README. In particular, FlyWorkFlow shall list Next.js 16, NestJS 11, AWS Lambda (API Gateway, SAM), Prisma + PostgreSQL and S3.
- **Related rules:** BR-006
- **Acceptance criteria (summary):** FlyWorkFlow card shows the listed stack; no "Next.js 14".
- **Origin:** PO-4; ASM-005
- **Status:** Approved

## FR-015 — AI assistant highlighted in Slicing Edge
- **Actor(s):** Recruiter
- **Priority:** Should
- **Requirement:** The system shall present the AI shopping assistant (Llama 3.3 70B on Groq, server-side tool calling to search products, recommend items and track orders) as the first feature of the Slicing Edge card.
- **Related rules:** —
- **Acceptance criteria (summary):** Description starts with the assistant; stack includes the LLM.
- **Origin:** PO-5
- **Status:** Approved

## FR-016 — Project kind label
- **Actor(s):** Recruiter
- **Priority:** Should
- **Requirement:** The system shall show on each card a label "Client project" or "Personal project · deployed" according to its project kind, and the portfolio subtitle shall state that the selection includes client work and production-deployed personal projects.
- **Related rules:** BR-006
- **Acceptance criteria (summary):** Sushi Burrito ×2 → Client; Slicing Edge and FlyWorkFlow → Personal; label in EN/ES.
- **Origin:** PO-6
- **Status:** Approved

## FR-017 — Hero headline
- **Actor(s):** Recruiter
- **Priority:** Should
- **Requirement:** The system shall show in the hero the role, the main stack (TypeScript · React/Next.js · Node.js/NestJS · PostgreSQL · Java/Spring Boot · AWS) and the type of products built, without the word "desktop" in the headline.
- **Related rules:** BR-006
- **Acceptance criteria (summary):** Hero copy matches the approved text in EN/ES.
- **Origin:** PO-7; ASM-005
- **Status:** Approved

## FR-018 — About and Skills aligned
- **Actor(s):** Recruiter
- **Priority:** Should
- **Requirement:** The system shall state in About and Contact a location of Girón, Colombia (UTC-5) and a market of remote roles in the US, Canada and LATAM, and the skills grid shall include every technology in the hero stack (including NestJS, PostgreSQL, Prisma and AWS).
- **Related rules:** BR-006
- **Acceptance criteria (summary):** Copy and skills match the profile README.
- **Origin:** PO-8; ASM-006
- **Status:** Approved

## FR-019 — Demo availability verified
- **Actor(s):** Recruiter
- **Priority:** Should
- **Requirement:** The system shall publish only demo credentials verified to work. If a demo's backend may take more than 10 s to respond on first load, then the system shall show a notice on that card telling the visitor to expect a delay.
- **Related rules:** —
- **Acceptance criteria (summary):** Audit `docs/discovery/demo-audit.md` passes; notices match the audit.
- **Origin:** PO-9; ASM-008
- **Status:** Approved

## FR-020 — Link preview metadata
- **Actor(s):** Link unfurler
- **Priority:** Could
- **Requirement:** The system shall serve for each public route a specific meta description, `og:title`, `og:description`, `og:image` (1200×630), `og:url` and `twitter:card`.
- **Related rules:** —
- **Acceptance criteria (summary):** Tags present in pre-rendered HTML; preview renders in a validator.
- **Origin:** PO-10
- **Status:** Approved

## FR-021 — Client testimonial
- **Actor(s):** Recruiter
- **Priority:** Should
- **Requirement:** Where the client has given written authorization, the system shall show their testimonial (quote, name, role) on the Sushi Burrito card and in a case study if one exists, in EN and ES.
- **Related rules:** BR-007
- **Acceptance criteria (summary):** Shown only with an authorization record.
- **Authorized content (OQ-001, 2026-11-26):** display name "Leonardo Ortiz — owner of Sushi
  Burrito" (Bucaramanga; restaurant and city may be named). Quote, Spanish original: "Fue todo
  un profesional en su trabajo, implementó una solución sencilla pero práctica y eficiente que
  nos permitió agilizar todo el flujo de trabajo y tener trazabilidad completa de todos los datos
  del negocio." Published in ES and in an EN translation (pre-authorized). Only the quote,
  display name, role and restaurant name are published; no contact data. The author may
  withdraw consent at any time. Written authorization (BR-007) is held privately by the owner.
- **Origin:** PO-11; OQ-001
- **Status:** Approved (OQ-001 resolved 2026-11-26)

## FR-022 — Interactive architecture map
- **Actor(s):** Hiring manager
- **Priority:** Should
- **Requirement:** The system shall offer on each of the 4 project cards a "Show interactive architecture map" action. When activated, the system shall open a modal with that project's architecture map in the active language. The modal lets the visitor explore the nodes and edges, switch between guided views, and close with Esc.
- **Related rules:** —
- **Acceptance criteria (summary):** 4 maps; EN/ES labels; keyboard operable; lazy-loaded.
- **Origin:** PO-12 (added 2026-11-26)
- **Status:** Approved (implementation: ADR-0004 Option A)
