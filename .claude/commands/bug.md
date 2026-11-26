---
description: Fixes a bug with the reproduce → fix → validate loop (GENESIS §C.7)
argument-hint: "<bug description>"
---
<!-- Generated from .harness/commands/bug.md by .harness/sync-claude-code.mjs. Do not edit. -->
[ROLE: coordinator] Act with the role and permissions in .harness/agents/coordinator.md.

Bug: $ARGUMENTS

1. Constitutional check: which FR/AC does it break? If the spec has a gap, amend the spec first
   (Art. 13) through the planner.
2. Branch `fix/<slug>` from main. implementer: write a failing test that reproduces the bug →
   minimal fix → green test → commit `fix(scope): ... [BUG-<slug>]`.
3. reviewer: /sdd-validate with focus quality-security (plus e2e if UI).
4. 🚦 G-Merge. Update MEMORY.md with the learning.
