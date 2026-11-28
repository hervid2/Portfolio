# MEMORY — Hernán David Cardona Portfolio  (≤ 50 lines · updated: 2026-11-27, spec 001 closed)

## Current status
- **Stage:** G6 · Spec 001 **Implemented** (G-Merge 2026-11-27, PR #8 `da9dece`, prod verified).
- Next: spec 002 Hero and contact CTAs (PO-7, PO-1; FR-010, FR-011, FR-017) via `/feature`.
- Owner follow-ups, other repos (OF-2…OF-4 open): `docs/roadmap.md`. New debts DEBT-021…025
  (a11y, navbar at 360 px, credentials-dialog i18n): roadmap, mostly for spec 004.
- **main is protected** since 2026-11-26: required checks `frontend`, `api`; PR required (0
  reviews); no force push or deletion; `enforce_admins: false` (owner choice). Verified by GET.
- Stale local branches `feat/card-animations`, `refactor`: status unknown, ask Hernán.

## Recent decisions (permanent ones go to ADR or Constitution)
- ADR-0003: custom Vite SSG (Option C); React 18 and Vite 5 stay; upgrade optional (DEBT-007).
- ADR-0004: native SVG architecture maps for all 4 projects (PO-12, new scope).
- Mail: Resend is primary in production; nodemailer must become a real runtime fallback
  (spec 009). Today the provider is picked once at startup by config (DEBT-020).
- CV: Google Drive `/view` links by language (BR-005). Email: copy button only, no `mailto`.
- Pre-rendered HTML is EN only (ASM-010). Coverage is reported, not gated (ASM-011).
- Out of scope: the oakfern dashboard (OQ-003) and the custom domain for now (OQ-004).
- Tooling pinned below latest majors for Node 22.17 / Vite 5 (DEBT-009). e2e deferred to 004.

## Learnings and known pitfalls
- Type check: `npm run typecheck --prefix frontend|api`. Root `npx tsc` fails (no root TS).
- Parallel agents in one checkout break `node_modules`: dev/preview servers lock `esbuild.exe`
  and `npm ci` then half-deletes the tree. Use a scratch worktree/copy for installs and probes;
  run commit-producing agents sequentially. If broken: stop servers, `npm ci --prefix frontend`.
- The API does NOT auto-deploy (prod ran March code until 2026-11-27). Manual: droplet
  `/var/www/portfolio-api` → git pull, `npm ci`, prisma generate, build, `pm2 restart
  portfolio-api`. G-Merge for api changes ends at "deployed and verified". Vercel auto-deploys.
- `gh` now has a valid session with admin on the repo. Creating PRs via `gh pr create` is blocked
  by the auto-mode classifier → Hernán opens PRs (as **draft** until G-Merge).
- Cloning `sushiBurritoJava` on Windows fails on long paths. Use `git show HEAD:<file>`.
- Playwright MCP uses installed Chrome; it creates `.playwright-mcp/` (gitignored).
- `npm audit fix` takes the newest in-range version (resend 6.41.0 was 6 h old): check publish
  date and provenance. A parent pin (express → qs) may need `npm update <parent>`.
- LinkedIn cannot be read automatically: Hernán pastes posts if they are needed.
- Prod: web `portfolio-hernan-cardona.vercel.app`; API `api-portfolio.hernan-cardona.com` (`/health`
  200) via nginx `sites-enabled/api-portfolio` → :4000 (4001/4002 other apps); proxy first.

## Retrospective spec 001 (GENESIS §C.9; full text in specs/001-*/validation.md)
- APPLIED 2026-11-27 (`chore(harness): apply spec 001 retrospective improvements [001]`):
  out-of-plan files stop for Hernán first (T-11a/C-01); greps use `from "motion`; MCP pinned
  `@playwright/mcp@0.0.86` (sync now writes `.mcp.json`); api G-Merge ends at prod deploy;
  commit ids `[T-NN]`/`[NNN]`/`[BUG-<slug>]` (C-06). Still deferred: react/no-multi-comp.
- Worked: BR-008 stop (T-14a); red-first + mutation (CL-04); browser beats jsdom (popLayout).
  Cycles ≤ 1 per task; validation 1 of 3; audit window met on day 1.

## Active blockers and open questions
- OQ-005: retention policy for contact messages.
