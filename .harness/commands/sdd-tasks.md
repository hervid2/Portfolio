---
description: SDD phase 5 — breaks an approved plan into atomic tasks
agent: planner
---
Spec: $ARGUMENTS

1. Read specs/NNN-*/plan.md.
2. Write specs/NNN-*/tasks.md (template D.21): atomic, ordered tasks; each with AC, files, a
   concrete verification command and dependencies; mark [P] only if no files are shared.
   "Library absent" greps match the import (`from "motion`), not the bare word (testing-conventions
   rule 10).
3. Every AC is covered by at least one task with a test.
4. Close by requesting 🚦 G-Plan through the coordinator.
