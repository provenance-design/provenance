# Major Work Passes

Understanding what's already been done prevents repeating or undoing previous work.

## 1. Initial Build (Feb 2025)

Built the Next.js site from a 16-entry React prototype. Deployed to Vercel. Set up GitHub repo under `provenance-design` account. Created the generation pipeline with Cooper Hewitt and V&A API integration.

## 2. Content Expansion (Feb 2025)

Scaled from 16 to ~458 entries via the pipeline (two rounds of batch generation using Claude API). Then manually added ~140 more entries to reach ~598. Many entries in this phase have unverified facts.

## 3. Connection Quality Pass (Feb-Mar 2025)

Two phases. First: rewrote **212 connections** across 10 clusters where connection texts had become formulaic. The Parentesi cluster was the worst offender: 32 of its 42 connections repeated "cable and bracket" variations. Second: extended to the full archive — **1,111 connections rewritten** total. All 922 "Both..." sentence openers eliminated. Quality standard established.

## 4. Structural Rebuild — Hub Pruning and Rewiring (Mar 2025)

Topology analysis revealed a hub problem: ten objects dominated navigation.

- **59 hub connection prunes** — removed redundant connections from over-connected objects
- **28 lazy bridge swaps** — replaced weak cross-discipline connections with argued ones
- Added new connections to under-connected objects (those with <=2 connections)
- Wrote curated pathways through the network:
  - **"WHO GETS TO DESIGN?"** — Autoprogettazione -> ESP Printing Block -> Favela Chair -> Do Hit Chair
  - **"TECHNOLOGY DISAPPEARS"** — Black ST201 -> Muji CD Player -> iPhone 6 -> iPod Touch
  - **"140 YEARS OF TREES"** — Trellis -> Cambio -> Ore Streams -> In Loving Memory of Aicher
  - **"ANXIETY vs CLARITY"** — Placebo -> Underground Map -> Muji CD -> Black ST201 -> SK4

## 5. Accuracy Audit (Mar 2025)

Systematic fact-checking of newer entries. Key discoveries:

**Fabricated entries (removed):** Bon Bon Chair (615), Superfolk Everyday Objects (625).

**Major corrections:** Laser Chair (459) — description was opposite of reality. Rex Chair (616) — wrong year, materials, manufacturer. Assemblage 5 (623) — wrong date, materials, venue. Gamper entry (608) — wrong title and date.

**Lesson:** AI-assisted expansion consistently blends accurate high-level design knowledge with fabricated specifics (exact years, materials, manufacturers). The error pattern is plausible-sounding detail that passes casual inspection. Always verify against primary sources.

## 6. Expansion to 1,000 (Mar 2025)

- Merged 246 candidates (IDs 637-935) into the live archive, reaching 844 entries
- Researched and drafted 156 new entries (IDs 936-1091) across themed batches: Ceramic+Glass, Eastern Bloc, East Asian+Speculative, Latin American+African, European gaps
- Merged to reach **1,000 entries** with 3,217 connections and zero broken targets
- Sonnet used for descriptions/significance, connection texts drafted at B-grade — Opus quality pass outstanding

## 7. Project Restructure (Mar 2025)

Extracted CLAUDE.md (25KB monolith) into focused documents:
- `docs/schema.md` — data schema and editing guide
- `docs/voice-guide.md` — editorial standards, connection typology, 12 Principles
- `docs/research.md` — scholarly research context and roadmap
- `docs/topology-guide.md` — network analysis, hubs, rebuild plan
- `docs/history.md` — this file

Added skills (`/validate`, `/merge`, `/topology`), README, cleaned up hooks and retired tools.
