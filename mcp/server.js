import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadArchive, summarise } from './data-loader.js';
import { findPaths } from './pathfinder.js';

// Load archive data at startup
const { entries, idMap, adjacency, connectionTypes, disciplines } = loadArchive();

const server = new McpServer({
  name: 'provenance-archive',
  version: '1.0.0'
});

// ─── Tool 1: search_entries ───────────────────────────────────────────

server.registerTool(
  'search_entries',
  {
    title: 'Search Entries',
    description: 'Search the Provenance Archive by text query, discipline, origin, year range, movement, or connection type. All parameters optional, combined with AND logic. Returns max 50 entry summaries.',
    inputSchema: {
      query: z.string().optional().describe('Free text — searches title, designer, description, significance, keywords'),
      discipline: z.string().optional().describe('Exact match: Product, Furniture, Graphic, Lighting, Architecture, Typography, Textile, Transport, Ceramic, Glass, Metalwork'),
      origin: z.string().optional().describe('Exact match, e.g. "Italy", "United Kingdom"'),
      year_from: z.number().optional().describe('Minimum year (inclusive)'),
      year_to: z.number().optional().describe('Maximum year (inclusive)'),
      movement: z.string().optional().describe('Partial match against movement field'),
      connection_type: z.string().optional().describe('Entries with at least one connection of this type: argument, lineage, material, sameProblem, zeitgeist, method')
    }
  },
  async (params) => {
    const { query, discipline, origin, year_from, year_to, movement, connection_type } = params;

    // Require at least one parameter
    if (!query && !discipline && !origin && year_from == null && year_to == null && !movement && !connection_type) {
      return { content: [{ type: 'text', text: 'Error: At least one search parameter required.' }], isError: true };
    }

    // Validate discipline
    if (discipline && !disciplines.includes(discipline)) {
      return { content: [{ type: 'text', text: `Error: Invalid discipline "${discipline}". Valid: ${disciplines.join(', ')}` }], isError: true };
    }

    // Validate connection_type
    const validTypes = Object.keys(connectionTypes);
    if (connection_type && !validTypes.includes(connection_type)) {
      return { content: [{ type: 'text', text: `Error: Invalid connection_type "${connection_type}". Valid: ${validTypes.join(', ')}` }], isError: true };
    }

    const queryLower = query ? query.toLowerCase() : null;

    // Score and filter
    const results = [];
    for (const entry of entries) {
      // Apply filters
      if (discipline && entry.discipline !== discipline) continue;
      if (origin && entry.origin !== origin) continue;
      if (year_from != null && entry.year < year_from) continue;
      if (year_to != null && entry.year > year_to) continue;
      if (movement && !(entry.movement || '').toLowerCase().includes(movement.toLowerCase())) continue;
      if (connection_type && !entry.connections.some(c => c.type === connection_type)) continue;

      // Score for text query relevance
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
        else continue; // no match
      } else {
        score = 50; // no text query — all filtered entries rank equally
      }

      results.push({ entry, score });
    }

    // Sort: score desc, then year desc, then id asc
    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.entry.year !== a.entry.year) return b.entry.year - a.entry.year;
      return a.entry.id - b.entry.id;
    });

    const capped = results.slice(0, 50).map(r => summarise(r.entry));

    return {
      content: [{ type: 'text', text: JSON.stringify({ count: capped.length, total: results.length, entries: capped }, null, 2) }]
    };
  }
);

// ─── Tool 2: get_entry ────────────────────────────────────────────────

server.registerTool(
  'get_entry',
  {
    title: 'Get Entry',
    description: 'Get a full Provenance Archive entry by ID, with all connections enriched with target entry context (title, designer, year, discipline).',
    inputSchema: {
      id: z.number().describe('Entry ID')
    }
  },
  async ({ id }) => {
    const entry = idMap.get(id);
    if (!entry) {
      return { content: [{ type: 'text', text: `Error: No entry found with ID ${id}` }], isError: true };
    }

    // Enrich connections with target entry context
    const enrichedConnections = entry.connections.map(conn => {
      const target = idMap.get(conn.id);
      return {
        id: conn.id,
        type: conn.type,
        reason: conn.reason,
        target: target ? {
          title: target.title,
          designer: target.designer,
          year: target.year,
          discipline: target.discipline
        } : null
      };
    });

    const result = {
      id: entry.id,
      title: entry.title,
      designer: entry.designer,
      year: entry.year,
      discipline: entry.discipline,
      origin: entry.origin || null,
      manufacturer: entry.manufacturer || null,
      collection: entry.collection || null,
      movement: entry.movement || null,
      description: entry.description,
      significance: entry.significance,
      keywords: entry.keywords,
      connections: enrichedConnections
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
    };
  }
);

// ─── Tool 3: find_path ───────────────────────────────────────────────

server.registerTool(
  'find_path',
  {
    title: 'Find Path',
    description: 'Trace connection paths between two Provenance Archive entries using BFS, up to 3 hops. Returns up to 5 shortest paths with connection types, reasons, and direction (forward/reverse).',
    inputSchema: {
      from_id: z.number().describe('Starting entry ID'),
      to_id: z.number().describe('Target entry ID'),
      max_hops: z.number().min(1).max(3).optional().describe('Maximum path length (default 3, max 3)')
    }
  },
  async ({ from_id, to_id, max_hops }) => {
    if (!idMap.has(from_id)) {
      return { content: [{ type: 'text', text: `Error: No entry found with ID ${from_id}` }], isError: true };
    }
    if (!idMap.has(to_id)) {
      return { content: [{ type: 'text', text: `Error: No entry found with ID ${to_id}` }], isError: true };
    }

    const hops = Math.min(max_hops || 3, 3);
    const paths = findPaths(from_id, to_id, adjacency, idMap, hops);

    const fromEntry = idMap.get(from_id);
    const toEntry = idMap.get(to_id);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          from: summarise(fromEntry),
          to: summarise(toEntry),
          path_count: paths.length,
          paths
        }, null, 2)
      }]
    };
  }
);

// ─── Tool 4: get_cluster ─────────────────────────────────────────────

server.registerTool(
  'get_cluster',
  {
    title: 'Get Cluster',
    description: 'Pull a subgraph of related entries radiating from a starting point. Depth 1: direct connections. Depth 2: connections of connections. Capped at 100 entries.',
    inputSchema: {
      entry_id: z.number().describe('Centre entry ID'),
      depth: z.number().min(1).max(2).optional().describe('1 or 2 (default 1, max 2)')
    }
  },
  async ({ entry_id, depth: rawDepth }) => {
    const centreEntry = idMap.get(entry_id);
    if (!centreEntry) {
      return { content: [{ type: 'text', text: `Error: No entry found with ID ${entry_id}` }], isError: true };
    }

    const maxDepth = Math.min(rawDepth || 1, 2);
    const CAP = 100;

    // BFS to collect entries within depth
    const visited = new Set([entry_id]);
    let frontier = [entry_id];

    for (let d = 0; d < maxDepth; d++) {
      const nextFrontier = [];
      for (const nodeId of frontier) {
        const edges = adjacency.get(nodeId) || [];
        for (const edge of edges) {
          if (!visited.has(edge.targetId) && idMap.has(edge.targetId)) {
            visited.add(edge.targetId);
            nextFrontier.push(edge.targetId);
          }
        }
      }
      frontier = nextFrontier;
    }

    // Check if truncation needed
    let truncated = false;
    let clusterIds = [...visited];

    if (clusterIds.length > CAP) {
      truncated = true;
      // Keep the most-connected entries (by total degree in the adjacency map)
      const scored = clusterIds.map(id => ({
        id,
        degree: (adjacency.get(id) || []).length
      }));
      scored.sort((a, b) => b.degree - a.degree);
      // Always keep the centre entry
      const kept = new Set([entry_id]);
      for (const s of scored) {
        if (kept.size >= CAP) break;
        kept.add(s.id);
      }
      clusterIds = [...kept];
    }

    const clusterSet = new Set(clusterIds);

    // Collect all connections between cluster entries
    const connections = [];
    const connSeen = new Set();
    for (const nodeId of clusterIds) {
      const entry = idMap.get(nodeId);
      for (const conn of entry.connections) {
        if (clusterSet.has(conn.id)) {
          const key = `${nodeId}-${conn.id}-${conn.type}`;
          if (!connSeen.has(key)) {
            connSeen.add(key);
            connections.push({
              from_id: nodeId,
              to_id: conn.id,
              type: conn.type,
              reason: conn.reason
            });
          }
        }
      }
    }

    // Collect discipline set
    const disciplineSet = new Set();
    const clusterEntries = clusterIds
      .filter(id => id !== entry_id)
      .map(id => {
        const e = idMap.get(id);
        disciplineSet.add(e.discipline);
        return summarise(e);
      });
    disciplineSet.add(centreEntry.discipline);

    const result = {
      centre: summarise(centreEntry),
      entries: clusterEntries,
      connections,
      stats: {
        entry_count: clusterIds.length,
        connection_count: connections.length,
        disciplines: [...disciplineSet].sort()
      },
      truncated
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
    };
  }
);

// ─── Start ────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
