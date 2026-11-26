---
description: Orchestrates a feature's full SDD cycle with human gates
agent: coordinator
---
Feature: $ARGUMENTS

Run GENESIS Part C (docs/governance/GENESIS.md) from start to finish:
1. Constitutional check against docs/constitution.md and docs/roadmap.md → assign NNN and branch
   `feat/NNN-slug` from `main`. If the feature is not in the roadmap, stop and propose adding it.
2. planner: /sdd-specify → reviewer: /sdd-clarify → Hernán answers → planner updates the spec →
   🚦 G-Spec.
3. planner: /sdd-plan and /sdd-tasks → 🚦 G-Plan.
4. implementer: /sdd-implement task by task (tasks marked [P] may run in parallel if they share no
   files).
5. reviewer ×3 in parallel: /sdd-validate NNN compliance | e2e | quality-security → consolidate
   into specs/NNN-*/validation.md.
6. CHANGES REQUIRED → back to 4 (max. 3 cycles). APPROVED → 🚦 G-Merge (ask before pushing or
   opening the PR).
7. Update docs/traceability.md, docs/roadmap.md and MEMORY.md; run the harness retrospective
   (GENESIS §C.9).
Stop at each 🚦 until Hernán explicitly approves.
