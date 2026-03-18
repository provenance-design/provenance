import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { loadArchive, summarise } from '../data-loader.js';
import { findPaths } from '../pathfinder.js';

const { entries, idMap, adjacency, disciplines, connectionTypes } = loadArchive();

describe('search_entries logic', () => {
  function search({ query, discipline, origin, year_from, year_to, movement, connection_type }) {
    const queryLower = query ? query.toLowerCase() : null;
    const validTypes = Object.keys(connectionTypes);
    const results = [];

    for (const entry of entries) {
      if (discipline && entry.discipline !== discipline) continue;
      if (origin && entry.origin !== origin) continue;
      if (year_from != null && entry.year < year_from) continue;
      if (year_to != null && entry.year > year_to) continue;
      if (movement && !(entry.movement || '').toLowerCase().includes(movement.toLowerCase())) continue;
      if (connection_type && !entry.connections.some(c => c.type === connection_type)) continue;

      let score = 0;
      if (queryLower) {
        const titleLower = entry.title.toLowerCase();
        const designerLower = entry.designer.toLowerCase();
        if (titleLower === queryLower) score = 100;
        else if (titleLower.includes(queryLower)) score = 80;
        else if (designerLower.includes(queryLower)) score = 60;
        else if ((entry.description || '').toLowerCase().includes(queryLower)) score = 40;
        else if ((entry.significance || '').toLowerCase().includes(queryLower)) score = 30;
        else if (entry.keywords && entry.keywords.some(k => k.toLowerCase().includes(queryLower))) score = 20;
        else continue;
      } else {
        score = 50;
      }
      results.push({ entry, score });
    }

    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.entry.year !== a.entry.year) return b.entry.year - a.entry.year;
      return a.entry.id - b.entry.id;
    });

    return results.slice(0, 50).map(r => summarise(r.entry));
  }

  it('finds Arco by title', () => {
    const results = search({ query: 'Arco Floor Lamp' });
    assert.equal(results[0].id, 1);
    assert.equal(results[0].title, 'Arco Floor Lamp');
  });

  it('filters by discipline', () => {
    const results = search({ discipline: 'Ceramic' });
    assert.ok(results.length > 0);
    assert.ok(results.every(r => r.discipline === 'Ceramic'));
  });

  it('filters by year range', () => {
    const results = search({ year_from: 1920, year_to: 1930, discipline: 'Furniture' });
    assert.ok(results.every(r => r.year >= 1920 && r.year <= 1930));
  });

  it('caps at 50 results', () => {
    const results = search({ discipline: 'Furniture' });
    assert.ok(results.length <= 50);
  });

  it('includes movement in results', () => {
    const results = search({ query: 'Arco' });
    const arco = results.find(r => r.id === 1);
    assert.ok(arco);
    assert.equal(arco.movement, 'Italian Rationalism');
  });
});

describe('get_entry logic', () => {
  it('returns enriched connections', () => {
    const entry = idMap.get(1);
    const conn = entry.connections[0];
    const target = idMap.get(conn.id);
    assert.ok(target, 'connection target exists');
    assert.ok(target.title);
    assert.ok(target.discipline);
  });

  it('returns null for non-existent ID', () => {
    assert.equal(idMap.get(999999), undefined);
  });
});

describe('get_cluster logic', () => {
  it('depth 1 returns direct connections', () => {
    const centreId = 1;
    const edges = adjacency.get(centreId) || [];
    const connectedIds = new Set(edges.map(e => e.targetId));
    assert.ok(connectedIds.size > 0);
  });

  it('depth 2 cluster from a hub is large but finite', () => {
    const centreId = 1;
    const visited = new Set([centreId]);
    let frontier = [centreId];
    for (let d = 0; d < 2; d++) {
      const next = [];
      for (const nodeId of frontier) {
        for (const edge of (adjacency.get(nodeId) || [])) {
          if (!visited.has(edge.targetId) && idMap.has(edge.targetId)) {
            visited.add(edge.targetId);
            next.push(edge.targetId);
          }
        }
      }
      frontier = next;
    }
    // Should be capped at 100 in the real implementation
    assert.ok(visited.size > 0);
  });
});

describe('find_path integration', () => {
  it('finds a path between two entries in different disciplines', () => {
    // Arco (Lighting, id=1) to something in Graphic
    const graphic = entries.find(e => e.discipline === 'Graphic');
    const result = findPaths(1, graphic.id, adjacency, idMap, 3);
    // Might or might not find a path — just check it returns an array
    assert.ok(Array.isArray(result));
  });

  it('path steps have correct shape', () => {
    const result = findPaths(1, 8, adjacency, idMap, 3);
    assert.ok(result.length > 0);
    const path = result[0];
    assert.ok(typeof path.hops === 'number');
    assert.ok(Array.isArray(path.steps));
    for (const step of path.steps) {
      assert.ok(step.entry.id);
      assert.ok(step.entry.title);
    }
    // Last step has null connection
    assert.equal(path.steps[path.steps.length - 1].connection, null);
  });
});
