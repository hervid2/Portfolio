# Visual baseline — Spec 000
Captured: 2026-11-26 · Task: T-01 · AC: AC-000-09 (baseline half), AC-000-13 (`main` reference size)

## Baseline
- **Commit:** `ed051a4f0da1e6f6a8fc068ede315f6ed65756a8` (`git merge-base main HEAD`, the `main` tip
  before any spec 000 implementation commit).
- **Worktree:** `../portfolio-main-baseline` (kept until validation; removed in P-04).
- **Build:** `cd ../portfolio-main-baseline/frontend && npm ci && npm run build`. No `.env`, so no
  `VITE_*` values (as in CI): the Turnstile widget is not rendered and the API base URL falls back
  to `http://localhost:4000`.
- **Server:** `npx vite preview --port 4173 --strictPort`.
- **Browser:** Playwright MCP (installed Google Chrome).
- **Evidence (gitignored):** `.evidence/000-quality-baseline/baseline/` holds 40 PNGs, `records.json`
  (the text records below) and `console.log`. The script is also kept as
  `.evidence/000-quality-baseline/capture.js`, because the MCP only loads files from the repository.

## Bundle size of `main` (NFR-002 reference)
Definition (plan §6): gzip sizes, as printed by `vite build`, of the JS and CSS that
`dist/index.html` references (module script + `modulepreload` links; there are none on `main`).
Lazy section chunks are excluded.

| Asset | Raw | Gzip |
|---|---|---|
| `assets/index-5tenY65S.js` (initial JS) | 296.49 kB | **96.46 kB** |
| `assets/index-BFX6Q03Z.css` (initial CSS) | 18.75 kB | **4.24 kB** |
| `AboutSection` chunk (lazy, excluded) | 3.69 kB | 1.16 kB |
| `ContactSection` chunk (lazy, excluded) | 5.34 kB | 1.84 kB |
| `PortfolioSection` chunk (lazy, excluded) | 24.86 kB | 7.80 kB |

Row for the `docs/architecture/overview.md` table (written by its own task):
`| main before spec 000 | ed051a4 | 96.46 kB | 4.24 kB | reference only |`

## Emulation (plan §6 step 3)
- `prefers-reduced-motion: reduce` and `prefers-color-scheme` = the state's theme.
- Every `<video>` is paused with `currentTime = 0` (and `autoplay = false`) before each shot.
- Requests to `youtube.com`, `youtube-nocookie.com` and `challenges.cloudflare.com` (any subdomain)
  are aborted through `context.route`.
- After each scroll: 1500 ms wait; before each shot: 300 ms after pausing videos.
- Viewport screenshots (not full page) with `animations: "disabled"`, one per section, after
  `scrollIntoView({ block: "start" })`. Viewports: 360 × 780 and 1280 × 800.
- Every state starts from a fresh load: `localStorage` cleared, `portfolio-language` and
  `portfolio-theme` set, reload, then a scroll through the whole page so the lazy sections mount.

## State matrix (plan §6 step 4) and shot list
1. **Sections:** `home`, `portfolio`, `about`, `contact` × `en`/`es` × `dark`/`light` × `360`/`1280`
   → 32 shots named `<section>-<lang>-<theme>-<width>.png`.
2. `extra-mobile-menu-en-dark-360.png` — mobile menu open.
3. `extra-video-modal-en-dark-1280.png`, `extra-credentials-modal-en-dark-1280.png` — first
   "Watch Demo Video" / "Demo Credentials" button; focus on open and after Esc recorded as text.
4. Keyboard pass (text only): Tab from the top of the page until focus returns to `body`.
5. `extra-card-hover-en-dark-1280.png` — hover on the first project card.
6. `extra-card-tap-en-dark-360.png` — tap (CDP touch events, touch emulation on) on the first
   card's title.
7. `extra-contact-validation-en-dark-1280.png` — empty form submitted.
8. `extra-contact-api-unreachable-en-dark-1280.png` — `**/api/contact` aborted, valid form
   submitted.
9. Reduced-motion check (text only, replaces the DevTools `MotionConfig` check): after scrolling
   through every section, the list of elements whose computed `transform` is not identity.
10. `extra-persist-es-light-1280.png` — ES and light chosen through the UI, then reload;
    stored values and the first nav label recorded as text.

Total: 40 shots.

## Text records (baseline)
- **Video modal:** focus on open stays on the trigger (`button "Watch Demo Video"`, not inside the
  dialog); Esc closes it (0 dialogs); focus after Esc = the trigger, `:focus-visible`.
- **Credentials modal:** same pattern (`button "Demo Credentials"`); Esc closes it; focus returns
  to the trigger.
- **Tab sequence (34 stops, all `:focus-visible`):** brand, Home, Portfolio, About Me, Get in
  Touch, EN, ES, Switch to light mode, View My Work, Get in Touch, GitHub (`a`), LinkedIn (`a`),
  5 filter chips (All, Desktop, Web SPA, E-commerce, Web App), then per card: Watch Demo Video ·
  Code | Live Demo · Code · Demo Credentials (×3), contact GitHub, LinkedIn, `input#name`,
  `input#email`, `textarea#message`, Send contact message; then `body`. Full list in
  `records.json`.
- **Reduced-motion transforms:** 32 elements keep a non-identity transform after settling:
  28 × `translateY(24px)` (`matrix(1, 0, 0, 1, 0, 24)`: hero text, section headers, about text and
  image, 16 skill chips) and the 4 project cards with `scale(0.96) translateY(24px)`. This is the
  `main` behavior: the validation run must produce the **same list**, not an empty one (see
  Findings).
- **Persistence:** `portfolio-language = "es"`, `portfolio-theme = "light"`, `<html>` has
  `theme-light`, first nav label `Inicio`.
- **Contact states:** validation shows "Please complete all fields before sending."; the API
  error shows the raw `Failed to fetch`.

## Console log summary (baseline)
38 errors, 0 warnings, 0 page errors, all caused by the emulation:
- 37 × `Failed to load resource: net::ERR_FAILED` for
  `https://challenges.cloudflare.com/turnstile/v0/api.js` (blocked; one per page load);
- 1 × the same for `http://localhost:4000/api/contact` (aborted on purpose in state 8).

The validation run must show no error outside these two sources.

## Comparison (plan §6 step 5, used in validation)
- Run the same script unchanged against the branch preview on 4174
  (`npm run build && npx vite preview --port 4174 --strictPort` from the feature branch). The
  script picks 4174 when it answers and writes to `.evidence/000-quality-baseline/branch/`.
- Per shot name, decode both PNGs in an `OffscreenCanvas` (no new dependency). A pixel differs if
  any RGBA channel differs by **more than 25/255**.
- **Tolerance: ≤ 0.1 % of pixels per shot.** Shots over it get a side-by-side review recorded in
  `validation.md`.
- Text records (`records.json`) must match; console errors must not add new sources.

## Findings (baseline behavior, not changed by spec 000)
- **F-1 Reduced motion leaves content offset.** With `prefers-reduced-motion: reduce`, 32
  animated elements stay at their initial `y: 24` (and the cards at `scale: 0.96`). The plan's
  "no element keeps a non-identity transform" check would fail on `main`, so validation compares
  the list against this baseline instead. Candidate for a debt entry (coordinator decides).
- **F-2 Modals do not move focus into the dialog on open** (focus stays on the trigger). Esc and
  focus return work. Recorded as-is; no change in spec 000 (CL-06).
- **F-3 The API-unreachable message is the raw `Failed to fetch`**, not a dictionary string.

## Capture script (run with Playwright MCP `browser_run_code_unsafe`)
Run it unchanged for both runs, from a page on the preview origin, with
`filename: .evidence/000-quality-baseline/capture.js` (or pasted as `code`).

```js
async (page) => {
  // Target: 4174 (feature branch preview) when it answers, else 4173 (main baseline preview).
  const ROOT = "C:/ADSO/JAVASCRIPT/Portfolio/.evidence/000-quality-baseline";
  const probe = async (port) => {
    try {
      const res = await page.request.get(`http://localhost:${port}/`, { timeout: 2000 });
      return res.ok();
    } catch {
      return false;
    }
  };
  const PORT = (await probe(4174)) ? 4174 : 4173;
  const BASE = `http://localhost:${PORT}/`;
  const OUT = `${ROOT}/${PORT === 4174 ? "branch" : "baseline"}`;
  const SECTIONS = ["home", "portfolio", "about", "contact"];
  const SETTLE = 1500;
  const BLOCKED = /^https?:\/\/([^/]*\.)?(youtube\.com|youtube-nocookie\.com|challenges\.cloudflare\.com)\//;
  const ctx = page.context();
  const log = { port: PORT, out: OUT, shots: [], console: [], records: {} };

  const onConsole = (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      log.console.push({ type: m.type(), text: m.text().slice(0, 200) });
    }
  };
  const onPageError = (e) => log.console.push({ type: "pageerror", text: String(e).slice(0, 200) });
  const block = (route) => route.abort();
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  await ctx.route(BLOCKED, block);

  const wait = (ms) => page.waitForTimeout(ms);
  const pauseVideos = () =>
    page.evaluate(() =>
      document.querySelectorAll("video").forEach((v) => {
        v.autoplay = false;
        v.pause();
        v.currentTime = 0;
      }),
    );
  const shot = async (name) => {
    await pauseVideos();
    await wait(300);
    await page.screenshot({ path: `${OUT}/${name}.png`, animations: "disabled" });
    log.shots.push(name);
  };
  const focusInfo = () =>
    page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return { tag: "body", name: "", focusVisible: false };
      const name =
        el.getAttribute("aria-label") ||
        (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60) ||
        el.getAttribute("title") ||
        el.getAttribute("id") ||
        "";
      return {
        tag: el.tagName.toLowerCase(),
        name,
        focusVisible: el.matches(":focus-visible"),
        inDialog: Boolean(el.closest("[role=dialog]")),
      };
    });
  const scrollTo = async (id, block = "start") => {
    await page.waitForSelector(`#${id}`, { state: "attached", timeout: 10000 });
    await page.evaluate(
      ([target, b]) => document.getElementById(target).scrollIntoView({ block: b, behavior: "instant" }),
      [id, block],
    );
    await wait(SETTLE);
  };
  const loadAllSections = async () => {
    for (let i = 0; i < 12; i += 1) {
      await page.evaluate(() => window.scrollBy({ top: window.innerHeight, behavior: "instant" }));
      await wait(250);
    }
    for (const id of SECTIONS) await page.waitForSelector(`#${id}`, { state: "attached", timeout: 10000 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await wait(SETTLE);
  };
  const open = async ({ lang = "en", theme = "dark", width = 1280 } = {}) => {
    await page.setViewportSize({ width, height: width === 360 ? 780 : 800 });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await page.goto(BASE, { waitUntil: "load" });
    await page.evaluate(
      ([l, t]) => {
        localStorage.clear();
        localStorage.setItem("portfolio-language", l);
        localStorage.setItem("portfolio-theme", t);
      },
      [lang, theme],
    );
    await page.reload({ waitUntil: "load" });
    await wait(SETTLE);
    await loadAllSections();
  };

  // 1. Matrix: 4 sections x EN/ES x dark/light x 360/1280 = 32 viewport shots.
  for (const width of [360, 1280]) {
    for (const lang of ["en", "es"]) {
      for (const theme of ["dark", "light"]) {
        await open({ lang, theme, width });
        for (const id of SECTIONS) {
          await scrollTo(id);
          await shot(`${id}-${lang}-${theme}-${width}`);
        }
      }
    }
  }

  // 2. Mobile menu open (360, EN dark).
  await open({ width: 360 });
  await page.click('button[aria-controls="mobile-menu"]');
  await wait(800);
  await shot("extra-mobile-menu-en-dark-360");

  // 3. Modals (1280, EN dark): focus placement and close with Esc.
  for (const [key, label] of [["video", "Watch Demo Video"], ["credentials", "Demo Credentials"]]) {
    await open();
    await scrollTo("portfolio");
    await page.locator("#portfolio button", { hasText: label }).first().click();
    await wait(SETTLE);
    const focusOnOpen = await focusInfo();
    await shot(`extra-${key}-modal-en-dark-1280`);
    await page.keyboard.press("Escape");
    await wait(1000);
    log.records[`${key}Modal`] = {
      focusOnOpen,
      dialogsAfterEsc: await page.locator("[role=dialog]").count(),
      focusAfterEsc: await focusInfo(),
    };
  }

  // 4. Focus-visible keyboard pass (1280, EN dark), from the top of the page.
  await open();
  const tabs = [];
  for (let i = 0; i < 60; i += 1) {
    await page.keyboard.press("Tab");
    await wait(60);
    const info = await focusInfo();
    tabs.push(`${info.tag}|${info.name}|${info.focusVisible ? "fv" : "no-fv"}`);
    if (info.tag === "body" && i > 0) break;
  }
  log.records.tabSequence = tabs;

  // 5. Hover on a project card (1280, EN dark).
  await open();
  await scrollTo("portfolio");
  await page.locator("#portfolio article").first().hover();
  await wait(1000);
  await shot("extra-card-hover-en-dark-1280");

  // 6. Tap on a project card title with touch emulation (360, EN dark).
  await open({ width: 360 });
  await page.evaluate(() =>
    document.querySelector("#portfolio article h3").scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await wait(SETTLE);
  const box = await page.locator("#portfolio article h3").first().boundingBox();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
  const point = { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height / 2) };
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await wait(1000);
  await shot("extra-card-tap-en-dark-360");
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: false });
  await cdp.detach();

  // 7. Contact client-side validation error (1280, EN dark): submit the empty form.
  await open();
  await scrollTo("contact");
  await page.click('#contact button[type="submit"]');
  await wait(800);
  await page.evaluate(() =>
    document.querySelector("#contact form").scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await wait(800);
  await shot("extra-contact-validation-en-dark-1280");

  // 8. API unreachable (1280, EN dark): **/api/contact aborted, valid form submitted.
  const abortApi = (route) => route.abort();
  await page.route("**/api/contact", abortApi);
  await open();
  await scrollTo("contact");
  await page.fill("#name", "Baseline Tester");
  await page.fill("#email", "baseline.tester@example.com");
  await page.fill("#message", "This is a baseline capture message used only to test the error state.");
  await page.click('#contact button[type="submit"]');
  await wait(2500);
  await page.evaluate(() =>
    document.querySelector("#contact form").scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await wait(800);
  await shot("extra-contact-api-unreachable-en-dark-1280");
  await page.unroute("**/api/contact", abortApi);

  // 9. Reduced motion (DOM-free MotionConfig check): no non-identity transform after settling.
  await open();
  for (const id of SECTIONS) await scrollTo(id);
  log.records.reducedMotionTransforms = await page.evaluate(() => {
    const identity = new Set(["none", "matrix(1, 0, 0, 1, 0, 0)"]);
    return [...document.querySelectorAll("body *")]
      .filter((el) => !identity.has(getComputedStyle(el).transform))
      .map((el) => {
        const cls = (el.getAttribute("class") || "").slice(0, 80);
        return `${el.tagName.toLowerCase()}|${cls}|${getComputedStyle(el).transform}`;
      });
  });

  // 10. Language and theme persist after reload (BR-001, BR-002): switch via the UI, reload.
  await open();
  await page.locator("header button", { hasText: /^ES$/ }).click();
  await page.click('button[aria-label="Switch to light mode"]');
  await wait(500);
  await page.reload({ waitUntil: "load" });
  await wait(SETTLE);
  log.records.persistence = await page.evaluate(() => ({
    storedLanguage: localStorage.getItem("portfolio-language"),
    storedTheme: localStorage.getItem("portfolio-theme"),
    htmlHasThemeLight: document.documentElement.classList.contains("theme-light"),
    firstNavLabel: (document.querySelector("header nav button")?.textContent || "").trim(),
  }));
  await shot("extra-persist-es-light-1280");

  // Cleanup so the MCP page is left as found.
  await ctx.unroute(BLOCKED, block);
  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  await page.emulateMedia({ reducedMotion: null, colorScheme: null });
  return JSON.stringify(log);
}
```
