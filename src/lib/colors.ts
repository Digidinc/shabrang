/**
 * Shabrang Brand Colors — Persian Miniature Aesthetic
 *
 * These match the CSS custom properties in globals.css.
 * Use Tailwind classes (text-shabrang-gold, bg-shabrang-cream, etc.) in components.
 * Use these constants only for programmatic color access (charts, canvas, etc.)
 */

export const SHABRANG_COLORS = {
  // Primary palette (Persian miniature)
  cream: '#F5E6C8',        // Warm parchment background
  coal: '#1A1A18',         // Coal black for structure/outlines
  teal: '#1A4A4A',         // Deep teal — water, coherence
  tealLight: '#2D5A6B',    // Lighter teal variant
  crimson: '#8B3535',      // Persian crimson — fire, entropy
  crimsonLight: '#8B3A3A', // Lighter crimson variant
  gold: '#C9A227',         // Antique gold — sacred, wisdom
  goldLight: '#D4A84B',    // Lighter gold variant
  green: '#3D5C3D',        // Garden green — nature (accent only)

  // Text colors
  text: '#1A1A18',         // Primary text (dark on cream)
  textDim: '#5A6170',      // Muted text
  textLight: '#E6E8EC',    // Light text (for dark backgrounds)
} as const;

/** Semantic color meanings in Shabrang context */
export const SHABRANG_SEMANTICS = {
  water: SHABRANG_COLORS.teal,       // Qanat, coherence, flow
  fire: SHABRANG_COLORS.crimson,     // Entropy, transformation, danger
  sacred: SHABRANG_COLORS.gold,      // Wisdom, illumination, value
  earth: SHABRANG_COLORS.coal,       // Structure, grounding, outlines
  growth: SHABRANG_COLORS.green,     // Nature, life (accent)
  canvas: SHABRANG_COLORS.cream,     // Background, parchment
  emphasis: SHABRANG_COLORS.goldLight, // Highlights, active states
  muted: SHABRANG_COLORS.textDim,    // Secondary text, metadata
} as const;

export type ShabrangColor = keyof typeof SHABRANG_COLORS;

// Legacy alias for FRC compatibility during migration
export const FRC_COLORS = {
  void: SHABRANG_COLORS.cream,
  text: SHABRANG_COLORS.text,
  textDim: SHABRANG_COLORS.textDim,
  blue: SHABRANG_COLORS.teal,
  blueLight: SHABRANG_COLORS.tealLight,
  gold: SHABRANG_COLORS.gold,
  goldLight: SHABRANG_COLORS.goldLight,
  steel: SHABRANG_COLORS.textDim,
} as const;

export const FRC_SEMANTICS = {
  invariant: FRC_COLORS.gold,
  coherence: FRC_COLORS.blue,
  background: FRC_COLORS.void,
  emphasis: FRC_COLORS.goldLight,
  muted: FRC_COLORS.textDim,
} as const;

export type FRCColor = keyof typeof FRC_COLORS;
