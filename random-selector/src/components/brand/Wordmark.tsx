/**
 * Wordmark — the gamaleldien mark, and a link home.
 *
 * The geometry is the same artwork already shipping as the tools favicon
 * (`FAVICON_LANDING` in build-router.py): an open arc with a solid corner
 * counterform. Kept as inline SVG rather than an <Image> so it inherits
 * `currentColor` and needs no network round-trip on a projector or a phone on
 * conference wifi.
 *
 * Replaces the AZMX wordmark, which was a client asset and cannot appear here.
 */

export interface WordmarkProps {
  height?: number;
  /** Show the "gamaleldien" text beside the mark. */
  showText?: boolean;
  className?: string;
}

export function Wordmark({
  height = 24,
  showText = true,
  className = "",
}: WordmarkProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`.trim()}
      style={{ color: "currentColor" }}
    >
      <svg
        viewBox="0 0 60.12 60.12"
        width={height}
        height={height}
        fill="none"
        role="img"
        aria-label="gamaleldien"
        focusable="false"
        style={{ flex: "none" }}
      >
        <path d="M60.12 35.22v24.9l-24.9-24.9z" fill="currentColor" />
        <path
          d="M60.12 10.32 47.67 22.77c-3.44-3.44-7.94-5.16-12.45-5.16s-9.01 1.72-12.45 5.16c-3.44 3.43-5.16 7.94-5.16 12.45s1.72 9.01 5.16 12.45L10.32 60.12C3.94 53.75 0 44.94 0 35.22s3.94-18.53 10.32-24.9C16.69 3.94 25.49 0 35.22 0s18.53 3.94 24.9 10.32"
          fill="currentColor"
        />
      </svg>
      {showText && (
        <span
          className="font-display font-semibold lowercase tracking-[-0.01em]"
          style={{ fontSize: height * 0.72, lineHeight: 1 }}
        >
          gamaleldien
        </span>
      )}
    </span>
  );
}

export default Wordmark;
