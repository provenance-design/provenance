# Topology Guide

## Hub Ceiling — 30 Inbound Max

All mega-hubs were pruned in March 2025. The ceiling is **30 inbound connections**. Do not add connections to any object above 25 inbound without removing one first.

Current top inbound (as of March 2025):

- **Arco (1), Mezzadro (2), Parentesi (3), Pompidou (15), SK 4 (16)** — 31 inbound
- **Snoopy (5), Superleggera (6), Ulm Stool (7), Grillo (10), Egg Chair (24)** — 30 inbound
- **London Underground Map (13), 606 (11), Carlton (12), Penguin (14), IBM Logo (56)** — all below 30

## Topology Status (March 2025)

The topology rebuild is **complete**. Key metrics:

- **Min degree: 3** — no dead-end entries
- **Median degree: 5** — healthy navigability
- **Max inbound: 31** — no more gravity wells
- **0 template patterns** in connection texts
- **0 formulaic significance texts**

### Remaining opportunities
- **192 entries at degree 3** — functional but could be richer (target 4-5)
- **171 entries with 0 inbound** — reachable by browsing but nobody links to them
- **Material connections at 4.3%** — underrepresented (target ~10%)
- **Lateral reach over proximity.** Connecting the Pewter Stool to the Panton Chair is a short hop (both canonical European furniture). Connecting the Pewter Stool to the London Underground Map because both impose a radical constraint on process — that's the long lateral reach that creates serendipity.

## Topology Tools

Run `python tools/topology.py` for network diagnostics:

- **Hub analysis** — counts total connections per object (outgoing + incoming). Flags objects above threshold.
- **Cross-discipline ratio** — percentage of connections bridging different disciplines. Target: 40%+.
- **Dead-end finder** — objects with only 1-2 connections that trap navigation.
- **Tight-loop detector** — triangles where all three nodes have few external connections.
- **Path finder** — BFS search for 4-5 step paths crossing 3+ disciplines.
- **Connection grader** — classifies connections as A/B/C quality.

Add `--with-candidates` to include staging entries.

## Network Visualiser

Two modes on the Connection Map tab, toggled with Force|Radial buttons.

### Force-Directed View
Physics-based simulation. Nodes repel, connections attract, layout emerges from the data. Good for seeing cluster structure and identifying orphans. Dark canvas, discipline-coloured nodes, connection type filtering.

### Radial View (Prototype)
Nodes arranged on a circle perimeter, grouped by discipline segment. Connections drawn as Bezier arcs through the centre. Ego-network highlighting on hover. Connection type colouring.

This is a **prototype** — the long-term goal is for the Connection Map to be a designed artefact, not just a diagram. Reference material for the visual ambition in `docs/waves-model*.jpg` (screenshots from 6529.io's radial network visualisation).

### Staging version
Integrated in `/staging` page, shows candidates overlaid on the existing network.

**What the visualiser reveals:**
- **Hub dominance** — oversized central nodes = over-connected objects channelling too much traffic
- **Orphan clusters** — isolated groups needing cross-discipline bridges
- **Discipline clustering** — same-colour nodes grouped together = lacking cross-discipline wiring
- **Dead ends** — peripheral nodes with 1-2 connections
- **Tight loops** — triangles with no external connections

## Discipline Balance

Current counts (March 2025, after reclassification pass):

| Discipline | Count | Status |
|-----------|-------|--------|
| Furniture | 297 | Strong |
| Product | 240 | Strong |
| Graphic | 138 | Good |
| Architecture | 71 | Adequate |
| Textile | 69 | Good — was 29 |
| Lighting | 68 | Adequate |
| Ceramic | 35 | Growing |
| Glass | 35 | Growing |
| Metalwork | 20 | Improved — was 11 |
| Typography | 16 | Adequate for discipline |
| Transport | 11 | Still weakest |
