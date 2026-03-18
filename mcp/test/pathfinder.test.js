import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { findPaths } from '../pathfinder.js';
import { loadArchive } from '../data-loader.js';

const { idMap, adjacency } = loadArchive();

describe('findPaths', () => {
  it('finds a direct connection (1 hop)', () => {
    // Arco (1) connects directly to entry 8
    const result = findPaths(1, 8, adjacency, idMap, 3);
    assert.ok(result.length > 0);
    assert.equal(result[0].hops, 1);
    assert.equal(result[0].steps[0].entry.id, 1);
    assert.equal(result[0].steps[1].entry.id, 8);
    assert.equal(result[0].steps[1].connection, null); // destination has no connection
    assert.ok(result[0].steps[0].connection !== null);
  });

  it('returns empty array when no path exists within max_hops', () => {
    // Use max_hops=0 — should find nothing
    const result = findPaths(1, 8, adjacency, idMap, 0);
    assert.equal(result.length, 0);
  });

  it('returns at most 5 paths', () => {
    // Pick two well-connected entries — should have multiple paths
    const result = findPaths(1, 2, adjacency, idMap, 3);
    assert.ok(result.length <= 5);
  });

  it('handles from_id === to_id', () => {
    const result = findPaths(1, 1, adjacency, idMap, 3);
    assert.equal(result.length, 1);
    assert.equal(result[0].hops, 0);
    assert.equal(result[0].steps.length, 1);
    assert.equal(result[0].steps[0].entry.id, 1);
    assert.equal(result[0].steps[0].connection, null);
  });

  it('includes direction on each connection', () => {
    const result = findPaths(1, 8, adjacency, idMap, 3);
    const firstStep = result[0].steps[0];
    assert.ok(firstStep.connection.direction === 'forward' || firstStep.connection.direction === 'reverse');
  });

  it('all paths are sorted shortest first', () => {
    const result = findPaths(1, 2, adjacency, idMap, 3);
    for (let i = 1; i < result.length; i++) {
      assert.ok(result[i].hops >= result[i - 1].hops);
    }
  });
});
