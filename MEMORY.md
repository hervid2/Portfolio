# MEMORY — Hernán David Cardona Portfolio  (≤ 50 lines · updated: 2026-11-26, spec 000 G-Plan)

## Current status
- **Stage:** G5 · Active feature: 000-quality-baseline · SDD phase: 6 (Implement)
- **Branch:** `feat/000-quality-baseline` (not pushed). PR #3 (OQ-001) is merged in `main`.
- **Last completed step:** G-Spec (spec v1.0) and G-Plan (spec v1.1, plan, 38 tasks) approved
  2026-11-26 (commits 0fc7481, 3207ae3).
- **Next step:** implementer runs T-01…T-38 one by one (`specs/000-quality-baseline/tasks.md`);
  draft PR before validation (ask Hernán to push).
- Stale local branches `feat/card-animations`, `refactor`: status unknown, ask Hernán.

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
- Playwright MCP uses the installed Google Chrome; a Chromium cache also exists in `%LOCALAPPDATA%\ms-playwright`.
- LinkedIn cannot be read automatically: Hernán pastes posts if they are needed.
- Production API: `api-portfolio.hernan-cardona.com` (`/health` 200). Frontend: `portfolio-hernan-cardona.vercel.app`.

## Active blockers and open questions
- OQ-001 closed 2026-11-26 (FR-021): spec 008 unblocked; EN translation pre-authorized.
- OQ-005: retention policy for contact messages.
- OQ-000-01: Hernán runs `gh auth login` (admin on repo) before the branch-protection step
  (agent applies it after G-Merge, `enforce_admins: false` by owner choice).
- ASM-008: the FlyWorkFlow Super Admin demo account may be invalid → to be checked in the PO-9 audit (spec 001).
