# MCP Skills Architecture: Persona-Scoped Agent Skills

**Date:** 2026-03-19
**Status:** Draft
**Scope:** Agent skills layer for the Provenance MCP server — four personas, free/premium tiers, public distribution path

---

## Context

Art Blocks launched a public MCP server (2026-03-19) with persona-segmented agents (Collector, Artist, Researcher, Developer) and a published skills repo (`ArtBlocks/skills`). Provenance already has a working local MCP server with four generic tools. This design adds the intelligence layer: skills that teach external agents how to *reason about design connections*, not just query them.

## Key Decision

**Persona logic lives in skills, not in the MCP server.** The four MCP tools (`search_entries`, `get_entry`, `find_path`, `get_cluster`) stay generic. Skills teach agents how to compose them for persona-specific tasks. This means:

- The free tier gives you raw tools + basic skills
- The premium tier gives you design reasoning encoded as transferable editorial intelligence
- The MCP server stays simple and deterministic (WAT Layer 3)
- Skills carry the genuine reasoning (WAT Layer 2)

## Personas

| Persona | Art Blocks Equivalent | Core Need |
|---|---|---|
| **Student** | Collector | Discover, trace, analyse design connections |
| **Lecturer** | Artist | Build curriculum pathways, design assessments |
| **Researcher** | Researcher | Network analysis, influence mapping, gap finding |
| **Curator** | Developer | Quality review, entry drafting, topology management |

## Architecture

### Layered Skills

```
mcp/skills/
  README.md              ← Quick-start guide (public)
  core.md                ← Foundation knowledge (public)
  student/
    explore.md           ← Discovery and navigation (public)
    analyse.md           ← Academic analysis support (premium)
  lecturer/
    pathway.md           ← Module/pathway building (premium)
    assess.md            ← Assessment design (premium)
  researcher/
    topology.md          ← Network analysis (premium)
    influence.md         ← Influence mapping (premium)
  curator/
    review.md            ← Quality review (premium)
    expand.md            ← Entry drafting and expansion (premium)
```

### Skill Dependency

All persona skills assume the agent has loaded `core.md`. Core teaches:
- What the archive is
- The four MCP tools and their parameters
- The six connection types and what each argues
- The 11 disciplines and their density
- How to interpret enriched connections
- The quality standard

Persona skills build on this foundation with task-specific recipes.

### Free/Premium Boundary

No DRM or authentication at this stage. Premium skills are markdown files that simply aren't included in the public distribution. The MCP tools work regardless — premium skills teach you how to use them *well*.

**Free tier (public):** README, core, student/explore
**Premium tier (subscription):** Everything else

### Distribution Path

1. **Now:** `mcp/skills/` inside this repo
2. **Phase 2:** Extract public skills to `provenance-design/skills` on GitHub
3. **Phase 3:** Premium skills bundled with hosted MCP endpoint and subscription

No code changes needed for extraction — it's a file distribution question.

---

## Skill Designs

### core.md (Public)

Foundation knowledge for any agent connecting to the Provenance MCP server.

**Contents:**
- Archive overview: 1,000 design objects, 3,021 connections, 11 disciplines
- Tool reference: all four tools with parameters, return shapes, composition patterns
- Connection typology: the six types, what each argues, examples
- Discipline map: all 11 with relative density (Furniture 297 → Transport 11)
- Interpreting results: forward/reverse direction, reason text perspective, enriched connections
- Quality standard: connections are critical arguments — the swap test, Sudjic register

### student/explore.md (Public)

Discovery and navigation for students.

**Recipes:**
- **Object discovery:** search by discipline + movement/origin/year, present with context
- **Connection tracing:** `find_path` between two objects, `get_entry` on each step, build narrative
- **Cluster exploration:** `get_cluster` depth 1, group by discipline and connection type, highlight bridges
- **Common questions:** "What influenced X?", "What else used this material?", "What was happening in [place] in [decade]?"

### student/analyse.md (Premium)

Academic analysis support.

**Recipes:**
- **Essay scaffolding:** from thesis → find supporting/complicating entries and connections → build argument structure
- **Comparative analysis:** two objects, map shared and divergent connection threads
- **Movement mapping:** internal tensions (arguments), lineage chains, zeitgeist clusters within a movement
- **Connection-writing practice:** use swap test and quality standard to draft original connection arguments

### lecturer/pathway.md (Premium)

Module and pathway building — the core subscription product.

**Recipes:**
- **Module pathway building:** topic + duration → search → cluster hubs → path between anchors → progressive sequence
- **Learning outcome alignment:** match entries to SOLO taxonomy levels via graph structure (single connection = relational, path = extended abstract, cluster = multistructural)
- **Lecture sequencing:** order entries so each session connects to the previous via `find_path`
- **Cross-discipline bridging:** find strongest bridges that broaden without losing focus, filtered by connection type

### lecturer/assess.md (Premium)

Assessment design.

**Recipes:**
- **Assignment generation:** from pathway, identify pairs/clusters for student connection-writing
- **Difficulty calibration:** single hop = Level 4/5, multi-hop = Level 5/6, cross-discipline cluster = Level 6/7
- **Marking reference:** surface existing connection reasons as quality benchmarks
- **Plagiarism resistance:** connection-writing defeats generic AI via swap test — how to set assignments that exploit this

### researcher/topology.md (Premium)

Network analysis and gap finding.

**Recipes:**
- **Gap finding:** compare discipline density, identify thin bridges (research opportunities)
- **Hub analysis:** cluster depth 2 on high-degree nodes, map which connection types dominate
- **Cross-discipline metrics:** find all paths between two disciplines, characterise by connection type
- **Cluster detection:** find tightly connected subgraphs with few exits — intellectual cul-de-sacs or coherent movements

### researcher/influence.md (Premium)

Influence mapping and lineage tracing.

**Recipes:**
- **Influence mapping:** designer/object → search → follow lineage connections outward → directed influence graph
- **Counter-narrative finding:** for established lineages, find alternative routes via different connection types
- **Temporal analysis:** year-range search → cluster on period hubs → within-decade vs cross-era connections
- **Publication-ready output:** structured findings with entry citations, connection evidence, path documentation

### curator/review.md (Premium)

Quality review and maintenance.

**Recipes:**
- **Connection quality review:** apply swap test to each connection reason, grade against Sudjic standard
- **Hub management:** check inbound count against 30 ceiling, identify weakest connection for removal
- **Dead-end detection:** find low-connection entries, determine which connection type adds most topological value
- **Template language detection:** catch formulaic patterns, rewrite toward specificity

### curator/expand.md (Premium)

Entry drafting and archive expansion.

**Recipes:**
- **Candidate drafting:** compose entry to schema, find existing entries for connections, draft minimum 3 passing swap test
- **Connection writing:** get both entries, identify genuine design argument, select type, write compressed specific reason
- **Batch expansion:** map discipline gap, identify missing canonical objects, draft cohort with cross-discipline bridges
- **Topology-aware placement:** check cluster won't overload hub, create dead end, or duplicate existing cluster

---

## What's Not Included

- **No changes to the MCP server** — tools stay generic
- **No authentication or DRM** — premature at this stage
- **No hosted endpoint** — Phase 2/3
- **No changes to the live site or archive data**
- **No curriculum_query composite tool** — skills handle composition

## Success Criteria

- Any agent loading core.md + a persona skill can accomplish persona-specific tasks using only the four MCP tools
- Skills are self-contained markdown — no code dependencies
- Free/premium boundary is a distribution question, not a technical one
- Structure supports extraction to separate repo without changes
