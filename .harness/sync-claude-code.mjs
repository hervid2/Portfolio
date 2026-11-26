#!/usr/bin/env node
/**
 * Regenerates the Claude Code adapters in `.claude/` from the canonical harness in `.harness/`
 * (GENESIS §G4.7). Usage, from the repository root: `node .harness/sync-claude-code.mjs`.
 *
 * - `.harness/agents/*.md` → `.claude/agents/*.md` (frontmatter translated to Claude Code fields).
 *   The coordinator is the main session, so it is imported by CLAUDE.md instead of being a subagent.
 * - `.harness/commands/*.md` → `.claude/commands/*.md`. Commands owned by a subagent run in a
 *   forked context; commands that talk to the human run inline in the main session.
 * - `.harness/skills/<name>/` → `.claude/skills/<name>/` (copied as-is).
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const HARNESS_DIR = ".harness";
const CLAUDE_DIR = ".claude";

/** Claude Code frontmatter per subagent. Path limits in `.harness` are instructions only. */
const AGENT_FRONTMATTER = {
  planner: ["model: inherit", "disallowedTools: Agent, NotebookEdit"],
  implementer: ["model: inherit", "disallowedTools: Agent, NotebookEdit, WebSearch"],
  reviewer: ["model: inherit", "disallowedTools: Agent, NotebookEdit"]
};

/** Commands that need the conversation or the human run inline in the main session. */
const INLINE_COMMANDS = new Set(["feature", "sdd-specify", "sdd-status", "bug", "memory"]);

/** Argument hints shown in the slash-command menu. */
const ARGUMENT_HINTS = {
  feature: "<feature description or roadmap spec number>",
  "sdd-specify": "<NNN or request>",
  "sdd-clarify": "<NNN>",
  "sdd-plan": "<NNN>",
  "sdd-tasks": "<NNN>",
  "sdd-implement": "<NNN> [T-xx]",
  "sdd-validate": "<NNN> <compliance|e2e|quality-security>",
  bug: "<bug description>",
  adr: "<decision to make>"
};

/**
 * Splits a markdown file into its YAML frontmatter fields and its body.
 *
 * @param text - Full file content.
 * @returns The frontmatter as a key/value map and the body.
 */
function parseMarkdown(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { fields: {}, body: text };
  }
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([\w-]+):\s*(.*?)\s*(#.*)?$/);
    if (pair) {
      fields[pair[1]] = pair[2];
    }
  }
  return { fields, body: match[2] };
}

/**
 * Writes one Claude Code subagent per non-primary harness agent.
 */
function syncAgents() {
  const targetDir = join(CLAUDE_DIR, "agents");
  mkdirSync(targetDir, { recursive: true });
  for (const fileName of readdirSync(join(HARNESS_DIR, "agents"))) {
    const name = fileName.replace(/\.md$/, "");
    const extraFields = AGENT_FRONTMATTER[name];
    if (!extraFields) {
      continue;
    }
    const { fields, body } = parseMarkdown(readFileSync(join(HARNESS_DIR, "agents", fileName), "utf8"));
    const header = [`name: ${name}`, `description: ${fields.description}`, ...extraFields];
    const notice = `<!-- Generated from .harness/agents/${fileName} by .harness/sync-claude-code.mjs. Do not edit. -->\n`;
    writeFileSync(join(targetDir, fileName), `---\n${header.join("\n")}\n---\n${notice}${body}`);
  }
}

/**
 * Writes one Claude Code command per harness command, forked into its owner subagent when possible.
 */
function syncCommands() {
  const targetDir = join(CLAUDE_DIR, "commands");
  mkdirSync(targetDir, { recursive: true });
  for (const fileName of readdirSync(join(HARNESS_DIR, "commands"))) {
    const name = fileName.replace(/\.md$/, "");
    const { fields, body } = parseMarkdown(readFileSync(join(HARNESS_DIR, "commands", fileName), "utf8"));
    const header = [`description: ${fields.description}`];
    if (ARGUMENT_HINTS[name]) {
      header.push(`argument-hint: "${ARGUMENT_HINTS[name]}"`);
    }
    let preamble = "";
    if (INLINE_COMMANDS.has(name)) {
      preamble = `[ROLE: ${fields.agent}] Act with the role and permissions in .harness/agents/${fields.agent}.md.\n\n`;
    } else {
      header.push("context: fork", `agent: ${fields.agent}`, "background: false");
      preamble = "Read AGENTS.md and MEMORY.md first: you do not see the conversation.\n\n";
    }
    const notice = `<!-- Generated from .harness/commands/${fileName} by .harness/sync-claude-code.mjs. Do not edit. -->\n`;
    writeFileSync(join(targetDir, fileName), `---\n${header.join("\n")}\n---\n${notice}${preamble}${body}`);
  }
}

/**
 * Copies every harness skill directory into `.claude/skills/`.
 */
function syncSkills() {
  const sourceDir = join(HARNESS_DIR, "skills");
  if (!existsSync(sourceDir)) {
    return;
  }
  const targetDir = join(CLAUDE_DIR, "skills");
  rmSync(targetDir, { recursive: true, force: true });
  cpSync(sourceDir, targetDir, { recursive: true });
}

syncAgents();
syncCommands();
syncSkills();
process.stdout.write("Claude Code adapters regenerated from .harness/\n");
