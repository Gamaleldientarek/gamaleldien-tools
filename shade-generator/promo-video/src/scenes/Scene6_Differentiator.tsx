import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const BRAND_ORANGE = "#e16105";
const DARK_BG = "#0a0a0a";

const FEATURES = ["OKLCH COLOR SCIENCE", "SMART WEIGHT DETECTION", "ZERO DEPENDENCIES"];

export const Scene6_Differentiator: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene lasts 2 seconds (60 frames)
  // Feature lines: frames 0-30
  // "FREE." reveal: frames 30-60

  const showFree = frame >= 30;

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
      {/* Feature Lines */}
      {!showFree && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            alignItems: "center",
          }}
        >
          {FEATURES.map((feature, index) => {
            const delay = index * 6; // Staggered 200ms (6 frames)
            const featureOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            });

            const featureY = interpolate(frame, [delay, delay + 15], [16, 0], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            });

            return (
              <div
                key={feature}
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  opacity: featureOpacity,
                  transform: `translateY(${featureY}px)`,
                }}
              >
                {feature}
              </div>
            );
          })}
        </div>
      )}

      {/* "FREE." Hero Text */}
      {showFree && (
        <div
          style={{
            fontSize: 160,
            fontWeight: 700,
            color: BRAND_ORANGE,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            textShadow: `0 0 24px rgba(225, 97, 5, 0.12)`,
            transform: `scale(${
              interpolate(
                spring({
                  frame: frame - 30,
                  fps,
                  config: { damping: 15, stiffness: 80 },
                }),
                [0, 1],
                [0.8, 1],
                {
                  extrapolateRight: "clamp",
                  extrapolateLeft: "clamp",
                }
              )
            })`,
          }}
        >
          FREE.
        </div>
      )}

      {/* Subtle grain/particle texture behind "FREE." */}
      {showFree && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "8px 8px",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};
