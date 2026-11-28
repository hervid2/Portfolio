# Approved MCP servers

| Server | Purpose | Used by | Permissions / scope | Configuration | Approved |
|---|---|---|---|---|---|
| Playwright (`@playwright/mcp`) | A real browser for the e2e validation (GENESIS §C.3, Reviewer B), the PO-9 demo audit, screenshots, and checks for responsive layout, themes and accessibility | reviewer (e2e focus); coordinator for audits | Local only. Browses `localhost` previews, Vercel previews, production, and the 4 public demos. No credentials beyond the public demo accounts. Never used to log into Hernán's personal accounts | `.mcp.json` → `npx -y @playwright/mcp@0.0.86` (stdio, pinned). No env vars or secrets. The first run downloads the package, and Chromium if no Chrome is installed | Hernán, 2026-11-26 (G4.6) |

## Generated `.mcp.json` (canonical source)
`node .harness/sync-claude-code.mjs` writes the JSON block below verbatim to `.mcp.json`. Edit it here,
never in `.mcp.json`.

- **Version pin:** `@playwright/mcp` is pinned to `0.0.86`, not `@latest`. The `@latest` npx fetch
  caused a 30 s `CONNECT_TIMEOUT` at session start (spec 001 retrospective, approved 2026-11-27).
  Bump it deliberately: check the version and its publish date with `npm view @playwright/mcp`
  (Art. 14), edit the block, regenerate.

```json mcp
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@0.0.86"],
      "env": {}
    }
  }
}
```

## Not approved / considered
- **Context7** (library docs): not approved on 2026-11-26. For Art. 14 use `npm view` and the official documentation through web search instead.

## Rules
- Credentials never go in `.mcp.json`. If a server ever needs a key, use `${VAR}` expansion and document the variable in `.env.example`, without its value.
- Adding an MCP server needs Hernán's approval and an entry in this file.
