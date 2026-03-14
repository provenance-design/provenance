# Provenance Archive

A curated, argued archive of 1,000 design objects at **provenancearchive.uk**. Built and maintained by **Neil Housego**, Senior Lecturer in Product Design, University of Lincoln. The connection — not the object — is the primary unit of design knowledge.

---

## Technical Stack

- **Framework:** Next.js 14 (App Router), React 18
- **Hosting:** Vercel, auto-deploys from GitHub on push
- **Repository:** `github.com/provenance-design/provenance` (**public**)
- **No database** — all data lives in JS files
- **Primary data file:** `app/data/archive.js` (1,000 entries, ~2MB)
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

- **1,000 entries** in live archive, **3,217 connections**, zero broken targets
- **11 disciplines:** Product (304), Furniture (304), Graphic (147), Architecture (70), Lighting (69), Ceramic (35), Textile (23), Glass (19), Typography (15), Metalwork (8), Transport (6)
- Weakest disciplines: **Metalwork, Glass, Textile** — prioritise when adding
- Entry IDs: 1–1091 (not contiguous)

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

## Overconnected Hubs — Do Not Add Without Pruning

- **London Underground Map (13)** — ~105 connections
- **606 Shelving (11)** — ~96 connections
- **Carlton Bookcase (12)** — ~94 connections
- **Penguin Books (14)**, **Pompidou (15)**, **IBM Logo (56)** — heavily connected

See `docs/topology-guide.md` for the full topology rebuild plan.

---

## What Claude Should Always Do

- **Verify facts** against primary sources (V&A, Cooper Hewitt, MoMA, Vitra, Design Museum). Museum databases are authoritative.
- **Write connections to the quality standard** in `docs/voice-guide.md`. Compressed, argued, specific, non-transferable.
- **Think topologically.** Does this create a cross-discipline bridge? Overload a hub? Create a dead end?
- **Flag hallucination risk.** If unsure about an object, date, or material — say so. Do not invent.
- **Use British English** throughout.

## What Claude Should Never Do

- **Never use template language** in connections. If it could describe any two objects, rewrite.
- **Never add connections to overconnected hubs** without removing one first.
- **Never assume an entry's facts are correct** — earlier expansion phases introduced errors.
- **Never source images from Wikipedia or Wikimedia Commons.**
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

**Five views:** Featured, Archive (grid), Connection Map (force-directed graph), About, Detail (entry + connection cards).

**Images:** `/public/images/{id}.jpg`. Typographic fallback for missing images. Deep links: `provenancearchive.uk?entry=ID`.
