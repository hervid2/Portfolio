# ADR-0002 — Layered Express contact API with Prisma + MySQL
- **Status:** Accepted (retroactive, documented 2026-11-26)
- **Date:** 2026-02 (original) · documented 2026-11-26
- **Context:** The contact form needs server-side validation, CAPTCHA verification with a secret, persistence and an email notification. The secrets cannot live in the frontend.
- **Options considered:**

| Option | Pros | Cons | Fit with NFRs |
|---|---|---|---|
| Express + TypeScript, layered (domain / application / infrastructure / interfaces), Prisma + MySQL (chosen) | Shows backend design (SOLID, DIP via interfaces); swappable providers (Noop / Resend / Nodemailer) | A server to operate | Meets NFR-010 |
| Serverless function on Vercel | No server to run | Less backend showcase | Meets NFR-010 |
| Third-party form service | Zero code | No showcase; data with a third party | Partial |

- **Decision:** Layered Express API, Prisma + MySQL, Turnstile, Resend/Nodemailer — decided by Hernán.
- **Consequences:**
  - Positive: clear boundaries; providers can be swapped by config.
  - Negative: content models in `schema.prisma` that the site does not use (DEBT-002); no migrations folder in the repo (DEBT-004).
  - Risks: API downtime breaks the contact form. Mitigation: the copy-email path (FR-011).
  - What would make us reconsider it: hosting cost, or operations burden.
