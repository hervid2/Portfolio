---
description: SDD phase 6 — implements the next pending task (or the given one)
argument-hint: "<NNN> [T-xx]"
context: fork
agent: implementer
background: false
---
<!-- Generated from .harness/commands/sdd-implement.md by .harness/sync-claude-code.mjs. Do not edit. -->
Read AGENTS.md and MEMORY.md first: you do not see the conversation.

Spec and task: $ARGUMENTS   (e.g. "001" or "001 T-03")

1. Precondition: plan.md and tasks.md approved (G-Plan) and you are on branch feat/NNN-slug.
2. Pick the given task or the first unchecked one whose dependencies are done.
3. Follow GENESIS §C.2: failing test → minimal code → verify (task command + lint + type check +
   affected tests) → atomic commit `type(scope): description [T-xx]` → check off with evidence.
4. One task per invocation. Any deviation from the plan → stop and report.
