import { summarise } from './data-loader.js';

/**
 * BFS with multi-parent tracking.
 * Returns up to 5 shortest paths between fromId and toId.
 */
export function findPaths(fromId, toId, adjacency, idMap, maxHops = 3) {
  // Same entry — return trivial path
  if (fromId === toId) {
    const entry = idMap.get(fromId);
    if (!entry) return [];
    return [{
      hops: 0,
      steps: [{ entry: summarise(entry), connection: null }]
    }];
  }

  if (!idMap.has(fromId) || !idMap.has(toId)) return [];

  // BFS: for each node, store all (parent, edge) pairs at the shortest depth
  // parents: Map<nodeId, Array<{parentId, edge}>>
  const parents = new Map();
  const depth = new Map(); // Map<nodeId, number>

  depth.set(fromId, 0);
  parents.set(fromId, []);

  const queue = [fromId];
  let found = false;
  let targetDepth = Infinity;

  while (queue.length > 0) {
    const current = queue.shift();
    const currentDepth = depth.get(current);

    // Don't expand beyond maxHops or beyond the depth where we found the target
    if (currentDepth >= maxHops || currentDepth >= targetDepth) continue;

    const edges = adjacency.get(current) || [];
    for (const edge of edges) {
      const nextId = edge.targetId;
      const nextDepth = currentDepth + 1;

      if (!depth.has(nextId)) {
        // First time seeing this node
        depth.set(nextId, nextDepth);
        parents.set(nextId, [{ parentId: current, edge }]);
        queue.push(nextId);

        if (nextId === toId) {
          found = true;
          targetDepth = nextDepth;
        }
      } else if (depth.get(nextId) === nextDepth) {
        // Same depth — record additional parent for alternative paths
        parents.get(nextId).push({ parentId: current, edge });

        if (nextId === toId) found = true;
      }
      // If depth.get(nextId) < nextDepth, skip — we already found a shorter way
    }
  }

  if (!found) return [];

  // Backtrack from toId to reconstruct up to 5 paths
  const paths = [];
  const MAX_PATHS = 5;

  function backtrack(nodeId, pathSoFar) {
    if (paths.length >= MAX_PATHS) return;

    if (nodeId === fromId) {
      // pathSoFar is in reverse order (toId → fromId), so reverse it
      const steps = pathSoFar.slice().reverse();
      paths.push({
        hops: steps.length - 1,
        steps
      });
      return;
    }

    for (const { parentId, edge } of parents.get(nodeId)) {
      if (paths.length >= MAX_PATHS) return;
      const step = {
        entry: summarise(idMap.get(parentId)),
        connection: {
          type: edge.type,
          reason: edge.reason,
          direction: edge.direction
        }
      };
      backtrack(parentId, [...pathSoFar, step]);
    }
  }

  // Start backtracking from toId
  const destinationStep = { entry: summarise(idMap.get(toId)), connection: null };
  backtrack(toId, [destinationStep]);

  return paths.sort((a, b) => a.hops - b.hops);
}
