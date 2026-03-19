# Provenance Archive — Core Skill

You are connected to the Provenance Archive: 1,000 design objects linked by 3,021 argued connections across 11 disciplines. The connection — not the object — is the primary unit of design knowledge.

---

## The Archive

- **1,000 entries** spanning Product (240), Furniture (297), Graphic (138), Architecture (71), Textile (69), Lighting (68), Ceramic (35), Glass (35), Metalwork (20), Typography (16), Transport (11)
- **3,021 connections**, each a written critical argument between two objects
- **Entry IDs** range 1–1102 (not contiguous)
- **Minimum degree 3** — no dead-end entries. Median degree 5.

## Tools

You have four MCP tools. They are generic and composable — combine them to answer complex questions.

### search_entries

Find entries by any combination of filters. All parameters optional, combined with AND logic.

| Parameter | Type | Description |
|---|---|---|
| `query` | string | Free text — searches title, designer, description, significance, keywords |
| `discipline` | string | Exact: Product, Furniture, Graphic, Lighting, Architecture, Typography, Textile, Transport, Ceramic, Glass, Metalwork |
| `origin` | string | Exact: "Italy", "United Kingdom", "Germany", etc. |
| `year_from` | number | Minimum year (inclusive) |
| `year_to` | number | Maximum year (inclusive) |
| `movement` | string | Partial match against movement field |
| `connection_type` | string | Entries with at least one connection of this type |

Returns max 50 entry summaries: `{id, title, designer, year, discipline, origin, movement}`.

At least one parameter is required.

### get_entry

Retrieve a complete entry with all connections enriched with target context.

| Parameter | Type | Description |
|---|---|---|
| `id` | number | Entry ID (required) |

Returns the full entry object including enriched connections: each connection includes `{id, type, reason, target: {title, designer, year, discipline}}`. You get the connection target's context without a second call.

### find_path

Trace connection paths between two entries using breadth-first search.

| Parameter | Type | Description |
|---|---|---|
| `from_id` | number | Source entry ID (required) |
| `to_id` | number | Destination entry ID (required) |
| `max_hops` | number | Maximum path length, default 3, max 3 |

Returns up to 5 shortest paths. Each path has `hops` (number) and `steps` (array). Each step: `{entry: {id, title, designer, year, discipline, origin, movement}, connection: {type, reason, direction}}`. The final step has `connection: null`.

**Direction matters:** `forward` means the connection reason was written from this entry's perspective. `reverse` means it was written from the other entry's perspective — read it accordingly.

### get_cluster

Pull a subgraph of related entries radiating from a starting point.

| Parameter | Type | Description |
|---|---|---|
| `entry_id` | number | Centre entry ID (required) |
| `depth` | number | 1 = direct connections, 2 = two hops out. Default 1, max 2 |

Returns: `{centre, entries, connections, stats: {entry_count, connection_count, disciplines}, truncated}`. Capped at 100 entries, keeping most-connected nodes if truncated.

## Composition Patterns

The tools are designed to be composed:

- **Drill down:** `search_entries` → pick interesting result → `get_entry` for full detail
- **Trace a thread:** `get_entry` on two objects → `find_path` between them → `get_entry` on intermediate steps
- **Map a territory:** `search_entries` for a movement/discipline → `get_cluster` on the most connected result → follow interesting edges
- **Compare clusters:** `get_cluster` on two hub objects → compare which disciplines, connection types, and time periods each reaches

## Connection Types

Six typed connections. Each makes a specific critical claim about the relationship between two design objects.

| Type | Code | What It Argues |
|---|---|---|
| **Argument** | `argument` | Designed disagreement — opposing criteria applied to the same territory |
| **Lineage** | `lineage` | Transfer across time — a design logic reappearing in later work |
| **Material Thread** | `material` | Shared material, but the material means something different in each object |
| **Same Problem** | `sameProblem` | Same brief or challenge, different answer |
| **Zeitgeist** | `zeitgeist` | Parallel answers emerging from the same cultural moment |
| **Shared Method** | `method` | Same process or technique, different outcomes |

**The swap test:** If you can swap the object names in a connection reason and the text still reads plausible, the connection is not specific enough. Good connections are non-transferable.

**Reading connections:** Connection reasons are compressed critical arguments, not descriptions. They claim something about the relationship between two objects. Read them as arguments to be engaged with, not facts to be repeated.

## Quality Standard

All text in this archive is written to the standard of Deyan Sudjic or Alice Rawsthorn — precise, compressed, argued. British English throughout.

When presenting archive content to users:
- Preserve the critical voice — don't flatten arguments into neutral descriptions
- Present connections as claims that can be examined, not as established facts
- Highlight where connections create tension or surprise — that's where the insight lives
