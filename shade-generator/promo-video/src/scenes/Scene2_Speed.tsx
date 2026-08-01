import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const BRAND_ORANGE = "#e16105";
const LIGHT_BG = "#f5f5f5";

// Three random color generations
const GENERATION_COLORS = [
  {
    base: "#3B82F6",
    shades: ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF", "#1E3A8A", "#172554"],
    weight: 500,
  },
  {
    base: "#10B981",
    shades: ["#ECFDF5", "#D1FAE5", "#A7F3D0", "#6EE7B7", "#34D399", "#10B981", "#059669", "#047857", "#065F46", "#064E3B", "#022C22"],
    weight: 500,
  },
  {
    base: "#F59E0B",
    shades: ["#FFFBEB", "#FEF3C7", "#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F", "#451A03"],
    weight: 500,
  },
];

export const Scene2_Speed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene lasts 3 seconds (90 frames)
  // Generation 1: frames 0-30
  // Generation 2: frames 30-60
  // Generation 3: frames 60-90

  const generationIndex = Math.min(Math.floor(frame / 30), 2);
  const currentGen = GENERATION_COLORS[generationIndex];

  // Flash effect on generation change
  const flashOpacity = frame % 30 === 0 && frame > 0 ? 0.05 : 0;

  // Spacebar animation
  const spacebarFrame = frame % 30;
  const spacebarScale = spring({
    frame: spacebarFrame,
    fps,
    config: { damping: 15 },
    durationInFrames: 10,
  });

  // Text overlay "11 SHADES. INSTANT." appears on second spacebar hit
  const textDelay = 1 * fps; // Appears at 1s (second generation)
  const textOpacity = interpolate(frame, [textDelay, textDelay + 10], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const textSlide = interpolate(frame, [textDelay, textDelay + 15], [-50, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: LIGHT_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: 40,
      }}
    >
      {/* Flash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "white",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Controls Section */}
      <div
        style={{
          backgroundColor: "white",
          padding: 32,
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          marginBottom: 32,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: "80%",
          maxWidth: 600,
        }}
      >
        {/* Hex input */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              backgroundColor: currentGen.base,
              borderRadius: 8,
              border: "2px solid rgba(0, 0, 0, 0.1)",
            }}
          />
          <input
            readOnly
            value={currentGen.base}
            style={{
              flex: 1,
              fontSize: 20,
              fontFamily: "monospace",
              padding: "12px 16px",
              borderRadius: 8,
              border: "2px solid rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9fafb",
            }}
          />
        </div>

        {/* Generate Random button */}
        <button
          style={{
            backgroundColor: BRAND_ORANGE,
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            padding: "14px 24px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            transform: `scale(${1 - spacebarScale * 0.1})`,
            boxShadow: "0 2px 8px rgba(225, 97, 5, 0.3)",
          }}
        >
          GENERATE RANDOM
        </button>

        {/* Keyboard hint */}
        <div
          style={{
            fontSize: 11,
            color: "#6b7280",
            fontWeight: 600,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          [SPACE] RANDOM
        </div>
      </div>

      {/* Shade swatches */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "90%",
        }}
      >
        {currentGen.shades.map((color, index) => {
          const swatchSpring = spring({
            frame: spacebarFrame,
            fps,
            config: { damping: 20 },
            delay: index * 2,
          });

          return (
            <div
              key={`${generationIndex}-${index}`}
              style={{
                width: 70,
                height: 70,
                backgroundColor: color,
                borderRadius: 10,
                transform: `translateY(${interpolate(swatchSpring, [0, 1], [16, 0])})`,
                opacity: swatchSpring,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                position: "relative",
              }}
            >
              {/* BASE badge */}
              {index === currentGen.weight / 100 - 0.5 && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 4,
                    left: "50%",
                    transform: "translateX(-50%)",
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

      {/* Text overlay: "11 SHADES. INSTANT." */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "10%",
          fontSize: 48,
          fontWeight: 700,
          color: BRAND_ORANGE,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: textOpacity,
          transform: `translateX(${textSlide}px)`,
          textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        11 SHADES. INSTANT.
      </div>
    </div>
  );
};
