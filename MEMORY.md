# MEMORY — Hernán David Cardona Portfolio  (≤ 50 lines · updated: 2026-11-26)

## Current status
- **Stage:** Genesis G5 (next) · Active feature: 000-quality-baseline (not started) · SDD phase: 1
- **Branch:** `main` @ 0e8d626 (harness merged via PR #2; `chore/genesis-harness` can be deleted)
- **Last completed step:** G-Harness merged into `main` (PR #2, 2026-11-26)
- **Next step:** G5: `/feature 000` (quality baseline) in a new session → creates
  `feat/000-quality-baseline` from `main`. This MEMORY.md update is uncommitted: commit it there.

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
- OQ-001: answered 2026-11-26, pending formal closure in docs (planner: brief, roadmap,
  traceability, FR-021 → spec 008 unblocked; also fix brief.md:223 "Spec 006" → 008).
  - Leonardo Ortiz authorized: quote = questionnaire Q3, display "Leonardo Ortiz — owner of
    Sushi Burrito", restaurant + city may be named, LinkedIn text reusable.
  - Hernán accepts the filled questionnaire as the BR-007 written authorization (his decision).
  - The EN translation is pre-authorized by Leonardo: spec 008 needs no extra approval.
  - The filled questionnaire is local only: gitignored and untracked (public repo).
- OQ-005: retention policy for contact messages.
- ASM-008: the FlyWorkFlow Super Admin demo account may be invalid → to be checked in the PO-9 audit (spec 001).
