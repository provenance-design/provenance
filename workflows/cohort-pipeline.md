# Cohort Pipeline

The end-to-end process for adding a themed batch of 50 entries to the archive.

## Inputs

- **Theme**: discipline, period, geography, or concept (e.g. "50 Japanese design objects, 1950–2000")
- **Target count**: 50 entries per cohort
- **Current archive state**: run `python tools/topology.py` first to know what gaps exist

## Steps

### 1. Research

**Agent:** design-provenance-researcher

Source candidate objects for the theme. For each object, provide: title, designer, year, manufacturer, origin, discipline, collection, movement. Verify against museum databases (V&A, Cooper Hewitt, MoMA, Vitra). Flag anything uncertain.

**Output:** List of ~60 objects (over-source by 20% to allow cuts).

### 2. Duplicate Check

**Tool:** `python tools/validate.py --candidates --check-targets archive`

Before writing any entries, check proposed titles and designers against the existing archive and candidates. Kill duplicates early.

### 3. Draft Entries

Write entries into `candidates.js` following the archive schema. For each entry:
- Description: how the object works (material, process, form). 3–4 sentences.
- Significance: why it matters (what arguments it enables). 2–3 sentences.
- Connections Tier 1: 2–3 connections within the cohort.
- Connections Tier 2: 2–3 connections to the existing archive. Favour cross-cluster bridges. Avoid overconnected hubs.
- Keywords: 5–7 specific terms.
- imageUrl: leave as empty string (images sourced separately).

**Quality standard:** Every connection must be non-transferable. If you can swap the object names and the text still reads plausible, rewrite.

### 4. Validate

**Tool:** `python tools/validate.py`

Run full validation. Fix all errors. Review warnings.

### 5. Curate

**Agent:** design-curator

Review the batch for:
- Canonical accuracy (dates, materials, manufacturers)
- Connection quality (A/B/C grading)
- Discipline balance within the cohort
- Missing obvious connections

Rewrite anything graded C. Sharpen anything graded B.

### 6. Topology Check

**Tool:** `python tools/topology.py --with-candidates`

Check:
- Are candidates creating cross-discipline bridges or clustering?
- Are any existing hubs getting overloaded?
- Are there orphan candidates with no connections to the main network?
- What's the cross-discipline ratio before and after?

### 7. Neil Reviews

Deploy staging: candidates are visible at `provenancearchive.uk/staging` (password-gated; see `app/staging/page.js`).

Neil reviews entries, connections, and topology. Iterate as needed.

### 8. Merge

**Tool:** `python tools/merge.py --ids [approved IDs]`

Or `python tools/merge.py --all` if the entire batch is approved.

The tool:
- Runs validation automatically
- Moves approved entries from candidates.js to archive.js
- Strips staging-only fields
- Removes merged entries from candidates.js

### 9. Images

Launch parallel Haiku agents in batches of ~40 entries each. Each agent:

1. Reads its batch from `.tmp/image_batch_N.json`
2. For each entry: **WebSearch** `[title] [designer]` → find museum/designer page → **WebFetch** to extract image URL → **curl** to `public/images/{id}.jpg`
3. Reports successes and failures

Expected hit rate: ~60%. Graphic design, typography, and some contemporary/digital entries often need manual sourcing — museum sites block scraping and typeface specimens aren't easily downloadable.

**Neil verifies:**
Every image must be eyeballed. Automated sourcing cannot reliably verify that an image shows the correct object. This step is not optional. Deploy images to staging, review at `provenancearchive.uk/staging`, flag any wrong images.

No Wikipedia/Wikimedia Commons images — ever.

### Model hierarchy

| Task | Model | Reason |
|------|-------|--------|
| Image sourcing (web search + download) | Haiku | Mechanical — one search per object |
| Fact-checking entries | Haiku/Sonnet | Web search + basic reasoning |
| Entry drafting (descriptions, significance) | Sonnet | Good prose, cheaper than Opus |
| Connection quality review | Sonnet | Needs design knowledge, not full Opus |
| Writing connection texts | Opus | Genuine curatorial reasoning |
| Validation, topology, merge | Tools | Deterministic, zero tokens |

### 10. Deploy

```bash
git add app/data/archive.js app/data/candidates.js public/images/
git commit -m "Add [n] entries: [theme description]"
git push
```

Run `python tools/validate.py` before pushing to catch errors. Verify at provenancearchive.uk after ~60 seconds.

### 11. Post-Merge Topology

**Tool:** `python tools/topology.py`

Run on the live archive to confirm the merge improved the network. Compare against the pre-merge report from Step 6.

## Completion Criteria

- All entries pass validation (zero errors)
- Cross-discipline ratio >= 40%
- No new entries connect to overloaded hubs without pruning
- All connection texts are A-grade (non-transferable, argued, specific)
- Neil has signed off
