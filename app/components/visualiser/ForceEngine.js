/**
 * Provenance Network Visualiser — Force Engine
 *
 * Layered priority force simulation. Each connection type applies a distinct
 * force — the Xenakis transduction principle. Forces run in sequence each tick
 * with earlier layers (lineage) having greater influence through alpha decay.
 *
 * Execution order per tick:
 *   1. Spatial hash rebuild
 *   2. Repulsion (spatial-hash accelerated, O(n*k))
 *   3. Lineage — vertical cascade
 *   4. Method — lateral affinity
 *   5. Material — gravitational clump
 *   6. Argument — tensile opposition
 *   7. Zeitgeist — atmospheric field
 *   8. sameProblem — orbital
 *   9. Centering — prevents drift
 *  10. Integration — velocity damping + position update
 *
 * Pure JavaScript class. No React dependency.
 */

import { CONNECTION_FORCES, FORCE_LAYERS, LAYER_DECAY, PERFORMANCE } from './constants.js';

export class ForceEngine {
  constructor(graph) {
    this.nodes = graph.nodes;
    this.edges = graph.edges;
    this.nodeMap = graph.nodeMap;
    this.adjacency = graph.adjacency;
    this.width = 0;
    this.height = 0;
    this.iteration = 0;
    this.settled = false;
    this.alpha = 1.0;

    // Spatial hash for O(n*k) repulsion
    this.cellSize = PERFORMANCE.spatialHashCellSize;
    this.grid = new Map();

    // Active connection types (for entry sequence phasing)
    this.activeTypes = new Set(Object.keys(CONNECTION_FORCES));

    // Pre-bucket edges by type for efficient per-layer iteration
    this.edgesByType = new Map();
    this._bucketEdges();

    // Force function dispatch table (avoids switch per edge)
    this._forceFn = {
      'vertical-cascade':   this._forceVerticalCascade.bind(this),
      'tensile-opposition':  this._forceTensileOpposition.bind(this),
      'lateral-affinity':    this._forceLateralAffinity.bind(this),
      'orbital':             this._forceOrbital.bind(this),
      'gravitational-clump': this._forceGravitationalClump.bind(this),
      'atmospheric-field':   this._forceAtmosphericField.bind(this),
    };

    this._initPositions();
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  /**
   * Pre-sort edges into buckets by connection type.
   * Called once at construction so per-layer iteration is a single array scan.
   */
  _bucketEdges() {
    this.edgesByType.clear();
    for (const type of FORCE_LAYERS) {
      this.edgesByType.set(type, []);
    }
    for (const edge of this.edges) {
      const bucket = this.edgesByType.get(edge.type);
      if (bucket) bucket.push(edge);
    }
  }

  /**
   * Initialise node positions.
   * Scatter by discipline group to give the force system a head start.
   */
  _initPositions() {
    const disciplines = new Map();
    this.nodes.forEach(n => {
      if (!disciplines.has(n.discipline)) disciplines.set(n.discipline, []);
      disciplines.get(n.discipline).push(n);
    });

    const discArray = [...disciplines.keys()];
    const angleStep = (Math.PI * 2) / discArray.length;

    discArray.forEach((disc, i) => {
      const angle = angleStep * i;
      const groupNodes = disciplines.get(disc);
      const cx = Math.cos(angle) * 300;
      const cy = Math.sin(angle) * 300;

      groupNodes.forEach(n => {
        const jitter = 150;
        n.x = cx + (Math.random() - 0.5) * jitter;
        n.y = cy + (Math.random() - 0.5) * jitter;
        n.vx = 0;
        n.vy = 0;
      });
    });
  }

  /**
   * Rebuild the spatial hash grid for efficient repulsion.
   */
  _rebuildSpatialHash() {
    this.grid.clear();
    for (const node of this.nodes) {
      const cx = Math.floor(node.x / this.cellSize);
      const cy = Math.floor(node.y / this.cellSize);
      const key = `${cx},${cy}`;
      if (!this.grid.has(key)) this.grid.set(key, []);
      this.grid.get(key).push(node);
    }
  }

  /**
   * Get neighbouring nodes from adjacent spatial hash cells.
   */
  _getNeighbours(node) {
    const cx = Math.floor(node.x / this.cellSize);
    const cy = Math.floor(node.y / this.cellSize);
    const neighbours = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${cx + dx},${cy + dy}`;
        const cell = this.grid.get(key);
        if (cell) {
          for (const n of cell) {
            if (n !== node) neighbours.push(n);
          }
        }
      }
    }
    return neighbours;
  }

  /**
   * Run one simulation tick.
   * Returns timing data for performance monitoring.
   */
  tick() {
    const t0 = performance.now();

    this._rebuildSpatialHash();
    const t1 = performance.now();

    // 1. Repulsion (spatial-hash accelerated)
    this._applyRepulsion();
    const t2 = performance.now();

    // 2-7. Layered connection forces — each type in priority order
    this._applyLayeredForces();
    const t3 = performance.now();

    // 8. Centering — prevents drift
    this._applyCentering();

    // 9. Integration — damping + position update
    this._integrate();

    // Cool down
    this.alpha *= 0.999;
    if (this.alpha < 0.001) this.settled = true;
    this.iteration++;

    const t4 = performance.now();

    return {
      hash: t1 - t0,
      repulsion: t2 - t1,
      connection: t3 - t2,
      integrate: t4 - t3,
      total: t4 - t0,
    };
  }

  /**
   * Node-node repulsion using spatial hash.
   */
  _applyRepulsion() {
    const repulsionStrength = 800 * this.alpha;

    for (const node of this.nodes) {
      const neighbours = this._getNeighbours(node);
      for (const other of neighbours) {
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 1) continue;
        const dist = Math.sqrt(distSq);
        const force = repulsionStrength / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        node.vx += fx;
        node.vy += fy;
      }
    }
  }

  /**
   * Layered priority force model.
   *
   * Each connection type runs as its own layer, in FORCE_LAYERS order.
   * Layer 0 (lineage) runs at full alpha. Each subsequent layer runs at
   * alpha * (1 - LAYER_DECAY * layerIndex), so lineage dominates structure
   * and later forces adjust within that structure.
   */
  _applyLayeredForces() {
    for (let layerIndex = 0; layerIndex < FORCE_LAYERS.length; layerIndex++) {
      const type = FORCE_LAYERS[layerIndex];

      // Skip inactive types (entry sequence phasing)
      if (!this.activeTypes.has(type)) continue;

      const edges = this.edgesByType.get(type);
      if (!edges || edges.length === 0) continue;

      const config = CONNECTION_FORCES[type];
      if (!config) continue;

      // Layer alpha — diminishing influence for later layers
      const layerAlpha = this.alpha * Math.max(0, 1 - LAYER_DECAY * layerIndex);

      const forceFn = this._forceFn[config.type];
      if (!forceFn) continue;

      for (const edge of edges) {
        const source = this.nodeMap.get(edge.source);
        const target = this.nodeMap.get(edge.target);
        if (!source || !target) continue;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        forceFn(source, target, dx, dy, dist, config.tension, layerAlpha);
      }
    }
  }

  // === Individual force functions ===
  // Each receives layerAlpha instead of computing from this.alpha directly.

  /**
   * LINEAGE: Gravitational, vertical. Earlier objects above later ones.
   * Source (earlier year) pulls upward, target (later year) pulls downward.
   */
  _forceVerticalCascade(source, target, dx, dy, dist, tension, layerAlpha) {
    const strength = tension * layerAlpha;
    const idealDist = 120;
    const springForce = (dist - idealDist) / dist * strength;

    // Horizontal spring to preferred distance
    source.vx += (dx / dist) * springForce * 0.5;
    target.vx -= (dx / dist) * springForce * 0.5;

    // Vertical ordering: earlier year above (negative y)
    const yearDiff = (target.year || 1900) - (source.year || 1900);
    const verticalBias = Math.sign(yearDiff) * strength * 2;
    source.vy -= verticalBias;
    target.vy += verticalBias;
  }

  /**
   * ARGUMENT: Tensile, oppositional. Objects held apart at distance with taut spring.
   * High tension, never fully resolving. Wider ideal distance.
   */
  _forceTensileOpposition(source, target, dx, dy, dist, tension, layerAlpha) {
    const strength = tension * layerAlpha;
    const idealDist = 200;
    const springForce = (dist - idealDist) / dist * strength;
    source.vx += (dx / dist) * springForce;
    source.vy += (dy / dist) * springForce;
    target.vx -= (dx / dist) * springForce;
    target.vy -= (dy / dist) * springForce;
  }

  /**
   * METHOD: Lateral affinity. Horizontal clustering, workbench arrangement.
   * Pulls objects to same horizontal band with gentle attraction.
   */
  _forceLateralAffinity(source, target, dx, dy, dist, tension, layerAlpha) {
    const strength = tension * layerAlpha;
    const idealDist = 80;
    const springForce = (dist - idealDist) / dist * strength;

    // Stronger horizontal pull, weaker vertical
    source.vx += (dx / dist) * springForce * 1.5;
    source.vy += (dy / dist) * springForce * 0.3;
    target.vx -= (dx / dist) * springForce * 1.5;
    target.vy -= (dy / dist) * springForce * 0.3;
  }

  /**
   * SAME PROBLEM: Orbital. Objects revolve slowly around their midpoint.
   * Tangential force + weak radial spring.
   */
  _forceOrbital(source, target, dx, dy, dist, tension, layerAlpha) {
    const strength = tension * layerAlpha;
    const idealDist = 150;
    const springForce = (dist - idealDist) / dist * strength * 0.5;

    // Radial spring
    source.vx += (dx / dist) * springForce;
    source.vy += (dy / dist) * springForce;
    target.vx -= (dx / dist) * springForce;
    target.vy -= (dy / dist) * springForce;

    // Tangential (perpendicular) force for slow orbit
    const tangentialStrength = strength * 0.3;
    source.vx += (-dy / dist) * tangentialStrength;
    source.vy += (dx / dist) * tangentialStrength;
    target.vx -= (-dy / dist) * tangentialStrength;
    target.vy -= (dx / dist) * tangentialStrength;
  }

  /**
   * MATERIAL: Gravitational clump. Strong short-range attraction.
   * Objects sharing material cluster tightly.
   */
  _forceGravitationalClump(source, target, dx, dy, dist, tension, layerAlpha) {
    const strength = tension * layerAlpha;
    const idealDist = 50;
    const springForce = (dist - idealDist) / dist * strength * 1.5;
    source.vx += (dx / dist) * springForce;
    source.vy += (dy / dist) * springForce;
    target.vx -= (dx / dist) * springForce;
    target.vy -= (dy / dist) * springForce;
  }

  /**
   * ZEITGEIST: Atmospheric field. Very weak, diffuse attraction.
   * Tints a region rather than pulling two specific points together.
   */
  _forceAtmosphericField(source, target, dx, dy, dist, tension, layerAlpha) {
    const strength = tension * layerAlpha;
    const idealDist = 180;
    const springForce = (dist - idealDist) / dist * strength * 0.3;
    source.vx += (dx / dist) * springForce;
    source.vy += (dy / dist) * springForce;
    target.vx -= (dx / dist) * springForce;
    target.vy -= (dy / dist) * springForce;
  }

  /**
   * Gentle centering force to prevent drift.
   */
  _applyCentering() {
    const strength = 0.01 * this.alpha;
    for (const node of this.nodes) {
      node.vx -= node.x * strength;
      node.vy -= node.y * strength;
    }
  }

  /**
   * Velocity integration with damping.
   */
  _integrate() {
    const damping = 0.85;
    const maxVelocity = 10;
    for (const node of this.nodes) {
      node.vx *= damping;
      node.vy *= damping;
      // Clamp velocity
      const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
      if (speed > maxVelocity) {
        node.vx = (node.vx / speed) * maxVelocity;
        node.vy = (node.vy / speed) * maxVelocity;
      }
      node.x += node.vx;
      node.y += node.vy;
    }
  }

  /**
   * Set which connection types are active (for entry sequence phasing).
   */
  setActiveTypes(types) {
    this.activeTypes = new Set(types);
    // Reheat slightly when new types are introduced
    this.alpha = Math.max(this.alpha, 0.3);
    this.settled = false;
  }

  /**
   * Reset the simulation (replay entry sequence).
   */
  reset() {
    this.alpha = 1.0;
    this.iteration = 0;
    this.settled = false;
    this._initPositions();
  }
}
