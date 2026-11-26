# CLAUDE.md

This project is governed by GENESIS (docs/governance/GENESIS.md). The shared operating code for every agent is
imported below. In Claude Code the main session acts as the **Coordinator**; planner, implementer and reviewer
are subagents in `.claude/agents/` (generated from `.harness/` — run `node .harness/sync-claude-code.mjs`).

@AGENTS.md
@.harness/agents/coordinator.md
