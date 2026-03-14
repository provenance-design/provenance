# /topology

Run network topology analysis on the archive.

## Usage

- `/topology` — analyse the live archive
- `/topology candidates` — include candidates in the analysis

## Steps

1. Run the topology script:
   ```bash
   python tools/topology.py
   ```
   Add `--with-candidates` to include staging entries.

2. Report key metrics:
   - **Total entries and connections**
   - **Cross-discipline ratio** (target: 40%+)
   - **Top hubs** — objects with the most connections (flag any above 12)
   - **Dead ends** — objects with fewer than 3 connections
   - **Orphan clusters** — groups disconnected from the main network

3. Highlight problems:
   - Hubs above the 12-connection ceiling
   - Cross-discipline ratio below 40%
   - New dead ends or tight loops introduced by recent additions

4. Suggest specific fixes for any topology problems found.

## Reference

See `docs/topology-guide.md` for the full topology rebuild plan, known hubs, and discipline balance targets.
