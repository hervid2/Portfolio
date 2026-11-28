# Live demo audit — spec 001

> Status: **preflight done (T-12); Sushi Burrito Web logins done (T-13); Slicing Edge logins
> done (T-14, both failed); FlyWorkFlow logins done (T-15, Super Admin excluded); latency
> session 1 done (T-16, 2 of 3 samples per endpoint); latency session 2 and `coldStartNotice`
> decision done (T-17, 3 of 3 samples, no notice on any project)**. The close (T-18) is
> pending. Section 6 is not final yet. Owner decisions of 2026-11-27: the FlyWorkFlow Super
> Admin is owner-verified (ASM-008 closed, no audit login; spec v1.3). **Slicing Edge re-audit
> complete (T-14a 21:49, T-14b 21:54 UTC-5): both accounts verified.** The T-14a B-E3
> escalation was resolved by the owner (the admin "Recent Orders" are his own test data,
> Stripe test mode); OQ-001-16 is closed with no exception needed (spec v1.4), so
> `ownerExceptionUsernames` holds only the FlyWorkFlow Super Admin (section 4.3, section 5).

## 1. Header

| Field | Value |
|---|---|
| Audit date (`auditDate`, ASM-001-14) | **2026-11-27** (first day of this run) |
| Window end | **2026-12-04** (`auditDate` + 7 days). Every record of this run and G-Merge must fall on or before this date; otherwise spec §4.2 B4 applies (re-run) |
| Auditor | Implementer agent (Claude Code), on Hernán's machine, Git Bash; Hernán gave the go-ahead for T-12 (no login) |
| Method version | 1 |
| Time zone | UTC-5 (constitution Title IV) |
| Spec | [spec 001 — project cards accuracy](../../specs/001-project-cards-accuracy/spec.md) (v1.4), [plan §1.6](../../specs/001-project-cards-accuracy/plan.md) |
| Requirements | [FR-019 — Demo availability verified](../requirements/functional.md), [BR-008 — Live demo audit safety](../requirements/business-rules.md), NFR-013 |

**Owner confirmations this audit relies on**

| Id | Confirmation | Owner | Date |
|---|---|---|---|
| OQ-001-04 | The linked Sushi Burrito Web deployment is a demo clone with seeded data, separate from the restaurant's real instance (separate repo, VPS and database). Its three accounts are audited normally under BR-008 (ASM-001-12) | Hernán | 2026-11-27 |
| OQ-001-12 | Slicing Edge holds non-real data and Stripe runs in test mode; all its demo accounts stay publishable, Admin included, subject to the audit (ASM-001-13) | Hernán | 2026-11-27 |
| OQ-001-15 / OQ-001-05 | FlyWorkFlow Super Admin (`camila.rojas@flyworkflow.io`) is excluded from the audit: kept on the card, never logged into, listed as "not audited — owner investigation pending" (ASM-008, one-off Title III exception) | Hernán | 2026-11-27 |
| ASM-008 / OQ-001-15 update | The owner states the Super Admin access works: ASM-008 closed as "Confirmed by owner, 2026-11-27 (no audit login)". The row now reads "not audited — owner-verified 2026-11-27"; the account stays in `ownerExceptionUsernames` | Hernán | 2026-11-27 |
| OQ-001-16 | The two Slicing Edge accounts that failed at T-14 stay on the card as a one-off owner exception to constitution Title III, listed in `ownerExceptionUsernames`; owner fix pending (follow-up OF-1, `docs/roadmap.md`) | Hernán | 2026-11-27 |
| B-E3 (T-14a) / OQ-001-12 | Resolves the T-14a B-E3 escalation with option (a): the orders and names in the Slicing Edge admin "Recent Orders" are the owner's own **test data** (Stripe test mode, consistent with OQ-001-12 / ASM-001-13). The T-14a Admin login (21:49, role "Admin") counts as **verified**; no new Admin login. Go-ahead for the Customer login (T-14b) | Hernán | 2026-11-27 |
| OQ-001-16 update | After T-14a / T-14b verified both Slicing Edge accounts, OQ-001-16 is closed as "resolved by re-audit T-14a/T-14b; no exception needed"; both accounts leave `ownerExceptionUsernames` and are `verified` (spec v1.4; OF-1 closed) | Hernán | 2026-11-27 |

## 2. Method

**BR-008 rules (binding for every task of this run)**
- Allowed actions only: open the demo, at most **one** login attempt per published demo account
  per audit run, observe the landing page, log out.
- Never: submit any other form, create / edit / delete data, retry a failed login, use a
  password-reset link, create an account, or record third-party or real data.
- Login fails → record the visible message only, no retry in this run, credential not published
  (B-E2), unless the owner keeps it as a named exception (OQ-001-16).
- Login lands on real-looking data → log out at once, record "possible production data" without
  copying anything, escalate to Hernán (B-E3).
- The FlyWorkFlow Super Admin is never logged into (owner exception above).
- No password, token, cookie or screenshot of a logged-in page is stored in this file or the repo.
- Each login task needs Hernán's explicit go-ahead for that demo (T-13, T-14, T-15).

**Link commands (spec §4.1 B3, NFR-013)** — run from Git Bash; a final 2xx passes:

```sh
curl -sL -o /dev/null -w "%{http_code} %{url_effective}" <url>   # final status, redirects followed
curl -sIL <url> | grep -iE "^HTTP/|^location:"                   # redirect chain (status lines)
```

**YouTube oEmbed check** — 200 passes:

```sh
curl -s -o /dev/null -w "%{http_code}" \
  "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json"
```

A final 4xx/5xx or oEmbed failure gets one re-check in the same run; if it still fails, the
audit stops and escalates to Hernán (B-E1, B-E4).

**First-load latency (ASM-001-03, no login)** — used by T-16 / T-17, not by this preflight:

```sh
curl -s -o /dev/null -w "%{time_starttransfer} %{time_total} %{http_code}" <endpoint>
```

3 samples per endpoint, each after ≥ 30 min without traffic from the auditor, over at least two
separate sessions inside the window. `coldStartNotice` = yes if any `time_total` > 10 s. Other
visitors may warm the backend, so the result is best effort.

**Endpoint discovery (OQ-001-11, spec §4.2 B5)** — Playwright MCP loads only the **public**
pages (home, product list, login page without typing); the auditor reads the network requests
and the public JS bundles, then sends unauthenticated `GET` requests to candidate health routes.
No form, no login.

**Playwright MCP preflight (OQ-001-09):** connected on 2026-11-27 19:27 UTC-5
(`browser_navigate`, `browser_network_requests`, `browser_snapshot`, `browser_close` all
worked). T-13 … T-15 can use it; the fallback (Hernán logs in by hand) is not needed.

## 3. Per-project results

Link checks run 2026-11-27 19:26 UTC-5; endpoint discovery 19:27 – 19:28 UTC-5. No re-check
was needed (every final status was 2xx, every oEmbed 200).

### 3.1 Sushi Burrito Desktop (`java-desktop-app`)

| Check | Result |
|---|---|
| Live demo URL | none (`liveDemoUrl: null`; flow A3) |
| Code URL `https://github.com/hervid2/sushiBurritoJava` | **200**, final URL unchanged; chain: `200` |
| YouTube EN `inrgfaGwJEE` (oEmbed) | **200** |
| YouTube ES `sSIvLiMbzEM` (oEmbed) | **200** |
| First-load latency | N/A — no live demo (flow A3) |
| `coldStartNotice` | N/A — no live demo |

### 3.2 Sushi Burrito Web (`sushi-burrito-spa`)

| Check | Result |
|---|---|
| Live demo URL `https://sushi-burrito-final.vercel.app/` | **200**, final URL unchanged; chain: `200`; 0.43 s |
| Code URL `https://github.com/hervid2/SushiBurritoFinal` | **200**, final URL unchanged; chain: `200` |
| YouTube | none (no `demoVideoId`) |
| API base URL (OQ-001-11) | `https://api-sushi-burrito.hernan-cardona.com/api` — found in the public bundle `assets/index-BoEdhW8C.js`; the login page sends no API request before login |
| Health-route probe (GET, no auth) | `/` 404 · `/health` 404 · `/api/health` 404 · `/healthz` 404 · **`/api` 200** `{"message":"Bienvenido al API de Sushi Burrito."}` (0.56 s) |
| **Proposed latency endpoint** | `GET https://api-sushi-burrito.hernan-cardona.com/api` (public welcome route; no dedicated health route exists). Confirmed by Hernán 2026-11-27 (OQ-001-11 closed) |
| First-load latency samples | 3 of 3: session 1 (T-16, §3.5) and session 2 (T-17, §3.6); max `time_total` 0.40 s |
| `coldStartNotice` | **no** — no `time_total` sample > 10 s (T-17, §3.7) |

### 3.3 The Slicing Edge (`the-slicing-edge`)

| Check | Result |
|---|---|
| Live demo URL `https://slicing-edge-e-commerce-web.vercel.app/` | **200**, final URL unchanged; chain: `200`; 1.14 s |
| Code URL `https://github.com/hervid2/Slicing-edge-e-commerce` | **200**, final URL unchanged; chain: `200` |
| YouTube | none (no `demoVideoId`) |
| API base URL (OQ-001-11) | `https://slicing-edgeapi-production.up.railway.app/api` — observed in the browser on the public `/products` page: `GET …/api/categories` → 200. The home page is server-rendered and calls the API server-side |
| Health-route probe (GET, no auth) | `/health` 404 · `/` 404 · **`/api/health` 200** `{"status":"ok","service":"slicing-edge-api",…}` (0.56 s) · `/docs` 200 (Swagger UI, 0.47 s) |
| **Proposed latency endpoints** | `GET https://slicing-edgeapi-production.up.railway.app/api/health` (API) and `GET https://slicing-edge-e-commerce-web.vercel.app/` (storefront home), per ASM-001-03. Confirmed by Hernán 2026-11-27 (OQ-001-11 closed) |
| First-load latency samples | 3 of 3 per endpoint: session 1 (T-16, §3.5) and session 2 (T-17, §3.6); max `time_total` 0.69 s (API), 1.14 s (storefront home) |
| `coldStartNotice` | **no** — no `time_total` sample > 10 s (T-17, §3.7) |

### 3.4 FlyWorkFlow (`flyworkflow-incidents`)

| Check | Result |
|---|---|
| Live demo URL `https://flyworkflowapp.vercel.app/` | **200**, final URL `https://flyworkflowapp.vercel.app/login?from=%2F`; chain: `307` (Location `/login?from=%2F`) → `200`; 2.46 s |
| Code URL `https://github.com/hervid2/flyworkflowapp` | **200**, final URL unchanged; chain: `200` |
| YouTube | none (no `demoVideoId`) |
| API base URL | `https://50s0hvq0me.execute-api.us-east-1.amazonaws.com` — found in the public JS chunks of `/login`; the login page sends no API request before login |
| Health-route probe (GET, no auth) | **`/health` 200** `{"status":"ok","uptime":1.71,…}` — ttfb 2.85 s, total 2.85 s; uptime 1.7 s shows a fresh Lambda (one observation, not a sample) |
| **Proposed latency endpoint** | `GET https://50s0hvq0me.execute-api.us-east-1.amazonaws.com/health` (already named by ASM-001-03). Confirmed by Hernán 2026-11-27 (OQ-001-11 closed) |
| First-load latency samples | 3 of 3: session 1 (T-16, §3.5) and session 2 (T-17, §3.6); max `time_total` 2.90 s (cold Lambda) |
| `coldStartNotice` | **no** — no `time_total` sample > 10 s (T-17, §3.7) |

**Real-looking data on public pages:** none seen. Sushi Burrito Web and FlyWorkFlow show only a
login form; Slicing Edge shows a seeded knife catalogue (product names, categories, Cloudinary
images). Nothing was copied.

### 3.5 First-load latency — Session 1 (T-16)

Run 2026-11-27 20:16 – 21:16 UTC-5 by the implementer agent (Git Bash, curl 8.4.0, Schannel),
from Hernán's machine, with Hernán's go-ahead given the same day. Only the public,
unauthenticated `GET` endpoints confirmed for OQ-001-11; no login, no form. Command per request:

```sh
curl -s -o /dev/null -w "%{time_starttransfer} %{time_total} %{http_code}" <endpoint>
```

(The FlyWorkFlow body was saved to a temporary file only to read its `uptime` field, then deleted.)

**Spacing.** Each sample came ≥ 30 min after the auditor's last request to that backend: the last
traffic before this session was Sushi Burrito Web 19:35 (T-13), Slicing Edge 19:37 (T-14) and
FlyWorkFlow 20:14 (T-15), so FlyWorkFlow sample 1 waited until 20:45. Session 1 took **2 of the
3 samples** per endpoint; session 2 (T-17, a separate invocation) takes the third. The Slicing
Edge storefront home renders server-side and calls the same API, so the order alternates (sample
1: API then home; sample 2: home then API) and each sample of one also warms the other.

**Samples** (seconds; values rounded to 2 decimals; `time_total` is the value compared with the
10 s threshold):

| Sample | Time (UTC-5) | Project | Endpoint | time_starttransfer | time_total | http_code | Notes |
|---|---|---|---|---|---|---|---|
| S1-1 | 2026-11-27 20:16:07 | Sushi Burrito Web | `GET https://api-sushi-burrito.hernan-cardona.com/api` | 0.29 | 0.29 | 200 | — |
| S1-1 | 2026-11-27 20:16:08 | The Slicing Edge | `GET https://slicing-edgeapi-production.up.railway.app/api/health` | 0.61 | 0.61 | 200 | measured before the home |
| S1-1 | 2026-11-27 20:16:09 | The Slicing Edge | `GET https://slicing-edge-e-commerce-web.vercel.app/` | 1.08 | 1.14 | 200 | API already warmed by the row above |
| S1-1 | 2026-11-27 20:45:45 | FlyWorkFlow | `GET https://50s0hvq0me.execute-api.us-east-1.amazonaws.com/health` | 2.62 | 2.62 | 200 | `uptime` 1.84 s → cold start (fresh Lambda) |
| S1-2 | 2026-11-27 20:47:15 | Sushi Burrito Web | `GET https://api-sushi-burrito.hernan-cardona.com/api` | 0.40 | 0.40 | 200 | — |
| S1-2 | 2026-11-27 20:47:16 | The Slicing Edge | `GET https://slicing-edge-e-commerce-web.vercel.app/` | 0.37 | 0.39 | 200 | measured before the API |
| S1-2 | 2026-11-27 20:47:18 | The Slicing Edge | `GET https://slicing-edgeapi-production.up.railway.app/api/health` | 0.55 | 0.55 | 200 | API already warmed by the row above |
| S1-2 | 2026-11-27 21:16:45 | FlyWorkFlow | `GET https://50s0hvq0me.execute-api.us-east-1.amazonaws.com/health` | 2.38 | 2.38 | 200 | `uptime` 1.65 s → cold start (fresh Lambda) |

**Warm references (not samples).** One request sent right after each sample (about 1–3 s later)
shows the warm baseline. These do not count towards the 3 samples or the notice decision.

| After | Time (UTC-5) | Endpoint | time_starttransfer | time_total | http_code | Notes |
|---|---|---|---|---|---|---|
| S1-1 | 20:16:07 | Sushi Burrito Web `/api` | 0.41 | 0.41 | 200 | — |
| S1-1 | 20:16:09 | Slicing Edge API `/api/health` | 0.52 | 0.52 | 200 | — |
| S1-1 | 20:16:11 | Slicing Edge storefront home | 0.33 | 0.35 | 200 | — |
| S1-1 | 20:45:48 | FlyWorkFlow `/health` | 0.27 | 0.27 | 200 | `uptime` 2.32 s (same instance) |
| S1-2 | 20:47:16 | Sushi Burrito Web `/api` | 0.28 | 0.28 | 200 | — |
| S1-2 | 20:47:17 | Slicing Edge storefront home | 0.34 | 0.36 | 200 | — |
| S1-2 | 20:47:19 | Slicing Edge API `/api/health` | 0.43 | 0.43 | 200 | — |
| S1-2 | 21:16:48 | FlyWorkFlow `/health` | 0.32 | 0.32 | 200 | `uptime` 2.16 s (same instance) |

**Extra request (disclosed).** At about 20:47:30 UTC-5 the auditor sent one more unmeasured
`GET` to the Slicing Edge API `/api/health` by mistake. It falls after every Slicing Edge sample
of this session, so no sample is affected; it only moves the Slicing Edge "last auditor traffic"
time to 20:47:30.

**Session 1 reading (input for T-17, not a decision):**
- No `time_total` above 10 s on any endpoint (maximum 2.62 s, FlyWorkFlow S1-1).
- FlyWorkFlow: both samples hit a cold Lambda (`uptime` < 2 s at response time). The cold start
  adds about 2.1–2.4 s over the warm 0.27–0.32 s, well below the threshold.
- Sushi Burrito Web (droplet) and the Slicing Edge API (Railway) show no cold-start pattern: the
  first and warm requests are within 0.2 s of each other. The Slicing Edge storefront's first
  request of S1-1 (1.14 s against 0.35 s warm) suggests a mild Vercel cold render.
- Other visitors may have warmed any backend in the 30 min gaps (best effort, ASM-001-03).
- Last auditor traffic at the end of session 1: Sushi Burrito Web 20:47:16, Slicing Edge 20:47:30,
  FlyWorkFlow 21:16:48 (all UTC-5, 2026-11-27).

### 3.6 First-load latency — Session 2 (T-17)

Run 2026-11-27 21:25 – 21:47 UTC-5 by the implementer agent in a separate invocation from T-16
(ASM-001-03), same machine, same tools, same command and same endpoints as §3.5 (public,
unauthenticated `GET` only; no login, no form). Hernán gave the go-ahead the same day. The
FlyWorkFlow body was again saved to a temporary file only to read `uptime`, then deleted.

**Spacing.** Each sample came ≥ 30 min after the auditor's last request to that backend
(end of session 1: Sushi Burrito Web 20:47:16, Slicing Edge 20:47:30, FlyWorkFlow 21:16:48).
Sushi Burrito Web and Slicing Edge were eligible from 21:17:30 and were sampled at 21:25;
FlyWorkFlow was eligible from 21:46:48 and was sampled at 21:47:08. The Slicing Edge order
alternates again (S2-1: API then home, like S1-1). No other request was sent in this session.

**Samples** (seconds; rounded to 2 decimals):

| Sample | Time (UTC-5) | Project | Endpoint | time_starttransfer | time_total | http_code | Notes |
|---|---|---|---|---|---|---|---|
| S2-1 | 2026-11-27 21:25:41 | Sushi Burrito Web | `GET https://api-sushi-burrito.hernan-cardona.com/api` | 0.32 | 0.32 | 200 | — |
| S2-1 | 2026-11-27 21:25:42 | The Slicing Edge | `GET https://slicing-edgeapi-production.up.railway.app/api/health` | 0.69 | 0.69 | 200 | measured before the home |
| S2-1 | 2026-11-27 21:25:43 | The Slicing Edge | `GET https://slicing-edge-e-commerce-web.vercel.app/` | 1.08 | 1.11 | 200 | API already warmed by the row above |
| S2-1 | 2026-11-27 21:47:08 | FlyWorkFlow | `GET https://50s0hvq0me.execute-api.us-east-1.amazonaws.com/health` | 2.90 | 2.90 | 200 | `uptime` 2.05 s → cold start (fresh Lambda) |

**Warm references (not samples).** One request right after each sample; not counted.

| After | Time (UTC-5) | Endpoint | time_starttransfer | time_total | http_code | Notes |
|---|---|---|---|---|---|---|
| S2-1 | 21:25:41 | Sushi Burrito Web `/api` | 0.24 | 0.24 | 200 | — |
| S2-1 | 21:25:43 | Slicing Edge API `/api/health` | 0.42 | 0.42 | 200 | — |
| S2-1 | 21:25:45 | Slicing Edge storefront home | 0.37 | 0.40 | 200 | — |
| S2-1 | 21:47:13 | FlyWorkFlow `/health` | 0.29 | 0.29 | 200 | `uptime` 4.60 s (same instance) |

**Session 2 reading:** same pattern as session 1. FlyWorkFlow hit a cold Lambda again (about
2.6 s over warm); the storefront home's first request (1.11 s against 0.40 s warm) again suggests
a mild Vercel cold render; Sushi Burrito Web and the Slicing Edge API show no cold-start pattern.
Last auditor traffic at the end of the audit's latency work: Sushi Burrito Web 21:25:41, Slicing
Edge 21:25:45, FlyWorkFlow 21:47:13 (UTC-5, 2026-11-27).

### 3.7 `coldStartNotice` decision (T-17)

Rule (ASM-001-03, §2): `coldStartNotice` = yes if **any** `time_total` sample of the project's
endpoints is > 10 s over the 3 samples (sessions 1 and 2); warm references do not count.

| Project | Endpoint | Samples (`time_total`, s) | Max of 3 | > 10 s? |
|---|---|---|---|---|
| Sushi Burrito Web | API `/api` | 0.29 · 0.40 · 0.32 | 0.40 | no |
| The Slicing Edge | API `/api/health` | 0.61 · 0.55 · 0.69 | 0.69 | no |
| The Slicing Edge | storefront home | 1.14 · 0.39 · 1.11 | 1.14 | no |
| FlyWorkFlow | API `/health` | 2.62 · 2.38 · 2.90 | 2.90 | no |

| Project id | Decision |
|---|---|
| `java-desktop-app` | `coldStartNotice`: **N/A** — no live demo (flow A3) |
| `sushi-burrito-spa` | `coldStartNotice`: **no** — max `time_total` 0.40 s |
| `the-slicing-edge` | `coldStartNotice`: **no** — max `time_total` 1.14 s (storefront home) |
| `flyworkflow-incidents` | `coldStartNotice`: **no** — max `time_total` 2.90 s; every sample was a cold Lambda, still under 10 s |

So `coldStartProjectIds` will be `[]` (T-18 writes it in section 6 and applies it to
`projects.ts`). Best effort: other visitors may have warmed a backend between samples.

## 4. Credentials

Prepared for T-13 … T-15. Result column is empty until the login task for that demo runs.

### 4.1 Sushi Burrito Desktop (`java-desktop-app`)

No published credentials (flow A2).

### 4.2 Sushi Burrito Web (`sushi-burrito-spa`) — T-13

| Role label (card) | Username | Result | Observed role / landing page | Published |
|---|---|---|---|---|
| Admin / Administrador | `admin@demo.com` | **verified** — 2026-11-27 19:35 UTC-5, first attempt | Lands on `#admin/dashboard` "Panel administrativo" / "Dashboard Administrativo"; admin menu (Dashboard, Gestión de Usuarios, Menú y mesas, Estadísticas ventas); seeded-looking counters only. Logout OK (19:35, "Has cerrado sesión.") | yes |
| Kitchen / Cocina | `kitchen@demo.com` | **verified** — 2026-11-27 19:35 UTC-5, first attempt | Lands on `#kitchen/orders/pending` "Pedidos Pendientes"; kitchen menu (Pendientes, En Preparación, Listos); one demo order (table number and menu items, no personal data). Logout OK (19:35) | yes |
| Waiter / Mesero | `waiter@demo.com` | **verified** — 2026-11-27 19:35 UTC-5, first attempt | Lands on `#waiter/orders` "Gestión de Pedidos" / "Gestión de Mesas"; waiter menu (Gestión de Pedidos, Estado Pedidos, Facturar pedido); six tables, no personal data. Logout OK (19:35) | yes |

T-13 notes (Playwright MCP, 2026-11-27 19:34 – 19:35 UTC-5; Hernán's go-ahead given the same
day):
- One login attempt per account; all three succeeded on the first try, so no retry question
  arose. After each login only the landing view was read (accessibility snapshot); no menu link,
  create / edit / status / invoice button, password-reset link or other form was used. Each
  session ended with "Cerrar Sesión"; the browser was closed afterwards.
- The app shows no explicit role name; the role is inferred from the landing route
  (`#admin/…`, `#kitchen/…`, `#waiter/…`), the page heading and the menu. The card labels
  (Admin, Kitchen, Waiter) match these views.
- No real-looking personal or business data on any landing view (B-E3 not triggered). Nothing
  was copied; no screenshot was taken. The MCP's logged-in page snapshots were moved out of the
  repository folder to the session scratchpad.

### 4.3 The Slicing Edge (`the-slicing-edge`) — T-14, re-audit T-14a / T-14b

Current result (re-audit run after the owner reported the login fixed: Admin at T-14a, Customer
at T-14b). The T-14a "possible production data" finding was resolved by the owner (test data,
section 1). The T-14 rows below are kept as history.

| Role label (card) | Username | Result | Observed role / landing page | Published |
|---|---|---|---|---|
| Admin / Administrador | `admin@slicing-edge.com` | **verified (T-14a)** — 2026-11-27 21:49 UTC-5, single attempt, login succeeded. The B-E3 flag on its landing view was cleared by the owner: the recent orders are his test data (Stripe test mode, OQ-001-12); no new login | Lands on `/admin` "Admin Dashboard"; header badge shows the role explicitly: "Admin"; admin menu (Dashboard, Products, Orders, Users). Logout OK (21:50, back to `/`) | yes |
| Customer / Cliente | `customer@example.com` | **verified (T-14b)** — 2026-11-27 21:54 UTC-5, single attempt, login succeeded | Redirected to the public storefront home `/`; no role badge: the header shows a display name (seeded demo persona, not recorded), "My account" (`/account`) and "Sign out", and no admin link, so the role is inferred as a signed-in customer, matching the card label. No personal or order data on the landing view. Logout OK (21:54) | yes |

History (T-14, first run):

| Role label (card) | Username | Result | Observed role / landing page | Published |
|---|---|---|---|---|
| Admin / Administrador | `admin@slicing-edge.com` | **failed** — 2026-11-27 19:37 UTC-5, single attempt, not retried | Stayed on `/auth/login`; visible message "Invalid email or password". No logged-in view, so no role observed | yes (owner exception, OQ-001-16) |
| Customer / Cliente | `customer@example.com` | **failed** — 2026-11-27 19:37 UTC-5, single attempt, not retried | Stayed on `/auth/login`; visible message "Invalid email or password". No logged-in view, so no role observed | yes (owner exception, OQ-001-16) |

T-14 notes (Playwright MCP, 2026-11-27 19:37 UTC-5; Hernán's go-ahead given the same day):
- One email/password attempt per published account on `/auth/login` ("Welcome Back"), with the
  passwords published in `projects.ts`. Both returned "Invalid email or password" about 1–3 s
  after "Sign In" and the page stayed on the login form. Per BR-008 neither was retried; the
  "Forgot password?" link, "Continue with Google" and "Create one" (sign-up) were not used.
- Because no login succeeded, there was no session to log out of, no role to observe and no
  logged-in data to assess (B-E3 not reachable). The T-13 role-inference note does not apply.
- Stripe test-mode indicator: none seen on the pages visited (home, login). No cart, checkout or
  guest-checkout flow was opened, so nothing about Stripe was observed.
- Open sign-up and guest checkout were left untouched. Nothing was copied; no screenshot was
  taken. The MCP's page snapshots of this run (public pages and the login form only) were moved
  out of the repository folder to the session scratchpad; the browser was closed.

T-14a notes (re-audit, Playwright MCP, 2026-11-27 21:49 – 21:50 UTC-5; Hernán's go-ahead given
the same day, after he reported that he fixed the login in the Slicing Edge project):
- A new audit run for these two accounts only (BR-008: one attempt per account per run). Email
  and password only, with the passwords published in `projects.ts`, on `/auth/login`;
  "Continue with Google", "Forgot password?" and "Create one" were not used.
- Admin: the login succeeded on the single attempt and redirected to `/admin`. The role is shown
  explicitly (header badge "Admin"), and the route, heading and menu are admin-only, matching the
  card label. The landing view's recent-orders list shows customer names and an email address
  that look like real people's data, next to store counters. Under B-E3 the auditor signed out at
  once with the header "Sign out" button (21:50, back to the public home `/`), clicked nothing
  else, and copied none of it: no name, address, order number or amount is recorded here.
- Customer: not attempted. The brief for T-14a says to stop at a B-E3 finding, so the run ended
  after the Admin logout. The account stays untested in this run.
- Read-only: no cart, checkout, edit, product, order, user, search or AI-assistant control and no
  other form was used. After the logout the public header showed a cart badge "1", which the
  auditor did not create or open.
- No screenshot was taken. The MCP's three page snapshots of this run (login form, the logged-in
  admin view, the public home after logout) were moved out of the repository folder to the
  session scratchpad (`t14a-playwright`); the browser was closed and no process is left running.
- Owner context: OQ-001-12 / ASM-001-13 state that all Slicing Edge data is non-real. The
  auditor cannot confirm that from the page, so the B-E3 rule applies as written; Hernán decides
  (section 5).
- Resolution (owner, 2026-11-27): option (a), the orders and names are his own test data
  (Stripe test mode); the Admin result counts as verified (section 1). The MCP snapshots of
  T-14a were deleted by the coordinator.

T-14b notes (completion of the same re-audit run, Playwright MCP, 2026-11-27 21:53 – 21:54
UTC-5; Hernán's go-ahead given the same day with his B-E3 decision):
- Customer only; the Admin was not logged into again (verified at T-14a, owner decision). One
  email/password attempt on `/auth/login` with the password published in `projects.ts`;
  "Continue with Google", "Forgot password?" and "Create one" were not used.
- The login succeeded on the single attempt (21:54:00) and redirected to the public home `/`.
  The header first still showed the public "Account" link; about 10 s later it showed the
  signed-in header (display name, "My account", "Sign out"). That was observation only, not a
  second attempt. The app shows no role badge for a customer (unlike the Admin badge); the role
  is inferred from the absent admin link and badge, matching the card label "Customer".
- No real-looking personal or business data on the landing view (B-E3 not triggered): it is the
  public storefront home (seeded knife catalogue). The display name looked like a placeholder
  persona; it is not recorded here. No account, order, cart or wishlist page was opened.
- Logout: "Sign out" at 21:54:18. The header kept the signed-in look until the auditor reloaded
  the public home (21:54:31), which showed the public "Account" link again, so the session was
  closed (the header just does not refresh on sign-out; informational, other repo).
- Read-only: no cart, checkout, edit, search, AI-assistant control or other form was used. A
  cart badge "1" showed in the header right after the redirect; it was not opened or changed.
- No screenshot was taken. The MCP's six page snapshots of this run were moved out of the
  repository folder to the session scratchpad (`t14b-playwright`) and deleted after these notes
  were written; the browser was closed and no process is left running.

### 4.4 FlyWorkFlow (`flyworkflow-incidents`) — T-15

| Role label (card) | Username | Result | Observed role / landing page | Published |
|---|---|---|---|---|
| Super Admin / Superadministrador | `camila.rojas@flyworkflow.io` | not audited — owner-verified 2026-11-27 | no login (OQ-001-05, OQ-001-15); the owner states the access works (ASM-008 closed) | yes (owner exception) |
| Admin / Administrador | `isabela.nieto@constructoradelvalle.com` | **verified** — 2026-11-27 20:13 UTC-5, first attempt | Lands on `/mapa` "Mapa de Incidencias"; header user button shows the role explicitly: "Isabela Nieto — admin"; project "Proyecto Onboarding"; seeded-looking incident pins only. Logout OK (20:13, back to `/login`) | yes |
| Member / Miembro | `diego.salazar@constructoradelvalle.com` | **verified** — 2026-11-27 20:14 UTC-5, first attempt | Lands on `/mapa` "Mapa de Incidencias"; header user button shows the role explicitly: "Diego Salazar — member"; same project and pins as Admin. Logout OK (20:14, back to `/login`) | yes |

T-15 notes (Playwright MCP, 2026-11-27 20:13 – 20:14 UTC-5; Hernán's go-ahead given the same
day):
- The Super Admin (`camila.rojas@flyworkflow.io`) was not logged into and no attempt was made
  (owner exception OQ-001-05 / OQ-001-15, ASM-008).
- One login attempt per account on `/login` ("Gestión de Incidencias", Spanish by default, as
  expected), with the password published in `projects.ts`. Both succeeded on the first try and
  redirected to `/mapa` after a few seconds, so no retry question arose (FlyWorkFlow locks an
  account after 10 wrong passwords).
- Unlike T-13, the role does not need to be inferred: the header user button names it
  (`admin`, `member`), matching the card labels. The landing view and the main menu (Inicio,
  Dashboard, Mapa, Historial, Calendario, Galería, Documentos, Papelera, Ajustes) look the same
  for both roles; role-specific permissions further in were not explored (read-only audit).
- Only the landing view was read (accessibility snapshot). No menu link, incident pin,
  "Crear incidencia", upload, map tool, date / slider control, notification, settings, share,
  password-reset or other form was used; each session ended with "Cerrar sesión", then the
  browser was closed.
- No real-looking personal or business data on the landing view (B-E3 not triggered): the
  project is "Proyecto Onboarding" and the pins include "Testing incident #03" next to generic
  construction-issue titles. The display names match the published demo personas. Nothing was
  copied; no screenshot was taken. The MCP's page snapshots and console log of this run were
  moved out of the repository folder to the session scratchpad. Console: 4 warnings (an unused
  CSS preload), 0 errors.

## 5. Findings and follow-ups for Hernán

Preflight findings (T-18 completes this section):
- **OQ-001-11 resolved (owner, 2026-11-27):** the proposal is confirmed. Sushi Burrito Web
  `GET …hernan-cardona.com/api`; Slicing Edge `GET …/api/health` + storefront home; FlyWorkFlow
  `GET …/health`. Full URLs in section 3 and spec §11.
- **Task-count discrepancy — resolved: typo, 2 is correct (owner, 2026-11-27).** `tasks.md` T-12
  said "8 YouTube ids"; `projects.ts` has 2 (`java-desktop-app` EN and ES; the desktop app has no
  live demo, so its videos are its evidence). Both were checked.
- **Slicing Edge demo accounts fail (T-14, 2026-11-27) — resolved by re-audit T-14a / T-14b
  (exception lifted, see the next item):** `admin@slicing-edge.com` and `customer@example.com` both get "Invalid email or
  password" with the published passwords. Owner decision (2026-11-27, OQ-001-16): both stay on the
  card as a one-off exception to constitution Title III and are listed in
  `ownerExceptionUsernames`; T-18 does not remove them. Follow-up OF-1 (`docs/roadmap.md`): fix the
  accounts, then re-audit with a short `/bug` in this repo, which lifts the exception. Likely
  causes to check (not verified): the production database was never seeded with these users, it
  was reseeded with other passwords, or a visitor changed them (CL-17).
- **Slicing Edge re-audit (T-14a / T-14b, 2026-11-27) — resolved, both accounts verified:**
  at T-14a (21:49 UTC-5) the Admin login worked (role "Admin", `/admin`), but the dashboard's
  recent-orders list looked like real customer data (not copied), so the auditor logged out and
  escalated under B-E3. **Owner decision (2026-11-27), option (a):** those orders are his own
  test data (Stripe test mode, OQ-001-12); the Admin result counts as verified, with no new
  login. At T-14b (21:54 UTC-5) the Customer login succeeded on the single attempt (signed-in
  storefront, no personal data) and logged out. OQ-001-16 is closed as "resolved by re-audit
  T-14a/T-14b; no exception needed"; both accounts are `verified` and leave
  `ownerExceptionUsernames`; OF-1 is closed. No B-E3 escalation remains open for T-18.
  Suggestion for the owner (other repo, optional): the storefront header does not refresh on
  "Sign out" until the page reloads.
- **Sushi Burrito Web bundle (other repo, informational):** the public bundle contains the
  SweetAlert2 "protestware" snippet (reference to an anthem `.mp3` on `flag-gimn.ru`), which some
  SweetAlert2 11.x releases play for visitors on Russian-locale `.ru`/`.su`/`.рф` domains.
  Suggest pinning a SweetAlert2 version without it in `SushiBurritoFinal` (follow-up OF-4).

Follow-ups required by spec §8.2 item 5 (recorded now, confirmed at T-18):
- Add the demo accounts to the Sushi Burrito Web and Slicing Edge READMEs (OQ-001-06).
- State in the `SushiBurritoFinal` README that the linked deployment is a demo clone with seeded
  data, separate from the restaurant's instance (suggestion, other repo; OQ-001-04; follow-up
  OF-3).
- FlyWorkFlow Super Admin: owner-verified 2026-11-27, no audit login (ASM-008 closed, OQ-001-05,
  OQ-001-15).
- Sushi Burrito Web: the app header does not show the signed-in role (T-13); follow-up OF-2.
- Shared-demo integrity: any visitor can lock a FlyWorkFlow account or change a demo password;
  suggest blocking password changes for demo accounts and a scheduled reseed (CL-17).

Follow-ups in other repositories are tracked in `docs/roadmap.md` § "Owner follow-ups (other
repos)" (OF-1 … OF-4).

## 6. Machine-readable summary

Provisional: only `auditDate` and `ownerExceptionUsernames` are final; T-18 fills
`verifiedUsernames` and `coldStartProjectIds` from sections 3 and 4.

```json
{
  "auditDate": "2026-11-27",
  "verifiedUsernames": {
    "java-desktop-app": [],
    "sushi-burrito-spa": [],
    "the-slicing-edge": [],
    "flyworkflow-incidents": []
  },
  "ownerExceptionUsernames": {
    "flyworkflow-incidents": ["camila.rojas@flyworkflow.io"]
  },
  "coldStartProjectIds": []
}
```
