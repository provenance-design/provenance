'use client';

/**
 * Provenance Network Visualiser — Living Arc Field
 *
 * 1,000 nodes on a ring. 3,208 Bezier arcs as the visual material.
 * Additive blending. Ghost trails. Breathing control points.
 * Connection types shape arc character, not just colour.
 *
 * Journey mode: click through connected objects to build a readable
 * narrative from connection texts. The path IS the critical writing.
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
    curvePull: 0.65,
    amplitude: 18,
    speed: 0.0004,
    width: 0.8,
    alpha: 0.04,
  },
  argument: {
    curvePull: 0.12,
    amplitude: 4,
    speed: 0.0045,
    width: 0.6,
    alpha: 0.05,
  },
  method: {
    curvePull: 0.4,
    amplitude: 13,
    speed: 0.0009,
    width: 0.5,
    alpha: 0.035,
  },
  material: {
    curvePull: 0.18,
    amplitude: 6,
    speed: 0.0005,
    width: 1.2,
    alpha: 0.055,
  },
  zeitgeist: {
    curvePull: 0.85,
    amplitude: 35,
    speed: 0.0002,
    width: 0.3,
    alpha: 0.02,
  },
  sameProblem: {
    curvePull: -0.25,
    amplitude: 15,
    speed: 0.0007,
    width: 0.5,
    alpha: 0.04,
  },
};

export default function VisualiserShell({ devMode = false, onOpenItem = null }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // Journey state — the accumulated narrative
  const [journey, setJourney] = useState([]);
  // journey = [{ entry, connectionText, connectionType, fromEntry }]
  // First item has no connectionText (starting point)

  const [activeFilter, setActiveFilter] = useState(null);
  const [fps, setFps] = useState(0);

  const fpsHistory = useRef([]);
  // Ref to share journey with canvas loop
  const journeyRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

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
      const phase2 = Math.random() * Math.PI * 2;

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

    // --- Build edge lookup for journey trail ---
    // Key: "sourceId-targetId" → arc object
    const arcLookup = new Map();
    for (const arc of arcs) {
      arcLookup.set(`${arc.source.id}-${arc.target.id}`, arc);
      arcLookup.set(`${arc.target.id}-${arc.source.id}`, arc);
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
        let closestDist = 30;
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

      // Build set of highlighted arcs
      const highlightNode = selectedNode || hoveredNode;
      const highlightNeighbours = highlightNode ? new Set(adj.get(highlightNode.id) || []) : null;

      // Journey trail node IDs
      const jNodes = journeyRef.current;
      const journeyNodeIds = new Set(jNodes.map(j => j.entry.id));
      const journeyEdgeKeys = new Set();
      for (let i = 1; i < jNodes.length; i++) {
        journeyEdgeKeys.add(`${jNodes[i - 1].entry.id}-${jNodes[i].entry.id}`);
        journeyEdgeKeys.add(`${jNodes[i].entry.id}-${jNodes[i - 1].entry.id}`);
      }

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

          const isHighlighted = highlightNode && (
            arc.source.id === highlightNode.id ||
            arc.target.id === highlightNode.id
          );

          // Is this arc part of the journey trail?
          const isJourneyArc = journeyEdgeKeys.has(`${arc.source.id}-${arc.target.id}`);

          const isDimmed = highlightNode && !isHighlighted && !isJourneyArc;

          // Midpoint
          const midX = (sx + tx) / 2;
          const midY = (sy + ty) / 2;

          // Control point
          const dirX = cx - midX;
          const dirY = cy - midY;
          const pull = char.curvePull;
          let cpx = midX + dirX * pull;
          let cpy = midY + dirY * pull;

          // Breathing
          const breathe = Math.sin(time * char.speed + arc.phase) * char.amplitude;
          const breathe2 = Math.cos(time * char.speed * 0.7 + arc.phase2) * char.amplitude * 0.4;
          cpx += arc.perpX * breathe + arc.perpX * breathe2;
          cpy += arc.perpY * breathe + arc.perpY * breathe2;

          // Alpha
          let alpha = char.alpha;
          let color = baseColor;
          let width = char.width;

          if (isJourneyArc) {
            alpha = 0.5;
            color = '#E8E4DC';
            width = 2.5;
          } else if (isHighlighted) {
            alpha = 0.6;
            color = '#E8E4DC';
            width = 1.8;
          } else if (isDimmed) {
            alpha = char.alpha * 0.15;
          }
          if (filterType && filterType === type && !isJourneyArc) {
            alpha = isHighlighted ? 0.7 : char.alpha * 2.5;
          }

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(cpx, cpy, tx, ty);
          ctx.strokeStyle = color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = width;
          ctx.stroke();
        }
      }

      // --- Draw journey trail on top (source-over for solid visibility) ---
      if (jNodes.length > 1) {
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 1; i < jNodes.length; i++) {
          const prevNode = nodeMap.get(jNodes[i - 1].entry.id);
          const currNode = nodeMap.get(jNodes[i].entry.id);
          if (!prevNode || !currNode) continue;

          const arc = arcLookup.get(`${prevNode.id}-${currNode.id}`);
          const type = jNodes[i].connectionType;
          const trailColor = TYPE_COLORS[type] || '#E8E4DC';

          if (arc) {
            const sx = prevNode.ringX;
            const sy = prevNode.ringY;
            const tx = currNode.ringX;
            const ty = currNode.ringY;
            const char = arc.char;
            const midX = (sx + tx) / 2;
            const midY = (sy + ty) / 2;
            const dirX = cx - midX;
            const dirY = cy - midY;
            let cpx = midX + dirX * char.curvePull;
            let cpy = midY + dirY * char.curvePull;
            const breathe = Math.sin(time * char.speed + arc.phase) * char.amplitude;
            cpx += arc.perpX * breathe;
            cpy += arc.perpY * breathe;

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.quadraticCurveTo(cpx, cpy, tx, ty);
            ctx.strokeStyle = trailColor;
            ctx.globalAlpha = 0.8;
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Step number at midpoint
          const mx = (prevNode.ringX + currNode.ringX) / 2;
          const my = (prevNode.ringY + currNode.ringY) / 2;
          ctx.globalAlpha = 0.5;
          ctx.font = '9px "DM Sans", sans-serif';
          ctx.fillStyle = trailColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(i), mx + (cx - mx) * 0.3, my + (cy - my) * 0.3);
        }
      }

      // --- Draw nodes ---
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      for (const n of nodes) {
        const isActive = highlightNode && n.id === highlightNode.id;
        const isNeighbour = highlightNeighbours && highlightNeighbours.has(n.id);
        const isJourney = journeyNodeIds.has(n.id);

        const r = isActive ? 4 : isJourney ? 3.5 : isNeighbour ? 3 : Math.max(1.2, Math.sqrt(n.connectionCount) * 0.5);

        ctx.beginPath();
        ctx.arc(n.ringX, n.ringY, r, 0, Math.PI * 2);
        ctx.fillStyle = isJourney ? '#E8E4DC' : DISC_COLORS[n.discipline] || '#888';
        ctx.globalAlpha = isActive ? 1.0 : isJourney ? 0.9 : isNeighbour ? 0.8 : highlightNode ? 0.08 : 0.25;
        ctx.fill();

        if (isActive || isJourney) {
          ctx.strokeStyle = isActive ? '#fff' : 'rgba(255,255,255,0.4)';
          ctx.lineWidth = isActive ? 1.5 : 1;
          ctx.globalAlpha = 1;
          ctx.stroke();
        }
      }

      // --- Labels ---
      if (highlightNode) {
        ctx.globalAlpha = 1;
        ctx.font = '13px "DM Sans", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(highlightNode.title, highlightNode.ringX + 8, highlightNode.ringY);

        ctx.font = '10px "DM Sans", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        if (highlightNeighbours) {
          for (const nid of highlightNeighbours) {
            const nn = nodeMap.get(nid);
            if (!nn) continue;
            const dx = nn.ringX - highlightNode.ringX;
            const dy = nn.ringY - highlightNode.ringY;
            if (Math.sqrt(dx * dx + dy * dy) < radius * 1.5) {
              ctx.fillText(nn.title, nn.ringX + 6, nn.ringY);
            }
          }
        }
      }

      // Journey node labels (always visible)
      if (jNodes.length > 0) {
        ctx.globalAlpha = 0.8;
        ctx.font = '10px "DM Sans", sans-serif';
        ctx.fillStyle = '#E8E4DC';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        for (const j of jNodes) {
          const n = nodeMap.get(j.entry.id);
          if (n && (!highlightNode || n.id !== highlightNode.id)) {
            ctx.fillText(n.title, n.ringX + 6, n.ringY);
          }
        }
      }

      // Discipline labels
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

    const handleClick = () => {
      if (hoveredNode) {
        selectedNode = hoveredNode;
        const entry = getEntry(hoveredNode.id);
        if (!entry) return;

        const currentJourney = journeyRef.current;

        if (currentJourney.length === 0) {
          // Starting a journey
          const step = { entry, connectionText: null, connectionType: null, fromEntry: null };
          const newJourney = [step];
          journeyRef.current = newJourney;
          setJourney(newJourney);
        } else {
          // Check if this node is connected to the current position
          const lastEntry = currentJourney[currentJourney.length - 1].entry;
          const edge = GRAPH.edges.find(e =>
            (e.source === lastEntry.id && e.target === hoveredNode.id) ||
            (e.target === lastEntry.id && e.source === hoveredNode.id)
          );

          if (edge) {
            // Continue the journey
            const step = {
              entry,
              connectionText: edge.reason || '',
              connectionType: edge.type,
              fromEntry: lastEntry,
            };
            const newJourney = [...currentJourney, step];
            journeyRef.current = newJourney;
            setJourney(newJourney);
          } else {
            // Not connected — start a new journey from here
            const step = { entry, connectionText: null, connectionType: null, fromEntry: null };
            const newJourney = [step];
            journeyRef.current = newJourney;
            setJourney(newJourney);
          }
        }
      }
    };

    const handleResize = () => {
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

  const clearJourney = useCallback(() => {
    journeyRef.current = [];
    setJourney([]);
  }, []);

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

      {/* Journey panel — the narrative */}
      {journey.length > 0 && (
        <div style={{
          position: 'absolute', left: 16, top: 60, width: 340, maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)',
          borderRadius: 12, padding: 20, color: '#fff', fontFamily: '"DM Sans", sans-serif',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4 }}>
              Journey · {journey.length} {journey.length === 1 ? 'step' : 'steps'}
            </div>
            <button
              onClick={clearJourney}
              style={{
                padding: '3px 10px', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)',
                fontSize: 9, cursor: 'pointer', borderRadius: 4,
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              Clear
            </button>
          </div>

          {journey.map((step, i) => (
            <div key={`${step.entry.id}-${i}`}>
              {/* Connection text — the narrative between objects */}
              {step.connectionText && (
                <div style={{
                  padding: '10px 0',
                  borderLeft: `2px solid ${TYPE_COLORS[step.connectionType] || '#555'}`,
                  paddingLeft: 12,
                  marginLeft: 4,
                  marginBottom: 8,
                }}>
                  <div style={{ fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.4, marginBottom: 4, color: TYPE_COLORS[step.connectionType] }}>
                    {TYPE_LABELS[step.connectionType] || step.connectionType}
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.8 }}>
                    {step.connectionText}
                  </div>
                </div>
              )}

              {/* Object marker */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: step.connectionText ? 12 : 8 }}>
                <span style={{ fontSize: 10, opacity: 0.3, fontFamily: 'monospace', minWidth: 16 }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 14, fontFamily: '"DM Serif Display", serif', lineHeight: 1.2 }}>
                    {step.entry.title}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>
                    {step.entry.designer}, {step.entry.year} · {step.entry.discipline}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Prompt */}
          <div style={{ fontSize: 10, opacity: 0.3, marginTop: 8, fontStyle: 'italic' }}>
            Click a connected object to continue
          </div>
        </div>
      )}
    </div>
  );
}
