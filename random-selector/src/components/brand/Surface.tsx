import type { ElementType, ReactNode } from "react";

/**
 * Surface — the sanctioned surfaces.
 *
 *   ground     the page. Themes.
 *   card       a raised panel, 24px radius, hairline border. Themes.
 *   surface-2  a quieter panel inside a card. Themes.
 *   projection the room-facing screen. NEVER themes — a projector is always a
 *              dark room, and the room decides, not the facilitator's laptop.
 *
 * `lattice` overlays the 32px dot lattice, the system's own graphic ground.
 * `bloom` adds the signature gradient bloom, anchored BELOW the frame so its
 * hot centre — the ~2.98:1 contrast hazard — never reaches type.
 */

type SurfaceVariant = "ground" | "card" | "surface-2" | "projection";

const CLASS: Record<SurfaceVariant, string> = {
  ground: "g-ground",
  card: "g-card",
  "surface-2": "g-surface-2",
  projection: "g-projection",
};

export interface SurfaceProps {
  variant?: SurfaceVariant;
  as?: ElementType;
  /** Overlay the 32px dot lattice. */
  lattice?: boolean;
  /** Add the gradient bloom, anchored below the frame. */
  bloom?: boolean;
  children: ReactNode;
  className?: string;
}

export function Surface({
  variant = "ground",
  as: Tag = "div",
  lattice = false,
  bloom = false,
  children,
  className = "",
}: SurfaceProps) {
  const cls = [CLASS[variant], lattice && "g-lattice", bloom && "g-bloom", className]
    .filter(Boolean)
    .join(" ");

  return <Tag className={cls}>{children}</Tag>;
}

/** Which text tone a surface implies. Projection is always dark. */
export function isDarkSurface(variant: SurfaceVariant): boolean {
  return variant === "projection";
}

export default Surface;
