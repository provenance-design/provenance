# Provenance Archive — Agent Skills

Connect your AI agent to the Provenance Archive: 1,000 design objects linked by 3,257 argued connections across 11 disciplines.

## Quick Start

### 1. Add the MCP server

Add this to your Claude Code MCP config (`.mcp.json`):

```json
{
  "mcpServers": {
    "provenance": {
      "command": "node",
      "args": ["mcp/server.js"]
    }
  }
}
```

Run Claude Code from the project root and the server resolves `mcp/server.js` automatically. No `cwd` field needed.

### 2. Load the core skill

Give your agent `core.md` from this directory. It teaches the archive structure, the four query tools, and the six connection types.

### 3. Pick a persona skill

| Persona | Free | Premium |
|---|---|---|
| **Student** | `student/explore.md` — discover and trace connections | `student/analyse.md` — essay scaffolding, comparative analysis |
| **Lecturer** | — | `lecturer/pathway.md` — build module pathways |
| | — | `lecturer/assess.md` — design assessments |
| **Researcher** | — | `researcher/topology.md` — network analysis |
| | — | `researcher/influence.md` — influence mapping |
| **Curator** | — | `curator/review.md` — quality review |
| | — | `curator/expand.md` — entry drafting |

### 4. Ask a question

With `core.md` + `student/explore.md` loaded, try:

> "Trace how the Eames Lounge Chair connects to the Barcelona Chair through the archive."

The agent will compose `find_path`, `get_entry`, and `get_cluster` calls to build a narrative answer.

## What makes this different

Most MCP servers expose data. Provenance skills teach agents *design reasoning*. The six connection types aren't labels — they're arguments. A lineage connection claims influence across time. An argument connection claims designed disagreement. The skills teach your agent to read these critically and compose them into insight.

## About

Provenance Archive is a curated, argued collection of 1,000 design objects maintained by Neil Housego, Senior Lecturer in Product Design, University of Lincoln. The connection — not the object — is the primary unit of design knowledge.

[provenancearchive.uk](https://provenancearchive.uk)
