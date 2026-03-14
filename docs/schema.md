# Archive Data Schema

Each entry in `archive.js` follows this structure:

```javascript
{
  id: 616,                          // Unique integer
  title: "Rex Chair",
  designer: "Ineke Hans",
  year: 2021,
  discipline: "Furniture",          // One of the DISCIPLINES constants
  manufacturer: "Circuform",
  origin: "Netherlands",            // Country of origin
  description: "...",               // How the object works — material, process, form
  significance: "...",              // Why it matters — what arguments it enables
  movement: "Circular Design",
  collection: "Design Museum Gent, Museum Boijmans Van Beuningen",
  keywords: ["circular economy", "recycled nylon", "PA6", "injection moulding"],
  imageUrl: "/images/616.jpg",
  wikiTitle: "Rex_Chair",           // Optional — exact Wikipedia article title for fallback image
  connections: [
    {
      id: 10,                       // Target entry ID
      type: "argument",             // One of: argument, lineage, material, sameProblem, zeitgeist, method
      reason: "..."                 // The argued connection text
    }
  ]
}
```

## Exports

The file exports three constants:
- `CONNECTION_TYPES` — array of connection type objects with `id`, `label`, `color`, `icon`
- `DISCIPLINES` — array of discipline strings
- `ARCHIVE` — the main data array

## Candidates-Only Fields

Entries in `candidates.js` may also have `status` and `notes` fields (used during editorial review). These are stripped automatically when merging into the live archive via `tools/merge.py`.

## Disciplines

Product, Furniture, Graphic, Lighting, Architecture, Typography, Textile, Transport, Ceramic, Glass, Metalwork

## Editing archive.js

The file is large (~2MB, 30,000+ lines). **Read with offset/limit — do not load the whole file at once.** When making changes:

1. Parse with Python using regex:
   ```python
   import re, json
   content = open('app/data/archive.js').read()
   match = re.search(r'export const ARCHIVE\s*=\s*(\[[\s\S]*\]);', content)
   archive = json.loads(match.group(1))
   ```
2. Make changes programmatically
3. Write back with preamble intact (CONNECTION_TYPES and DISCIPLINES exports must precede the ARCHIVE array)
4. Verify after writing: count entries and total connections
5. Confirm changes with Neil before committing

## Data Integrity Rules

- Connections reference entries by `id` — target IDs **must** be valid IDs in the live archive or the current candidates batch
- Broken references produce dead links on the site
- `candidates.js` is the active working file between batches
- When merging candidates, assign IDs sequentially from the next available integer after the current highest ID in `archive.js`
- Candidate-to-candidate connections are by design — batches are drafted as cohorts with internal cross-references. These resolve when the batch merges into the archive.

## Image Convention

- Local files at `/public/images/{id}.jpg` (one per entry, named by integer ID)
- `imageUrl` field points to `/images/{id}.jpg`
- Fallback: Wikipedia API via `wikiTitle` field (legacy system)
- If neither exists, a typographic fallback plate is displayed
- Wikipedia/Wikimedia Commons images are **excluded** as manually-sourced images
