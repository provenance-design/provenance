import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARCHIVE_PATH = resolve(__dirname, '..', 'app', 'data', 'archive.js');

export function loadArchive() {
  const content = readFileSync(ARCHIVE_PATH, 'utf-8');

  // Extract CONNECTION_TYPES object (single line in archive.js, so .* is safe)
  const ctMatch = content.match(/export const CONNECTION_TYPES\s*=\s*(\{.*\});/);
  const connectionTypes = ctMatch ? JSON.parse(ctMatch[1]) : {};

  // Extract DISCIPLINES array (single line in archive.js)
  const dMatch = content.match(/export const DISCIPLINES\s*=\s*(\[.*\]);/);
  const disciplines = dMatch ? JSON.parse(dMatch[1]) : [];

  // Extract ARCHIVE array — uses the same greedy regex as tools/validate.py.
  // Works because ARCHIVE is the last array export in the file.
  const archiveMatch = content.match(/export const ARCHIVE\s*=\s*(\[[\s\S]*\]);/);
  if (!archiveMatch) {
    throw new Error(`Could not find 'export const ARCHIVE' in ${ARCHIVE_PATH}`);
  }

  const entries = JSON.parse(archiveMatch[1]);

  // Build ID map: Map<id, entry>
  const idMap = new Map();
  for (const entry of entries) {
    idMap.set(entry.id, entry);
  }

  // Build bidirectional adjacency map: Map<id, Array<{targetId, type, reason, direction}>>
  const adjacency = new Map();
  for (const entry of entries) {
    if (!adjacency.has(entry.id)) adjacency.set(entry.id, []);
    for (const conn of (entry.connections || [])) {
      // Forward edge: this entry connects to conn.id
      adjacency.get(entry.id).push({
        targetId: conn.id,
        type: conn.type,
        reason: conn.reason,
        direction: 'forward',
        sourceId: entry.id
      });
      // Reverse edge: conn.id connects back to this entry
      if (!adjacency.has(conn.id)) adjacency.set(conn.id, []);
      adjacency.get(conn.id).push({
        targetId: entry.id,
        type: conn.type,
        reason: conn.reason,
        direction: 'reverse',
        sourceId: entry.id
      });
    }
  }

  return { entries, idMap, adjacency, connectionTypes, disciplines };
}

// Helper: create a summary object from an entry (used in search results, path steps, clusters)
export function summarise(entry) {
  return {
    id: entry.id,
    title: entry.title,
    designer: entry.designer,
    year: entry.year,
    discipline: entry.discipline,
    origin: entry.origin || null,
    movement: entry.movement || null
  };
}
