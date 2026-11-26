---
description: Drafts a new Architecture Decision Record with options and trade-offs
argument-hint: "<decision to make>"
context: fork
agent: planner
background: false
---
<!-- Generated from .harness/commands/adr.md by .harness/sync-claude-code.mjs. Do not edit. -->
Read AGENTS.md and MEMORY.md first: you do not see the conversation.

Decision: $ARGUMENTS

1. Read docs/architecture/overview.md, docs/adr/, docs/requirements/non-functional.md.
2. Research current versions and maintenance of each option (Art. 14; `npm view`, official docs).
3. Create docs/adr/NNNN-<slug>.md (template D.9) with 2–3 options, a trade-off table against the
   NFRs, and a recommendation. Status: Proposed. Hernán decides.
4. Add it to the ADR index in docs/architecture/overview.md.
