# Provenance Archive - Curator Memory

## Archive Structure
- **Live archive**: `app/data/archive.js` — 1,000 entries, IDs 1-1091 (not contiguous)
- **Staging candidates**: `app/data/candidates.js`
- **Main site**: `app/page.js` (single-page app, client-side React)
- **Staging**: `app/staging/page.js` (password-protected: provenance2026)
- Connection types: argument, lineage, material, sameProblem, zeitgeist, method

## Known Data Issues (as of 2026-03-10)
- **Origin inconsistency**: UK has 6 variants (United Kingdom, England, Great Britain, London, Britain, UK); US has 2 (United States, USA). Needs normalisation.
- **Self-referencing connection**: Entry 482 (Branca Chair) connects to itself
- **Duplicate connection**: Entry 460 (High Tea Pot) connects to ID 2 twice (different types)
- **Header lists only 6 of 11 disciplines**: Missing Textile, Transport, Ceramic, Glass, Metalwork from header stats
- **Discipline imbalance**: Product(303), Furniture(304), Graphic(147) dominate. Transport(6), Metalwork(8), Typography(15), Glass(19), Textile(24) remain weak.
- **Hub concentration**: IDs 1-16 receive disproportionate inbound connections (London Underground Map: 99 inbound). Connection reasons are well-argued but the network is star-shaped.
- **Entry 96** (ET66 Calculator): only 1 connection — minimum should be 3

## Quality Patterns
- Early entries (IDs 1-50) have strongest, most distinctive voice
- Mid-range entries (IDs 150-500) show some formulaic connection reasons ("Where X does Y, Z does W")
- Candidate entries generally match archive quality; architecture candidates are particularly strong
- Connection reasons are consistently argued, rarely generic — this is the archive's signature strength
- Significance statements use "demonstrates" as a crutch verb in mid-range entries
- No broken connections in either archive or candidates (zero orphaned target IDs)

## Candidate Quality Notes
- Candidates deliberately fill gaps: Architecture(52), Textile(16), Ceramic(12), Glass(9), Metalwork(7), Transport(6)
- Candidate cross-discipline rate (41%) is lower than archive (52%)
- Candidate sameProblem (31) and material (9) connection types are underused vs archive proportions

## Contemporary Batch Notes (IDs 906-935)
- Discipline spread: Product(10), Graphic(4), Architecture(4), Furniture(4), Typography(3), Ceramic(2), Textile(2), Lighting(1). Product-heavy again.
- Geographic diversity is the batch's best feature: Kenya, Egypt, South Africa(2), Senegal, Argentina, Mexico, Iceland, Nigeria, Serbia, Turkey, Venezuela — genuine Global South representation
- Writing quality is high — matches early-archive voice, avoids mid-range formulaic patterns
- ALL 30 entries have empty connections arrays — this is the primary gap
- Several entries classified as "Product" that could be argued as other disciplines (e.g., Dazzle Ship, Forensic Architecture)
- Discipline "Graphic" used for Forensic Architecture (ID 910) — debatable, could be Architecture or a new discipline
- "Lighting" used for Ini Archibong chandelier — correct but archive has "Lighting" as a discipline while it's also a subcategory of Product in some entries

## Entry Block Consolidation
- See [entry_blocks_audit.md](entry_blocks_audit.md) for full audit of entry clusters occupying 4+ slots
- Worst offenders: King Lear costumes (8 entries), Vinci Weeds (6), XR (5), Variset hooks (4), Walkman variants (4), Lucienne Day Four Seasons (4)
- Total consolidation potential: 15-20 freed slots for weak disciplines
