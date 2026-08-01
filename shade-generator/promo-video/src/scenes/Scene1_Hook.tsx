import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

import { BRAND_ORANGE, DARK_BG, DOT_GRID, FONT_DISPLAY } from "../brand";


// 11 shade scale colors for #3B82F6 (blue)
const SHADE_COLORS = [
  "#EFF6FF", // 50
  "#DBEAFE", // 100
  "#BFDBFE", // 200
  "#93C5FD", // 300
  "#60A5FA", // 400
  "#3B82F6", // 500 BASE
  "#2563EB", // 600
  "#1D4ED8", // 700
  "#1E40AF", // 800
  "#1E3A8A", // 900
  "#172554", // 950
];

const SHADE_LABELS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Typewriter effect: "#3B82F6" (8 characters)
  const hexCode = "#3B82F6";
  const charsToShow = Math.min(Math.floor((frame / fps) * 5), hexCode.length); // 200ms per char
  const displayedHex = hexCode.slice(0, charsToShow);
  const typingComplete = charsToShow >= hexCode.length;

  // Hex input opacity
  const hexOpacity = interpolate(frame, [0, 5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Text overlay "ANY COLOR." appears after swatches land
  const textDelay = 1.5 * fps; // Appears at 1.5s
  const textOpacity = interpolate(frame, [textDelay, textDelay + 10], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

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
        // Dot grid pattern
        ...DOT_GRID,
      }}
    >
      {/* Typing hex code */}
      {!typingComplete && (
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 48,
            color: "white",
            opacity: hexOpacity,
            letterSpacing: "0.1em",
          }}
        >
          {displayedHex}
          <span
            style={{
              opacity: Math.floor(frame / 15) % 2, // Blinking cursor
              marginLeft: 4,
            }}
          >
            |
          </span>
        </div>
      )}

      {/* 11 Swatches explosion */}
      {typingComplete && (
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "90%",
          }}
        >
          {SHADE_COLORS.map((color, index) => {
            const delay = index * 3; // Staggered 50ms per swatch (3 frames at 30fps)
            const swatchSpring = spring({
              frame: frame - (typingComplete ? fps * 0.5 : 0) - delay,
              fps,
              config: { damping: 20, stiffness: 200 },
            });

            const scale = interpolate(swatchSpring, [0, 1], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            });

            return (
              <div
                key={index}
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: color,
                  borderRadius: 12,
                  transform: `scale(${scale})`,
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {/* Shade label */}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: index < 5 ? "#000" : "#fff",
                    opacity: 0.7,
                    textTransform: "uppercase",
                  }}
                >
                  {SHADE_LABELS[index]}
                </span>
                {/* BASE badge on shade 500 */}
                {index === 5 && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 4,
                      fontSize: 8,
                      fontWeight: 700,
                      color: "#fff",
                      backgroundColor: BRAND_ORANGE,
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    BASE
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Text overlay: "ANY COLOR." */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          fontSize: 64,
          fontWeight: 700,
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: textOpacity,
          textAlign: "center",
        }}
      >
        ANY COLOR.
      </div>
    </div>
  );
};
