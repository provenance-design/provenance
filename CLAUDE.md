# Provenance Archive

## What This Is

Provenance is a curated, argued archive of design objects — product, furniture, graphic, lighting, architecture, textile, ceramic, glass, metalwork — built as both a teaching resource for design students and the foundation of a developing scholarly research practice. It is not a database. It is not a mood board. It is a network of argued relationships between designed objects, where the connection — not the object — is the primary unit of design knowledge.

The archive lives at **provenancearchive.uk**. It is built and maintained by **Neil Housego**, Senior Lecturer in Product Design at Lincoln School of Design, University of Lincoln.

---

## Technical Stack

- **Framework:** Next.js 14 (App Router), React 18
- **Hosting:** Vercel, auto-deploys from GitHub on push
- **Repository:** `github.com/provenance-design/provenance` (**public**)
- **No database** — all data lives in JS files
- **Primary data file:** `~/Documents/_dev/provenance-archive/provenance-site/app/data/archive.js`
- **Staging candidates:** `~/Documents/_dev/provenance-archive/provenance-site/app/data/candidates.js`

### Project Structure

```
app/
  page.js              — Main site (single-page app: Featured, Archive, Connection Map, About, Detail views)
  layout.js            — Root layout, Google Fonts (DM Sans + DM Serif Display)
  globals.css          — Global styles
  staging-page.js      — Old staging component (superseded — do not use)
  staging/page.js      — Staging review page at /staging (password: provenance2026)
  data/
    archive.js         — LIVE data: ARCHIVE array, CONNECTION_TYPES, DISCIPLINES exports
    candidates.js      — STAGING data: CANDIDATES array (entries awaiting review)
tools/                   — Deterministic Python scripts (WAT Layer 3)
  validate.py          — The guardrail: schema, duplicates, IDs, hubs, template language
  topology.py          — Network diagnostics: hubs, dead ends, cross-discipline ratio, tight loops
  merge.py             — Deterministic candidate → archive migration with validation gate
  source_images.py     — RETIRED. V&A API approach replaced by direct web search.
  fetch_images.py      — RETIRED. Images now downloaded directly via curl.
  image_manifest.json  — RETIRED. No longer used.
workflows/               — Markdown SOPs (WAT Layer 1)
  cohort-pipeline.md   — End-to-end process for adding a themed batch of 50 entries
.claude/
  agents/              — Domain expert agents (WAT Layer 2)
    design-curator.md           — Reviews entry quality, connections, metadata
    design-provenance-researcher.md — Sources new design items for the archive
    provenance-site-builder.md  — Builds, deploys, fixes the Next.js site
    image-sourcing-archivist.md — Finds authoritative images for entries
  hooks/                 — INACTIVE. All hooks disabled. Scripts retained for reference.
  settings.json        — Empty (hooks cleared)
  agent-memory/        — Persistent knowledge per agent (accumulates across sessions)
.tmp/                    — Disposable intermediates (gitignored)
```
- **Images:** Dual sourcing system. Primary: local files at `/public/images/{id}.jpg` (one image per entry, named by integer ID). Fallback: Wikipedia API via the `wikiTitle` field (must match exact Wikipedia article title). If neither exists, a typographic fallback plate is displayed. Wikipedia/Wikimedia Commons images are **excluded as manually-sourced images** — the `wikiTitle` API fallback is a legacy system from the initial build. All new images should be locally sourced and saved as `{id}.jpg`.

### WAT Framework (Workflows, Agents, Tools)

The project uses the WAT architecture: probabilistic AI handles reasoning while deterministic code handles execution. This separation prevents compounding errors.

**Layer 1 — Workflows** (`workflows/`): Markdown SOPs defining what to do and how. Written in plain language. The cohort pipeline is the primary workflow.

**Layer 2 — Agents** (`.claude/agents/`): Four domain experts that read workflows, call tools, and make decisions. They orchestrate — they don't do everything themselves.

**Layer 3 — Tools** (`tools/`): Python scripts that do the actual work. Consistent, testable, deterministic. When an API can handle something, use a tool — not an agent.

**Token efficiency rule:** If it can be done deterministically (API call, script, validation), it MUST be a tool. Agents are only for genuine reasoning tasks. Use Haiku model for simple agent tasks (e.g. one web search per object). Never burn Opus tokens on work a script could do.

**Model hierarchy:**

| Task | Model | Why |
|------|-------|-----|
| Image sourcing (web search + download) | Haiku | Mechanical — one search per object |
| Fact-checking entries | Haiku/Sonnet | Web search + basic reasoning |
| Entry drafting (descriptions, significance) | Sonnet | Good prose, cheaper than Opus |
| Connection quality review | Sonnet | Design knowledge, not full Opus |
| Writing connection texts | Opus | Genuine curatorial reasoning |
| Validation, topology, merge | Tools | Deterministic, zero tokens |

**Error recovery loop:** When a tool fails: fix the tool → verify the fix → update the workflow → move on with a more robust system.

### Deployment

```bash
cd ~/Documents/_dev/provenance-archive/provenance-site
git add .
git commit -m "description of changes"
git push
```

Vercel rebuilds automatically. Allow ~60 seconds for propagation. Authentication is handled by macOS Keychain — no tokens or credentials needed in the command.

### Git Rules

- **NEVER** add "Co-Authored-By" lines mentioning Claude or any AI to commit messages
- Keep commit messages concise and descriptive
- Entries are typically committed in batches (e.g. "44 candidates", "94 staging candidates")

### Site Features

- **Deep links** — `provenancearchive.uk?entry=ID` auto-opens a specific entry in the detail panel.
- **Discipline filter** — toggleable discipline buttons in the header. Click once to filter, click again to deselect.
- **Connection type filter** — on each entry's detail page, filter visible connections by type (Argument, Lineage, Material Thread, etc.). Each type has a distinct colour and icon.
- **Typographic fallback** — entries without images display a typographic plate (title, designer, year on a coloured background keyed to discipline) instead of a broken image.
- **Image path convention** — `/public/images/{id}.jpg`. The `imageUrl` field in the data points to `/images/{id}.jpg`. Images are named by integer ID only (e.g. `4.jpg`, not `004.jpg` — an early filename mismatch broke the Grillo Telephone image).

### Staging Site

The staging system is a separate route within the Next.js app at `/staging`. It is the editorial interface for reviewing candidates before they go live.

**Location:** `~/Documents/_dev/provenance-archive/provenance-site/app/staging/page.js`
(Note: an older `app/staging-page.js` file also exists in the root app directory — this was an early prototype built before the `/staging` route was properly set up. It is superseded and not in use. The active staging page is `app/staging/page.js`. The route was initially conceived as `/review` and later renamed to `/staging` to better reflect its purpose as a full editorial environment, not just an approve/reject tool.)

**Access:** Password-protected. The password is `provenance2026`. On load, the page prompts for the password and stores it in session state (not localStorage). No authentication persists between sessions.

**Data source:** Reads from `~/Documents/_dev/provenance-archive/provenance-site/app/data/candidates.js`, which uses the same schema as `archive.js`. Candidates are drafted here first, reviewed on the staging page, then merged into the live archive when approved.

**Tabs:** The staging page has multiple tabs:
1. **Candidates list** — displays all entries from `candidates.js` in card format with discipline colour coding. Each card shows title, designer, year, discipline, description, significance, and all proposed connections with their types and reason texts.
2. **Network visualiser** — an interactive force-directed graph (see below) that shows both the existing archive entries and the proposed candidates, allowing Neil to see how new entries would integrate into the network topology before committing them.

**Merge workflow:**
1. Draft new entries into `candidates.js` (same schema as `archive.js`)
2. Review them at `provenancearchive.uk/staging` (password: `provenance2026`)
3. Use the network visualiser tab to check topological integration — are candidates creating useful cross-discipline bridges or just clustering around existing hubs?
4. When satisfied, manually move approved entries from `candidates.js` into `archive.js`
5. Remove merged entries from `candidates.js`
6. Push to deploy

**Important:** The staging page is deployed live alongside the main site (it's just a route). The password protection is client-side only — it's not hardened security, just a gate to prevent casual discovery. The URL `provenancearchive.uk/staging` is not linked from the main site.

### Network Visualiser

An interactive force-directed graph that renders the entire archive's connection topology. Built with HTML5 Canvas for performance at 598+ nodes.

**Visual design:**
- **Dark canvas background** (near-black)
- **Nodes** are circles, **coloured by discipline** — each discipline has a distinct colour from the site's palette (same colours used in the discipline filter on the main site)
- **Node size** scales with **connection count** — objects with more connections appear larger, making hub objects immediately visible
- **Edges** are drawn as lines between connected nodes, with subtle opacity so the overall structure reads without individual edges dominating
- **Labels** appear on hover or at zoom thresholds — showing object title and designer

**Interaction:**
- Nodes can be dragged to rearrange the layout
- Zoom and pan supported
- Hover shows entry details
- The physics simulation uses force-directed layout (attraction along edges, repulsion between all nodes, gravity toward centre) to organically cluster related objects while spacing the overall network

**Two versions exist:**
1. **Standalone HTML file** — a single self-contained HTML document that reads `archive.js` and renders the full graph. Can be opened locally in a browser for offline analysis. Built specifically so Neil can show colleagues the archive's topology without needing a dev environment — double-click the file and it opens. Located in the pipeline folder.
2. **Integrated staging tab** — the same visualiser embedded within the `/staging` page, with the addition of candidate entries from `candidates.js` rendered in a distinct style (e.g. different opacity or outline) so you can see how proposed entries would sit in the network before committing them.

**What the visualiser reveals:**
- **Hub dominance** — oversized nodes clustered at the centre indicate objects that are over-connected and channelling too much navigation traffic
- **Orphan clusters** — isolated groups of nodes with no bridges to the main network indicate entries that need cross-discipline connections
- **Discipline clustering** — if all nodes of one colour sit together, the archive lacks cross-discipline wiring. Healthy topology shows discipline colours interleaved.
- **Dead ends** — small nodes at the periphery with only 1–2 connections. These need additional connections or the user gets stuck.
- **Tight loops** — triangles of 3 nodes where none have external connections. These trap navigation.

### Main Site Front-End

The main site (`app/page.js`) is a single-page React application within Next.js. It has five views, all rendered within the same page component: **Featured** (curated highlights), **Archive** (full grid of all entries), **Connection Map** (the network visualiser), **About** (editorial statement and connection type guide), and **Detail** (individual entry view with connections). Key UI components:

- **Grid view** — entries displayed as image cards in a responsive grid, with discipline colour coding and typographic fallback plates for missing images
- **Detail panel** — clicking an entry opens a detail view showing: image, title, designer, year, manufacturer, discipline badge, movement, collection, description, significance statement, keywords, and all connections as clickable cards
- **Connection cards** — each connection card shows: connection type icon and label (colour-coded), target object's discipline, title, designer, year, and the argued reason text in italic. Clicking a connection card navigates to that entry's detail panel — this is how users traverse the network.
- **Connection type filter** — buttons above the connection cards allow filtering by type (All / Argument / Lineage / Material / Same Problem / Zeitgeist / Method). Each button uses the type's signature colour.
- **Discipline filter** — header buttons for filtering the grid by discipline. Click toggles on, click again toggles off.
- **About panel** — explains the archive's purpose, the six connection types with descriptions, and lists source archives.

The site uses a warm cream/off-white palette (`#F6F5F0` background, `#FDFCF8` cards, `#EBE8E0` borders) with **DM Serif Display** for titles and **DM Sans** for body text (both loaded via Google Fonts in `layout.js`). The visual language is deliberately restrained — closer to a museum catalogue than a tech product.

### Repository Visibility

The GitHub repository is **public** under the `provenance-design` GitHub account (separate from Neil's Basalt Rooms account). The live site at provenancearchive.uk reveals nothing about the underlying GitHub account. Neil's university colleagues should not discover his Basalt Rooms identity — the `provenance-design` account has no link to Basalt Rooms.

### Topology Analysis Tools

Several Python analysis scripts have been developed for auditing the network:

- **Misattribution scanner** — scans every connection reason text for designer surnames that don't belong to either endpoint object. Catches cases where the AI mixed up which designer it was describing.
- **Hub analysis** — counts total connections per object (both outgoing and incoming). Flags objects above a threshold. Top hubs identified: London Underground Map (~105), 606 Shelving (~101), Carlton (~97).
- **Cross-discipline ratio** — calculates what percentage of connections bridge different disciplines vs. stay within the same discipline. Healthy target: 40%+ cross-discipline.
- **Dead-end finder** — identifies objects with only 1–2 connections that trap navigation.
- **Tight-loop detector** — finds triangles where all three nodes have few external connections.
- **Path finder** — BFS-based search for interesting 4–5 step paths that cross 3+ disciplines, scored by discipline variety and alternation. Used to identify and verify curated pathways through the archive.
- **Connection grader** — classifies connections as A/B/C quality based on length, specificity, and the presence of template language patterns.

These scripts are run ad hoc within conversations. They are not part of the deployed site — they operate on the raw `archive.js` data file.

---

## Current State

- **598 entries** in live archive (`archive.js`), **1,988 connections**. Entry IDs range 1–636 (not contiguous — some IDs removed during audits).
- **246 candidates** in staging (`candidates.js`), IDs 637–935. **⚠ Verify against actual file before starting work — this count may be stale if batches have been merged or rejected since the CLAUDE.md was last updated.**
- Target: **1,000 entries** in the live archive
- Each entry has: title, designer, year, manufacturer, discipline, description, significance statement, keywords, collection references, movement, and typed connections to other entries
- **Image sourcing:** Haiku agents do WebSearch for each object, find museum/designer pages, WebFetch the page to extract the image URL, then curl to download to `public/images/{id}.jpg`. Neil verifies every image. Wikipedia/Wikimedia Commons **explicitly excluded**.

### Known Overconnected Hubs — Do Not Add To Without Pruning

These objects already dominate the network topology. Never add a new connection to any of these without removing an existing one first:

- **London Underground Map (13)** — ~105 connections
- **606 Universal Shelving System (11)** — ~101 connections
- **Carlton Bookcase (TODO: verify ID from archive.js)** — ~97 connections
- **Penguin Books (14)** — heavily connected
- **Pompidou Centre (15)** — heavily connected (was flagged as overused in connection audit)
- **IBM Logo / Paul Rand (56)** — frequently used as a target

The post-1,000-entry rebuild plan will enforce a connection ceiling of 12 per object. Until then, exercise restraint with all high-connection objects.

### Known Issues

- **Hub dominance:** Ten objects (London Underground Map, 606 Shelving, Carlton, etc.) carry a disproportionate share of navigation paths. The post-1,000-entry rebuild will enforce a **connection floor of 6–8** and a **ceiling of 12** per object.
- **Tight loops:** Some small clusters trap navigation. Audit for triangles where all nodes have few external connections.
- **Image errors:** Some entries display incorrect images (e.g. wrong project by the right designer). These require manual checking against the live site.
- **Hallucination risk:** Entries added during AI-assisted expansion phases may contain fabricated objects, wrong dates, wrong materials, or wrong manufacturers. See the full list in "5. Accuracy Audit" under Major Work Passes. The error pattern is consistent: AI blends accurate high-level design knowledge with fabricated specifics (exact years, materials, manufacturers). **Always verify new or unfamiliar entries against primary sources before publishing.**

### Scaling Plan — Route to 1,000 Entries

The agreed method for reaching 1,000 entries is **themed cohorts of 50**, not bulk generation:

1. **Each cohort is themed** — by discipline, period, or geography (e.g. "50 Japanese design objects, 1950–2000"). This makes verification manageable within a bounded knowledge domain.
2. **Connections within a cohort are written first** (Tier 1), then connections to the existing archive (Tier 2, 3–5 per entry). Tier 2 connections should be scored by network distance — favour cross-cluster bridges over reinforcing existing hubs.
3. **Every cohort gets a topology check** before merging: are new entries well-connected or orphaned? Are existing hubs getting overloaded? Are there dead-end clusters?
4. **Duplicate detection** must run before each cohort — check designer name, object title, and year+manufacturer against the full live archive. A Python scan is safest (see Duplicate Detection section below).
5. **Full exclusion check against existing titles is required** — earlier batches inadvertently created duplicates. Run before any new batch is written.
6. **The model is: Claude drafts, Neil verifies, iterate per cohort.** Not "generate 400 entries and fix them later" — that's what produced the accuracy problems in the first expansion.

At 50 entries per cohort, reaching 1,000 requires ~8 more cohorts from the current 598. Each cohort produces ~150–200 connection texts.

### Post-1,000 Topology Rebuild Plan

Once the archive reaches 1,000 entries, a full topology rebuild is planned:

- **Connection ceiling: 12 per object.** No object should have more than 12 connections. The top hubs (Underground Map at ~105, 606 at ~101, Carlton at ~97) will be pruned to their best 10–12 connections. The other 90+ connections dilute quality and create gravity wells that suck every navigation path through the same objects.
- **Connection floor: 6–8 per object.** Every object needs at least 6 connections. The 442 entries currently sitting at 3–5 connections are dead ends — a visitor who lands on them has 2–3 exits. That's not a web, it's a cul-de-sac.
- **Algorithmic scoring:** For each entry, score every possible pairing in the archive on material overlap, process overlap, problem overlap, chronological proximity, geographical tension, and network distance. Prioritise connections that bridge distant clusters over connections that reinforce existing hubs.
- **Lateral reach over proximity.** Connecting the Pewter Stool to the Panton Chair is a short hop (both canonical European furniture). Connecting the Pewter Stool to the London Underground Map because both impose a radical constraint on process — that's the long lateral reach that creates serendipity.
- **The network visualiser is the diagnostic tool.** Run before/after comparison. The goal: the network transforms from a hub-spoke solar system (ten suns, hundreds of orbiting rocks) into a distributed web where every node is a viable starting point and every click leads somewhere unexpected.

### Discipline Gaps

The archive is weakest in: **Ceramic, Glass, Metalwork, Textile**. Prioritise candidates from these disciplines to rebalance the network.

### Disciplines

Product, Furniture, Graphic, Lighting, Architecture, Typography, Textile, Transport, Ceramic, Glass, Metalwork

### Data Integrity Rules

- Connections reference entries by `id` — target IDs **must** be valid IDs in the live archive or the current candidates batch. Broken references (pointing to non-existent IDs) will produce dead links on the site.
- `candidates.js` is the active working file between batches — this is where new work happens before merging to the live archive.
- When merging candidates into the archive, assign IDs sequentially from the next available integer after the current highest ID in `archive.js`.

---

## The Connection Typology

Six typed connections. Every connection must name both objects, cite specific years and materials, and make a **non-transferable** claim — i.e. the connection text could only describe these two objects and no others. Formulaic or generic connection texts are unacceptable.

| Type | Code | What It Argues |
|---|---|---|
| **Argument** | `argument` | A designed disagreement. Two objects address the same territory with opposing criteria. |
| **Lineage** | `lineage` | Transfer across time. A formal, material, or conceptual logic that reappears in a later solution. |
| **Material Thread** | `material` | Shared material carrying different labour, politics, performance, or meaning across contexts. |
| **Same Problem** | `sameProblem` | The same brief answered differently. What changes when the medium, era, or culture changes? |
| **Zeitgeist** | `zeitgeist` | Parallel answers emerging within the same cultural and historical moment. |
| **Shared Method** | `method` | Transferable process detached from style. The same methodology producing different outcomes. |

### Connection Quality Standard

A good connection reads like a compressed critical essay. It should produce a small cognitive snap: unexpected, but immediately obvious once stated.

**Gold standard — short form:**
*"Mezzadro finds form through function. Juicy Salif abandons function for meaning. The central argument in design discourse, in two objects."*

**Gold standard — full length (the level all new work should reach):**
*"Baas presses synthetic clay onto a steel frame and leaves every thumbprint — the table's surface is a record of accumulation, material added until it's thick enough. De Waal throws porcelain and shaves it until light passes through — the teapot's wall is a record of removal, material taken away until it's thin enough. Two artists whose entire argument is in the relationship between hand and surface."*

*"Colombo's Multi Chair: two cushions and a hinge — sitting, lounging, sleeping, the whole domestic programme in one compact object. Grcic's Mayday: a cone, a hook, and a cord — table lamp, hanging lamp, emergency light, the whole lighting programme in one portable tool. Two designers who believe a single well-designed object should make several lesser objects unnecessary."*

**What makes these work:** They name specific materials and processes. They describe what each object actually does. The argument emerges from the description — it's not bolted on. The final sentence crystallises the insight without explaining it to death. You could teach a whole studio session from either one.

**C-grade — what to reject:**
*"Place them side by side: X treats design as system and restraint, while Y leans into presence and cultural signal. The point isn't taste — it's what design is for."* — Template language. Could describe any two objects. Says nothing specific. Reject.

*"Both explore the boundaries between function and sculpture."* — Vague. "Both" opener. No materials, no years, no specifics. Reject.

*"Near-contemporary responses within related cultural/design conditions."* — Academic filler. Zero insight. Reject.

**The test:** If you can swap the object names in the connection text for any other pair and it still reads as plausible, the connection is not specific enough. Rewrite.

**Rules:**
- Name both objects and both designers
- Cite specific years, materials, processes, or manufacturers
- Make a claim that could not be transferred to any other pair
- Write compressed, argued, specific prose — no filler
- Every connection should produce a small cognitive snap: unexpected, but immediately obvious once stated

---

## Twelve Principles of Product Design

Derived empirically by mining all connection texts and significance statements in the archive. These are not traditional visual or compositional principles — they emerge from what the archive's network actually values.

1. **Component Economy** — achieving maximum function from minimum parts
2. **Reduction** — removing until only the essential remains
3. **Material Position** — material as decision, not finish; carrying meaning, politics, labour
4. **Process as Form** — the manufacturing process visible in the final object
5. **Structural Expression** — making the structure legible as the design
6. **Behavioural Observation** — designing from how the body actually behaves
7. **Weight** — physical and psychological weight as a design variable
8. **Contextual Range** — one object functioning across multiple contexts
9. **System Logic** — single rules generating entire families of objects
10. **Presence** — the object's capacity to hold attention through form alone
11. **Appropriation** — taking something from outside design and recontextualising it
12. **Lifespan** — designing for time (durability, patina, decay, permanence, ephemerality)

**Proportion** is addressed separately as the one legitimate carryover from traditional visual principles, reframed as structural rather than compositional.

Written up as a four-page document (Century Gothic / Georgia). Each principle: number + name + one-paragraph definition + single canonical example from the archive.

**Final preamble wording (do not rewrite without Neil's sign-off):**
*"The standard principles of design — balance, proximity, hierarchy, emphasis — describe how things look. They were developed for two-dimensional composition. These twelve principles describe how design decisions are made. They were extracted empirically from 2,000 argued relationships between 600 canonical design objects in the Provenance Archive — by analysing what the canon actually talks about when it explains why a design decision is good."*

**Final proportion footnote wording:**
*"Proportion carries over from the traditional list but transforms: in three dimensions it means section profiles, taper ratios, weight distribution, and the relationship between a leg's thickness and the load it carries. It is structural proportion, not compositional proportion. The same is true of every visual quality. Colour is a material position decision. Surface finish is a process outcome. Silhouette is the visible result of structural expression and reduction. Visual coherence across a range is system logic. In product design, appearance is not a separate activity. It is inseparable from material, structural, and strategic decisions — sometimes driven by them, sometimes driving them, never independent of them. The visual principles are not absent from this framework. They are embedded within it."*

**Editorial decisions that were explicitly debated and settled:**
- "How things think" was rejected as the preamble framing — "how design decisions are made" is the correct claim.
- "Appropriation" was kept over proposed alternatives like "Found Intelligence" — the word is precise and correct. If it generates classroom discussion about cultural appropriation vs. appropriating existing intelligence, that's a good seminar, not a problem to avoid.
- The document should do one thing — state the position. Teaching infrastructure goes around it, not inside it.

---

## Scholarly Research Practice

The archive is being developed as a formal research practice. This is not a side project — it is the foundation of Neil's academic trajectory.

### Theoretical Framings

- **Threshold concepts (Meyer & Land, 2003, 2006):** "The connection is the unit, not the object" functions as a threshold concept — troublesome, integrative, irreversible, transformative. Land, Rattray & Vivian (2014) extend this to professional disciplines where threshold crossing happens in doing, not only in understanding.
- **SOLO taxonomy (Biggs & Collis, 1982):** The connection typology scaffolds progression from unistructural (identifying objects) through relational (articulating connections) to extended abstract (applying patterns to new contexts). Every typed connection requires at minimum a relational response.
- **Conversational framework (Laurillard, 2012):** Interface-as-editorial-act. Navigation is not a move deeper into a category but a move across a relationship. The interface structures reflection as a condition of use, not an incidental by-product. Browsing and reasoning become inseparable.
- **Connectivism (Siemens):** Knowledge resides in connections across a network. Provenance is an authored, curated implementation — a deliberate departure from Siemens' distributed digital model. Engage critically, not reverentially.
- **Critical pedagogy (Freire, 1970):** Canon accountability via conscientização. The network topology makes bias inspectable — whose work is a hub, whose work is a footnote, whose work is absent. The politics of the archive live in the connections, not the catalogue. Connects to decolonising design education scholarship (Schultz et al. 2018, Abdulla et al. 2019, Ansari 2018).
- **Reflective practice (Schön):** Each typed connection forces a moment of specification — reflection-in-action embedded in the architecture of the tool.
- **Practice-based research (Frayling):** The archive itself is a research output. The paper contextualises the knowledge claim. Both are needed for REF.

### Research Roadmap

1. **Immediate:** Ethics approval for a small qualitative study on Neil's own modules at Lincoln. Semi-structured interviews with 6–8 students. Think-aloud protocols. Student work samples showing connection articulation before/after using the archive. This generates the empirical evidence that makes everything publishable.
2. **Conference papers:** DRS (Design Research Society — pedagogy track), E&PDE (Engineering and Product Design Education), LTAD (Learning and Teaching in Art and Design, via GLAD network).
3. **Journal Paper 1 (pedagogical):** Connection typology, SOLO scaffolding, threshold concepts, student evidence. Target: *Art, Design & Communication in Higher Education* or *The Design Journal*.
4. **Journal Paper 2 (critical/political):** Canon accountability, decolonising design, archive as inspectable network topology. Target: *Teaching in Higher Education* or *Design and Culture*.
5. **REF positioning:** Archive as portfolio output + published paper + critical commentary = legitimate REF return.
6. **SFHEA application:** Provenance as core case study — framework (connection typology), evidence (student outcomes), leadership (the archive's growth model).
7. **PhD by Published Work (long-term):** Lincoln offers these. Two or three published papers + the archive as portfolio output + a critical commentary threading them together.

### Key Journals and Venues

- Design Research Society (DRS) conference — pedagogy track
- Engineering and Product Design Education (E&PDE) conference
- Learning and Teaching in Art and Design (LTAD) — GLAD network
- *Art, Design & Communication in Higher Education*
- *The Design Journal*
- *Teaching in Higher Education*
- *Journal of Design History*
- *Design Issues* (MIT Press)
- *Research in Learning Technology*
- *British Journal of Educational Technology*
- *Design and Culture*

---

## Archive Data Schema

Each entry in `archive.js` follows this structure:

```javascript
{
  id: 616,                          // Unique integer
  title: "Rex Chair",
  designer: "Ineke Hans",
  year: 2021,
  discipline: "Furniture",          // One of the DISCIPLINES constants
  manufacturer: "Circuform",
  origin: "Netherlands",              // Country of origin
  description: "...",               // How the object works — material, process, form
  significance: "...",              // Why it matters — what arguments it enables
  movement: "Circular Design",
  collection: "Design Museum Gent, Museum Boijmans Van Beuningen",
  keywords: ["circular economy", "recycled nylon", "PA6", "injection moulding"],
  imageUrl: "/images/616.jpg",
  wikiTitle: "Rex_Chair",              // Optional — exact Wikipedia article title, used for image fetching via Wikipedia API as fallback when no local image exists
  connections: [
    {
      id: 10,                       // Target entry ID
      type: "argument",             // One of: argument, lineage, material, sameProblem, zeitgeist, method
      reason: "..."                 // The argued connection text
    }
  ]
}
```

The file also exports `CONNECTION_TYPES` and `DISCIPLINES` constants at the top.

**Candidates-only fields:** Entries in `candidates.js` may also have `status` and `notes` fields (used during review). These are stripped when merging into the live archive.

---

## Staging Pipeline

The staging system is the quality gate between drafting new entries and publishing them to the live archive. It exists because earlier expansion phases (particularly AI-assisted batch generation via the Anthropic API pipeline) introduced hallucinated entries, duplicates, and factual errors that weren't caught before going live. The staging pipeline prevents this.

### Pipeline Architecture

The pipeline and the site are **independent systems**. The pipeline outputs entries. Neil reviews them on the staging page. He then manually merges approved entries into the live archive. The pipeline never touches `archive.js` directly — Neil is always the gatekeeper.

**Content generation pipeline** (separate from the site):
- **Location:** `~/Documents/_dev/provenance-archive/provenance-pipeline/`
- **Tool:** `pipeline.py` — CLI with subcommands: `search`, `generate`, `review`, `export`, `status`, `seed`
- **Sources:** Cooper Hewitt API (requires token, CC0 images), V&A API (open, no key), MoMA public dataset
- **Generator:** Sends object metadata to Claude API (Sonnet) with a system prompt encoding Provenance's curatorial voice and connection typology. Generates description, significance, keywords, and argued connections to existing archive entries.
- **Cost:** ~$0.01–0.03 per entry using Sonnet. 200 entries ≈ $2–6.
- **Config:** `.env` file with `ANTHROPIC_API_KEY` and `COOPERHEWITT_TOKEN`

### Staging Workflow

The full process is documented in `workflows/cohort-pipeline.md`. Summary:

1. **Generate candidates** — either via the pipeline, the design-provenance-researcher agent, or by hand-drafting entries
2. **Place in `candidates.js`** — same schema as `archive.js`, same exports structure
3. **Validate** — `python tools/validate.py --candidates --check-targets archive` (catches duplicates, broken IDs, missing fields, hub violations)
4. **Review at `/staging`** — browse candidates, read connection texts, check the network visualiser
5. **Verify facts** — cross-reference titles, dates, manufacturers, materials, and collections against primary sources. Museum databases are authoritative.
6. **Check topology** — `python tools/topology.py --with-candidates` to ensure candidates create useful bridges rather than clustering around existing hubs
7. **Merge** — `python tools/merge.py --ids [approved IDs]` (runs validation automatically, moves entries, strips staging fields, cleans up candidates.js)
8. **Add images** — Launch Haiku agents in parallel batches (~40 per agent). Each agent: WebSearch for the object, WebFetch the top museum/designer result, extract image URL, curl to `public/images/{id}.jpg`. Neil verifies every image — automated sourcing can return wrong objects.
9. **Deploy** — `git add . && git commit -m "Add [n] entries: [brief description]" && git push`

### Duplicate Detection

Built into `tools/validate.py`. Checks title + designer against the full archive and cross-checks between archive and candidates. Run before any merge:

```bash
python tools/validate.py                                    # Both files
python tools/validate.py --candidates --check-targets archive  # Candidates with archive cross-check
```

### Quality Grading

Connections have been graded in previous audit passes using an A/B/C system:
- **A** — genuine insight, non-transferable, produces a cognitive snap
- **B** — decent argument but could be sharper, or relies on an overused target object
- **C** — lazy bridge, template language, must rewrite

In the most recent deep audit: 35 A-grade, 33 B-grade, 31 C-grade out of 99 new connections. All C-grades were rewritten. The target is 100% A-grade for all new work.

---

## Working With This Archive

### What Claude Should Always Do

- **Verify facts.** If writing or editing entries, always check titles, years, manufacturers, materials, and collection attributions against primary sources. Museum databases (V&A, Cooper Hewitt, MoMA, Vitra, Design Museum) are authoritative. Designer studio websites are authoritative. Wikipedia is a starting point, not a source.
- **Write connections to the quality standard.** Compressed, argued, specific, non-transferable. Name both objects. Cite years and materials. Make a claim that could only describe this pair.
- **Think topologically.** Every new entry or connection changes the network. Consider: does this create a new cross-discipline bridge? Does it add to an over-connected hub? Does it create a dead end? Does it open a pathway that didn't exist before?
- **Respect the discipline balance.** Prioritise under-represented disciplines (Ceramic, Glass, Metalwork, Textile) when suggesting new entries.
- **Flag hallucination risk.** If unsure whether an object exists, a date is correct, or a material description is accurate — say so explicitly. Do not invent. The archive's credibility depends on accuracy.
- **Think like a design lecturer.** Every connection should be teachable. It should open a student's understanding, not close it. The archive trains designers to move from reference to criteria — from "I've seen this" to "I can justify why this matters."

### What Claude Should Never Do

- **Never use template language in connections.** If the text could describe any two objects, rewrite it.
- **Never add connections to already-overconnected hubs** (Underground Map, 606 Shelving, Carlton, etc.) without removing one first.
- **Never assume an entry's facts are correct** just because it exists in the archive. Earlier expansion phases introduced errors. Verify before building on.
- **Never source images from Wikipedia or Wikimedia Commons.**
- **Never push to GitHub without Neil's go-ahead.** Always confirm before running `git push`.
- **Never edit the live `archive.js` directly on the server.** All changes go through Git.
- **Never write connections that are merely descriptive.** A connection is an argument, not a caption. It must make a claim about the relationship between two objects that could be contested, defended, or refined.

### When Editing archive.js

The file is large (~1.3MB, 25,000+ lines). **In Claude Code, read with offset/limit — do not load the whole file at once.** When making changes:
1. Work from the most recent version (ask Neil to upload if not already present)
2. Parse with Python using regex to extract the ARCHIVE array from the JS exports:
   ```python
   ct_match = re.match(
       r'(export const CONNECTION_TYPES = .*?;\n\nexport const DISCIPLINES = .*?;\n\n)export const ARCHIVE = (\[.*\]);',
       content, re.DOTALL
   )
   preamble = ct_match.group(1)
   archive = json.loads(ct_match.group(2))
   ```
3. Make changes programmatically
4. Write back the full file with preamble intact:
   ```python
   output = preamble + 'export const ARCHIVE = ' + json.dumps(archive, ensure_ascii=False) + ';'
   ```
5. Verify after writing: count entries and total connections
6. Confirm changes with Neil before committing and pushing

---

## Major Work Passes Completed

Understanding what's already been done prevents repeating or undoing previous work.

### 1. Initial Build (Feb 2025)
Built the Next.js site from a 16-entry React prototype. Deployed to Vercel. Set up GitHub repo under `provenance-design` account. Created the generation pipeline with Cooper Hewitt and V&A API integration.

### 2. Content Expansion (Feb 2025)
Scaled from 16 to ~458 entries via the pipeline (two rounds of batch generation using Claude API). Then manually added ~140 more entries to reach ~598. Many entries in this phase have unverified facts.

### 3. Connection Quality Pass — Full Archive (Feb–Mar 2025)
Two phases. First: rewrote **212 connections** across 10 clusters where connection texts had become formulaic and repetitive. The Parentesi cluster was the worst offender: 32 of its 42 connections repeated "cable and bracket" variations. Second: extended to the full archive — **1,111 connections rewritten** total. All 922 "Both..." sentence openers eliminated. Quality standard established: compressed, argued, specific, non-transferable. The early hand-written connections (entries 1–24) set the gold standard; the batch-generated connections had drifted into templates and were brought up to that standard.

### 4. Structural Rebuild — Hub Pruning and Rewiring (Mar 2025)
Topology analysis revealed a hub problem: ten objects dominated navigation. Executed:
- **59 hub connection prunes** — removed redundant connections from over-connected objects
- **28 lazy bridge swaps** — replaced weak cross-discipline connections with argued ones
- Added new connections to under-connected objects (those with ≤2 connections)
- Wrote curated pathways through the network — 4–5 step paths crossing 3+ disciplines, each with a thematic title. Verified examples:
  - **"WHO GETS TO DESIGN?"** — Autoprogettazione → ESP Printing Block → Favela Chair → Do Hit Chair
  - **"TECHNOLOGY DISAPPEARS"** — Black ST201 → Muji CD Player → iPhone 6 → iPod Touch
  - **"140 YEARS OF TREES"** — Trellis → Cambio → Ore Streams → In Loving Memory of Aicher
  - **"ANXIETY vs CLARITY"** — Placebo → Underground Map → Muji CD → Black ST201 → SK4
  These pathways demonstrate the archive's core educational value: you can walk from Italian radical design to Brazilian favela economics to Dutch critical design, and every step is argued.

### 5. Accuracy Audit (Mar 2025)
Systematic fact-checking of newer entries across two rounds. Discovered and corrected:

**Round 1 — hallucinations and major errors:**
- **Bon Bon Chair (615)** — completely fabricated by AI. Removed, replaced with Fracture Furniture (Ineke Hans, Cappellini, 2007).
- **Superfolk Everyday Objects (625)** — completely fabricated. Removed.
- **Laser Chair (459)** — real object but description was the opposite of reality. Corrected.
- **Rex Chair (616)** — wrong year, wrong materials, wrong manufacturer. Fully rewritten (correct: injection-moulded recycled PA6 nylon, Circuform, deposit system, 2021).
- **Green Chicken (598)**, **Monkey Table (618)**, **Dino Armchair (619)**, **Totem (624)** — all had significant factual errors. Corrected.
- **Paper Porcelain (636)** — minor errors (manufacturer and collection). Corrected.

**Round 2 — additional corrections:**
- **Assemblage 5 (623)** — wrong. Listed as 2012 steel wardrobe at Gallery FUMI; actually a 2017 Friedman Benda exhibition (crystal, cob, bronze). Corrected.
- **Banquete Chair** — manufacturer corrected from Edra to Estudio Campana.
- **Gamper entry (608)** — corrected from "Salone del Mobile Chair" (2005) to "100 Chairs in 100 Days" (2007).
- **Big Shadow** — date corrected from 2009 to 1998.
- **Orgone Lounge** — material corrected from perforated aluminium to moulded fibreglass.

**Lesson:** AI-assisted expansion phases consistently blend accurate high-level design knowledge with fabricated specifics (exact years, materials, manufacturers). The error pattern is plausible-sounding detail that passes casual inspection. Always verify against primary sources before publishing.

### 6. ChatGPT Topology Spreadsheet — Triage (Mar 2025)
A ChatGPT-generated network analysis spreadsheet (`provenance_network_review_v2.xlsx`) was assessed. The structural topology data (Coverage, Hubs, Betweenness, Bridges) was retained as a strategic roadmap. The 890 pre-written connection texts were discarded — every one followed template patterns that would have undone the quality work already completed.

---

## Voice and Conventions

- **British English** throughout (colour, catalogue, behaviour, organisation)
- **Century Gothic** for headings, **Georgia** for body text in printed documents
- **en-GB** language setting for accessibility compliance
- Entries sourced primarily from institutional collections: Cooper Hewitt, V&A, MoMA, Design Museum London, Vitra Design Museum, Triennale Milan, Museum für Gestaltung Zürich
- The archive does not claim neutrality. It makes its editorial logic inspectable.

### Prose Standard

The tone is that of a serious design critic: precise, compressed, argued. Not academic jargon, not populist flattening. Think Deyan Sudjic, Alice Rawsthorn, or the better V&A exhibition catalogues.

Connection texts should be **compressed and aphoristic**. Theory arrives as image, not as explanation. No scaffolding, no "in other words", no hedging. State the claim and trust the reader. The early connections in the archive — written one at a time with full attention — set the standard. The later batch-generated connections drifted into template patterns and had to be rewritten.

**Descriptions** explain *how* objects work — material, process, form. Not art-historical preamble.
**Significance statements** explain *why* students need to know them — what arguments they enable, what positions they take.

Design history is a network, not a parade. If you find yourself listing objects chronologically, you are doing it wrong.

---

## Common Tasks — Quick Reference

- **Adding entries:** Append to CANDIDATES array in `candidates.js` for staging review. Ensure IDs don't clash with existing entries in either file.
- **Editing entries:** Find by ID in `archive.js` or `candidates.js`. Use offset/limit reading — don't load the whole file.
- **Validating:** `python tools/validate.py` — run before every merge and deploy. Zero errors required.
- **Topology check:** `python tools/topology.py` — hub counts, dead ends, cross-discipline ratio. Add `--with-candidates` to include staging.
- **Merging candidates:** `python tools/merge.py --ids 637 638 639` or `--all`. Runs validation automatically. Use `--dry-run` to preview.
- **Sourcing images:** Launch Haiku agents in parallel batches (~40 per agent). Each does WebSearch → WebFetch → curl to `public/images/{id}.jpg`. Neil verifies every image. ~60% hit rate; graphic design and typography entries often need manual sourcing.
- **Staging review:** Review candidates at `provenancearchive.uk/staging` (password: `provenance2026`) before merging to archive.
- **Connection audit:** Ensure cross-discipline spread, reduce hub concentration, eliminate template language. Validator flags template patterns automatically.
- **Deploying:** `git add . && git commit -m "msg" && git push`
- **Running locally:** `npm run dev` → `http://localhost:3000`
- **Full cohort pipeline:** See `workflows/cohort-pipeline.md` for the end-to-end 50-entry process.
