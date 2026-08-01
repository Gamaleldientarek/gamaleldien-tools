import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Sequence } from "remotion";
import { useEffect } from "react";

// Brand constants
const BRAND_ORANGE = "#e16105";
const DARK_BG = "#0a0a0a";
const LIGHT_BG = "#f5f5f5";
const TEXT_WHITE = "#ffffff";
const TEXT_MUTED = "#808080";
const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif";

// Blue palette shades for Scene 1
const BLUE_SHADES = [
  "#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", 
  "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#172554"
];

// Color palettes for Scene 2
const COLOR_PALETTES = {
  emerald: ["#ecfdf5", "#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#022c22"],
  purple: ["#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95", "#2e1065"],
  rose: ["#fff1f2", "#ffe4e6", "#fecdd3", "#fda4af", "#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337", "#4c0519"]
};

// Dot grid pattern
const DOT_GRID = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

// Scene 1: THE HOOK — Hex → Color Explosion
const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Typewriter effect for hex input
  const typewriterFrames = 45;
  const hexText = "#3B82F6";
  const typedLength = Math.floor(interpolate(frame, [0, typewriterFrames], [0, hexText.length], { extrapolateRight: "clamp" }));
  const displayText = hexText.slice(0, typedLength);
  
  // Color swatches appear after typing completes
  const swatchStartFrame = typewriterFrames + 10;
  
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...DOT_GRID }}>
      {/* Input field */}
      <div style={{
        position: "absolute",
        top: "45%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(255,255,255,0.1)",
        border: "2px solid rgba(255,255,255,0.2)",
        borderRadius: "12px",
        padding: "16px 24px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "32px",
        color: TEXT_WHITE,
        minWidth: "280px",
        textAlign: "center",
        backdropFilter: "blur(10px)",
      }}>
        {displayText}
        {frame < typewriterFrames && frame % 60 < 30 && (
          <span style={{ opacity: 0.7 }}>|</span>
        )}
      </div>
      
      {/* Color swatches cascade */}
      <div style={{
        position: "absolute",
        top: "55%",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        justifyContent: "center",
        maxWidth: "600px",
      }}>
        {BLUE_SHADES.map((color, index) => {
          const delay = swatchStartFrame + (index * 3);
          const springConfig = spring({ 
            frame: frame - delay, 
            fps, 
            config: { damping: 15, stiffness: 200 } 
          });
          const scale = interpolate(springConfig, [0, 1], [0, 1]);
          const opacity = interpolate(springConfig, [0, 1], [0, 1]);
          const y = interpolate(springConfig, [0, 1], [40, 0]);
          
          return (
            <div
              key={index}
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: color,
                borderRadius: "8px",
                border: index === 5 ? "3px solid white" : "1px solid rgba(255,255,255,0.2)",
                transform: `scale(${scale}) translateY(${y}px)`,
                opacity,
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            />
          );
        })}
      </div>
      
      {/* Text overlay */}
      <div style={{
        position: "absolute",
        bottom: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: FONT,
        fontSize: "72px",
        fontWeight: "700",
        color: TEXT_WHITE,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        textAlign: "center",
        opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateX(-50%) translateY(${interpolate(frame, [80, 100], [30, 0], { extrapolateRight: "clamp" })}px)`,
        textShadow: "0 2px 16px rgba(0,0,0,0.7)",
      }}>
        ANY COLOR.
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: SPEED — Random Generation
const Scene2Speed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const paletteKeys = Object.keys(COLOR_PALETTES) as Array<keyof typeof COLOR_PALETTES>;
  const cycleDuration = 30; // frames per palette
  const currentPaletteIndex = Math.floor(frame / cycleDuration) % paletteKeys.length;
  const paletteKey = paletteKeys[currentPaletteIndex];
  const palette = COLOR_PALETTES[paletteKey];
  
  // Flash effect between palette changes
  const flashOpacity = interpolate(frame % cycleDuration, [0, 3, 6], [0.6, 0, 0], { extrapolateRight: "clamp" });
  
  // SPACE key animation
  const spaceKeyScale = interpolate(frame % 30, [0, 5, 15], [1, 0.95, 1], { extrapolateRight: "clamp" });
  
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...DOT_GRID }}>
      {/* Color palette */}
      <div style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translateX(-50%)",
        display: "grid",
        gridTemplateColumns: "repeat(11, 1fr)",
        gap: "12px",
        maxWidth: "800px",
      }}>
        {palette.map((color, index) => {
          const delay = (frame % cycleDuration) + (index * 2);
          const springConfig = spring({ 
            frame: delay, 
            fps, 
            config: { damping: 20, stiffness: 180 } 
          });
          
          return (
            <div
              key={index}
              style={{
                width: "60px",
                height: "80px",
                backgroundColor: color,
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                transform: `scale(${springConfig})`,
                boxShadow: "0 6px 30px rgba(0,0,0,0.4)",
              }}
            />
          );
        })}
      </div>
      
      {/* SPACE key */}
      <div style={{
        position: "absolute",
        bottom: "25%",
        left: "50%",
        transform: `translateX(-50%) scale(${spaceKeyScale})`,
        background: "rgba(255,255,255,0.1)",
        border: "2px solid rgba(255,255,255,0.3)",
        borderRadius: "8px",
        padding: "12px 40px",
        fontFamily: FONT,
        fontSize: "20px",
        fontWeight: "600",
        color: TEXT_WHITE,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        backdropFilter: "blur(10px)",
      }}>
        SPACE
      </div>
      
      {/* Text overlay with staggered words */}
      <div style={{
        position: "absolute",
        bottom: "15%",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "20px",
        fontFamily: FONT,
        fontSize: "56px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        textAlign: "center",
      }}>
        {["11", "SHADES.", "INSTANT."].map((word, index) => (
          <span
            key={index}
            style={{
              color: TEXT_WHITE,
              opacity: interpolate(frame, [60 + index * 8, 75 + index * 8], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(frame, [60 + index * 8, 75 + index * 8], [20, 0], { extrapolateRight: "clamp" })}px)`,
            }}
          >
            {word}
          </span>
        ))}
      </div>
      
      {/* Flash overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#ffffff",
        opacity: flashOpacity,
        zIndex: 10,
      }} />
    </AbsoluteFill>
  );
};

// Scene 3: PREVIEW — Cards + Components  
const Scene3Preview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Switch to components at frame 60 (2 seconds into scene)
  const showComponents = frame > 60;
  
  return (
    <AbsoluteFill style={{ backgroundColor: LIGHT_BG, padding: "80px" }}>
      {!showComponents ? (
        /* UI Cards */
        <div style={{ display: "flex", gap: "40px", alignItems: "center", justifyContent: "center", height: "100%" }}>
          {[
            { title: "Profile Card", delay: 0 },
            { title: "Product Card", delay: 6 },
            { title: "Hero Card", delay: 12 },
          ].map((card, index) => {
            const slideIn = spring({ frame: frame - card.delay, fps, config: { damping: 25, stiffness: 150 } });
            const x = interpolate(slideIn, [0, 1], [200, 0]);
            
            return (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "32px",
                  width: "300px",
                  height: "400px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  transform: `translateX(${x}px)`,
                  opacity: slideIn,
                  border: `2px solid ${BLUE_SHADES[5]}`,
                }}
              >
                <div style={{
                  width: "100%",
                  height: "120px",
                  background: `linear-gradient(135deg, ${BLUE_SHADES[4]}, ${BLUE_SHADES[6]})`,
                  borderRadius: "12px",
                  marginBottom: "24px",
                }} />
                <h3 style={{ 
                  fontFamily: FONT, 
                  fontSize: "24px", 
                  fontWeight: "600", 
                  color: BLUE_SHADES[8],
                  marginBottom: "12px",
                }}>
                  {card.title}
                </h3>
                <p style={{ 
                  fontFamily: FONT, 
                  fontSize: "16px", 
                  color: TEXT_MUTED,
                  lineHeight: 1.5,
                }}>
                  Built with perfect color harmony using OKLCH color science.
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        /* Component Grid */
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "32px",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          {[
            { type: "Button", color: BLUE_SHADES[5] },
            { type: "Badge", color: BLUE_SHADES[6] },
            { type: "Input", color: BLUE_SHADES[4] },
            { type: "Alert", color: BLUE_SHADES[3] },
            { type: "Card", color: BLUE_SHADES[7] },
            { type: "Toggle", color: BLUE_SHADES[5] },
            { type: "Progress", color: BLUE_SHADES[6] },
            { type: "Avatar", color: BLUE_SHADES[4] },
          ].map((comp, index) => {
            const delay = 60 + (index * 4);
            const appearSpring = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 200 } });
            const scale = interpolate(appearSpring, [0, 1], [0.8, 1]);
            
            return (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  height: "120px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transform: `scale(${scale})`,
                  opacity: appearSpring,
                  border: `1px solid ${comp.color}20`,
                }}
              >
                <div style={{
                  width: "60px",
                  height: "40px",
                  backgroundColor: comp.color,
                  borderRadius: "8px",
                  marginBottom: "12px",
                }} />
                <span style={{
                  fontFamily: FONT,
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                }}>
                  {comp.type}
                </span>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Text overlays */}
      {!showComponents && (
        <div style={{
          position: "absolute",
          top: "15%",
          left: "80px",
          fontFamily: FONT,
          fontSize: "56px",
          fontWeight: "700",
          color: "#1f2937",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [30, 45], [20, 0], { extrapolateRight: "clamp" })}px)`,
        }}>
          LIVE PREVIEW.
        </div>
      )}
      
      {showComponents && (
        <div style={{
          position: "absolute",
          bottom: "15%",
          right: "80px",
          fontFamily: FONT,
          fontSize: "48px",
          fontWeight: "700",
          color: "#1f2937",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: interpolate(frame, [75, 90], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [75, 90], [20, 0], { extrapolateRight: "clamp" })}px)`,
        }}>
          EVERY ELEMENT.
        </div>
      )}
    </AbsoluteFill>
  );
};

// Scene 4: DARK MODE
const Scene4DarkMode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Theme toggle happens at frame 30
  const isDark = frame > 30;
  
  return (
    <AbsoluteFill style={{ backgroundColor: isDark ? DARK_BG : LIGHT_BG }}>
      {/* Theme toggle mockup */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        borderRadius: "32px",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: isDark ? "transparent" : "white",
          border: isDark ? "2px solid rgba(255,255,255,0.3)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
        }}>
          ☀️
        </div>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: isDark ? "white" : "transparent",
          border: !isDark ? "2px solid rgba(0,0,0,0.1)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
        }}>
          🌙
        </div>
      </div>
      
      {/* Glassmorphism cards (dark mode) */}
      {isDark && (
        <div style={{ 
          display: "flex", 
          gap: "40px", 
          alignItems: "center", 
          justifyContent: "center", 
          height: "60%",
          marginTop: "10%",
        }}>
          {[0, 1, 2].map((index) => {
            const delay = 35 + (index * 8);
            const appearSpring = spring({ frame: frame - delay, fps, config: { damping: 25, stiffness: 150 } });
            
            return (
              <div
                key={index}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "20px",
                  padding: "32px",
                  width: "280px",
                  height: "200px",
                  backdropFilter: "blur(20px)",
                  opacity: appearSpring,
                  transform: `scale(${interpolate(appearSpring, [0, 1], [0.9, 1])})`,
                }}
              >
                <div style={{
                  width: "100%",
                  height: "40px",
                  background: `linear-gradient(90deg, ${BLUE_SHADES[5]}40, ${BLUE_SHADES[6]}60)`,
                  borderRadius: "8px",
                  marginBottom: "20px",
                }} />
                <div style={{
                  width: "70%",
                  height: "16px",
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderRadius: "4px",
                  marginBottom: "12px",
                }} />
                <div style={{
                  width: "50%",
                  height: "16px",
                  backgroundColor: "rgba(255,255,255,0.4)",
                  borderRadius: "4px",
                }} />
              </div>
            );
          })}
        </div>
      )}
      
      {/* Animated bar chart */}
      {isDark && (
        <div style={{
          position: "absolute",
          bottom: "25%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "end",
          gap: "16px",
          height: "120px",
        }}>
          {[0.3, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4].map((height, index) => {
            const delay = 50 + (index * 6);
            const growSpring = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 120 } });
            const barHeight = interpolate(growSpring, [0, 1], [0, height * 100]);
            
            return (
              <div
                key={index}
                style={{
                  width: "32px",
                  height: `${barHeight}px`,
                  background: `linear-gradient(180deg, ${BLUE_SHADES[4]}, ${BLUE_SHADES[6]})`,
                  borderRadius: "4px 4px 0 0",
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Text overlay */}
      <div style={{
        position: "absolute",
        bottom: "15%",
        left: "80px",
        fontFamily: FONT,
        fontSize: "64px",
        fontWeight: "700",
        color: isDark ? TEXT_WHITE : "#1f2937",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" }),
        textShadow: isDark ? `0 0 40px ${BRAND_ORANGE}60, 0 2px 20px rgba(0,0,0,0.8)` : "none",
      }}>
        DARK MODE.
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: EXPORT — 6 Formats
const Scene5Export: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const tabs = ["TAILWIND V3", "FIGMA VARIABLES", "CSS VARIABLES"];
  const tabDuration = 40; // frames per tab
  const currentTab = Math.floor(frame / tabDuration) % tabs.length;
  
  // Code snippets for each tab
  const codeSnippets = {
    "TAILWIND V3": "bg-blue-500\nhover:bg-blue-600\ntext-white\nfocus:ring-blue-300",
    "FIGMA VARIABLES": "primitive/blue/500\ncomponent/button/bg\nsemantic/primary",
    "CSS VARIABLES": "--blue-500: #3b82f6;\n--blue-600: #2563eb;\n--blue-300: #93c5fd;"
  };
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#1e1e1e", padding: "80px" }}>
      {/* Code editor mockup */}
      <div style={{
        background: "#252526",
        borderRadius: "12px",
        border: "1px solid #3e3e42",
        width: "100%",
        height: "70%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Editor header with tabs */}
        <div style={{
          background: "#2d2d30",
          padding: "0",
          display: "flex",
          borderBottom: "1px solid #3e3e42",
        }}>
          {tabs.map((tab, index) => {
            const isActive = index === currentTab;
            const tabOpacity = interpolate(frame, [index * tabDuration, index * tabDuration + 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            
            return (
              <div
                key={index}
                style={{
                  padding: "12px 24px",
                  background: isActive ? "#1e1e1e" : "transparent",
                  color: isActive ? TEXT_WHITE : "#858585",
                  borderBottom: isActive ? `2px solid ${BRAND_ORANGE}` : "none",
                  fontFamily: FONT,
                  fontSize: "14px",
                  fontWeight: "500",
                  opacity: tabOpacity,
                }}
              >
                {tab}
              </div>
            );
          })}
        </div>
        
        {/* Code content */}
        <div style={{ padding: "32px", flex: 1 }}>
          <pre style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "18px",
            color: TEXT_WHITE,
            lineHeight: 1.6,
            margin: 0,
            opacity: interpolate(frame % tabDuration, [5, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}>
            {codeSnippets[tabs[currentTab] as keyof typeof codeSnippets]}
          </pre>
        </div>
        
        {/* Copy button */}
        <div style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 16px",
          background: BRAND_ORANGE,
          color: "white",
          borderRadius: "6px",
          fontFamily: FONT,
          fontSize: "12px",
          fontWeight: "600",
          textTransform: "uppercase",
          cursor: "pointer",
          transform: `scale(${interpolate(frame % 30, [0, 5, 10], [1, 0.95, 1], { extrapolateRight: "clamp" })})`,
          boxShadow: frame % 30 < 10 ? "0 0 20px rgba(34, 197, 94, 0.5)" : "none",
        }}>
          COPY TO CLIPBOARD
        </div>
      </div>
      
      {/* Text overlays with staggered appearance */}
      <div style={{ position: "absolute", top: "15%", left: "80px" }}>
        <div style={{
          fontFamily: FONT,
          fontSize: "52px",
          fontWeight: "700",
          color: TEXT_WHITE,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
          marginBottom: "16px",
        }}>
          6 EXPORT FORMATS.
        </div>
        
        <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          {["FIGMA.", "TAILWIND.", "CSS."].map((word, index) => (
            <span
              key={index}
              style={{
                fontFamily: FONT,
                fontSize: "56px",
                fontWeight: "700",
                color: word === "FIGMA." ? BRAND_ORANGE : TEXT_WHITE,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                opacity: interpolate(frame, [40 + index * 12, 55 + index * 12], [0, 1], { extrapolateRight: "clamp" }),
                transform: `translateY(${interpolate(frame, [40 + index * 12, 55 + index * 12], [20, 0], { extrapolateRight: "clamp" })}px)`,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: THE DIFFERENTIATOR — FREE Reveal
const Scene6Differentiator: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const features = ["OKLCH COLOR SCIENCE", "SMART WEIGHT DETECTION", "ZERO DEPENDENCIES"];
  const freeRevealFrame = 36; // 1.2 seconds
  
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...DOT_GRID, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Feature lines */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        alignItems: "center",
        opacity: interpolate(frame, [freeRevealFrame - 5, freeRevealFrame + 5], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
      }}>
        {features.map((feature, index) => {
          const delay = index * 8;
          const appearSpring = spring({ frame: frame - delay, fps, config: { damping: 25, stiffness: 150 } });
          const y = interpolate(appearSpring, [0, 1], [40, 0]);
          
          return (
            <div
              key={index}
              style={{
                fontFamily: FONT,
                fontSize: "42px",
                fontWeight: "600",
                color: TEXT_WHITE,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: appearSpring,
                transform: `translateY(${y}px)`,
                textShadow: "0 2px 16px rgba(0,0,0,0.7)",
              }}
            >
              {feature}
            </div>
          );
        })}
      </div>
      
      {/* FREE reveal */}
      <div style={{
        position: "absolute",
        fontFamily: FONT,
        fontSize: "180px",
        fontWeight: "700",
        color: BRAND_ORANGE,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        opacity: interpolate(frame, [freeRevealFrame, freeRevealFrame + 5], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
        transform: `scale(${interpolate(spring({ frame: frame - freeRevealFrame, fps, config: { damping: 12, stiffness: 80, mass: 1.2 } }), [0, 1], [0.5, 1])})`,
        textShadow: `0 0 80px ${BRAND_ORANGE}40, 0 0 160px ${BRAND_ORANGE}20`,
      }}>
        FREE.
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: CTA
const Scene7CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleSpring = spring({ frame, fps, config: { damping: 25, stiffness: 100 } });
  const urlSpring = spring({ frame: frame - 8, fps, config: { damping: 25, stiffness: 100 } });
  const authorSpring = spring({ frame: frame - 16, fps, config: { damping: 25, stiffness: 100 } });
  const underlineWidth = interpolate(frame, [20, 45], [0, 100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...DOT_GRID, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px" }}>
      {/* Title */}
      <div style={{
        fontFamily: FONT,
        fontSize: "72px",
        fontWeight: "700",
        color: BRAND_ORANGE,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        opacity: titleSpring,
        transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
        textShadow: `0 0 60px ${BRAND_ORANGE}30`,
      }}>
        UI COLOR GENERATOR
      </div>
      
      {/* URL with underline animation */}
      <div style={{
        position: "relative",
        opacity: urlSpring,
        transform: `translateY(${interpolate(urlSpring, [0, 1], [20, 0])}px)`,
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: "36px",
          fontWeight: "500",
          color: TEXT_WHITE,
          letterSpacing: "0.06em",
        }}>
          tools.gamaleldien.com/shades
        </div>
        <div style={{
          position: "absolute",
          bottom: "-6px",
          left: "0",
          height: "2px",
          width: `${underlineWidth}%`,
          backgroundColor: BRAND_ORANGE,
        }} />
      </div>
      
      {/* Author */}
      <div style={{
        position: "absolute",
        bottom: "60px",
        right: "80px",
        fontFamily: FONT,
        fontSize: "20px",
        fontWeight: "400",
        color: TEXT_MUTED,
        letterSpacing: "0.02em",
        opacity: authorSpring,
      }}>
        by Gamal Eldien
      </div>
    </AbsoluteFill>
  );
};

// Flash transition effect
const FlashTransition: React.FC<{ color?: string }> = ({ color = "#ffffff" }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 3, 8], [0, 0.4, 0], { extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", inset: 0, backgroundColor: color, opacity, zIndex: 20 }} />;
};

// Main component
export const PromoV4: React.FC = () => {

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      {/* Scene 1: Hook (0-2s = frames 0-60) */}
      <Sequence from={0} durationInFrames={60}>
        <Scene1Hook />
      </Sequence>

      {/* Scene 2: Speed (2-5s = frames 60-150) */}
      <Sequence from={60} durationInFrames={90}>
        <Scene2Speed />
        <FlashTransition />
      </Sequence>

      {/* Scene 3: Preview (5-9s = frames 150-270) */}
      <Sequence from={150} durationInFrames={120}>
        <Scene3Preview />
      </Sequence>

      {/* Scene 4: Dark Mode (9-12s = frames 270-360) */}
      <Sequence from={270} durationInFrames={90}>
        <Scene4DarkMode />
        <FlashTransition color={BRAND_ORANGE} />
      </Sequence>

      {/* Scene 5: Export (12-16s = frames 360-480) */}
      <Sequence from={360} durationInFrames={120}>
        <Scene5Export />
      </Sequence>

      {/* Scene 6: Differentiator (16-18s = frames 480-540) */}
      <Sequence from={480} durationInFrames={60}>
        <Scene6Differentiator />
      </Sequence>

      {/* Scene 7: CTA (18-20s = frames 540-600) */}
      <Sequence from={540} durationInFrames={60}>
        <Scene7CTA />
      </Sequence>
    </AbsoluteFill>
  );
};