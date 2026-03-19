# Today Tab — Algorithmic Daily Object

**Date:** 2026-03-19
**Status:** Design approved, ready for implementation

## Summary

Replace the static Today view (currently hardcoded to `ARCHIVE[0]`) with an algorithmically rotating daily object. Add a subtle inline connection path teaser beneath the existing entry layout. Add OG metadata for social sharing.

## Constraints

- **Do not alter the existing Today view layout.** The entry display (image, description, significance, keywords, connections) stays exactly as-is.
- **No new files or dependencies.** All changes happen within existing files.
- **Client-side only.** Deterministic algorithm, no server state, no API routes. Works with Vercel static hosting.
- **Site stability is paramount.** The site is in a good state. Changes are isolated to the `featured` state initialisation and the featured view's render block.

## 1. Daily Selection Algorithm

**Location:** `app/page.js`, replacing `useState(() => ARCHIVE[0])`

**Approach:** Deterministic hash from the date string.

```
seed = hash("YYYY-MM-DD")  // e.g. hash("2026-03-19")
index = seed % ARCHIVE.length
featured = ARCHIVE[index]
```

**Hash function:** djb2 (initial seed 5381, multiply by 33, XOR each char code). No crypto dependency needed. Deterministic across all browsers.

**Date string:** Always UTC via `new Date().toISOString().slice(0, 10)`. This avoids timezone differences between Vercel's SSR and the client causing a React hydration mismatch.

**No setter needed:** The `useState` initialiser computes the entry once on mount. No `setFeatured` — the featured entry is stable for the session.

**Properties:**
- Same date → same entry, every time, for every visitor
- Different date → different entry (in practice — collisions are fine over 1,000 entries)
- No repeats tracking needed — the hash naturally distributes across the archive
- No weighting or variety logic in v1 — the hash provides sufficient pseudo-randomness across disciplines and eras over a month of daily picks

**Why no weighting in v1:** The archive is 1,000 entries across 11 disciplines. A simple hash will naturally cover variety over any 30-day window. Adding discipline balancing or connection-count weighting adds complexity for marginal benefit. Can be added later if the daily picks cluster.

## 2. Connection Path Teaser

**Location:** `app/page.js`, new element within the `view === 'featured'` render block, below the existing connections section.

**Design:** Inline trail (option A from brainstorming).

```
Follow the thread
Arco  lineage →  Parentesi  argument →  Mezzadro
```

- "Follow the thread" label: 9.5px, uppercase, `#B8A080`, matching existing section labels
- Entry names: 13.5px, font-weight 500, coloured by discipline using existing `PALETTE`
- Connection types: 10px, uppercase, `#C4A882`, with → arrow
- 2-3 hops from today's entry

**Path algorithm:**
- Start from today's entry
- At each hop, pick a connection deterministically using the same date seed
- Follow actual connections from `entry.connections[]` (only those whose target exists in `ARCHIVE`)
- If an entry has no outbound connections, stop the path short
- If the path is empty (zero hops), hide the teaser entirely — don't show "Follow the thread" with nothing after it
- Path is deterministic — same seed, same path, all day

**Behaviour:** Display only, not clickable. A teaser that shows the archive's connective structure.

## 3. OG Metadata for Social Sharing

**Location:** `app/layout.js` — update the existing metadata export, or add `generateMetadata` if dynamic metadata is needed.

**For the default/today URL (`provenancearchive.uk`):**
- `og:title` — entry title + designer + year (e.g. "Arco — Achille & Pier Giacomo Castiglioni, 1962")
- `og:description` — first ~150 characters of significance text
- `og:image` — entry image URL (local path or V&A framemark)
- `og:url` — `provenancearchive.uk`
- `twitter:card` — `summary_large_image`

**Challenge:** OG tags must be in the initial HTML for crawlers to read them. Since the daily selection is client-side, the OG tags can't reflect today's specific entry without SSR or a server component.

**Pragmatic solution for v1:** Use static OG tags that describe the archive itself, not the daily entry:
- Title: "Provenance — Today's Design Object"
- Description: "A curated archive of 1,000 design objects. A new entry featured daily."
- Image: a generic Provenance brand image or the site's existing OG image

**Future enhancement:** If entry-specific OG tags become important (e.g. for automated social posting), add a server component or API route that resolves the daily entry server-side. Not needed for v1.

## 4. Shareable URL

**Dropped from v1.** The bare URL (`provenancearchive.uk`) already shows today's entry since the featured view is the default landing. A `?today` parameter would be redundant. The existing `?entry=ID` deep links are preserved and unmodified.

## Files Changed

| File | Change | Risk |
|------|--------|------|
| `app/page.js` | Replace `ARCHIVE[0]` with daily algorithm; add path teaser to featured view | Low — isolated to featured state and render block |
| `app/layout.js` | Add/update static OG metadata tags | Minimal — metadata only |

## What This Does Not Change

- Archive view, Connection Map, About page, Detail view — untouched
- Data files (`archive.js`, `candidates.js`) — untouched
- Staging system — untouched
- Any existing URL handling (`?entry=ID`) — preserved
- Visual design of the Today entry layout — preserved exactly

## Testing

1. `npm run dev` — verify Today view shows a different entry than Arco
2. Change system date or modify the date string in code — verify different entries appear
3. Refresh multiple times on same day — verify same entry persists
4. Click through to Archive, Connection Map, About, back to Today — verify navigation works
5. Click an entry from Archive, verify detail view works
6. Check `?entry=ID` deep links still work
7. View page source — verify OG tags are present
8. `npm run build` — verify no build errors
9. Check browser console for React hydration mismatch warnings
10. Test on narrow viewport — verify connection path teaser wraps gracefully
