import type { CSSProperties } from "react";

/**
 * BrandNumeral — join numbers, section indices, ordered lists.
 *
 * SF Mono, not the display face. The rule in this system is that anything
 * which TICKS or must not reflow takes mono: a numeral in a live roster
 * changes as people join, and a proportional figure would make the whole
 * column shuffle sideways on every arrival. Tabular by construction rather
 * than by opt-in feature flag.
 *
 * (The AZMX original used its serif here for personality. There is no serif
 * in this system, and the mono answer is better anyway for a live list.)
 */

type NumeralColor = "accent" | "accent-hover" | "text" | "muted";
type NumeralScale = "sm" | "md" | "lg" | "xl";

const COLOR: Record<NumeralColor, string> = {
  accent: "var(--accent)",
  "accent-hover": "var(--accent-hover)",
  text: "var(--text)",
  muted: "var(--text-secondary)",
};

const SCALE: Record<NumeralScale, string> = {
  sm: "clamp(1.5rem, 2.5vw, 2rem)",
  md: "clamp(2rem, 4vw, 3.25rem)",
  lg: "clamp(3rem, 5.5vw, 5rem)",
  xl: "clamp(4.5rem, 9vw, 8rem)",
};

export interface BrandNumeralProps {
  value: string | number;
  color?: NumeralColor;
  scale?: NumeralScale;
  /** Pad short join numbers, e.g. 7 → "07". */
  pad?: number;
  className?: string;
  style?: CSSProperties;
}

export function BrandNumeral({
  value,
  color = "accent",
  scale = "md",
  pad,
  className = "",
  style,
}: BrandNumeralProps) {
  const raw = String(value);
  const display = pad ? raw.padStart(pad, "0") : raw;
  return (
    <span
      className={`g-numeral inline-block leading-none ${className}`.trim()}
      style={{
        color: COLOR[color],
        fontSize: SCALE[scale],
        letterSpacing: "-0.01em",
        ...style,
      }}
    >
      {display}
    </span>
  );
}

export default BrandNumeral;
