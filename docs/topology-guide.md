# Topology Guide

## Known Overconnected Hubs

These objects dominate the network topology. Never add a new connection to any of these without removing an existing one first:

- **London Underground Map (13)** — ~97 connections
- **606 Universal Shelving System (11)** — ~91 connections
- **Carlton Bookcase (12)** — ~87 connections
- **Penguin Books (14)** — heavily connected
- **Pompidou Centre (15)** — heavily connected
- **IBM Logo / Paul Rand (56)** — frequently used as a target

## Topology Rebuild Plan (Active — Archive Reached 1,000)

The archive has reached 1,000 entries. The topology rebuild is now due:

- **Connection ceiling: 12 per object.** No object should have more than 12 connections. The top hubs will be pruned to their best 10-12 connections. The remaining 90+ connections dilute quality and create gravity wells.
- **Connection floor: 6-8 per object.** Every object needs at least 6 connections. Entries with 3-5 connections are dead ends.
- **Algorithmic scoring:** Score every possible pairing on material overlap, process overlap, problem overlap, chronological proximity, geographical tension, and network distance. Prioritise connections that bridge distant clusters.
- **Lateral reach over proximity.** Connecting the Pewter Stool to the Panton Chair is a short hop (both canonical European furniture). Connecting the Pewter Stool to the London Underground Map because both impose a radical constraint on process — that's the long lateral reach that creates serendipity.
- **The network visualiser is the diagnostic tool.** Run before/after comparison.

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

Target discipline representation (current counts after 1,000 entries):

| Discipline | Count | Status |
|-----------|-------|--------|
| Product | 303 | Strong |
| Furniture | 300 | Strong |
| Graphic | 138 | Good |
| Architecture | 71 | Adequate |
| Lighting | 69 | Adequate |
| Ceramic | 35 | Growing |
| Textile | 29 | Improved — was 23 |
| Glass | 21 | Improved — was 19 |
| Typography | 15 | Adequate for discipline |
| Metalwork | 11 | Improved — was 8, still weakest |
| Transport | 8 | Improved — was 6 |
