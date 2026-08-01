import type { CSSProperties } from "react";

/**
 * Node — the graphic device, and the only non-typographic mark in the system.
 *
 * It is the 32px dot lattice (already in production on the tools landing page
 * and the Dark Mode Converter) promoted from wallpaper to instrument. A lit
 * node is a participant; the lattice is the room.
 *
 * Replaces the AZMX chevron entirely. Any arrow, caret or chevron reads as
 * AZMX and is banned here.
 *
 * SQUARE at small sizes on purpose: a 4px circle renders muddy at 16px, and
 * the lattice itself is built on a square grid.
 */

type NodeTone = "accent" | "accent-hover" | "muted" | "current";
type NodeShape = "square" | "dot";

const TONE: Record<NodeTone, string> = {
  accent: "var(--accent)",
  "accent-hover": "var(--accent-hover)",
  muted: "var(--border-hard)",
  current: "currentColor",
};

export interface BrandNodeProps {
  /** Edge length in px. Square below ~8px, round above, unless forced. */
  size?: number;
  tone?: NodeTone;
  shape?: NodeShape;
  /** Dim a node that is present but not active (the un-picked, at reveal). */
  dim?: boolean;
  /** Decorative by default; give a label to expose it to assistive tech. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function BrandNode({
  size = 4,
  tone = "accent",
  shape,
  dim = false,
  label,
  className = "",
  style,
}: BrandNodeProps) {
  // Square is the default identity; round only once it is big enough to read
  // as a circle rather than as a smudge.
  const resolved: NodeShape = shape ?? (size >= 8 ? "dot" : "square");

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 ${className}`.trim()}
      style={{
        inlineSize: size,
        blockSize: size,
        backgroundColor: TONE[tone],
        borderRadius: resolved === "dot" ? "50%" : 0,
        opacity: dim ? 0.2 : 1,
        transition: "opacity var(--g-dur-base) var(--g-ease-out)",
        ...style,
      }}
    />
  );
}

/**
 * StateDot — joining open / closed.
 *
 * NO GREEN, and no RAG semantics at all: open vs closed is MODAL, not
 * good-vs-bad, so a red/green dot would import a meaning this product never
 * had. Open is the accent with a pulsing ring (live = accent); closed is a
 * hollow ring. Colour never carries the state alone — the accompanying label
 * always says it in words.
 */
export function StateDot({
  open,
  className = "",
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`g-state-dot ${open ? "g-state-open" : "g-state-closed"} ${className}`.trim()}
    />
  );
}

export default BrandNode;
