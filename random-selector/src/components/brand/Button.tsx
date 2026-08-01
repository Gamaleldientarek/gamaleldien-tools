import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { BrandNode } from "./BrandNode";

/**
 * Button — gamaleldien tools. Generously rounded (12px), which is the single
 * biggest visual departure from the AZMX original's near-square 2px doctrine.
 *
 * Primary = a solid accent block. Secondary = hairline-outlined, transparent.
 * Danger = reserved for destructive confirms only (close room, delete room).
 *
 * Labels are Clash — a button label is a SPOKEN thing, not running prose.
 *
 * Polymorphic: pass `href` to render a Next <Link>, otherwise a <button>.
 */

type Variant = "primary" | "secondary" | "danger";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  /** Show the trailing node tick — the chevron's replacement. */
  tick?: boolean;
  fullWidth?: boolean;
  className?: string;
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type LinkProps = CommonProps & {
  href: string;
};

export type BrandButtonProps = ButtonProps | LinkProps;

function classesFor(variant: Variant, fullWidth: boolean) {
  // Big one-handed tap target on a phone. 12px radius, no shadow.
  const base =
    "group inline-flex items-center justify-center gap-3 min-h-14 px-6 py-4 " +
    "rounded-g-md font-display font-semibold text-base tracking-[0.02em] uppercase " +
    "transition-colors duration-150 select-none g-press " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "focus-visible:ring-accent focus-visible:ring-offset-bg " +
    "disabled:opacity-40 disabled:pointer-events-none cursor-pointer";

  const width = fullWidth ? "w-full" : "";

  let skin: string;
  if (variant === "primary") {
    // White label on accent: #FFFFFF on #E16105 is 3.78:1 — below AA for body
    // text, but this is 16px semibold uppercase, which clears the large-text
    // threshold (3:1). Kept deliberately; do not reuse this pairing for prose.
    skin = "bg-accent text-white hover:bg-accent-hover";
  } else if (variant === "danger") {
    skin =
      "bg-transparent text-[#EF4444] border border-[#EF4444]/50 " +
      "hover:bg-[#EF4444] hover:text-text hover:border-[#EF4444]";
  } else {
    skin =
      "bg-transparent text-text border border-border hover:border-accent hover:text-accent";
  }

  return `${base} ${skin} ${width}`.trim();
}

export function Button(props: BrandButtonProps) {
  const {
    children,
    variant = "primary",
    tick = false,
    fullWidth = false,
    className = "",
    href,
    ...rest
  } = props as CommonProps & { href?: string } & ButtonHTMLAttributes<HTMLButtonElement>;

  const cls = `${classesFor(variant, fullWidth)} ${className}`.trim();

  const inner = (
    <>
      <span>{children}</span>
      {tick && (
        <BrandNode
          size={6}
          shape="square"
          tone={variant === "primary" ? "current" : "accent"}
          className="transition-transform duration-150 group-hover:translate-x-0.5"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}

export default Button;
