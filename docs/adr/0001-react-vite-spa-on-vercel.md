# ADR-0001 — React + Vite + Tailwind SPA on Vercel
- **Status:** Accepted (retroactive, documented 2026-11-26). Partially superseded by ADR-0003 if ADR-0003 is accepted.
- **Date:** 2026-02 (original) · documented 2026-11-26
- **Context:** A personal portfolio with 4 sections, bilingual static content, a contact form and a strong visual identity. One developer, free hosting.
- **Options considered:**

| Option | Pros | Cons | Fit with NFRs |
|---|---|---|---|
| React 18 + Vite + Tailwind SPA on Vercel (chosen) | Fast DX; typed static data; free CDN hosting | Empty HTML for crawlers | Fails NFR-005 (discovered later) |
| Next.js | SSR/SSG built in | Heavier for a one-page site | Would meet NFR-005 |
| Plain HTML/CSS | Simplest; indexable | No component model; weak showcase | Meets NFR-005 |

- **Decision:** React + TypeScript + Vite + Tailwind, rendered on the client, deployed on Vercel — decided by Hernán.
- **Consequences:**
  - Positive: fast iteration; typed content; lazy sections.
  - Negative: the served HTML has no content (PO-2).
  - Risks: SEO and link previews.
  - What would make us reconsider it: the need for indexable content → ADR-0003.
