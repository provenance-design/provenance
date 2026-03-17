/**
 * Provenance Network Visualiser — Trace Renderer
 *
 * Records and renders the user's navigation path.
 * The UPIC principle: the user's exploration is a drawing.
 *
 * Pure JavaScript class. No React dependency.
 */

export class TraceRenderer {
  constructor() {
    this.traces = []; // { id, type, timestamp }
    this.maxLength = 100; // max trace history per session
  }

  /**
   * Record a navigation step.
   */
  addStep(nodeId, connectionType) {
    this.traces.push({
      id: nodeId,
      type: connectionType || 'direct',
      timestamp: Date.now(),
    });

    if (this.traces.length > this.maxLength) {
      this.traces.shift();
    }
  }

  /**
   * Get the current trace for rendering.
   */
  getTraces() {
    return this.traces;
  }

  /**
   * Clear the session trace.
   */
  clear() {
    this.traces = [];
  }

  /**
   * Save aggregate trace to localStorage.
   * For desire line accumulation across sessions.
   */
  saveAggregate() {
    try {
      const existing = JSON.parse(localStorage.getItem('provenance-traces') || '[]');
      // Store as edge pairs (from -> to) with type
      for (let i = 1; i < this.traces.length; i++) {
        existing.push({
          from: this.traces[i - 1].id,
          to: this.traces[i].id,
          type: this.traces[i].type,
          t: Date.now(),
        });
      }
      // Keep only last 10,000 trace edges
      const trimmed = existing.slice(-10000);
      localStorage.setItem('provenance-traces', JSON.stringify(trimmed));
    } catch (e) {
      // localStorage not available — degrade gracefully
    }
  }

  /**
   * Load aggregate traces from localStorage.
   * Returns edge frequency map for desire line rendering.
   */
  loadAggregate() {
    try {
      const traces = JSON.parse(localStorage.getItem('provenance-traces') || '[]');
      const edgeFreq = new Map();
      for (const t of traces) {
        const key = `${Math.min(t.from, t.to)}-${Math.max(t.from, t.to)}`;
        edgeFreq.set(key, (edgeFreq.get(key) || 0) + 1);
      }
      return edgeFreq;
    } catch (e) {
      return new Map();
    }
  }
}
