# ADR-0004 — Interactive architecture maps
- **Status:** Accepted (2026-11-26)
- **Date:** 2026-11-26
- **Context:**
  - FR-022 needs an interactive map per project (4) in a modal, in EN/ES, keyboard-operable, lazy-loaded (NFR-002, NFR-003).
  - Existing sources:
    - FlyWorkFlow: Archify JSON (components, connections, guided `views`) plus a generated HTML of ~840 KB.
    - Slicing Edge: hand-written HTML in Spanish (24 KB) plus PNGs in EN/ES.
    - Sushi Burrito Web: an HTML page on GitHub Pages.
    - Sushi Burrito Desktop: nothing.
  - Each source has its own visual style and language coverage.
- **Options considered:**

| Option | Pros | Cons | Fit with NFRs |
|---|---|---|---|
| **A. Native React `ArchitectureMap` component that renders typed data (`frontend/src/data/architecture/*.ts`) as SVG** | One visual language (dark/cyan tokens); EN/ES by type; accessible (focusable nodes, list of views as alternative); light; no cross-origin dependency; shows front-end skill. FlyWorkFlow data converts from its Archify JSON | Build effort: the component, plus authoring data for 3 maps | Meets NFR-002/003/006/011 |
| B. `<iframe sandbox>` of the existing GitHub Pages HTML | Fast to ship for 3 of 4 | Mixed styles and languages (Slicing Edge is ES only); ~840 KB page; depends on GitHub Pages; poor focus handling across frames; Desktop still needs a map | Weak on NFR-002/003/006 |
| C. Copy the generated HTML into `public/` and iframe it same-origin | No external dependency | Same style, language and a11y issues as B; copies drift from their source | Weak on NFR-003/006 |

- **Recommendation (agent):**
  - **Option A**, with no new dependency: SVG plus existing `motion`, with pan and zoom done through CSS transforms.
  - Data is authored from each repo's docs; FlyWorkFlow is converted from its Archify JSON.
  - Each node can link to its source file in the repo, as the Archify version does.
  - Discarded: B and C, because they ship three different looks and only one language, which works against the brand and FR-022.
- **Decision:** **Option A — a native React `ArchitectureMap` component over typed bilingual data.** Decided by Hernán at G-Foundational, 2026-11-26.
- **Consequences:**
  - Positive: consistent, bilingual, accessible maps.
  - Negative: map data must be kept in sync with each project by hand.
  - Risks: map readability on small screens. Mitigation: the views list and the zoom control.
  - What would make us reconsider it: if Archify (or similar) can export themeable, bilingual components.
