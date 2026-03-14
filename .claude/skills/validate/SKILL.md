# /validate

Run validation on the archive and/or candidates.

## Usage

- `/validate` — validate both archive and candidates
- `/validate candidates` — candidates only
- `/validate archive` — archive only

## Steps

1. Run the validation script:
   ```bash
   python tools/validate.py
   ```
   Add `--candidates` to validate only candidates. Add `--check-targets archive` to cross-check candidate connection targets against the archive.

2. Report results:
   - **Errors** (must fix): missing fields, invalid IDs, duplicate entries, invalid connection types, broken connection targets
   - **Warnings** (review): origin inconsistencies, hub threshold violations, short connection reasons

3. If errors found, summarise them grouped by type and suggest fixes.

4. If zero errors, confirm and report entry/connection counts.

## Notes

- Candidate-to-candidate connection targets are expected — they resolve when the batch merges. Do not report these as errors.
- Zero errors required before any merge or deploy.
- The validator also catches template language patterns in connection texts.
