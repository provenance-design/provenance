# Provenance — Project Instructions

## What this is
A curated archive of significant design objects (furniture, graphics, architecture, typography, lighting, etc.) with argued cross-disciplinary connections. Built for design students and educators. Live at provenancearchive.uk.

## Stack
- Next.js 14 (App Router), React 18, deployed on Vercel
- No database — all data lives in JS files
- Images from Wikipedia API (via `wikiTitle`) or local `/images/{id}.jpg`

## Project structure
```
app/
  page.js              — Main site (single-page app: Featured, Archive, Connection Map, About, Detail views)
  layout.js            — Root layout, Google Fonts (DM Sans + DM Serif Display)
  globals.css          — Global styles
  staging-page.js      — Old staging component (superseded)
  staging/page.js      — Staging review page at /staging (password: provenance2026)
  data/
    archive.js         — LIVE data: ARCHIVE array, CONNECTION_TYPES, DISCIPLINES (598 entries, IDs 1–636)
    candidates.js      — STAGING data: CANDIDATES array (217 entries, IDs 637–855)
```

## Data model
Each entry has: `id`, `title`, `designer`, `year`, `discipline`, `origin`, `manufacturer`, `collection`, `movement`, `wikiTitle`, `description`, `significance`, `connections[]`, `keywords[]`, `imageUrl` (optional).

Candidates also have `status` and `notes` fields (stripped when displayed).

### Connection types
- `argument` — direct dialogue/opposition between works
- `lineage` — influence chain, one leads to another
- `material` — shared material logic
- `sameProblem` — different answers to the same design question
- `zeitgeist` — same cultural moment, different discipline
- `method` — shared design method/process

Each connection: `{ id, type, reason }` — the `reason` is an argued paragraph, not a tag.

### Disciplines
Product, Furniture, Graphic, Lighting, Architecture, Typography, Textile, Transport, Ceramic, Glass, Metalwork

## Workflow
1. Pipeline (separate repo `provenance-pipeline`) generates candidates via Claude API + museum APIs
2. Candidates land in `candidates.js` for staging review at `/staging`
3. Approved entries get merged into `archive.js`
4. Push to GitHub triggers Vercel auto-deploy

## Git rules
- NEVER add "Co-Authored-By" lines mentioning Claude or any AI to commit messages
- Keep commit messages concise and descriptive

## Key conventions
- Entries are committed in batches (see git log pattern: "44 candidates", "94 staging candidates", etc.)
- Connection `reason` fields are written in curatorial voice — argued, specific, not generic
- Connections reference entries by `id` — must be valid IDs in the archive or current candidates batch
- The `wikiTitle` field must match the exact Wikipedia article title (used for image fetching)
- archive.js is large (25k+ lines) — read with offset/limit, don't load the whole thing
- candidates.js is the active working file between batches

## Common tasks
- **Adding entries**: Append to ARCHIVE array in archive.js, ensure IDs don't clash
- **Editing entries**: Find by ID in archive.js or candidates.js
- **Fixing connections**: Check target IDs exist, fix broken references
- **Staging review**: Review candidates at /staging before merging to archive
- **Connection audit**: Ensure cross-discipline spread, reduce hub concentration
