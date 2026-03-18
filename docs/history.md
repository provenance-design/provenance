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

## 8. Connection Quality Rewrite — Template Elimination (Mar 2025)

Systematic elimination of template language from connections. The "Where/While... opposing approaches" formula was the dominant failure mode — 118 connections used it.

- **29 remaining Where/While template connections rewritten** to A-grade standard (the bulk were done in pass 3, these were survivors)
- **15 hub connections pruned** from Underground Map (13), 606 Shelving (11), Carlton (12)
- **10 new connections added** to 8 dead-end entries (≤2 connections)
- **6 connection type corrections** (mis-typed lineage → zeitgeist/method/argument)
- Final grep confirms 0 template language remaining

## 9. Entry Block Consolidation (Mar 2025)

Curator agent audit identified clusters where one designer/project occupied too many slots:

- **King Lear costumes** (Noguchi): 8 entries → 2. Removed IDs 138, 139, 141, 142, 143, 144. Kept 136 and 140, reclassified from Graphic to Textile.
- **Vinci Weeds** (Leonardo): 6 entries → 1. Removed IDs 375, 376, 377, 378, 379. Kept 374.
- **11 entries removed**, connections redirected and salvaged where possible.

**11 replacement entries added** (IDs 1092–1102) to restore count to 1,000, targeting weak disciplines:
- Metalwork +3: Wirkkala Silver Leaf Dish TW 11 (1954), Ponti La Cornuta (1948), Puiforcat Tea Service (1922)
- Glass +2: Bianconi & Venini Fazzoletto (1948), Gallé Cameo Glass Vase (1900)
- Textile +3: Tawney The Dark River (1962), Stölzl Slit Tapestry (1927), de Amaral Alquimia 13 (1984)
- Transport +2: Pininfarina Cisitalia 202 GT (1946), Issigonis Morris Minor (1948)
- Architecture +1: Burle Marx Copacabana Promenade (1970)

All facts verified against MoMA, Met, V&A, Cooper Hewitt, MUMAC, Bauhaus-Archiv. All 33 new connections written to A-grade standard.

**Remaining blocks identified but not yet actioned:** Kenneth Grange Variset (4→1), Sony Walkman (4→2), Hans Coper (8→4-5), XR (5→2-3), Lucienne Day Four Seasons (4→1-2), PESTS (5→2-3).

## 10. Radial Network View Prototype (Mar 2025)

Added a radial arc network visualisation as an alternative to the force-directed graph on the Connection Map tab. Force|Radial toggle.

- Nodes arranged on a circle perimeter, grouped by discipline
- Bezier arc connections coloured by connection type
- Ego-network highlighting on hover
- Discipline-coloured segments

This is a **prototype** — the Connection Map needs to become a designed artefact, not just a diagram. The force-directed view is a physics simulation; the radial view is a step toward intentional composition. Neither is finished. Future work should treat the visualisation as a design brief: curated colour palette, proper typography, considered hierarchy, intentional negative space, and transitions that feel designed rather than springy.

Reference material in `docs/waves-model*.jpg` — screenshots from 6529.io's network visualisation showing the sophistication level to aim for and push past.

## 11. Quality Audit and Network Rebuild (Mar 2025)

Comprehensive quality pass bringing the entire archive to Sudjic/Rawsthorn standard. The archive had a "two-speed" problem: IDs 1-100 and 600+ were well-written, but the expansion-phase entries (IDs 100-600) were formulaic.

**Prose quality:**
- **325+ significance texts rewritten** — eliminated all formulaic openers ("It demonstrates how", "One must", "The work reveals", "Essential for understanding")
- **67 descriptions rewritten** in the ID 100-600 problem zone
- **28 weak "Both" connection conclusions sharpened**
- **294 missing periods added** to connection reasons
- **46 American spellings corrected** (color→colour, behavior→behaviour, organize→organise)
- **3 broken significance texts fixed** (entries 395, 398, 514)

**Network topology:**
- **Enforced 30-inbound ceiling** on 13 mega-hubs (previously up to 104 inbound) — ~280 weakest connections pruned using algorithmic scoring (length, specificity markers, template language penalties)
- **96+ new connections added** to dead-end and low-degree entries — all A-grade, swap-tested
- **10 inter-hub connections restored** after pruning script accidentally removed them
- **4 data errors fixed** (connection texts describing wrong targets)
- **Every entry now ≥3 total connections** — zero dead ends

**Data hygiene:**
- **63 entries reclassified** to correct disciplines
- **3 fabricated entries replaced** with verified canonical objects
- **Origin normalisation** (England→United Kingdom, USA→United States)
- **Duplicate removal** across archive

**Final state:** 1,000 entries, 3,021 connections, 0 validation errors, 0 template patterns, 0 formulaic openers, 0 American spellings. Min degree 3, median 5, max inbound 31.
