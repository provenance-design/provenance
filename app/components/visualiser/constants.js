/**
 * Provenance Network Visualiser — Constants
 *
 * Single source of truth for all visual, physical, and interaction parameters.
 * Every number here is a design decision, not a default.
 */

// Discipline colours — designed for dark canvas (#1E2228)
// Warm, muted, distinguishable. Not saturated. Museum palette.
export const DISCIPLINE_COLORS = {
  Product:      '#C4A882',  // warm neutral — anchoring discipline
  Furniture:    '#7BA68C',  // sage green
  Graphic:      '#8BA4B8',  // cool blue-grey
  Lighting:     '#C4B878',  // warm gold
  Architecture: '#A0887A',  // warm stone
  Typography:   '#90A890',  // muted green
  Textile:      '#C49878',  // warm terracotta
  Transport:    '#78A0B0',  // steel blue
  Ceramic:      '#B0A080',  // clay
  Glass:        '#80B0A0',  // pale blue-green
  Metalwork:    '#A090B0',  // silver-violet
};

// Connection type colours — for edge rendering and filtering UI
export const TYPE_COLORS = {
  argument:    '#C47050',  // copper tension
  lineage:     '#6BA080',  // heritage green
  material:    '#80A870',  // material earth
  sameProblem: '#7090A0',  // question blue
  zeitgeist:   '#908878',  // period amber
  method:      '#8A9A8A',  // process grey
};

// Connection type force parameters
// These are the Xenakis transduction — each type has distinct spatial/kinetic behaviour
export const CONNECTION_FORCES = {
  lineage: {
    type: 'vertical-cascade',
    tension: 0.3,
    description: 'Gravitational, vertical, inherited. Parent above child.',
    particle: 'drift-down',
  },
  argument: {
    type: 'tensile-opposition',
    tension: 0.8,
    description: 'Taut, oppositional, directional. Never fully resolving.',
    particle: 'oscillate',
  },
  method: {
    type: 'lateral-affinity',
    tension: 0.4,
    description: 'Horizontal clustering. Workbench arrangement.',
    particle: 'settle',
  },
  sameProblem: {
    type: 'orbital',
    tension: 0.2,
    description: 'Constellation pattern. Objects orbiting a shared void.',
    particle: 'slow-revolve',
  },
  material: {
    type: 'gravitational-clump',
    tension: 0.6,
    description: 'Dense, gravitational, tactile. Tight clumping.',
    particle: 'heavy-drift',
  },
  zeitgeist: {
    type: 'atmospheric-field',
    tension: 0.1,
    description: 'Atmospheric, ambient, diffuse. Field effect, not point connection.',
    particle: 'diffuse',
  },
};

// Zoom breakpoints — authored transitions between perceptual modes
export const SCALE_BREAKPOINTS = {
  macro: { min: 0.05, max: 0.3, labels: false, connectionReasons: false, particles: 'sparse' },
  meso:  { min: 0.3,  max: 1.5, labels: true,  connectionReasons: false, particles: 'normal' },
  micro: { min: 1.5,  max: 8.0, labels: true,  connectionReasons: true,  particles: 'dense' },
};

// Entry sequence timing (13 seconds total)
export const ENTRY_SEQUENCE = {
  phases: [
    { type: 'lineage',     start: 0,    end: 3000,  label: 'Lineage Skeleton' },
    { type: 'method',      start: 3000, end: 5000,  label: 'Method Weave' },
    { type: 'material',    start: 5000, end: 7000,  label: 'Material Condensation' },
    { type: 'argument',    start: 7000, end: 9000,  label: 'Argument Tension' },
    { type: 'zeitgeist',   start: 9000, end: 11000, label: 'Zeitgeist Atmosphere' },
    { type: 'sameProblem', start: 11000, end: 13000, label: 'Same Problem Constellations' },
  ],
  totalDuration: 13000,
  breathingStart: 13000,
};

// Layered priority force model
// Forces run in this sequence each tick. Earlier layers dominate structure.
// Each layer runs at alpha * (1 - layerDecay * layerIndex).
export const FORCE_LAYERS = [
  'lineage',      // 0 — skeleton
  'method',       // 1 — lateral weave
  'material',     // 2 — tight clumps
  'argument',     // 3 — tensile opposition
  'zeitgeist',    // 4 — atmospheric drift
  'sameProblem',  // 5 — orbital constellations
];

export const LAYER_DECAY = 0.12; // alpha reduction per layer index

// Performance budget
export const PERFORMANCE = {
  targetFPS: 60,
  frameBudgetMs: 16.6,
  maxParticles: 5000,
  spatialHashCellSize: 80,  // pixels — tune based on average node spacing
  forceIterationsPerTick: 1,
  labelRenderThreshold: 0.3, // scale below which labels are hidden
};

// Canvas
export const CANVAS = {
  background: '#1E2228',
  nodeMinRadius: 3,
  nodeMaxRadius: 18,
  edgeOpacity: 0.15,
  edgeWidth: 0.5,
  hoverEdgeOpacity: 0.6,
  selectedEdgeOpacity: 0.8,
  labelFont: '11px "DM Sans", sans-serif',
  labelColor: 'rgba(255,255,255,0.7)',
  traceOpacity: 0.4,
  breathingAmplitude: 0.3,  // pixels of node oscillation in idle state
  breathingPeriod: 8000,     // ms for one breathing cycle
};
