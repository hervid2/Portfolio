---
description: SDD phase 7 — validates a feature branch with a given focus
argument-hint: "<NNN> <compliance|e2e|quality-security>"
context: fork
agent: reviewer
background: false
---
<!-- Generated from .harness/commands/sdd-validate.md by .harness/sync-claude-code.mjs. Do not edit. -->
Read AGENTS.md and MEMORY.md first: you do not see the conversation.

Spec and focus: $ARGUMENTS   (focus: compliance | e2e | quality-security)

1. Read spec.md, plan.md, tasks.md and the diff `git diff main...HEAD`.
2. Run the validation for the focus (see .harness/agents/reviewer.md). Execute; attach evidence.
3. Write or append your section to specs/NNN-*/validation.md (template D.22) with findings
   classified BLOCKER | MAJOR | MINOR | SUGGESTION and the Definition of Done checklist.
4. Verdict APPROVED only with no blocker or major findings. Never modify code.
