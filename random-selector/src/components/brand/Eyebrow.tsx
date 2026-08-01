import type { ReactNode } from "react";
import { BrandNode } from "./BrandNode";

/**
 * Eyebrow — UPPERCASE tracked micro-label that heads content. Clash, because
 * an eyebrow is spoken, not read in quantity. Optional leading node tick
 * (the chevron's replacement).
 *
 * The accent is mode-independent in this system — #E16105 clears AA on both
 * the dark ground (5.55:1) and the light ground — so unlike the AZMX original
 * there is no per-surface colour switch to get wrong.
 */

export interface EyebrowProps {
  children: ReactNode;
  /** Show the small leading node tick. */
  tick?: boolean;
  className?: string;
}

export function Eyebrow({
  children,
  tick = false,
  className = "",
}: EyebrowProps) {
  return (
    <p
      className={`g-eyebrow text-accent flex items-center gap-2 text-start ${className}`.trim()}
    >
      {tick && <BrandNode size={4} shape="square" tone="accent" />}
      <span>{children}</span>
    </p>
  );
}

export default Eyebrow;
