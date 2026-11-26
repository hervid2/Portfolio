---
description: SDD phase 2 — creates or updates a feature's specification
agent: planner
---
Request: $ARGUMENTS

1. Read docs/constitution.md, docs/glossary.md, docs/roadmap.md and the related FR/NFR/BR in
   docs/requirements/. For positioning or project facts, check the GitHub profile README (BR-006).
2. If the feature is not in the roadmap, stop and propose adding it.
3. Create specs/NNN-<slug>/spec.md with template D.18 (NNN from the roadmap).
4. Interview Hernán (in Spanish) in rounds of ≤ 7 questions until covering: actors, main flow,
   alternative and error flows, rules, data, interface (EN and ES copy, both themes, mobile) and
   acceptance criteria in Given / When / Then.
5. Do not write code. Gaps → OQ; assumptions → ASM.
6. Close with a summary and recommend running /sdd-clarify NNN.
