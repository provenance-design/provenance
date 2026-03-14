#!/usr/bin/env python3
"""
Provenance Archive — Topology Analyser
Network diagnostics. Run before and after merges.

Usage:
    python tools/topology.py                  # Full report on live archive
    python tools/topology.py --with-candidates  # Include candidates in analysis
    python tools/topology.py --hubs           # Hub report only
    python tools/topology.py --dead-ends      # Dead ends only
    python tools/topology.py --cross-discipline # Cross-discipline ratio only
"""

import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE_PATH = ROOT / "app" / "data" / "archive.js"
CANDIDATES_PATH = ROOT / "app" / "data" / "candidates.js"


def parse_js_array(path, var_name):
    content = path.read_text(encoding="utf-8")
    pattern = rf"export const {var_name}\s*=\s*(\[[\s\S]*\]);"
    match = re.search(pattern, content)
    if not match:
        print(f"ERROR: Could not find 'export const {var_name}' in {path}")
        sys.exit(1)
    return json.loads(match.group(1))


def load_entries(include_candidates=False):
    entries = parse_js_array(ARCHIVE_PATH, "ARCHIVE")
    if include_candidates and CANDIDATES_PATH.exists():
        entries += parse_js_array(CANDIDATES_PATH, "CANDIDATES")
    return entries


def build_graph(entries):
    """Build adjacency data from entries."""
    entry_map = {e["id"]: e for e in entries}
    # Total connections per node (outgoing + incoming)
    conn_count = Counter()
    # Adjacency list (bidirectional)
    adj = defaultdict(set)
    # Cross-discipline edges
    cross_discipline = 0
    same_discipline = 0
    # Connection types distribution
    type_counts = Counter()

    for entry in entries:
        eid = entry["id"]
        disc = entry.get("discipline", "")
        for conn in entry.get("connections", []):
            tid = conn.get("id")
            ctype = conn.get("type", "")
            conn_count[eid] += 1
            conn_count[tid] += 1
            adj[eid].add(tid)
            adj[tid].add(eid)
            type_counts[ctype] += 1

            target = entry_map.get(tid)
            if target:
                if target.get("discipline", "") != disc:
                    cross_discipline += 1
                else:
                    same_discipline += 1

    return entry_map, conn_count, adj, cross_discipline, same_discipline, type_counts


def report_hubs(entry_map, conn_count, top_n=20):
    """Report most-connected entries."""
    print(f"\n  TOP {top_n} HUBS (by total connections)")
    print(f"  {'ID':>5}  {'Conns':>5}  {'Discipline':<14} Title")
    print(f"  {'─'*5}  {'─'*5}  {'─'*14} {'─'*40}")
    for eid, count in conn_count.most_common(top_n):
        entry = entry_map.get(eid, {})
        title = entry.get("title", f"(external ref {eid})")[:40]
        disc = entry.get("discipline", "?")
        print(f"  {eid:>5}  {count:>5}  {disc:<14} {title}")


def report_dead_ends(entry_map, conn_count, threshold=2):
    """Report entries with too few connections."""
    dead = [(eid, count) for eid, count in conn_count.items()
            if count <= threshold and eid in entry_map]
    dead.sort(key=lambda x: x[1])

    print(f"\n  DEAD ENDS ({len(dead)} entries with <= {threshold} connections)")
    if len(dead) > 30:
        print(f"  Showing first 30 of {len(dead)}:")
        dead = dead[:30]
    print(f"  {'ID':>5}  {'Conns':>5}  {'Discipline':<14} Title")
    print(f"  {'─'*5}  {'─'*5}  {'─'*14} {'─'*40}")
    for eid, count in dead:
        entry = entry_map.get(eid, {})
        title = entry.get("title", "???")[:40]
        disc = entry.get("discipline", "?")
        print(f"  {eid:>5}  {count:>5}  {disc:<14} {title}")


def report_cross_discipline(cross, same):
    """Report cross-discipline connection ratio."""
    total = cross + same
    if total == 0:
        print("\n  No connections to analyse.")
        return
    ratio = cross / total * 100
    print(f"\n  CROSS-DISCIPLINE RATIO")
    print(f"  Cross-discipline: {cross} ({ratio:.1f}%)")
    print(f"  Same-discipline:  {same} ({100 - ratio:.1f}%)")
    if ratio >= 40:
        print(f"  Status: HEALTHY (target: >= 40%)")
    else:
        print(f"  Status: BELOW TARGET (target: >= 40%, current: {ratio:.1f}%)")


def report_discipline_balance(entries):
    """Report discipline distribution."""
    disc_counts = Counter(e.get("discipline", "Unknown") for e in entries)
    total = len(entries)
    print(f"\n  DISCIPLINE BALANCE ({total} entries)")
    print(f"  {'Discipline':<14} {'Count':>5}  {'%':>5}  Bar")
    print(f"  {'─'*14} {'─'*5}  {'─'*5}  {'─'*30}")
    for disc, count in disc_counts.most_common():
        pct = count / total * 100
        bar = "#" * int(pct / 2)
        print(f"  {disc:<14} {count:>5}  {pct:>4.1f}%  {bar}")


def report_connection_types(type_counts):
    """Report connection type distribution."""
    total = sum(type_counts.values())
    print(f"\n  CONNECTION TYPES ({total} total)")
    print(f"  {'Type':<14} {'Count':>5}  {'%':>5}")
    print(f"  {'─'*14} {'─'*5}  {'─'*5}")
    for ctype, count in type_counts.most_common():
        pct = count / total * 100
        print(f"  {ctype:<14} {count:>5}  {pct:>4.1f}%")


def report_tight_loops(adj, entry_map):
    """Find triangles where all three nodes have few external connections."""
    triangles = []
    visited = set()
    for a in adj:
        for b in adj[a]:
            if b <= a:
                continue
            for c in adj[a] & adj[b]:
                if c <= b:
                    continue
                tri = (a, b, c)
                # Count external connections (connections outside the triangle)
                external = 0
                for node in tri:
                    external += len(adj[node] - set(tri))
                if external <= 3:  # Very isolated triangle
                    triangles.append((tri, external))

    print(f"\n  TIGHT LOOPS ({len(triangles)} isolated triangles)")
    if triangles:
        print(f"  Triangles where all three nodes have <= 3 external connections:")
        for tri, ext in sorted(triangles, key=lambda x: x[1])[:15]:
            names = []
            for nid in tri:
                entry = entry_map.get(nid, {})
                names.append(f"{entry.get('title', '???')} [{nid}]")
            print(f"    {' -- '.join(names)} (external: {ext})")
    else:
        print(f"  None found.")


def report_orphans(entries, conn_count):
    """Entries with zero connections (not even referenced by others)."""
    orphans = [e for e in entries if conn_count.get(e["id"], 0) == 0]
    print(f"\n  ORPHANS ({len(orphans)} entries with zero connections)")
    for e in orphans[:20]:
        print(f"    [{e['id']}] {e.get('title', '???')} — {e.get('discipline', '?')}")
    if len(orphans) > 20:
        print(f"    ... and {len(orphans) - 20} more")


def main():
    args = sys.argv[1:]
    include_candidates = "--with-candidates" in args
    hubs_only = "--hubs" in args
    dead_only = "--dead-ends" in args
    cross_only = "--cross-discipline" in args
    show_all = not (hubs_only or dead_only or cross_only)

    label = "Archive + Candidates" if include_candidates else "Live Archive"
    entries = load_entries(include_candidates)

    print(f"\n{'='*60}")
    print(f"  Topology Report: {label} ({len(entries)} entries)")
    print(f"{'='*60}")

    entry_map, conn_count, adj, cross, same, type_counts = build_graph(entries)

    total_connections = sum(len(e.get("connections", [])) for e in entries)
    print(f"\n  Total entries: {len(entries)}")
    print(f"  Total connections: {total_connections}")
    print(f"  Avg connections per entry: {total_connections / len(entries):.1f}")

    if show_all or hubs_only:
        report_hubs(entry_map, conn_count)
    if show_all or dead_only:
        report_dead_ends(entry_map, conn_count)
    if show_all or cross_only:
        report_cross_discipline(cross, same)
    if show_all:
        report_discipline_balance(entries)
        report_connection_types(type_counts)
        report_tight_loops(adj, entry_map)
        report_orphans(entries, conn_count)

    print()


if __name__ == "__main__":
    main()
