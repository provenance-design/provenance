#!/usr/bin/env python3
"""
Provenance Archive — Merge Tool
Deterministic candidate-to-archive migration.

Usage:
    python tools/merge.py --ids 637 638 639       # Merge specific candidates
    python tools/merge.py --all                    # Merge all candidates
    python tools/merge.py --ids 637-650            # Merge a range
    python tools/merge.py --dry-run --all          # Preview without writing

Always runs validation before merging. Aborts on errors.
"""

import json
import re
import sys
import subprocess
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE_PATH = ROOT / "app" / "data" / "archive.js"
CANDIDATES_PATH = ROOT / "app" / "data" / "candidates.js"
VALIDATE_SCRIPT = ROOT / "tools" / "validate.py"

# Fields to strip when merging (staging-only metadata)
STAGING_FIELDS = {"status", "notes"}


def parse_js_file(path, var_name):
    """Parse a JS file and return (preamble, entries).
    Preamble is everything before 'export const VAR_NAME = ...'.
    """
    content = path.read_text(encoding="utf-8")

    if var_name == "ARCHIVE":
        # Archive has CONNECTION_TYPES and DISCIPLINES before the array
        pattern = re.compile(
            r'([\s\S]*?)export const ARCHIVE\s*=\s*(\[[\s\S]*\]);',
            re.DOTALL
        )
    else:
        # Candidates may have comments before the array
        pattern = re.compile(
            r'([\s\S]*?)export const CANDIDATES\s*=\s*(\[[\s\S]*\]);',
            re.DOTALL
        )

    match = pattern.search(content)
    if not match:
        print(f"ERROR: Could not parse {path}")
        sys.exit(1)

    preamble = match.group(1)
    entries = json.loads(match.group(2))
    return preamble, entries


def write_js_file(path, preamble, var_name, entries):
    """Write entries back to a JS file."""
    json_str = json.dumps(entries, indent=2, ensure_ascii=False)
    content = f"{preamble}export const {var_name} = {json_str};\n"
    path.write_text(content, encoding="utf-8")


def parse_id_args(args):
    """Parse --ids arguments into a set of integer IDs."""
    ids = set()
    for arg in args:
        if "-" in arg and not arg.startswith("-"):
            # Range: 637-650
            parts = arg.split("-")
            if len(parts) == 2:
                try:
                    start, end = int(parts[0]), int(parts[1])
                    ids.update(range(start, end + 1))
                    continue
                except ValueError:
                    pass
        try:
            ids.add(int(arg))
        except ValueError:
            print(f"WARNING: Skipping invalid ID '{arg}'")
    return ids


def strip_staging_fields(entry):
    """Remove staging-only fields from an entry."""
    return {k: v for k, v in entry.items() if k not in STAGING_FIELDS}


def main():
    args = sys.argv[1:]

    dry_run = "--dry-run" in args
    merge_all = "--all" in args

    # Parse IDs
    target_ids = set()
    if "--ids" in args:
        idx = args.index("--ids")
        id_args = []
        for a in args[idx + 1:]:
            if a.startswith("--"):
                break
            id_args.append(a)
        target_ids = parse_id_args(id_args)

    if not merge_all and not target_ids:
        print("Usage: python tools/merge.py --all | --ids 637 638 639 | --ids 637-650")
        print("       Add --dry-run to preview without writing.")
        sys.exit(1)

    # Load both files
    archive_preamble, archive = parse_js_file(ARCHIVE_PATH, "ARCHIVE")
    candidates_preamble, candidates = parse_js_file(CANDIDATES_PATH, "CANDIDATES")

    archive_ids = {e["id"] for e in archive}
    candidate_map = {e["id"]: e for e in candidates}

    # Determine which candidates to merge
    if merge_all:
        to_merge = [e for e in candidates]
    else:
        to_merge = []
        for cid in sorted(target_ids):
            if cid in candidate_map:
                to_merge.append(candidate_map[cid])
            else:
                print(f"WARNING: Candidate ID {cid} not found in candidates.js")

    if not to_merge:
        print("No candidates to merge.")
        sys.exit(0)

    # Check for ID collisions
    merge_ids = {e["id"] for e in to_merge}
    collisions = merge_ids & archive_ids
    if collisions:
        print(f"ERROR: ID collision with existing archive entries: {sorted(collisions)}")
        print("Resolve ID conflicts before merging.")
        sys.exit(1)

    # Preview
    print(f"\n{'='*60}")
    print(f"  Merge Preview")
    print(f"{'='*60}")
    print(f"  Candidates to merge: {len(to_merge)}")
    print(f"  Archive before: {len(archive)} entries")
    print(f"  Archive after:  {len(archive) + len(to_merge)} entries")
    print(f"\n  Entries:")
    for e in to_merge:
        conns = len(e.get("connections", []))
        print(f"    [{e['id']}] {e.get('title', '???')} — {e.get('discipline', '?')} ({conns} connections)")

    if dry_run:
        print(f"\n  DRY RUN — no files modified.")
        sys.exit(0)

    # Run validation (skip target checks when merging all — candidate-to-candidate refs resolve on merge)
    skip_validation = "--skip-validation" in sys.argv
    if not skip_validation:
        print(f"\n  Running validation...")
        result = subprocess.run(
            [sys.executable, str(VALIDATE_SCRIPT), "--candidates", "--check-targets", "archive"],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            print(f"\n  Validation FAILED. Fix errors before merging.")
            print(result.stdout)
            if result.stderr:
                print(result.stderr)
            sys.exit(1)
        print(f"  Validation passed.")
    else:
        print(f"\n  Skipping validation (--skip-validation).")

    # Merge
    merged_entries = [strip_staging_fields(e) for e in to_merge]
    archive.extend(merged_entries)

    # Remove merged entries from candidates
    remaining = [e for e in candidates if e["id"] not in merge_ids]

    # Write both files
    write_js_file(ARCHIVE_PATH, archive_preamble, "ARCHIVE", archive)

    # Update candidates comment
    if remaining:
        remaining_ids = sorted(e["id"] for e in remaining)
        comment = (f"// Provenance Archive — Staging Candidates\n"
                   f"// {len(remaining)} entries (IDs {remaining_ids[0]}–{remaining_ids[-1]})\n"
                   f"// Updated: {datetime.now().strftime('%Y-%m-%d')}\n\n")
    else:
        comment = (f"// Provenance Archive — Staging Candidates\n"
                   f"// Empty — all candidates merged\n"
                   f"// Updated: {datetime.now().strftime('%Y-%m-%d')}\n\n")

    write_js_file(CANDIDATES_PATH, comment, "CANDIDATES", remaining)

    print(f"\n  MERGED {len(to_merge)} entries into archive.js")
    print(f"  Archive now: {len(archive)} entries")
    print(f"  Candidates remaining: {len(remaining)}")
    print(f"\n  Next steps:")
    print(f"    1. Review the changes: git diff app/data/")
    print(f"    2. Run topology check: python tools/topology.py")
    print(f"    3. Commit when satisfied: git add . && git commit -m \"Merge {len(to_merge)} entries\"")


if __name__ == "__main__":
    main()
