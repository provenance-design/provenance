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

// Brighter, more saturated versions of type colours for trails and highlights
const TYPE_GLOW = {
  argument:    '#E8845C',
  lineage:     '#7CC49A',
  material:    '#9ACA85',
  sameProblem: '#85B0C4',
  zeitgeist:   '#B8A890',
  method:      '#A0B8A0',
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

  const [journey, setJourney] = useState([]);
  const [journeySealed, setJourneySealed] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [fps, setFps] = useState(0);

  const fpsHistory = useRef([]);
  const journeyRef = useRef([]);
  const sealedRef = useRef(false);

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

      return {
        source,
        target,
        type: edge.type,
        reason: edge.reason,
        char,
        phase,
        phase2,
        perpX: -dy / len,
        perpY: dx / len,
        color: TYPE_COLORS[edge.type] || '#887766',
        glow: TYPE_GLOW[edge.type] || '#E8E4DC',
      };
    }).filter(Boolean);

    const arcsByType = {};
    for (const arc of arcs) {
      if (!arcsByType[arc.type]) arcsByType[arc.type] = [];
      arcsByType[arc.type].push(arc);
    }

    const arcLookup = new Map();
    for (const arc of arcs) {
      arcLookup.set(`${arc.source.id}-${arc.target.id}`, arc);
      arcLookup.set(`${arc.target.id}-${arc.source.id}`, arc);
    }

    // --- Adjacency with type info ---
    const adj = new Map();
    const adjEdges = new Map(); // nodeId → [{otherId, type}]
    for (const edge of GRAPH.edges) {
      if (!adj.has(edge.source)) adj.set(edge.source, []);
      if (!adj.has(edge.target)) adj.set(edge.target, []);
      adj.get(edge.source).push(edge.target);
      adj.get(edge.target).push(edge.source);

      if (!adjEdges.has(edge.source)) adjEdges.set(edge.source, []);
      if (!adjEdges.has(edge.target)) adjEdges.set(edge.target, []);
      adjEdges.get(edge.source).push({ otherId: edge.target, type: edge.type });
      adjEdges.get(edge.target).push({ otherId: edge.source, type: edge.type });
    }

    // --- Interaction state ---
    const mouse = { x: 0, y: 0, active: false };
    let hoveredNode = null;
    let selectedNode = null;
    let filterType = null;

    // --- Zoom/pan state ---
    const view = { scale: 1, panX: 0, panY: 0, dragging: false, dragStartX: 0, dragStartY: 0 };

    ctx.fillStyle = CANVAS.background;
    ctx.fillRect(0, 0, W, H);

    // --- Helper: compute arc control point at time t ---
    function arcControlPoint(arc, time) {
      const sx = arc.source.ringX, sy = arc.source.ringY;
      const tx = arc.target.ringX, ty = arc.target.ringY;
      const midX = (sx + tx) / 2, midY = (sy + ty) / 2;
      const dirX = cx - midX, dirY = cy - midY;
      let cpx = midX + dirX * arc.char.curvePull;
      let cpy = midY + dirY * arc.char.curvePull;
      const breathe = Math.sin(time * arc.char.speed + arc.phase) * arc.char.amplitude;
      const breathe2 = Math.cos(time * arc.char.speed * 0.7 + arc.phase2) * arc.char.amplitude * 0.4;
      cpx += arc.perpX * (breathe + breathe2);
      cpy += arc.perpY * (breathe + breathe2);
      return { cpx, cpy };
    }

    // --- Animation loop ---
    let lastTime = performance.now();
    let frameCount = 0;

    const loop = (time) => {
      const dt = time - lastTime;
      lastTime = time;
      frameCount++;

      fpsHistory.current.push(dt);
      if (fpsHistory.current.length > 30) fpsHistory.current.shift();
      if (devMode && frameCount % 15 === 0) {
        const avg = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
        setFps(Math.round(1000 / avg));
      }

      // --- Ghost trail wash (in screen space, before transform) ---
      ctx.globalCompositeOperation = 'source-over';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const isSealed = sealedRef.current;
      ctx.fillStyle = isSealed ? 'rgba(30, 34, 40, 0.12)' : 'rgba(30, 34, 40, 0.06)';
      ctx.fillRect(0, 0, W, H);

      // --- Apply zoom/pan transform ---
      ctx.setTransform(dpr * view.scale, 0, 0, dpr * view.scale, view.panX * dpr, view.panY * dpr);

      // --- Hover detection (mouse in world space) ---
      hoveredNode = null;
      if (mouse.active) {
        const jCurrent = journeyRef.current;
        const lastJourneyId = jCurrent.length > 0 ? jCurrent[jCurrent.length - 1].entry.id : null;
        const journeyNeighbours = lastJourneyId ? new Set(adj.get(lastJourneyId) || []) : null;

        let found = false;
        if (journeyNeighbours && journeyNeighbours.size > 0) {
          let bestDist = 75;
          for (const n of nodes) {
            if (!journeyNeighbours.has(n.id)) continue;
            const dx = n.ringX - mouse.x;
            const dy = n.ringY - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < bestDist) {
              bestDist = d;
              hoveredNode = n;
              found = true;
            }
          }
        }
        if (!found) {
          let bestDist = 25;
          for (const n of nodes) {
            const dx = n.ringX - mouse.x;
            const dy = n.ringY - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < bestDist) {
              bestDist = d;
              hoveredNode = n;
            }
          }
        }
      }

      const highlightNode = isSealed ? null : (selectedNode || hoveredNode);
      const highlightNeighbours = highlightNode ? new Set(adj.get(highlightNode.id) || []) : null;

      // Journey state
      const jNodes = journeyRef.current;
      const journeyNodeIds = new Set(jNodes.map(j => j.entry.id));
      const journeyEdgeKeys = new Set();
      const journeyEdgeTypes = new Map();
      for (let i = 1; i < jNodes.length; i++) {
        const k1 = `${jNodes[i - 1].entry.id}-${jNodes[i].entry.id}`;
        const k2 = `${jNodes[i].entry.id}-${jNodes[i - 1].entry.id}`;
        journeyEdgeKeys.add(k1);
        journeyEdgeKeys.add(k2);
        journeyEdgeTypes.set(k1, jNodes[i].connectionType);
        journeyEdgeTypes.set(k2, jNodes[i].connectionType);
      }

      // === DRAW ARCS ===
      ctx.globalCompositeOperation = 'lighter';

      for (const type of Object.keys(arcsByType)) {
        if (filterType && filterType !== type) continue;

        const typeArcs = arcsByType[type];

        for (const arc of typeArcs) {
          const edgeKey = `${arc.source.id}-${arc.target.id}`;
          const isJourneyArc = journeyEdgeKeys.has(edgeKey);

          // When sealed, keep the field as a faint ghost — constellation behind the path

          const sx = arc.source.ringX, sy = arc.source.ringY;
          const tx = arc.target.ringX, ty = arc.target.ringY;

          const isHighlighted = highlightNode && (
            arc.source.id === highlightNode.id ||
            arc.target.id === highlightNode.id
          );

          const isDimmed = highlightNode && !isHighlighted && !isJourneyArc;

          const { cpx, cpy } = arcControlPoint(arc, time);

          // Determine visual treatment
          let alpha = arc.char.alpha;
          let color = arc.color;
          let width = arc.char.width;

          if (isHighlighted) {
            // Skip highlighted arcs — draw them in a second pass with source-over
          } else if (isJourneyArc) {
            // Journey trail: type colour, luminous, with soft glow
            color = arc.glow;
            alpha = 0.35;
            width = 2.5;
          } else if (isSealed) {
            // Faint ghost field behind the sealed path
            alpha = arc.char.alpha * 0.15;
          } else if (isDimmed) {
            alpha = arc.char.alpha * 0.12;
          }

          if (filterType && filterType === type && !isJourneyArc && !isHighlighted) {
            alpha = arc.char.alpha * 2.5;
          }

          if (!isHighlighted) {
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.quadraticCurveTo(cpx, cpy, tx, ty);
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = width;
            ctx.stroke();
          }
        }
      }

      // === HIGHLIGHTED NEIGHBOUR ARCS — fine thread with subtle type colour gradient ===
      if (highlightNode) {
        ctx.globalCompositeOperation = 'source-over';
        for (const type of Object.keys(arcsByType)) {
          if (filterType && filterType !== type) continue;
          for (const arc of arcsByType[type]) {
            const isHighlighted = (arc.source.id === highlightNode.id || arc.target.id === highlightNode.id);
            if (!isHighlighted) continue;

            const sx = arc.source.ringX, sy = arc.source.ringY;
            const tx = arc.target.ringX, ty = arc.target.ringY;
            const { cpx, cpy } = arcControlPoint(arc, time);
            const glowColor = arc.glow;
            const r = parseInt(glowColor.slice(1, 3), 16);
            const g = parseInt(glowColor.slice(3, 5), 16);
            const b = parseInt(glowColor.slice(5, 7), 16);

            // Single fine thread — gradient fades at ends, colour blooms gently in the middle
            const grad = ctx.createLinearGradient(sx, sy, tx, ty);
            grad.addColorStop(0, `rgba(${r},${g},${b},0.03)`);
            grad.addColorStop(0.3, `rgba(${r},${g},${b},0.25)`);
            grad.addColorStop(0.5, `rgba(${r},${g},${b},0.35)`);
            grad.addColorStop(0.7, `rgba(${r},${g},${b},0.25)`);
            grad.addColorStop(1, `rgba(${r},${g},${b},0.03)`);

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.quadraticCurveTo(cpx, cpy, tx, ty);
            ctx.strokeStyle = grad;
            ctx.lineWidth = arc.char.width;
            ctx.globalAlpha = 1;
            ctx.stroke();
          }
        }
        ctx.globalCompositeOperation = 'lighter';
      }

      // === JOURNEY TRAIL — drawn on top with glow ===
      if (jNodes.length > 1) {
        ctx.globalCompositeOperation = 'source-over';

        for (let i = 1; i < jNodes.length; i++) {
          const prevNode = nodeMap.get(jNodes[i - 1].entry.id);
          const currNode = nodeMap.get(jNodes[i].entry.id);
          if (!prevNode || !currNode) continue;

          const arc = arcLookup.get(`${prevNode.id}-${currNode.id}`);
          const type = jNodes[i].connectionType;
          const trailColor = TYPE_GLOW[type] || '#E8E4DC';

          if (arc) {
            const sx = prevNode.ringX, sy = prevNode.ringY;
            const tx = currNode.ringX, ty = currNode.ringY;
            const { cpx, cpy } = arcControlPoint(arc, time);

            // Outer glow
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.quadraticCurveTo(cpx, cpy, tx, ty);
            ctx.strokeStyle = trailColor;
            ctx.globalAlpha = 0.15;
            ctx.lineWidth = 6;
            ctx.stroke();

            // Core line
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.quadraticCurveTo(cpx, cpy, tx, ty);
            ctx.strokeStyle = trailColor;
            ctx.globalAlpha = 0.7;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      // === NODES ===
      ctx.globalCompositeOperation = 'source-over';

      for (const n of nodes) {
        const isActive = highlightNode && n.id === highlightNode.id;
        const isNeighbour = highlightNeighbours && highlightNeighbours.has(n.id);
        const isJourney = journeyNodeIds.has(n.id);

        const r = isActive ? 5 : isJourney ? 4 : isNeighbour ? 3 : Math.max(1.2, Math.sqrt(n.connectionCount) * 0.5);

        // Journey nodes get a subtle outer glow
        if (isJourney && !isActive) {
          ctx.beginPath();
          ctx.arc(n.ringX, n.ringY, r + 3, 0, Math.PI * 2);
          ctx.fillStyle = DISC_COLORS[n.discipline] || '#888';
          ctx.globalAlpha = 0.15;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.ringX, n.ringY, r, 0, Math.PI * 2);
        ctx.fillStyle = DISC_COLORS[n.discipline] || '#888';
        ctx.globalAlpha = isActive ? 1.0 : isJourney ? 0.9 : isNeighbour ? 0.8 : isSealed ? 0.04 : highlightNode ? 0.06 : 0.25;
        ctx.fill();

        if (isActive) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.9;
          ctx.stroke();
        }
      }

      // === LABELS ===

      // Hovered/selected node label
      if (highlightNode) {
        ctx.globalAlpha = 1;
        ctx.font = '500 13px "DM Sans", sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';

        // Position label avoiding overlap with ring
        const angle = highlightNode.angle || 0;
        const labelSide = (angle > -Math.PI / 2 && angle < Math.PI / 2) ? 'right' : 'left';
        ctx.textAlign = labelSide === 'right' ? 'left' : 'right';
        const labelOffset = labelSide === 'right' ? 10 : -10;
        ctx.fillText(highlightNode.title, highlightNode.ringX + labelOffset, highlightNode.ringY);

        // Neighbour labels with connection type indicator
        if (highlightNeighbours) {
          const neighbourEdges = adjEdges.get(highlightNode.id) || [];

          for (const { otherId, type } of neighbourEdges) {
            const nn = nodeMap.get(otherId);
            if (!nn) continue;
            const dx = nn.ringX - highlightNode.ringX;
            const dy = nn.ringY - highlightNode.ringY;
            if (Math.sqrt(dx * dx + dy * dy) > radius * 1.5) continue;

            const nnAngle = nn.angle || 0;
            const nnSide = (nnAngle > -Math.PI / 2 && nnAngle < Math.PI / 2) ? 'right' : 'left';
            const nnOffset = nnSide === 'right' ? 10 : -10;

            // Type dot
            const dotColor = TYPE_GLOW[type] || '#888';
            ctx.beginPath();
            ctx.arc(nn.ringX + (nnSide === 'right' ? 4 : -4), nn.ringY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.globalAlpha = 0.8;
            ctx.fill();

            // Name
            ctx.font = '10px "DM Sans", sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.55)';
            ctx.globalAlpha = 1;
            ctx.textAlign = nnSide === 'right' ? 'left' : 'right';
            ctx.fillText(nn.title, nn.ringX + nnOffset + (nnSide === 'right' ? 6 : -6), nn.ringY);
          }
        }
      }

      // Journey node labels
      if (jNodes.length > 0 && !highlightNode) {
        ctx.font = '500 10px "DM Sans", sans-serif';
        ctx.fillStyle = 'rgba(232, 228, 220, 0.7)';
        ctx.textBaseline = 'middle';
        for (const j of jNodes) {
          const n = nodeMap.get(j.entry.id);
          if (!n) continue;
          const nAngle = n.angle || 0;
          const nSide = (nAngle > -Math.PI / 2 && nAngle < Math.PI / 2) ? 'right' : 'left';
          ctx.textAlign = nSide === 'right' ? 'left' : 'right';
          ctx.globalAlpha = 1;
          ctx.fillText(n.title, n.ringX + (nSide === 'right' ? 8 : -8), n.ringY);
        }
      }

      // Discipline labels
      ctx.globalAlpha = highlightNode ? 0.12 : 0.25;
      ctx.font = '300 8px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const labelR = radius + 26;
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

    // --- Events ---
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      // Convert screen to world coordinates
      mouse.x = (screenX - view.panX) / view.scale;
      mouse.y = (screenY - view.panY) / view.scale;
      mouse.active = true;

      if (view.dragging) {
        view.panX += screenX - view.dragStartX;
        view.panY += screenY - view.dragStartY;
        view.dragStartX = screenX;
        view.dragStartY = screenY;
        canvas.style.cursor = 'grabbing';
      } else {
        canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      hoveredNode = null;
    };

    let clickTimer = null;
    let clickedNodeSnapshot = null;

    const handleClick = () => {
      // Don't trigger click if we just dragged
      if (didDrag) { didDrag = false; return; }
      // Snapshot the hovered node now — it may change during the delay
      clickedNodeSnapshot = hoveredNode;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickTimer = null;
        const node = clickedNodeSnapshot;

        // If journey is sealed, single click anywhere unseals and starts fresh
        if (sealedRef.current) {
          sealedRef.current = false;
          setJourneySealed(false);
          if (node) {
            selectedNode = node;
            const entry = getEntry(node.id);
            if (entry) {
              const step = { entry, connectionText: null, connectionType: null, fromEntry: null };
              journeyRef.current = [step];
              setJourney([step]);
            }
          } else {
            journeyRef.current = [];
            setJourney([]);
            selectedNode = null;
          }
          return;
        }

        if (node) {
          selectedNode = node;
          const entry = getEntry(node.id);
          if (!entry) return;

          const currentJourney = journeyRef.current;

          if (currentJourney.length === 0) {
            const step = { entry, connectionText: null, connectionType: null, fromEntry: null };
            const newJourney = [step];
            journeyRef.current = newJourney;
            setJourney(newJourney);
          } else {
            const lastEntry = currentJourney[currentJourney.length - 1].entry;
            const edge = GRAPH.edges.find(e =>
              (e.source === lastEntry.id && e.target === hoveredNode.id) ||
              (e.target === lastEntry.id && e.source === hoveredNode.id)
            );

            if (edge) {
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
              const step = { entry, connectionText: null, connectionType: null, fromEntry: null };
              const newJourney = [step];
              journeyRef.current = newJourney;
              setJourney(newJourney);
            }
          }
        }
      }, 250);
    };

    const handleDblClick = (e) => {
      e.preventDefault();
      // Cancel the pending single click
      if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
      const currentJourney = journeyRef.current;
      if (currentJourney.length >= 2) {
        sealedRef.current = true;
        setJourneySealed(true);
        selectedNode = null;
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

    const handleWheel = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseScreenX = e.clientX - rect.left;
      const mouseScreenY = e.clientY - rect.top;

      // Zoom towards cursor
      const zoomFactor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
      const newScale = Math.max(0.5, Math.min(3, view.scale * zoomFactor));
      const scaleChange = newScale / view.scale;

      view.panX = mouseScreenX - (mouseScreenX - view.panX) * scaleChange;
      view.panY = mouseScreenY - (mouseScreenY - view.panY) * scaleChange;
      view.scale = newScale;
    };

    let didDrag = false;

    const handleMouseDown = (e) => {
      if (e.button !== 0) return;
      didDrag = false;
      if (!hoveredNode) {
        view.dragging = true;
        const rect = canvas.getBoundingClientRect();
        view.dragStartX = e.clientX - rect.left;
        view.dragStartY = e.clientY - rect.top;
      }
    };

    const handleMouseUp = () => {
      if (view.dragging) didDrag = true;
      view.dragging = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('dblclick', handleDblClick);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    const filterRef = { set: (v) => { filterType = v; } };
    canvas._filterRef = filterRef;

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('dblclick', handleDblClick);
      canvas.removeEventListener('wheel', handleWheel);
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
    sealedRef.current = false;
    setJourneySealed(false);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: CANVAS.background, overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* Connection type filter bar */}
      <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10 }}>
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <button
            key={type}
            onClick={() => toggleFilter(type)}
            style={{
              padding: '5px 12px',
              borderRadius: 16,
              border: `1px solid ${activeFilter === type ? TYPE_GLOW[type] : 'rgba(255,255,255,0.1)'}`,
              background: activeFilter === type ? TYPE_GLOW[type] + '18' : 'rgba(0,0,0,0.4)',
              color: activeFilter === type ? TYPE_GLOW[type] : 'rgba(255,255,255,0.4)',
              fontSize: 9,
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.3s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dev overlay */}
      {devMode && (
        <div style={{ position: 'absolute', top: 16, right: 16, color: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace', textAlign: 'right', letterSpacing: '0.02em' }}>
          <div>{fps} fps</div>
          <div>{GRAPH.stats.nodeCount} nodes · {GRAPH.stats.edgeCount} arcs</div>
        </div>
      )}

      {/* Journey panel */}
      {journey.length > 0 && (
        <div style={{
          position: 'absolute', left: 20, top: 60, width: 360, maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto', background: 'rgba(10, 12, 16, 0.88)', backdropFilter: 'blur(24px)',
          borderRadius: 16, padding: '24px 24px 20px', color: '#fff', fontFamily: '"DM Sans", sans-serif',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.35, fontWeight: 500 }}>
              Journey · {journey.length} {journey.length === 1 ? 'step' : 'steps'}
            </div>
            <button
              onClick={clearJourney}
              style={{
                padding: '3px 10px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)',
                fontSize: 8, cursor: 'pointer', borderRadius: 10,
                fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.08em',
                textTransform: 'uppercase', transition: 'all 0.2s ease',
              }}
            >
              Clear
            </button>
          </div>

          {journey.map((step, i) => {
            const nextStep = journey[i + 1] || null;
            const typeColor = nextStep ? (TYPE_GLOW[nextStep.connectionType] || '#555') : null;

            return (
              <div key={`${step.entry.id}-${i}`}>
                {/* Object */}
                <div style={{ marginBottom: nextStep ? 6 : 0 }}>
                  <div style={{ fontSize: 15, fontFamily: '"DM Serif Display", serif', lineHeight: 1.25, color: '#E8E4DC' }}>
                    {step.entry.title}
                  </div>
                  <div style={{ fontSize: 9, opacity: 0.4, marginTop: 3, letterSpacing: '0.02em' }}>
                    {step.entry.designer}, {step.entry.year}
                  </div>
                </div>

                {/* Connection text to next */}
                {nextStep && nextStep.connectionText && (
                  <div style={{
                    margin: '12px 0 16px',
                    paddingLeft: 14,
                    borderLeft: `1.5px solid ${typeColor}`,
                    position: 'relative',
                  }}>
                    {/* Type label */}
                    <div style={{
                      fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: typeColor, opacity: 0.7, marginBottom: 6, fontWeight: 500,
                    }}>
                      {TYPE_LABELS[nextStep.connectionType]}
                    </div>
                    {/* Connection prose */}
                    <div style={{
                      fontSize: 12, lineHeight: 1.7, color: 'rgba(232, 228, 220, 0.75)',
                      fontStyle: 'italic', fontWeight: 300,
                    }}>
                      {nextStep.connectionText}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Invitation or sealed state */}
          {journey.length === 1 && !journeySealed && (
            <div style={{
              fontSize: 10, opacity: 0.25, marginTop: 12,
              fontStyle: 'italic', fontWeight: 300,
            }}>
              Follow a connection to begin
            </div>
          )}
          {journey.length >= 2 && !journeySealed && (
            <div style={{
              fontSize: 9, opacity: 0.2, marginTop: 14,
              fontStyle: 'italic', fontWeight: 300,
            }}>
              Double-click to reflect on this path
            </div>
          )}
          {journeySealed && (
            <div style={{
              fontSize: 9, opacity: 0.3, marginTop: 14,
              fontStyle: 'italic', fontWeight: 300,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: 12,
            }}>
              {journey.length} steps · Click anywhere to start a new journey
            </div>
          )}
        </div>
      )}
    </div>
  );
}
