# Provenance Memory

## Project state
- Archive: 598 live entries (IDs 1–636) in archive.js
- Candidates: 217 staging entries (IDs 637–855) in candidates.js
- Combined target: 815 entries
- Candidates have had 28 connection rewires for cross-discipline spread + hub reduction

## Key files (line counts)
- archive.js: ~25,800 lines
- candidates.js: ~8,900 lines
- page.js: 333 lines (main site)
- staging/page.js: 641 lines (staging review with enhanced features)
- staging-page.js: 369 lines (older staging version, likely superseded)

## Architecture notes
- Single-page app with state-driven views (featured/archive/detail/connections/about)
- ImageWithFallback component handles Wikipedia image fetching with graceful degradation
- Staging page strips `status` and `notes` fields from candidates before display
- Staging is password-protected ("provenance2026")

## User preferences
- NEVER add "Co-Authored-By: Claude" or any AI attribution to git commits
- No AI credit lines in code, commits, or anywhere in the project

## Patterns observed
- Git commits describe batch sizes: "194 staging candidates", "94 staging candidates, hub-audited"
- Connection reasons are written in specific curatorial voice — argued comparisons, not labels
- Disciplines have assigned palette colours in PALETTE const
- Two staging files exist: staging-page.js (older, simpler) and staging/page.js (newer, more features)
