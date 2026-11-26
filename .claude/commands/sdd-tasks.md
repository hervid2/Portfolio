---
description: SDD phase 5 — breaks an approved plan into atomic tasks
argument-hint: "<NNN>"
context: fork
agent: planner
background: false
---
<!-- Generated from .harness/commands/sdd-tasks.md by .harness/sync-claude-code.mjs. Do not edit. -->
Read AGENTS.md and MEMORY.md first: you do not see the conversation.

Spec: $ARGUMENTS

1. Read specs/NNN-*/plan.md.
2. Write specs/NNN-*/tasks.md (template D.21): atomic, ordered tasks; each with AC, files, a
   concrete verification command and dependencies; mark [P] only if no files are shared.
3. Every AC is covered by at least one task with a test.
4. Close by requesting 🚦 G-Plan through the coordinator.
