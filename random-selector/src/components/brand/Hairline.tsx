/**
 * Hairline — the 1px rule that does the work of a card border.
 *
 * The hairline stays a hairline: it is substrate, not device. The graphic
 * device is the Node. At most ONE 2px accent rule per surface.
 */

export interface HairlineProps {
  /** "active" = a single 2px accent rule. */
  weight?: "hairline" | "active";
  /** Vertical rule instead of horizontal. */
  vertical?: boolean;
  className?: string;
}

export function Hairline({
  weight = "hairline",
  vertical = false,
  className = "",
}: HairlineProps) {
  const color =
    weight === "active" ? "var(--accent)" : "var(--border-light)";
  const thickness = weight === "active" ? 2 : 1;

  return (
    <div
      role="separator"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      className={className}
      style={
        vertical
          ? { inlineSize: thickness, blockSize: "100%", backgroundColor: color }
          : { blockSize: thickness, inlineSize: "100%", backgroundColor: color }
      }
    />
  );
}

export default Hairline;
