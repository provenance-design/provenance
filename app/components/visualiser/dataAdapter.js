/**
 * Provenance Network Visualiser — Data Adapter
 *
 * Transforms ARCHIVE into the graph structure used by the visualiser.
 * Pure function, no side effects. Computed once at module scope.
 */

import { ARCHIVE } from '../../data/archive';

/**
 * Build the complete graph structure from the archive data.
 * Returns nodes, edges, adjacency maps, and computed metrics.
 */
export function buildGraph(archive) {
  const idSet = new Set(archive.map(e => e.id));

  // Count total connections per node (outgoing + incoming)
  const connCounts = new Map();
  archive.forEach(e => {
    const outgoing = e.connections ? e.connections.length : 0;
    connCounts.set(e.id, (connCounts.get(e.id) || 0) + outgoing);
    if (e.connections) {
      e.connections.forEach(c => {
        if (idSet.has(c.id)) {
          connCounts.set(c.id, (connCounts.get(c.id) || 0) + 1);
        }
      });
    }
  });

  // Build node array
  const nodes = archive.map(e => ({
    id: e.id,
    title: e.title,
    designer: e.designer,
    year: e.year,
    discipline: e.discipline,
    connectionCount: connCounts.get(e.id) || 0,
    // Position initialised by ForceEngine
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  }));

  // Build edge array with full connection data
  const edges = [];
  archive.forEach(e => {
    if (e.connections) {
      e.connections.forEach(c => {
        if (idSet.has(c.id)) {
          edges.push({
            source: e.id,
            target: c.id,
            type: c.type,
            reason: c.reason,
          });
        }
      });
    }
  });

  // Build adjacency map (bidirectional)
  const adjacency = new Map();
  edges.forEach(edge => {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
    if (!adjacency.has(edge.target)) adjacency.set(edge.target, []);
    adjacency.get(edge.source).push(edge);
    adjacency.get(edge.target).push(edge);
  });

  // Node lookup by ID
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Discipline groups
  const disciplineGroups = new Map();
  nodes.forEach(n => {
    if (!disciplineGroups.has(n.discipline)) disciplineGroups.set(n.discipline, []);
    disciplineGroups.get(n.discipline).push(n);
  });

  // Connection type distribution
  const typeDistribution = {};
  edges.forEach(e => {
    typeDistribution[e.type] = (typeDistribution[e.type] || 0) + 1;
  });

  // Hub detection (top 10 by connection count)
  const sortedByConns = [...nodes].sort((a, b) => b.connectionCount - a.connectionCount);
  const hubs = sortedByConns.slice(0, 10);

  // Dead ends (3 or fewer connections)
  const deadEnds = nodes.filter(n => n.connectionCount <= 3);

  return {
    nodes,
    edges,
    adjacency,
    nodeMap,
    disciplineGroups,
    typeDistribution,
    hubs,
    deadEnds,
    stats: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      disciplineCount: disciplineGroups.size,
      avgConnections: edges.length * 2 / nodes.length,
      maxConnections: sortedByConns[0]?.connectionCount || 0,
      minConnections: sortedByConns[sortedByConns.length - 1]?.connectionCount || 0,
    },
  };
}

// Pre-computed graph from live archive data
export const GRAPH = buildGraph(ARCHIVE);

/**
 * Get the full archive entry for a given ID.
 * Used for micro-level detail display.
 */
export function getEntry(id) {
  return ARCHIVE.find(item => item.id === id);
}
