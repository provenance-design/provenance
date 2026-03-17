/**
 * Provenance Network Visualiser — Particle System
 *
 * Ambient particles flowing along connection edges.
 * Each connection type produces particles with distinct kinetic character.
 * Object-pooled for performance.
 *
 * Pure JavaScript class. No React dependency.
 */

import { CONNECTION_FORCES, PERFORMANCE } from './constants.js';

class Particle {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 0;
    this.maxLife = 0;
    this.type = '';
    this.radius = 1.5;
    this.active = false;
    this.edgeSource = null;
    this.edgeTarget = null;
    this.progress = 0; // 0-1 along edge
  }

  reset(source, target, type) {
    this.x = source.x;
    this.y = source.y;
    this.edgeSource = source;
    this.edgeTarget = target;
    this.type = type;
    this.progress = 0;
    this.life = 0;
    this.active = true;
    this.radius = 1.5;

    // Lifespan varies by type
    const config = CONNECTION_FORCES[type];
    switch (config?.particle) {
      case 'drift-down':    this.maxLife = 180 + Math.random() * 60; break;
      case 'oscillate':     this.maxLife = 120 + Math.random() * 80; break;
      case 'settle':        this.maxLife = 200 + Math.random() * 40; break;
      case 'slow-revolve':  this.maxLife = 300 + Math.random() * 100; break;
      case 'heavy-drift':   this.maxLife = 250 + Math.random() * 50; break;
      case 'diffuse':       this.maxLife = 150 + Math.random() * 100; break;
      default:              this.maxLife = 150; break;
    }
  }
}

export class ParticleSystem {
  constructor(graph) {
    this.graph = graph;
    this.pool = [];
    this.activeParticles = [];

    // Pre-allocate particle pool
    for (let i = 0; i < PERFORMANCE.maxParticles; i++) {
      this.pool.push(new Particle());
    }

    this.spawnRate = 2; // particles per frame
    this.edgeIndex = 0;
    this.activeTypes = new Set(Object.keys(CONNECTION_FORCES));
  }

  /**
   * Get a particle from the pool.
   */
  _acquire() {
    for (const p of this.pool) {
      if (!p.active) return p;
    }
    return null; // pool exhausted
  }

  /**
   * Spawn new particles along edges.
   */
  _spawn() {
    const edges = this.graph.edges;
    if (edges.length === 0) return;

    for (let i = 0; i < this.spawnRate; i++) {
      // Round-robin through edges
      this.edgeIndex = (this.edgeIndex + 1) % edges.length;
      const edge = edges[this.edgeIndex];

      if (!this.activeTypes.has(edge.type)) continue;

      const source = this.graph.nodeMap.get(edge.source);
      const target = this.graph.nodeMap.get(edge.target);
      if (!source || !target) continue;

      const p = this._acquire();
      if (!p) break; // pool full

      p.reset(source, target, edge.type);
      this.activeParticles.push(p);
    }
  }

  /**
   * Update all active particles.
   */
  tick() {
    const t0 = performance.now();

    this._spawn();

    // Update each particle
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const p = this.activeParticles[i];
      p.life++;

      if (p.life >= p.maxLife) {
        p.active = false;
        this.activeParticles.splice(i, 1);
        continue;
      }

      // Move particle along edge with type-specific behaviour
      this._updateParticle(p);
    }

    return {
      count: this.activeParticles.length,
      time: performance.now() - t0,
    };
  }

  /**
   * Type-specific particle movement.
   */
  _updateParticle(p) {
    const source = p.edgeSource;
    const target = p.edgeTarget;
    const config = CONNECTION_FORCES[p.type];

    // Base: move along edge
    const speed = 0.005;

    switch (config?.particle) {
      case 'drift-down':
        // Steady downward drift along edge
        p.progress += speed * 0.8;
        p.x = source.x + (target.x - source.x) * p.progress;
        p.y = source.y + (target.y - source.y) * p.progress + p.life * 0.1;
        p.radius = 1.5;
        break;

      case 'oscillate':
        // Oscillate perpendicular to edge direction
        p.progress += speed;
        const baseX = source.x + (target.x - source.x) * p.progress;
        const baseY = source.y + (target.y - source.y) * p.progress;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const perpX = -dy / len;
        const perpY = dx / len;
        const osc = Math.sin(p.life * 0.15) * 8;
        p.x = baseX + perpX * osc;
        p.y = baseY + perpY * osc;
        p.radius = 1.5 + Math.abs(Math.sin(p.life * 0.1)) * 0.5;
        break;

      case 'settle':
        // Move toward target, decelerating
        p.progress += speed * (1 - p.progress * 0.5);
        p.x = source.x + (target.x - source.x) * p.progress;
        p.y = source.y + (target.y - source.y) * p.progress;
        p.radius = 1.2;
        break;

      case 'slow-revolve':
        // Orbit around midpoint
        const mx = (source.x + target.x) / 2;
        const my = (source.y + target.y) / 2;
        const orbitR = Math.sqrt((target.x - source.x) ** 2 + (target.y - source.y) ** 2) * 0.3;
        const angle = p.life * 0.02;
        p.x = mx + Math.cos(angle) * orbitR;
        p.y = my + Math.sin(angle) * orbitR;
        p.radius = 1.0;
        break;

      case 'heavy-drift':
        // Slow, heavy, gravitational
        p.progress += speed * 0.4;
        p.x = source.x + (target.x - source.x) * p.progress;
        p.y = source.y + (target.y - source.y) * p.progress;
        p.radius = 2.0;
        break;

      case 'diffuse':
        // Random walk, drifting outward from edge
        p.progress += speed * 0.6;
        p.x = source.x + (target.x - source.x) * p.progress + (Math.random() - 0.5) * 4;
        p.y = source.y + (target.y - source.y) * p.progress + (Math.random() - 0.5) * 4;
        p.radius = 1.0 + Math.random() * 0.5;
        break;

      default:
        p.progress += speed;
        p.x = source.x + (target.x - source.x) * p.progress;
        p.y = source.y + (target.y - source.y) * p.progress;
        break;
    }

    // Fade out near end of life
    const lifeRatio = p.life / p.maxLife;
    if (lifeRatio > 0.8) {
      p.radius *= (1 - (lifeRatio - 0.8) * 5);
    }
  }

  /**
   * Set which connection types produce particles.
   */
  setActiveTypes(types) {
    this.activeTypes = new Set(types);
  }

  /**
   * Get all active particles for rendering.
   */
  getParticles() {
    return this.activeParticles;
  }

  /**
   * Reset the particle system.
   */
  reset() {
    this.activeParticles.forEach(p => { p.active = false; });
    this.activeParticles = [];
    this.edgeIndex = 0;
  }
}
