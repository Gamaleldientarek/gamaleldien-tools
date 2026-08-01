import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, spring, Sequence, staticFile } from "remotion";

// Brand constants
const BRAND_ORANGE = "#e16105";
const DARK_BG = "#0a0a0a";
const TEXT_WHITE = "#ffffff";
const TEXT_MUTED = "#808080";
const FONT = "'Clash Display', 'Inter', -apple-system, sans-serif";

const DOT_GRID = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

// Ken Burns effect: slow zoom + optional pan
const useKenBurns = (frame: number, fps: number, duration: number, startScale = 1.0, endScale = 1.08, panX = 0, panY = 0) => {
  const progress = interpolate(frame, [0, duration * fps], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(progress, [0, 1], [startScale, endScale]);
  const x = interpolate(progress, [0, 1], [0, panX]);
  const y = interpolate(progress, [0, 1], [0, panY]);
  return { scale, x, y };
};

// Fade overlay text component
const OverlayText: React.FC<{
  text: string; fontSize?: number; color?: string; bottom?: number; left?: number;
  right?: number; top?: number; delay?: number; align?: string; glow?: boolean;
  weight?: number; spacing?: string; center?: boolean;
}> = ({ text, fontSize = 64, color = TEXT_WHITE, bottom, left, right, top, delay = 0, align, glow, weight = 700, spacing = "0.06em", center }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const fadeIn = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 120 } });
  const translateY = interpolate(fadeIn, [0, 1], [30, 0]);
  
  return (
    <div style={{
      position: "absolute",
      bottom, left, right, top,
      ...(center ? { left: "50%", transform: `translateX(-50%) translateY(${translateY}px)`, textAlign: "center" } : { transform: `translateY(${translateY}px)` }),
      fontFamily: FONT,
      fontSize,
      fontWeight: weight,
      color,
      textTransform: "uppercase" as const,
      letterSpacing: spacing,
      opacity: fadeIn,
      textShadow: glow ? `0 0 40px ${BRAND_ORANGE}60, 0 2px 20px rgba(0,0,0,0.8)` : "0 2px 16px rgba(0,0,0,0.7)",
      zIndex: 10,
    }}>
      {text}
    </div>
  );
};

// Screenshot with Ken Burns
const ScreenshotScene: React.FC<{
  src: string; startScale?: number; endScale?: number; panX?: number; panY?: number;
  brightness?: number; overlay?: number;
}> = ({ src, startScale = 1.0, endScale = 1.08, panX = 0, panY = 0, brightness = 1, overlay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const kb = useKenBurns(frame, fps, durationInFrames / fps, startScale, endScale, panX, panY);
  
  return (
    <AbsoluteFill>
      <div style={{
        width: "100%", height: "100%", overflow: "hidden",
        filter: `brightness(${brightness})`,
      }}>
        <Img src={src} style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${kb.scale}) translate(${kb.x}px, ${kb.y}px)`,
        }} />
      </div>
      {overlay > 0 && (
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(180deg, rgba(0,0,0,${overlay * 0.3}) 0%, rgba(0,0,0,${overlay}) 100%)`,
        }} />
      )}
    </AbsoluteFill>
  );
};

// Scene 6: Feature lines + FREE reveal (pure motion graphics)
const DifferentiatorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const features = ["OKLCH COLOR SCIENCE", "SMART WEIGHT DETECTION", "ZERO DEPENDENCIES"];
  
  // "FREE." reveal
  const freeDelay = fps * 1.2;
  const freeSpring = spring({ frame: frame - freeDelay, fps, config: { damping: 12, stiffness: 80, mass: 1.2 } });
  const freeScale = interpolate(freeSpring, [0, 1], [0.5, 1]);
  const freeOpacity = interpolate(frame, [freeDelay, freeDelay + 5], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  
  // Features fade out when FREE appears
  const featuresOpacity = interpolate(frame, [freeDelay - 5, freeDelay + 5], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...DOT_GRID, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Feature lines */}
      <div style={{ opacity: featuresOpacity, display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        {features.map((feature, i) => {
          const delay = i * 8;
          const s = spring({ frame: frame - delay, fps, config: { damping: 25, stiffness: 150 } });
          const y = interpolate(s, [0, 1], [40, 0]);
          return (
            <div key={i} style={{
              fontFamily: FONT, fontSize: 42, fontWeight: 600, color: TEXT_WHITE,
              textTransform: "uppercase", letterSpacing: "0.08em",
              opacity: s, transform: `translateY(${y}px)`,
            }}>
              {feature}
            </div>
          );
        })}
      </div>
      
      {/* FREE. */}
      <div style={{
        position: "absolute", opacity: freeOpacity,
        fontFamily: FONT, fontSize: 180, fontWeight: 700, color: BRAND_ORANGE,
        textTransform: "uppercase", letterSpacing: "0.04em",
        transform: `scale(${freeScale})`,
        textShadow: `0 0 80px ${BRAND_ORANGE}40, 0 0 160px ${BRAND_ORANGE}20`,
      }}>
        FREE.
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: CTA
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleSpring = spring({ frame, fps, config: { damping: 25, stiffness: 100 } });
  const urlSpring = spring({ frame: frame - 8, fps, config: { damping: 25, stiffness: 100 } });
  const authorSpring = spring({ frame: frame - 16, fps, config: { damping: 25, stiffness: 100 } });
  
  // Underline animation
  const underlineWidth = interpolate(frame, [20, 45], [0, 100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...DOT_GRID, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      {/* Title */}
      <div style={{
        fontFamily: FONT, fontSize: 72, fontWeight: 700, color: BRAND_ORANGE,
        textTransform: "uppercase", letterSpacing: "0.04em",
        opacity: titleSpring, transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
        textShadow: `0 0 60px ${BRAND_ORANGE}30`,
      }}>
        UI COLOR GENERATOR
      </div>
      
      {/* URL */}
      <div style={{ position: "relative", opacity: urlSpring, transform: `translateY(${interpolate(urlSpring, [0, 1], [20, 0])}px)` }}>
        <div style={{
          fontFamily: FONT, fontSize: 36, fontWeight: 500, color: TEXT_WHITE,
          letterSpacing: "0.06em",
        }}>
          tools.gamaleldien.com/shades
        </div>
        <div style={{
          position: "absolute", bottom: -6, left: 0, height: 2,
          width: `${underlineWidth}%`, backgroundColor: BRAND_ORANGE,
        }} />
      </div>
      
      {/* Author */}
      <div style={{
        position: "absolute", bottom: 60, right: 80,
        fontFamily: FONT, fontSize: 20, fontWeight: 400, color: TEXT_MUTED,
        letterSpacing: "0.02em",
        opacity: authorSpring,
      }}>
        by Gamal Eldien
      </div>
    </AbsoluteFill>
  );
};

// Flash transition between screenshots
const FlashTransition: React.FC<{ color?: string }> = ({ color = "#ffffff" }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 3, 8], [0, 0.6, 0], { extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", inset: 0, backgroundColor: color, opacity, zIndex: 20 }} />;
};

// Main composition
export const PromoV3: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      
      {/* Scene 1: Hero (0-2s = frames 0-60) — Light theme initial */}
      <Sequence from={0} durationInFrames={60}>
        <ScreenshotScene src={staticFile("screenshots-v3/02-blue-palette.png")} startScale={1.05} endScale={1.12} panY={-10} overlay={0.3} />
        <OverlayText text="ANY COLOR." fontSize={72} bottom={120} left={80} delay={15} glow />
      </Sequence>

      {/* Scene 2: Speed (2-5s = frames 60-150) — Random generations */}
      <Sequence from={60} durationInFrames={30}>
        <ScreenshotScene src={staticFile("screenshots-v3/03-random-1.png")} startScale={1.02} endScale={1.06} overlay={0.2} />
        <FlashTransition />
      </Sequence>
      <Sequence from={90} durationInFrames={30}>
        <ScreenshotScene src={staticFile("screenshots-v3/04-random-2.png")} startScale={1.02} endScale={1.06} overlay={0.2} />
        <FlashTransition />
      </Sequence>
      <Sequence from={120} durationInFrames={30}>
        <ScreenshotScene src={staticFile("screenshots-v3/01-hero-light.png")} startScale={1.02} endScale={1.06} overlay={0.2} />
        <FlashTransition />
        <OverlayText text="11 SHADES. INSTANT." fontSize={56} bottom={100} left={80} delay={5} />
      </Sequence>

      {/* Scene 3: Preview (5-9s = frames 150-270) — Cards + Components */}
      <Sequence from={150} durationInFrames={60}>
        <ScreenshotScene src={staticFile("screenshots-v3/05-preview-cards.png")} startScale={1.0} endScale={1.06} panY={-15} overlay={0.15} />
        <OverlayText text="LIVE PREVIEW." fontSize={56} top={60} left={80} delay={10} />
      </Sequence>
      <Sequence from={210} durationInFrames={60}>
        <ScreenshotScene src={staticFile("screenshots-v3/06-preview-more.png")} startScale={1.0} endScale={1.05} panY={10} overlay={0.15} />
        <OverlayText text="EVERY ELEMENT." fontSize={48} bottom={120} right={80} delay={10} />
      </Sequence>

      {/* Scene 4: Dark Mode (9-12s = frames 270-360) */}
      <Sequence from={270} durationInFrames={45}>
        <ScreenshotScene src={staticFile("screenshots-v3/07-dark-hero.png")} startScale={1.0} endScale={1.08} overlay={0.2} />
        <FlashTransition color={BRAND_ORANGE} />
        <OverlayText text="DARK MODE." fontSize={64} bottom={120} left={80} delay={8} glow />
      </Sequence>
      <Sequence from={315} durationInFrames={45}>
        <ScreenshotScene src={staticFile("screenshots-v3/09-dark-preview.png")} startScale={1.02} endScale={1.08} panY={-10} overlay={0.15} />
      </Sequence>

      {/* Scene 5: Export (12-16s = frames 360-480) */}
      <Sequence from={360} durationInFrames={60}>
        <ScreenshotScene src={staticFile("screenshots-v3/10-export-section.png")} startScale={1.0} endScale={1.06} panY={5} overlay={0.2} />
        <OverlayText text="6 EXPORT FORMATS." fontSize={52} top={60} left={80} delay={10} />
      </Sequence>
      <Sequence from={420} durationInFrames={60}>
        <ScreenshotScene src={staticFile("screenshots-v3/11-export-code.png")} startScale={1.02} endScale={1.06} overlay={0.25} />
        <OverlayText text="FIGMA." fontSize={56} bottom={180} left={80} delay={5} color={BRAND_ORANGE} />
        <OverlayText text="TAILWIND." fontSize={56} bottom={180} left={350} delay={10} />
        <OverlayText text="CSS." fontSize={56} bottom={180} left={700} delay={15} />
      </Sequence>

      {/* Scene 6: Differentiator (16-18s = frames 480-540) */}
      <Sequence from={480} durationInFrames={60}>
        <DifferentiatorScene />
      </Sequence>

      {/* Scene 7: CTA (18-20s = frames 540-600) */}
      <Sequence from={540} durationInFrames={60}>
        <CTAScene />
      </Sequence>
      
    </AbsoluteFill>
  );
};
