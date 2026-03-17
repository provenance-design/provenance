/**
 * Provenance Network Visualiser — Canvas Renderer
 *
 * Single draw loop per frame. Batches operations to minimise canvas state changes.
 * Renders: edges, nodes, particles, traces, labels (in that z-order).
 *
 * Pure JavaScript class. No React dependency.
 */

import { DISCIPLINE_COLORS, TYPE_COLORS, CANVAS, SCALE_BREAKPOINTS } from './constants.js';

export class CanvasRenderer {
  constructor(canvas, graph) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.graph = graph;
    this.nodeMap = graph.nodeMap;

    // Camera state (set by InteractionManager)
    this.tx = 0;
    this.ty = 0;
    this.scale = 0.15; // start zoomed out for macro view

    // Selection state
    this.hoveredId = null;
    this.selectedId = null;

    // Active filters
    this.activeTypes = null; // null = all types shown

    // Scale mode
    this.scaleMode = 'macro';

    // Pre-rendered label cache
    this._labelCache = new Map();
  }

  /**
   * Set camera transform.
   */
  setCamera(tx, ty, scale) {
    this.tx = tx;
    this.ty = ty;
    this.scale = scale;

    // Determine scale mode
    if (scale < SCALE_BREAKPOINTS.macro.max) {
      this.scaleMode = 'macro';
    } else if (scale < SCALE_BREAKPOINTS.meso.max) {
      this.scaleMode = 'meso';
    } else {
      this.scaleMode = 'micro';
    }
  }

  /**
   * Main draw call. One frame.
   * Returns timing data for performance monitoring.
   */
  draw(particles, traces) {
    const t0 = performance.now();
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.fillStyle = CANVAS.background;
    ctx.fillRect(0, 0, w, h);

    // Apply camera transform
    ctx.save();
    ctx.translate(w / 2 + this.tx, h / 2 + this.ty);
    ctx.scale(this.scale, this.scale);

    const t1 = performance.now();

    // Draw edges
    this._drawEdges();

    const t2 = performance.now();

    // Draw particles (if provided)
    if (particles && particles.length > 0) {
      this._drawParticles(particles);
    }

    const t3 = performance.now();

    // Draw traces (if provided)
    if (traces && traces.length > 0) {
      this._drawTraces(traces);
    }

    // Draw nodes
    this._drawNodes();

    const t4 = performance.now();

    // Draw labels (scale-dependent)
    if (this.scaleMode !== 'macro') {
      this._drawLabels();
    }

    const t5 = performance.now();

    // Draw selection highlight
    if (this.selectedId !== null) {
      this._drawSelectionHighlight();
    }

    ctx.restore();

    return {
      clear: t1 - t0,
      edges: t2 - t1,
      particles: t3 - t2,
      nodes: t4 - t3,
      labels: t5 - t4,
      total: performance.now() - t0,
    };
  }

  /**
   * Draw all edges.
   */
  _drawEdges() {
    const { ctx } = this;

    for (const edge of this.graph.edges) {
      // Filter by active type
      if (this.activeTypes && this.activeTypes !== edge.type) continue;

      const source = this.nodeMap.get(edge.source);
      const target = this.nodeMap.get(edge.target);
      if (!source || !target) continue;

      // Highlight edges connected to hovered/selected node
      const isHighlighted =
        this.hoveredId === edge.source || this.hoveredId === edge.target ||
        this.selectedId === edge.source || this.selectedId === edge.target;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = TYPE_COLORS[edge.type] || '#555';
      ctx.globalAlpha = isHighlighted ? CANVAS.hoverEdgeOpacity : CANVAS.edgeOpacity;
      ctx.lineWidth = isHighlighted ? 1.5 / this.scale : CANVAS.edgeWidth / this.scale;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  /**
   * Draw all nodes.
   */
  _drawNodes() {
    const { ctx } = this;
    const maxConn = this.graph.stats.maxConnections;

    for (const node of this.graph.nodes) {
      const r = this._nodeRadius(node, maxConn);
      const isActive = this.hoveredId === node.id || this.selectedId === node.id;

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = DISCIPLINE_COLORS[node.discipline] || '#888';
      ctx.globalAlpha = isActive ? 1.0 : 0.7;
      ctx.fill();

      if (isActive) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2 / this.scale;
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
  }

  /**
   * Calculate node radius based on connection count.
   */
  _nodeRadius(node, maxConn) {
    const t = Math.sqrt(node.connectionCount / (maxConn || 1));
    const r = CANVAS.nodeMinRadius + t * (CANVAS.nodeMaxRadius - CANVAS.nodeMinRadius);
    return r / this.scale; // scale-independent visual size
  }

  /**
   * Draw labels at meso/micro scale.
   */
  _drawLabels() {
    const { ctx } = this;
    const fontSize = Math.max(10, 12 / this.scale);

    ctx.font = `${fontSize}px "DM Sans", sans-serif`;
    ctx.fillStyle = CANVAS.labelColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const maxConn = this.graph.stats.maxConnections;

    for (const node of this.graph.nodes) {
      // At meso scale, only show labels for higher-connection nodes
      if (this.scaleMode === 'meso' && node.connectionCount < 6) continue;

      const r = this._nodeRadius(node, maxConn);
      ctx.fillText(node.title, node.x + r + 4 / this.scale, node.y);
    }
  }

  /**
   * Draw particles along connection edges.
   */
  _drawParticles(particles) {
    const { ctx } = this;
    ctx.globalAlpha = 0.6;

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius / this.scale, 0, Math.PI * 2);
      ctx.fillStyle = TYPE_COLORS[p.type] || '#888';
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  /**
   * Draw user navigation traces.
   */
  _drawTraces(traces) {
    const { ctx } = this;

    for (let i = 1; i < traces.length; i++) {
      const prev = this.nodeMap.get(traces[i - 1].id);
      const curr = this.nodeMap.get(traces[i].id);
      if (!prev || !curr) continue;

      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.strokeStyle = TYPE_COLORS[traces[i].type] || '#fff';
      ctx.globalAlpha = CANVAS.traceOpacity;
      ctx.lineWidth = 3 / this.scale;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  /**
   * Draw selection highlight — connected nodes and edges emphasised.
   */
  _drawSelectionHighlight() {
    // The emphasis is handled in _drawEdges and _drawNodes via isHighlighted/isActive checks.
    // This method can be extended for additional selection UI (ego-network glow, etc.)
  }

  /**
   * Hit-test: find the node at screen coordinates.
   */
  hitTest(screenX, screenY) {
    // Convert screen coords to world coords
    const worldX = (screenX - this.canvas.width / 2 - this.tx) / this.scale;
    const worldY = (screenY - this.canvas.height / 2 - this.ty) / this.scale;
    const maxConn = this.graph.stats.maxConnections;

    let closest = null;
    let closestDist = Infinity;

    for (const node of this.graph.nodes) {
      const dx = node.x - worldX;
      const dy = node.y - worldY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const r = this._nodeRadius(node, maxConn);
      const hitRadius = Math.max(r, 15 / this.scale); // minimum touch target

      if (dist < hitRadius && dist < closestDist) {
        closest = node;
        closestDist = dist;
      }
    }

    return closest;
  }
}
