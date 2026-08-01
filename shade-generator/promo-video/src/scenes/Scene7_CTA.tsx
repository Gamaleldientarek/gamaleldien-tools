import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const BRAND_ORANGE = "#e16105";
const DARK_BG = "#0a0a0a";
const TEXT_MUTED = "#808080";

export const Scene7_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene lasts 2 seconds (60 frames)
  // Title fades in: frames 0-12
  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(frame, [0, 15], [16, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // URL fades in: frames 6-18 (200ms after title)
  const urlOpacity = interpolate(frame, [6, 18], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const urlY = interpolate(frame, [6, 21], [16, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Underline draws: frames 12-30
  const underlineWidth = interpolate(frame, [12, 30], [0, 100], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Attribution fades in: frames 18-27 (300ms after URL)
  const attrOpacity = interpolate(frame, [18, 27], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Optional subtle glow pulse behind title (barely perceptible)
  const glowOpacity = interpolate(
    Math.sin((frame / fps) * Math.PI * 0.5), // 2s cycle
    [-1, 1],
    [0.05, 0.15],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    }
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: DARK_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    >
      {/* Subtle glow behind title */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 200,
          background: `radial-gradient(circle, ${BRAND_ORANGE}, transparent)`,
          opacity: glowOpacity,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Title */}
      <h1
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: BRAND_ORANGE,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 24,
          textAlign: "center",
          textShadow: `0 0 24px rgba(225, 97, 5, 0.12)`,
        }}
      >
        UI COLOR GENERATOR
      </h1>

      {/* URL */}
      <div
        style={{
          position: "relative",
          opacity: urlOpacity,
          transform: `translateY(${urlY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            color: "white",
            letterSpacing: "0.06em",
            marginBottom: 8,
          }}
        >
          tools.gamaleldien.com/shades
        </div>

        {/* Underline animation */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: `${underlineWidth}%`,
            height: 2,
            backgroundColor: BRAND_ORANGE,
            opacity: 0.5,
          }}
        />
      </div>

      {/* Attribution */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          fontSize: 18,
          fontWeight: 400,
          color: TEXT_MUTED,
          opacity: attrOpacity,
        }}
      >
        by Gamal Eldien
      </div>
    </div>
  );
};
