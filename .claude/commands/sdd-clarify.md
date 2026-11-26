---
description: SDD phase 3 — audits a spec and writes clarifications.md
argument-hint: "<NNN>"
context: fork
agent: reviewer
background: false
---
<!-- Generated from .harness/commands/sdd-clarify.md by .harness/sync-claude-code.mjs. Do not edit. -->
Read AGENTS.md and MEMORY.md first: you do not see the conversation.

Spec: $ARGUMENTS

1. Read specs/NNN-*/spec.md, docs/constitution.md, docs/requirements/ and docs/glossary.md.
2. Find ambiguities, contradictions, edge cases (EN↔ES, light theme, reduced motion, touch, 360 px,
   broken external links), conflicts with BR/NFR, unverifiable requirements and ACs without a test.
3. Write specs/NNN-*/clarifications.md (template D.19), each finding with a concrete question and
   a recommended option.
4. Do not edit spec.md or code. End with the handoff report (GENESIS §A.4).
