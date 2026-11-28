---
description: Fixes a bug with the reproduce → fix → validate loop (GENESIS §C.7)
agent: coordinator
---
Bug: $ARGUMENTS

1. Constitutional check: which FR/AC does it break? If the spec has a gap, amend the spec first
   (Art. 13) through the planner.
2. Branch `fix/<slug>` from main. implementer: write a failing test that reproduces the bug →
   minimal fix → green test → commit `fix(scope): ... [BUG-<slug>]`.
3. reviewer: /sdd-validate with focus quality-security (plus e2e if UI).
4. 🚦 G-Merge. If the fix touches `api/`, the last item is "deployed to the droplet and verified
   in production" (coordinator Procedure 4). Update MEMORY.md with the learning.
