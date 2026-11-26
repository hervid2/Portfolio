---
description: SDD phase 4 — writes the technical plan for an approved spec
agent: planner
---
Spec: $ARGUMENTS

1. Precondition: spec.md status is Approved (Definition of Ready, GENESIS §C.5). Otherwise stop.
2. Read the spec, docs/architecture/overview.md, docs/adr/ and the code the feature touches.
3. Write specs/NNN-*/plan.md (template D.20): approach and discarded alternatives, exact file
   paths, contracts, UI components, AC → test mapping, dependencies (Art. 10, versions checked
   with `npm view`), risks, affected ADRs. New architecture decision → propose an ADR (/adr).
4. Do not write code. Recommend /sdd-tasks NNN.
