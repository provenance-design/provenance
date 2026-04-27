# Provenance Archive

A curated, argued archive of 1,000 design objects at **provenancearchive.uk**. Built and maintained by **Neil Housego**, Senior Lecturer in Product Design, University of Lincoln. The connection — not the object — is the primary unit of design knowledge.

---

## Technical Stack

- **Framework:** Next.js 14 (App Router), React 18
- **Hosting:** Vercel, auto-deploys from GitHub on push
- **Repository:** `github.com/provenance-design/provenance` (**public**)
- **No database** — all data lives in JS files
- **Primary data file:** `app/data/archive.js` (1,000 entries, ~2.6MB)
- **Staging candidates:** `app/data/candidates.js`

## Project Structure

```
app/
  page.js              — Main site (single-page app)
  layout.js            — Root layout, Google Fonts
  globals.css          — Global styles
  staging/page.js      — Staging review page at /staging
  data/
    archive.js         — LIVE data: ARCHIVE, CONNECTION_TYPES, DISCIPLINES
    candidates.js      — STAGING data: CANDIDATES array
docs/
  schema.md            — Data schema and editing guide
  voice-guide.md       — Editorial standards, connection typology, 12 Principles
  research.md          — Scholarly research context and roadmap
  topology-guide.md    — Network analysis, hubs, rebuild plan
  history.md           — Major work passes completed
  decisions/           — Architectural decision records
  teaching/            — Teaching documents (Five Pathways, 12 Principles)
tools/
  validate.py          — Schema, duplicates, IDs, hubs, template language
  topology.py          — Network diagnostics
  merge.py             — Candidate → archive migration
workflows/
  cohort-pipeline.md   — End-to-end cohort process
.claude/
  agents/              — Domain expert agents
  agent-memory/        — Persistent knowledge per agent
  skills/              — Slash commands: /validate, /merge, /topology
  settings.json        — Configuration (hooks disabled)
```

## WAT Framework (Workflows, Agents, Tools)

Probabilistic AI handles reasoning. Deterministic code handles execution. This separation prevents compounding errors.

- **Layer 1 — Workflows** (`workflows/`): Markdown SOPs
- **Layer 2 — Agents** (`.claude/agents/`): Four domain experts that orchestrate
- **Layer 3 — Tools** (`tools/`): Python scripts that execute

**If it can be done deterministically, it MUST be a tool.** Agents are only for genuine reasoning.

| Task | Model | Why |
|------|-------|-----|
| Image sourcing | Haiku | Mechanical — one search per object |
| Fact-checking | Haiku/Sonnet | Web search + basic reasoning |
| Entry drafting | Sonnet | Good prose, cheaper than Opus |
| Connection quality review | Sonnet | Design knowledge, not full Opus |
| Writing connection texts | Opus | Genuine curatorial reasoning |
| Validation, topology, merge | Tools | Deterministic, zero tokens |

## Current State

- **1,000 entries** in live archive, **3,257 connections**, zero broken targets
- **11 disciplines:** Furniture (297), Product (202), Graphic (142), Textile (72), Architecture (71), Lighting (68), Ceramic (66), Glass (35), Metalwork (20), Typography (16), Transport (11)
- Weakest disciplines: **Transport, Typography** — prioritise when adding
- Entry IDs: 1–1102 (not contiguous — gaps from block consolidation)
- **Min degree 3** — no dead-end entries. Median degree 5. Max inbound 31.
- All significance texts and connection reasons at Sudjic/Rawsthorn standard — zero formulaic openers, zero template patterns, zero American spellings

## Git Rules

- **NEVER** add "Co-Authored-By" lines mentioning Claude or any AI to commit messages
- Keep commit messages concise and descriptive
- **NEVER** push to GitHub without Neil's go-ahead — always confirm first

## Repository Visibility

The GitHub repo is **public** under the `provenance-design` account (separate from Neil's Basalt Rooms account). Neil's university colleagues should not discover the Basalt Rooms identity — the accounts have no link.

## Deployment

```bash
git add .
git commit -m "description"
git push
```

Vercel rebuilds automatically (~60 seconds). Run `python tools/validate.py` before pushing. Authentication via macOS Keychain.

---

## Connection Typology

Six typed connections — see `docs/voice-guide.md` for the full quality standard, gold-standard examples, and grading criteria.

| Type | Code | What It Argues |
|---|---|---|
| **Argument** | `argument` | Designed disagreement — opposing criteria, same territory |
| **Lineage** | `lineage` | Transfer across time — logic reappearing later |
| **Material Thread** | `material` | Shared material, different meaning |
| **Same Problem** | `sameProblem` | Same brief, different answer |
| **Zeitgeist** | `zeitgeist` | Parallel answers, same cultural moment |
| **Shared Method** | `method` | Same process, different outcomes |

**The test:** If you can swap the object names and the text still reads plausible, the connection is not specific enough. Rewrite.

## Hub Ceiling — 30 Inbound Max

All mega-hubs have been pruned. Current top inbound counts:

- **Arco (1), Mezzadro (2), Parentesi (3), Pompidou (15), SK 4 (16)** — 31 inbound
- **Snoopy (5), Superleggera (6), Ulm Stool (7), Grillo (10), Egg Chair (24)** — 30 inbound
- **London Underground Map (13), 606 Shelving (11), Carlton (12), Penguin (14), IBM Logo (56)** — all below 30

**Do not add connections to any hub above 25 inbound without removing one first.**

See `docs/topology-guide.md` for topology guidance.

---

## PalaceForge — Persistent Knowledge Base

The project is indexed in a PalaceForge palace at `~/.palaceforge/palace/`. Use `palaceforge search "query"` to search across all project files — archive entries, connection texts, collab memos, editorial standards, paper drafts, topology data.

**When to use it:**
- Looking for a specific connection, entry, or design object across the archive
- Finding which collab memo discussed a particular topic
- Searching for evidence or examples for the paper
- Any time you'd otherwise grep across multiple files

**Example:** `palaceforge search "Bon Bon Chair"` or `palaceforge search "hub overloading"`

**Re-mine after major changes:** `palaceforge mine .` (run from the project root)

---

## What Claude Should Always Do

- **Use palaceforge search** when looking for context across the project — it's faster than reading multiple files.
- **Verify facts** against primary sources (V&A, Cooper Hewitt, MoMA, Vitra, Design Museum). Museum databases are authoritative.
- **Write connections to the quality standard** in `docs/voice-guide.md`. Compressed, argued, specific, non-transferable.
- **Think topologically.** Does this create a cross-discipline bridge? Overload a hub? Create a dead end?
- **Flag hallucination risk.** If unsure about an object, date, or material — say so. Do not invent.
- **Use British English** throughout.

## What Claude Should Never Do

- **Never use template language** in connections. If it could describe any two objects, rewrite.
- **Never add connections to overconnected hubs** without removing one first.
- **Never assume an entry's facts are correct** — earlier expansion phases introduced errors.
- **Never use Wikipedia/Wikimedia Commons as manually-sourced images** — the `wikiTitle` API fallback is acceptable for gap-filling but not a substitute for proper local images.
- **Never push without Neil's go-ahead.**

---

## Common Tasks

| Task | Command |
|------|---------|
| Validate | `python tools/validate.py` |
| Topology check | `python tools/topology.py` |
| Merge candidates | `python tools/merge.py --ids 937 938` or `--all` |
| Merge preview | `python tools/merge.py --dry-run --all` |
| Run locally | `npm run dev` → `localhost:3000` |
| Staging review | `provenancearchive.uk/staging` (password: `provenance2026`) |

For the full cohort pipeline, see `workflows/cohort-pipeline.md`.
For data schema and editing guide, see `docs/schema.md`.
For editorial standards and prose style, see `docs/voice-guide.md`.
For scholarly research context, see `docs/research.md`.
For network topology guidance, see `docs/topology-guide.md`.
For project history, see `docs/history.md`.

---

## Staging System

The staging page at `/staging` is the editorial interface for reviewing candidates before they go live.

- **Password:** `provenance2026` (client-side only, session state)
- **Data source:** `app/data/candidates.js` (same schema as archive)
- **Tabs:** Candidates list + Network visualiser
- **Not linked** from the main site
- **Merge workflow:** Draft → Review at /staging → Validate → Merge → Image source → Deploy

## Site Design

Warm cream palette (`#F6F5F0` background, `#FDFCF8` cards, `#EBE8E0` borders). DM Serif Display for titles, DM Sans for body. Deliberately restrained — museum catalogue, not tech product.

**Five views:** Featured, Archive (grid), Connection Map (interactive network graph — full-bleed, dark canvas, with connection type filtering and Force|Radial toggle), About, Detail (entry + connection cards).

**Network visualiser features:** Two modes — **Force** (physics-based force-directed layout) and **Radial** (nodes on circle perimeter grouped by discipline, Bezier arc connections). Both share: discipline-coloured nodes sized by connection count, six connection type filter buttons (Argument, Lineage, Material, Same Problem, Zeitgeist, Method), hover/click to explore, zoom/pan, info panel with connected objects and "View entry" link. Built with HTML5 Canvas for performance at 1000+ nodes. The radial view is a prototype — the Connection Map should become a designed artefact, not just a diagram. Reference material in `docs/waves-model*.jpg`.

**Images:** Three-tier fallback: local `/public/images/{id}.jpg` (454 entries) → V&A framemark URL (473 entries) → Wikipedia API via `wikiTitle` field (60 entries). Remaining 13 entries show typographic fallback plates. All new images should be locally sourced. Wikipedia/Wikimedia Commons images are acceptable as fallback but not as primary manually-sourced images.

**Deep links:** `provenancearchive.uk?entry=ID` auto-opens a specific entry.
