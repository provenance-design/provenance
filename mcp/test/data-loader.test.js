import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { loadArchive, summarise } from '../data-loader.js';

describe('loadArchive', () => {
  const data = loadArchive();

  it('loads all 1000 entries', () => {
    assert.equal(data.entries.length, 1000);
  });

  it('builds an ID map with all entries', () => {
    assert.equal(data.idMap.size, 1000);
    const arco = data.idMap.get(1);
    assert.equal(arco.title, 'Arco Floor Lamp');
  });

  it('builds bidirectional adjacency map', () => {
    // Entry 1 (Arco) connects to entry 8 — so entry 8 should have a reverse edge to 1
    const arcoEdges = data.adjacency.get(1);
    assert.ok(arcoEdges.some(e => e.targetId === 8 && e.direction === 'forward'));
    const entry8Edges = data.adjacency.get(8);
    assert.ok(entry8Edges.some(e => e.targetId === 1 && e.direction === 'reverse'));
  });

  it('loads all 11 disciplines', () => {
    assert.equal(data.disciplines.length, 11);
    assert.ok(data.disciplines.includes('Furniture'));
  });

  it('loads all 6 connection types', () => {
    const types = Object.keys(data.connectionTypes);
    assert.equal(types.length, 6);
    assert.ok(types.includes('argument'));
    assert.ok(types.includes('lineage'));
  });
});

describe('summarise', () => {
  it('returns summary fields only', () => {
    const entry = { id: 1, title: 'T', designer: 'D', year: 2000, discipline: 'Product', origin: 'UK', movement: 'Mod', description: 'long', significance: 'long', connections: [], keywords: [] };
    const s = summarise(entry);
    assert.deepEqual(Object.keys(s).sort(), ['designer', 'discipline', 'id', 'movement', 'origin', 'title', 'year']);
  });
});
