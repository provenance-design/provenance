#!/usr/bin/env python3
"""
Provenance Archive — Validator
The guardrail. Run before every merge.

Usage:
    python tools/validate.py                      # Validate both archive and candidates
    python tools/validate.py --archive            # Validate archive only
    python tools/validate.py --candidates         # Validate candidates only
    python tools/validate.py --candidates --check-targets archive
                                                  # Validate candidates, check connection
                                                  # targets exist in archive too
"""

import json
import re
import sys
import os
from collections import Counter
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

REQUIRED_FIELDS = ["id", "title", "designer", "year", "discipline", "description",
                   "significance", "connections", "keywords"]

VALID_DISCIPLINES = [
    "Product", "Furniture", "Graphic", "Lighting", "Architecture",
    "Typography", "Textile", "Transport", "Ceramic", "Glass", "Metalwork"
]

VALID_CONNECTION_TYPES = ["argument", "lineage", "material", "sameProblem", "zeitgeist", "method"]

# Hub ceiling — warn if connecting to these IDs
OVERCONNECTED_HUBS = {
    13: "London Underground Map",
    11: "606 Universal Shelving System",
    14: "Penguin Books",
    15: "Pompidou Centre",
    56: "IBM Logo / Paul Rand",
}

HUB_WARNING_THRESHOLD = 80  # warn if an entry has this many total connections

ORIGIN_VARIANTS = {
    "United Kingdom": ["England", "Great Britain", "London", "Britain", "UK", "United Kingdom"],
    "United States": ["USA", "United States"],
}

# Template language patterns to flag in connection reasons
TEMPLATE_PATTERNS = [
    r"^Both ",
    r"^Where .+ does .+, .+ does",
    r"explore the boundaries between",
    r"Near-contemporary responses",
]

# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE_PATH = ROOT / "app" / "data" / "archive.js"
CANDIDATES_PATH = ROOT / "app" / "data" / "candidates.js"


def parse_js_array(path, var_name):
    """Extract a JS array export from a .js file and parse as JSON."""
    content = path.read_text(encoding="utf-8")
    # Match: export const VAR_NAME = [...];
    pattern = rf"export const {var_name}\s*=\s*(\[[\s\S]*\]);"
    match = re.search(pattern, content)
    if not match:
        print(f"ERROR: Could not find 'export const {var_name}' in {path}")
        sys.exit(1)
    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError as e:
        print(f"ERROR: JSON parse failed in {path}: {e}")
        sys.exit(1)


def load_archive():
    return parse_js_array(ARCHIVE_PATH, "ARCHIVE")


def load_candidates():
    return parse_js_array(CANDIDATES_PATH, "CANDIDATES")


# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------

class ValidationResult:
    def __init__(self):
        self.errors = []
        self.warnings = []

    def error(self, msg):
        self.errors.append(msg)

    def warn(self, msg):
        self.warnings.append(msg)

    @property
    def ok(self):
        return len(self.errors) == 0

    def summary(self):
        lines = []
        if self.errors:
            lines.append(f"\n  ERRORS ({len(self.errors)}):")
            for e in self.errors:
                lines.append(f"    - {e}")
        if self.warnings:
            lines.append(f"\n  WARNINGS ({len(self.warnings)}):")
            for w in self.warnings:
                lines.append(f"    - {w}")
        if self.ok and not self.warnings:
            lines.append("\n  All checks passed.")
        return "\n".join(lines)


def check_required_fields(entries, result):
    """Check all required fields are present and correctly typed."""
    for entry in entries:
        eid = entry.get("id", "???")
        title = entry.get("title", "???")
        label = f"[{eid}] {title}"

        for field in REQUIRED_FIELDS:
            if field not in entry:
                result.error(f"{label}: missing required field '{field}'")

        # Type checks
        if "id" in entry and not isinstance(entry["id"], int):
            result.error(f"{label}: 'id' must be an integer, got {type(entry['id']).__name__}")
        if "year" in entry and not isinstance(entry["year"], int):
            result.error(f"{label}: 'year' must be an integer, got {type(entry['year']).__name__}")
        if "connections" in entry and not isinstance(entry["connections"], list):
            result.error(f"{label}: 'connections' must be a list")
        if "keywords" in entry and not isinstance(entry["keywords"], list):
            result.error(f"{label}: 'keywords' must be a list")


def check_disciplines(entries, result):
    """Check discipline values are valid."""
    for entry in entries:
        eid = entry.get("id", "???")
        title = entry.get("title", "???")
        disc = entry.get("discipline")
        if disc and disc not in VALID_DISCIPLINES:
            result.error(f"[{eid}] {title}: invalid discipline '{disc}'. "
                         f"Valid: {', '.join(VALID_DISCIPLINES)}")


def check_duplicate_entries(entries, result):
    """Check for duplicate entries by title+designer."""
    seen = {}
    for entry in entries:
        key = (entry.get("title", "").lower().strip(),
               entry.get("designer", "").lower().strip())
        eid = entry.get("id", "???")
        if key in seen:
            result.error(f"[{eid}] '{entry.get('title')}' by {entry.get('designer')} "
                         f"duplicates [{seen[key]}]")
        else:
            seen[key] = eid


def check_duplicate_ids(entries, result):
    """Check for duplicate IDs."""
    seen = {}
    for entry in entries:
        eid = entry.get("id")
        if eid in seen:
            result.error(f"Duplicate ID {eid}: '{entry.get('title')}' and '{seen[eid]}'")
        else:
            seen[eid] = entry.get("title", "???")


def check_connections(entries, valid_ids, result):
    """Check connection integrity."""
    for entry in entries:
        eid = entry.get("id", "???")
        title = entry.get("title", "???")
        label = f"[{eid}] {title}"
        connections = entry.get("connections", [])

        seen_connections = set()
        for conn in connections:
            target_id = conn.get("id")
            conn_type = conn.get("type")
            reason = conn.get("reason", "")

            # Self-reference
            if target_id == eid:
                result.error(f"{label}: self-referencing connection")

            # Target exists
            if valid_ids and target_id not in valid_ids:
                result.error(f"{label}: connection target ID {target_id} does not exist")

            # Valid connection type
            if conn_type not in VALID_CONNECTION_TYPES:
                result.error(f"{label}: invalid connection type '{conn_type}'")

            # Duplicate connection (same target + same type)
            conn_key = (target_id, conn_type)
            if conn_key in seen_connections:
                result.warn(f"{label}: duplicate connection to ID {target_id} ({conn_type})")
            seen_connections.add(conn_key)

            # Empty reason
            if not reason or not reason.strip():
                result.error(f"{label}: empty connection reason for target {target_id}")

            # Template language
            for pattern in TEMPLATE_PATTERNS:
                if re.search(pattern, reason):
                    result.warn(f"{label}: template language in connection to {target_id} "
                                f"(matches: {pattern})")
                    break

            # Hub warning
            if target_id in OVERCONNECTED_HUBS:
                result.warn(f"{label}: connects to overloaded hub "
                            f"'{OVERCONNECTED_HUBS[target_id]}' (ID {target_id})")


def check_origins(entries, result):
    """Flag inconsistent origin values."""
    origins = Counter()
    for entry in entries:
        origin = entry.get("origin", "")
        if origin:
            origins[origin] += 1

    for canonical, variants in ORIGIN_VARIANTS.items():
        found = {v: origins[v] for v in variants if origins[v] > 0}
        if len(found) > 1:
            detail = ", ".join(f"'{k}' ({v}x)" for k, v in found.items())
            result.warn(f"Origin inconsistency: {detail} — consider normalising to '{canonical}'")


def check_hub_overload(entries, result):
    """Flag entries with excessive connections."""
    # Count total connections (outgoing + incoming)
    conn_count = Counter()
    for entry in entries:
        eid = entry.get("id")
        outgoing = len(entry.get("connections", []))
        conn_count[eid] += outgoing
        for conn in entry.get("connections", []):
            conn_count[conn.get("id")] += 1

    for eid, count in conn_count.most_common():
        if count >= HUB_WARNING_THRESHOLD:
            title = next((e.get("title") for e in entries if e.get("id") == eid), "???")
            result.warn(f"[{eid}] {title}: {count} total connections (threshold: {HUB_WARNING_THRESHOLD})")
        else:
            break


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def validate(entries, label, valid_ids=None):
    """Run all checks on a set of entries."""
    result = ValidationResult()
    print(f"\n{'='*60}")
    print(f"  Validating: {label} ({len(entries)} entries)")
    print(f"{'='*60}")

    check_required_fields(entries, result)
    check_disciplines(entries, result)
    check_duplicate_ids(entries, result)
    check_duplicate_entries(entries, result)
    check_connections(entries, valid_ids, result)
    check_origins(entries, result)
    check_hub_overload(entries, result)

    print(result.summary())
    return result


def main():
    args = sys.argv[1:]
    do_archive = "--archive" in args or not any(a.startswith("--") for a in args)
    do_candidates = "--candidates" in args or not any(a.startswith("--") for a in args)
    check_targets_in_archive = "--check-targets" in args and "archive" in args

    results = []

    archive = load_archive() if (do_archive or check_targets_in_archive) else []
    candidates = load_candidates() if do_candidates else []

    archive_ids = {e["id"] for e in archive} if archive else set()
    candidate_ids = {e["id"] for e in candidates} if candidates else set()

    if do_archive:
        r = validate(archive, "Live Archive", valid_ids=archive_ids)
        results.append(r)

    if do_candidates:
        # Candidates can reference other candidates or (optionally) archive entries
        valid_ids = candidate_ids.copy()
        if check_targets_in_archive:
            valid_ids |= archive_ids
        r = validate(candidates, "Staging Candidates", valid_ids=valid_ids)
        results.append(r)

    # Cross-file duplicate check
    if do_archive and do_candidates:
        print(f"\n{'='*60}")
        print(f"  Cross-file duplicate check")
        print(f"{'='*60}")
        cross = ValidationResult()
        archive_titles = {}
        for e in archive:
            key = (e.get("title", "").lower().strip(),
                   e.get("designer", "").lower().strip())
            archive_titles[key] = e.get("id")
        for e in candidates:
            key = (e.get("title", "").lower().strip(),
                   e.get("designer", "").lower().strip())
            if key in archive_titles:
                cross.error(f"Candidate [{e.get('id')}] '{e.get('title')}' by {e.get('designer')} "
                            f"already exists in archive as [{archive_titles[key]}]")
        # Also check ID collisions
        overlap = archive_ids & candidate_ids
        if overlap:
            cross.error(f"ID collision between archive and candidates: {sorted(overlap)}")
        print(cross.summary())
        results.append(cross)

    # Final summary
    total_errors = sum(len(r.errors) for r in results)
    total_warnings = sum(len(r.warnings) for r in results)
    print(f"\n{'='*60}")
    print(f"  TOTAL: {total_errors} errors, {total_warnings} warnings")
    print(f"{'='*60}")

    sys.exit(1 if total_errors > 0 else 0)


if __name__ == "__main__":
    main()
