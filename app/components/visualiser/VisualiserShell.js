'use client';

/**
 * Provenance Network Visualiser — Living Arc Field
 *
 * 1,000 nodes on a ring. 3,208 Bezier arcs as the visual material.
 * Additive blending. Ghost trails. Breathing control points.
 * Connection types shape arc character, not just colour.
 *
 * The arcs ARE the artwork. Nodes are anchor points.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { GRAPH, getEntry } from './dataAdapter';
import { TYPE_COLORS, CANVAS } from './constants';

const DISC_COLORS = {
  Product:      '#C4A882',
  Furniture:    '#7BA68C',
  Graphic:      '#8BA4B8',
  Lighting:     '#C4B878',
  Architecture: '#A0887A',
  Typography:   '#90A890',
  Textile:      '#C49878',
  Transport:    '#78A0B0',
  Ceramic:      '#B0A080',
  Glass:        '#80B0A0',
  Metalwork:    '#A090B0',
};

const TYPE_LABELS = {
  argument: 'Argument', lineage: 'Lineage', material: 'Material',
  sameProblem: 'Same Problem', zeitgeist: 'Zeitgeist', method: 'Method',
};

// Arc character per connection type — the Xenakis transduction
const ARC_CHARACTER = {
  lineage: {
    curvePull: 0.65,       // deep curves through centre
    amplitude: 15,          // gentle drift
    speed: 0.0003,          // slow, gravitational
    width: 0.8,
    alpha: 0.04,
  },
  argument: {
    curvePull: 0.12,        // nearly straight — taut
    amplitude: 2.5,         // tight vibration
    speed: 0.004,           // fast, tense
    width: 0.6,
    alpha: 0.05,
  },
  method: {
    curvePull: 0.4,         // gentle lateral sweep
    amplitude: 10,
    speed: 0.0008,          // steady
    width: 0.5,
    alpha: 0.035,
  },
  material: {
    curvePull: 0.18,        // tight, stays near perimeter
    amplitude: 4,
    speed: 0.0004,          // heavy, geological
    width: 1.2,
    alpha: 0.055,
  },
  zeitgeist: {
    curvePull: 0.85,        // enormous sweeping arcs
    amplitude: 30,          // big drift — weather
    speed: 0.00015,         // very slow, atmospheric
    width: 0.3,
    alpha: 0.02,
  },
  sameProblem: {
    curvePull: -0.25,       // curves AWAY from centre — orbits a void
    amplitude: 12,
    speed: 0.0006,
    width: 0.5,
    alpha: 0.04,
  },
};

export default function VisualiserShell({ devMode = false, onOpenItem = null }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [connectedEntries, setConnectedEntries] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [fps, setFps] = useState(0);

  const fpsHistory = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Size canvas
    const container = canvas.parentElement;
    const W = container.clientWidth;
    const H = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    // Ring geometry
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) * 0.40;

    // --- Layout: nodes on ring, grouped by discipline ---
    const nodes = GRAPH.nodes.map(n => ({ ...n }));
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    const discGroups = {};
    for (const n of nodes) {
      if (!discGroups[n.discipline]) discGroups[n.discipline] = [];
      discGroups[n.discipline].push(n);
    }
    const discOrder = Object.keys(discGroups).sort((a, b) => discGroups[b].length - discGroups[a].length);
    for (const d of discOrder) {
      discGroups[d].sort((a, b) => b.connectionCount - a.connectionCount);
    }

    const gapAngle = 0.025;
    const totalGap = gapAngle * discOrder.length;
    const availableAngle = Math.PI * 2 - totalGap;
    let currentAngle = -Math.PI / 2;
    const discSegments = [];

    for (const disc of discOrder) {
      const group = discGroups[disc];
      const segAngle = availableAngle * (group.length / nodes.length);
      const segStart = currentAngle;

      // Most-connected nodes at centre of segment
      const mid = Math.floor(group.length / 2);
      const ordered = [];
      for (let i = 0; i < group.length; i++) {
        if (i % 2 === 0) ordered.push(group[mid + Math.floor(i / 2)]);
        else ordered.push(group[mid - Math.ceil(i / 2)]);
      }
      const valid = ordered.filter(Boolean);

      for (let i = 0; i < valid.length; i++) {
        const angle = segStart + (i + 0.5) * segAngle / valid.length;
        valid[i].ringX = cx + radius * Math.cos(angle);
        valid[i].ringY = cy + radius * Math.sin(angle);
        valid[i].angle = angle;
      }

      discSegments.push({
        disc,
        midAngle: segStart + segAngle / 2,
        startAngle: segStart,
        endAngle: segStart + segAngle,
      });

      currentAngle += segAngle + gapAngle;
    }

    // --- Pre-compute arc data ---
    const arcs = GRAPH.edges.map(edge => {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);
      if (!source || !target) return null;

      const char = ARC_CHARACTER[edge.type] || ARC_CHARACTER.method;
      const phase = Math.random() * Math.PI * 2;
      // Secondary phase for more complex motion
      const phase2 = Math.random() * Math.PI * 2;

      // Perpendicular direction for breathing offset
      const dx = target.ringX - source.ringX;
      const dy = target.ringY - source.ringY;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const perpX = -dy / len;
      const perpY = dx / len;

      return {
        source,
        target,
        type: edge.type,
        reason: edge.reason,
        char,
        phase,
        phase2,
        perpX,
        perpY,
        color: TYPE_COLORS[edge.type] || '#887766',
      };
    }).filter(Boolean);

    // Group arcs by type for batch rendering
    const arcsByType = {};
    for (const arc of arcs) {
      if (!arcsByType[arc.type]) arcsByType[arc.type] = [];
      arcsByType[arc.type].push(arc);
    }

    // --- Interaction state ---
    const mouse = { x: 0, y: 0, active: false };
    let hoveredNode = null;
    let selectedNode = null;
    let filterType = null;

    // Adjacency for quick lookup
    const adj = new Map();
    for (const edge of GRAPH.edges) {
      if (!adj.has(edge.source)) adj.set(edge.source, []);
      if (!adj.has(edge.target)) adj.set(edge.target, []);
      adj.get(edge.source).push(edge.target);
      adj.get(edge.target).push(edge.source);
    }

    // --- First frame: fill with background ---
    ctx.fillStyle = CANVAS.background;
    ctx.fillRect(0, 0, W, H);

    // --- Animation loop ---
    let lastTime = performance.now();
    let frameCount = 0;

    const loop = (time) => {
      const dt = time - lastTime;
      lastTime = time;
      frameCount++;

      // FPS
      fpsHistory.current.push(dt);
      if (fpsHistory.current.length > 30) fpsHistory.current.shift();
      if (devMode && frameCount % 15 === 0) {
        const avg = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
        setFps(Math.round(1000 / avg));
      }

      // --- Ghost trail: semi-transparent wash ---
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(30, 34, 40, 0.06)';
      ctx.fillRect(0, 0, W, H);

      // --- Find hovered node ---
      hoveredNode = null;
      if (mouse.active) {
        let closestDist = 30; // pixel radius for hover detection
        for (const n of nodes) {
          const dx = n.ringX - mouse.x;
          const dy = n.ringY - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < closestDist) {
            closestDist = d;
            hoveredNode = n;
          }
        }
      }

      // Build set of highlighted arc IDs (connected to hovered or selected node)
      const highlightNode = selectedNode || hoveredNode;
      const highlightNeighbours = highlightNode ? new Set(adj.get(highlightNode.id) || []) : null;

      // --- Draw arcs with additive blending ---
      ctx.globalCompositeOperation = 'lighter';

      for (const type of Object.keys(arcsByType)) {
        if (filterType && filterType !== type) continue;

        const typeArcs = arcsByType[type];
        const char = ARC_CHARACTER[type];
        const baseColor = TYPE_COLORS[type] || '#887766';

        for (const arc of typeArcs) {
          const sx = arc.source.ringX;
          const sy = arc.source.ringY;
          const tx = arc.target.ringX;
          const ty = arc.target.ringY;

          // Is this arc connected to the highlighted node?
          const isHighlighted = highlightNode && (
            arc.source.id === highlightNode.id ||
            arc.target.id === highlightNode.id
          );

          // Is this arc dimmed (something is highlighted but not this arc)?
          const isDimmed = highlightNode && !isHighlighted;

          // Midpoint
          const midX = (sx + tx) / 2;
          const midY = (sy + ty) / 2;

          // Control point: pull toward/away from centre
          const dirX = cx - midX;
          const dirY = cy - midY;
          const pull = char.curvePull;
          let cpx = midX + dirX * pull;
          let cpy = midY + dirY * pull;

          // Breathing: oscillate control point perpendicular to arc
          const breathe = Math.sin(time * char.speed + arc.phase) * char.amplitude;
          const breathe2 = Math.cos(time * char.speed * 0.7 + arc.phase2) * char.amplitude * 0.4;
          cpx += arc.perpX * breathe + arc.perpX * breathe2;
          cpy += arc.perpY * breathe + arc.perpY * breathe2;

          // Alpha
          let alpha = char.alpha;
          if (isHighlighted) {
            alpha = 0.6;
          } else if (isDimmed) {
            alpha = char.alpha * 0.15;
          }
          if (filterType && filterType === type) {
            alpha = isHighlighted ? 0.7 : char.alpha * 2.5;
          }

          // Draw
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(cpx, cpy, tx, ty);
          ctx.strokeStyle = isHighlighted ? '#E8E4DC' : baseColor;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = isHighlighted ? 1.8 : char.width;
          ctx.stroke();
        }
      }

      // --- Draw nodes: tiny, subtle ---
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      for (const n of nodes) {
        const isActive = highlightNode && n.id === highlightNode.id;
        const isNeighbour = highlightNeighbours && highlightNeighbours.has(n.id);

        // Node size: very small base, slightly larger for hubs
        const r = isActive ? 4 : isNeighbour ? 3 : Math.max(1.2, Math.sqrt(n.connectionCount) * 0.5);

        ctx.beginPath();
        ctx.arc(n.ringX, n.ringY, r, 0, Math.PI * 2);
        ctx.fillStyle = DISC_COLORS[n.discipline] || '#888';
        ctx.globalAlpha = isActive ? 1.0 : isNeighbour ? 0.8 : highlightNode ? 0.08 : 0.25;
        ctx.fill();

        if (isActive) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 1;
          ctx.stroke();
        }
      }

      // --- Labels: only near hover/selection ---
      if (highlightNode) {
        ctx.globalAlpha = 1;
        ctx.font = '13px "DM Sans", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // Highlighted node label
        const labelX = highlightNode.ringX + 8;
        const labelY = highlightNode.ringY;
        ctx.fillStyle = '#fff';
        ctx.fillText(highlightNode.title, labelX, labelY);

        // Neighbour labels
        ctx.font = '10px "DM Sans", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        if (highlightNeighbours) {
          for (const nid of highlightNeighbours) {
            const nn = nodeMap.get(nid);
            if (!nn) continue;
            // Only show labels for nearby neighbours to avoid clutter
            const dx = nn.ringX - highlightNode.ringX;
            const dy = nn.ringY - highlightNode.ringY;
            if (Math.sqrt(dx * dx + dy * dy) < radius * 1.5) {
              const nx = nn.ringX + 6;
              const ny = nn.ringY;
              ctx.fillText(nn.title, nx, ny);
            }
          }
        }
      }

      // --- Discipline labels at outer edge ---
      ctx.globalAlpha = highlightNode ? 0.15 : 0.3;
      ctx.font = '8px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const labelR = radius + 24;
      for (const seg of discSegments) {
        const lx = cx + labelR * Math.cos(seg.midAngle);
        const ly = cy + labelR * Math.sin(seg.midAngle);
        ctx.save();
        ctx.translate(lx, ly);
        let rot = seg.midAngle;
        if (rot > Math.PI / 2 && rot < Math.PI * 1.5) rot += Math.PI;
        if (rot < -Math.PI / 2) rot += Math.PI;
        ctx.rotate(rot);
        ctx.fillStyle = DISC_COLORS[seg.disc] || '#999';
        ctx.fillText(seg.disc.toUpperCase(), 0, 0);
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    // --- Event handlers ---
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
      canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      hoveredNode = null;
    };

    const handleClick = (e) => {
      if (hoveredNode) {
        selectedNode = hoveredNode;
        const entry = getEntry(hoveredNode.id);
        setSelectedEntry(entry);

        const adjIds = adj.get(hoveredNode.id) || [];
        const connected = adjIds.map(id => {
          const otherEntry = getEntry(id);
          const edge = GRAPH.edges.find(e =>
            (e.source === hoveredNode.id && e.target === id) ||
            (e.target === hoveredNode.id && e.source === id)
          );
          return { entry: otherEntry, edge };
        }).filter(c => c.entry && c.edge);
        setConnectedEntries(connected);
      } else {
        selectedNode = null;
        setSelectedEntry(null);
        setConnectedEntries([]);
      }
    };

    const handleResize = () => {
      // Simple reload on resize for now
      const W2 = container.clientWidth;
      const H2 = container.clientHeight;
      canvas.width = W2 * dpr;
      canvas.height = H2 * dpr;
      canvas.style.width = `${W2}px`;
      canvas.style.height = `${H2}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.fillStyle = CANVAS.background;
      ctx.fillRect(0, 0, W2, H2);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // Expose filter type to animation loop
    const filterRef = { get: () => filterType, set: (v) => { filterType = v; } };
    canvas._filterRef = filterRef;

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [devMode]);

  const toggleFilter = useCallback((type) => {
    const next = activeFilter === type ? null : type;
    setActiveFilter(next);
    const canvas = canvasRef.current;
    if (canvas && canvas._filterRef) {
      canvas._filterRef.set(next);
    }
  }, [activeFilter]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: CANVAS.background, overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* Connection type filter bar */}
      <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <button
            key={type}
            onClick={() => toggleFilter(type)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: `1px solid ${activeFilter === type ? TYPE_COLORS[type] : 'rgba(255,255,255,0.15)'}`,
              background: activeFilter === type ? TYPE_COLORS[type] + '20' : 'rgba(0,0,0,0.5)',
              color: activeFilter === type ? TYPE_COLORS[type] : 'rgba(255,255,255,0.5)',
              fontSize: 10,
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dev overlay */}
      {devMode && (
        <div style={{ position: 'absolute', top: 16, right: 16, color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace', textAlign: 'right' }}>
          <div>{fps} fps</div>
          <div>{GRAPH.stats.nodeCount} nodes / {GRAPH.stats.edgeCount} arcs</div>
        </div>
      )}

      {/* Selected entry panel */}
      {selectedEntry && (
        <div style={{
          position: 'absolute', right: 16, top: 60, width: 300, maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)',
          borderRadius: 12, padding: 20, color: '#fff', fontFamily: '"DM Sans", sans-serif',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, marginBottom: 4 }}>
            {selectedEntry.discipline} · {selectedEntry.year}
          </div>
          <h3 style={{ fontSize: 16, fontFamily: '"DM Serif Display", serif', margin: '0 0 4px 0', lineHeight: 1.2 }}>
            {selectedEntry.title}
          </h3>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 12 }}>{selectedEntry.designer}</div>

          <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.3, marginBottom: 8 }}>
            {connectedEntries.length} connections
          </div>

          {connectedEntries.slice(0, 10).map(({ entry: conn, edge }) => (
            <div key={conn.id} style={{ padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 11, marginBottom: 2 }}>{conn.title}</div>
              <div style={{ fontSize: 9, opacity: 0.4 }}>
                <span style={{ color: TYPE_COLORS[edge.type], opacity: 1 }}>{TYPE_LABELS[edge.type]}</span>
                <span style={{ marginLeft: 8 }}>{conn.designer}, {conn.year}</span>
              </div>
            </div>
          ))}

          {onOpenItem && (
            <button
              onClick={() => onOpenItem(selectedEntry.id)}
              style={{
                marginTop: 12, width: '100%', padding: '8px', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 10,
                cursor: 'pointer', borderRadius: 6, fontFamily: '"DM Sans", sans-serif',
              }}
            >
              View entry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
