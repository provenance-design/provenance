/**
 * Provenance Network Visualiser — Entry Sequence Controller
 *
 * The 7-phase compositional sequence. The network's overture.
 * Controls which connection types are active in the ForceEngine and ParticleSystem
 * based on elapsed time.
 *
 * Pure JavaScript class. No React dependency.
 */

import { ENTRY_SEQUENCE } from './constants.js';

export class EntrySequence {
  constructor(forceEngine, particleSystem) {
    this.forceEngine = forceEngine;
    this.particleSystem = particleSystem;
    this.startTime = null;
    this.playing = false;
    this.completed = false;
    this.currentPhase = -1;
    this.onPhaseChange = null; // callback for UI updates
  }

  /**
   * Start the entry sequence.
   */
  start() {
    this.startTime = performance.now();
    this.playing = true;
    this.completed = false;
    this.currentPhase = -1;

    // Start with no types active
    this.forceEngine.setActiveTypes([]);
    this.particleSystem.setActiveTypes([]);
  }

  /**
   * Skip to breathing state.
   */
  skip() {
    this.playing = false;
    this.completed = true;
    this.currentPhase = ENTRY_SEQUENCE.phases.length;

    // Activate all types
    const allTypes = ENTRY_SEQUENCE.phases.map(p => p.type);
    this.forceEngine.setActiveTypes(allTypes);
    this.particleSystem.setActiveTypes(allTypes);

    if (this.onPhaseChange) {
      this.onPhaseChange({ phase: 'breathing', label: 'Breathing State' });
    }
  }

  /**
   * Update the sequence. Called every frame.
   * Returns the current phase info.
   */
  tick() {
    if (!this.playing || this.completed) {
      return { phase: 'breathing', progress: 1 };
    }

    const elapsed = performance.now() - this.startTime;

    // Check if sequence is complete
    if (elapsed >= ENTRY_SEQUENCE.totalDuration) {
      this.playing = false;
      this.completed = true;
      this.currentPhase = ENTRY_SEQUENCE.phases.length;

      const allTypes = ENTRY_SEQUENCE.phases.map(p => p.type);
      this.forceEngine.setActiveTypes(allTypes);
      this.particleSystem.setActiveTypes(allTypes);

      if (this.onPhaseChange) {
        this.onPhaseChange({ phase: 'breathing', label: 'Breathing State' });
      }

      return { phase: 'breathing', progress: 1 };
    }

    // Determine current phase
    const activeTypes = [];
    let currentLabel = '';

    for (let i = 0; i < ENTRY_SEQUENCE.phases.length; i++) {
      const phase = ENTRY_SEQUENCE.phases[i];
      if (elapsed >= phase.start) {
        activeTypes.push(phase.type);
        currentLabel = phase.label;

        // Fire phase change callback
        if (i > this.currentPhase) {
          this.currentPhase = i;
          if (this.onPhaseChange) {
            this.onPhaseChange({ phase: phase.type, label: phase.label, index: i });
          }
        }
      }
    }

    // Update engines with currently active types
    this.forceEngine.setActiveTypes(activeTypes);
    this.particleSystem.setActiveTypes(activeTypes);

    return {
      phase: currentLabel,
      progress: elapsed / ENTRY_SEQUENCE.totalDuration,
      elapsed,
    };
  }

  /**
   * Reset to play again.
   */
  reset() {
    this.startTime = null;
    this.playing = false;
    this.completed = false;
    this.currentPhase = -1;
  }
}
