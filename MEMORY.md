# MEMORY — Hernán David Cardona Portfolio  (≤ 50 lines · updated: 2026-11-26, spec 000 closed)

## Current status
- **Stage:** G5 · Spec 000 **Implemented** (PR #4 merged e11bf10; validation APPROVED ×3).
- **Branch:** `chore/000-closeout` (closeout docs + C-02 + CI filter; push and PR pending).
- **main is protected** since 2026-11-26: required checks `frontend`, `api`; PR required (0
  reviews); no force push or deletion; `enforce_admins: false` (owner choice). Verified by GET.
- **Next step (new session):** `/bug` PE-01 (9 runtime npm advisories in api, 1 critical:
  proxy-addr; most fixable by `npm audit fix`) and `/bug` PE-02 (no `trust proxy` behind nginx →
  shared rate limit, Turnstile gets proxy IP). Both live in production. Then spec 001.
- Stale local branches `feat/card-animations`, `refactor`: status unknown, ask Hernán.

## Recent decisions (permanent ones go to ADR or Constitution)
- ADR-0003: custom Vite SSG (Option C); React 18 and Vite 5 stay; the upgrade is optional (DEBT-007).
- ADR-0004: native SVG architecture maps for all 4 projects (PO-12, new scope).
- CV: Google Drive `/view` links by language (BR-005). Email: copy button only, no `mailto`.
- Pre-rendered HTML is EN only (ASM-010). Coverage is reported, not gated (ASM-011).
- Out of scope: the oakfern dashboard (OQ-003) and the custom domain for now (OQ-004).
- Tooling pinned below latest majors for Node 22.17 / Vite 5 (DEBT-009). e2e deferred to 004.

## Learnings and known pitfalls
- Type check: `npm run typecheck --prefix frontend|api`. Root `npx tsc` fails (no root TS).
- Windows: coverage shows duplicate 0% rows when cwd is `c:` lowercase (local artifact only).
- Parallel agents in one checkout break `node_modules`: dev/preview servers lock `esbuild.exe`
  and `npm ci` then half-deletes the tree. Use a scratch worktree/copy for installs and probes;
  run commit-producing agents sequentially. If broken: stop servers, `npm ci --prefix frontend`.
- The API host auto-deploys on every merge to `main`; Vercel deploys the frontend too.
- `gh` now has a valid session with admin on the repo. Creating PRs via `gh pr create` is blocked
  by the auto-mode classifier → Hernán opens PRs (as **draft** until G-Merge).
- Cloning `sushiBurritoJava` on Windows fails on long paths. Use `git show HEAD:<file>`.
- Playwright MCP uses installed Chrome; it creates `.playwright-mcp/` (gitignored).
- LinkedIn cannot be read automatically: Hernán pastes posts if they are needed.
- Production API: `api-portfolio.hernan-cardona.com` (`/health` 200). Frontend: `portfolio-hernan-cardona.vercel.app`.

## Retrospective spec 000 (GENESIS §C.9)
- Missing instruction: the PR step didn't say "draft" loudly enough → PR #4 merged before
  validation (G-Merge skipped). Now prevented by branch protection; ask for draft explicitly.
- Repeated error: root `npx tsc` reported by 8 implementer runs → fixed in AGENTS.md/skills.
- Make deterministic: "one component per file" is not linted (C-02 slipped) → consider a lint
  rule (e.g. react/no-multi-comp once eslint-plugin-react supports ESLint 10).
- No correction cycle hit the limit (max 1 per task).

## Active blockers and open questions
- OQ-005: retention policy for contact messages.
- ASM-008: the FlyWorkFlow Super Admin demo account may be invalid → to be checked in the PO-9 audit (spec 001).
