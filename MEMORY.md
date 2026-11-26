# MEMORY — Hernán David Cardona Portfolio  (≤ 50 lines · updated: 2026-11-26)

## Current status
- **Stage:** Genesis G4 (harness), awaiting G-Harness · Active feature: — · SDD phase: —
- **Branch:** `chore/genesis-harness` (from `main` @ 09c41ef)
- **Last completed step:** G-Foundational approved (2026-11-26)
- **Next step:**
  1. G-Harness approval, then the bootstrap commit.
  2. G5: spec 000, quality baseline.

## Recent decisions (permanent ones go to ADR or Constitution)
- ADR-0003: custom Vite SSG (Option C); React 18 and Vite 5 stay; the upgrade is optional (DEBT-007).
- ADR-0004: native SVG architecture maps for all 4 projects (PO-12, new scope).
- CV: Google Drive `/view` links by language (BR-005). Email: copy button only, no `mailto`.
- Pre-rendered HTML is EN only (ASM-010). Coverage is reported, not gated (ASM-011).
- Out of scope: the oakfern dashboard (OQ-003) and the custom domain for now (OQ-004).

## Learnings and known pitfalls
- `npm run lint` fails today: `eslint` is not installed (DEBT-001).
- The `gh` CLI token is invalid. Read public repos via REST or `git clone`, or have Hernán run `gh auth login`.
- Cloning `sushiBurritoJava` on Windows fails on long paths. Use `git show HEAD:<file>`.
- LinkedIn cannot be read automatically: Hernán pastes posts if they are needed.
- Production API: `api-portfolio.hernan-cardona.com` (`/health` 200). Frontend: `portfolio-hernan-cardona.vercel.app`.

## Active blockers and open questions
- OQ-001: testimonial consent. Hernán sends `docs/discovery/stakeholder-questionnaire.md` → blocks spec 008.
- OQ-005: retention policy for contact messages.
- ASM-008: the FlyWorkFlow Super Admin demo account may be invalid → to be checked in the PO-9 audit (spec 001).
