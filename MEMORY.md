# MEMORY — Hernán David Cardona Portfolio  (≤ 50 lines · updated: 2026-11-27, spec 001 v1.3)

## Current status
- **Stage:** G6 · Spec 001 **Planned**, implementing (v1.3) on `feat/001-project-cards-accuracy`.
- T-01…T-16 done (incl. T-11a). Next: **T-17** latency session 2 (Hernán's go-ahead) on a later
  day, no earlier than 2026-11-28, on or before 2026-12-04 (audit window end); then T-18, T-19.
- Audit (`auditDate` 2026-11-27): logins 5 verified; Slicing Edge re-audit T-14a: Admin works
  but showed real-looking data (B-E3, escalated), Customer untested; Super Admin owner-verified.
- Owner follow-ups in other repos (OF-1…OF-4): `docs/roadmap.md` § "Owner follow-ups".
- **main is protected** since 2026-11-26: required checks `frontend`, `api`; PR required (0
  reviews); no force push or deletion; `enforce_admins: false` (owner choice). Verified by GET.
- Stale local branches `feat/card-animations`, `refactor`: status unknown, ask Hernán.

## Recent decisions (permanent ones go to ADR or Constitution)
- ADR-0003: custom Vite SSG (Option C); React 18 and Vite 5 stay; the upgrade is optional (DEBT-007).
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
- Droplet: nginx `/etc/nginx/sites-enabled/api-portfolio` → localhost:4000 (also 4001, 4002
  for other apps). Proxy/header changes must go live before code that trusts them deploys.
- Production API: `api-portfolio.hernan-cardona.com` (`/health` 200). Frontend: `portfolio-hernan-cardona.vercel.app`.

## Retrospective spec 000 (GENESIS §C.9)
- Missing instruction: the PR step didn't say "draft" loudly enough → PR #4 merged before
  validation (G-Merge skipped). Now prevented by branch protection; ask for draft explicitly.
- Make deterministic: "one component per file" is not linted (C-02 slipped) → consider a lint
  rule (e.g. react/no-multi-comp once eslint-plugin-react supports ESLint 10).

## Active blockers and open questions
- OQ-005: retention policy for contact messages.
