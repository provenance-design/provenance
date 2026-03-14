# /merge

Merge candidates from `candidates.js` into the live `archive.js`.

## Usage

- `/merge all` — merge all candidates
- `/merge 937 938 939` — merge specific IDs
- `/merge 937-950` — merge a range
- `/merge dry-run` — preview without writing

## Steps

1. **Preview first.** Run with `--dry-run` to show what will be merged:
   ```bash
   python tools/merge.py --dry-run --all
   ```

2. **Check for candidate-to-candidate connections.** If candidates reference each other's IDs (normal for cohort batches), use `--skip-validation` to avoid false errors:
   ```bash
   python tools/merge.py --all --skip-validation
   ```

3. **Run the merge:**
   ```bash
   python tools/merge.py --ids 937 938 939
   # or
   python tools/merge.py --all
   ```

4. **Post-merge verification:**
   - Report the new entry count and connection count
   - Run `python tools/validate.py` to confirm zero errors
   - Remind about next steps: topology check, image sourcing, deploy

## What the tool does

- Moves entries from `candidates.js` to `archive.js`
- Strips staging-only fields (`status`, `notes`)
- Removes merged entries from `candidates.js`
- Checks for ID collisions before merging
- Runs validation automatically (unless `--skip-validation`)

## Safety

- Never merge without Neil's awareness
- Always run `--dry-run` first if unsure
- Use `--skip-validation` only when candidate-to-candidate connections are expected
