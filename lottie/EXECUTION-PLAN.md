# Lottie Tool — Execution Plan
## tools.gamaleldien.com/lottie

**Author:** Joo + JO-Business + JO-Creative  
**Date:** 2026-01-31  
**Status:** Planning Phase  
**URL Target:** https://tools.gamaleldien.com/lottie

---

## Executive Summary

Build a comprehensive Lottie animation tool as a web page, following the same design language and business strategy as Dark Mode Converter and Shade Generator. The tool will be developed in 3 phases, each adding more functionality.

**Business Goal:** Lead generation for gamaleldien.com consulting + Zone 99 development projects.  
**Target Audience:** Designers, developers, and motion designers working with Lottie animations.  
**Competitive Advantage:** Professional-grade tool with brand editing capabilities (unique in the market).

---

## Phase Overview

| Phase | Name | Core Feature | Complexity | Priority |
|-------|------|--------------|------------|----------|
| 1️⃣ | **Lottie Preview** | Upload JSON → View animation | Low | NOW |
| 2️⃣ | **Lottie Editor** | View colors → Edit colors → Save JSON | Medium | NEXT |
| 3️⃣ | **Lottie Export** | Export to GIF / Video | High | LATER |

---

## Phase 1: Lottie Preview

### Objective
Create a simple, beautiful web tool that lets users upload a Lottie JSON file and preview the animation instantly.

### Features (MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Drag & Drop Upload** | Drop JSON file onto page | P0 |
| **File Select** | Click to browse files | P0 |
| **Animation Preview** | Display animation in real-time | P0 |
| **Play/Pause/Stop** | Basic playback controls | P0 |
| **Speed Control** | 0.25x to 3x speed slider | P1 |
| **Progress Bar** | Click to seek | P1 |
| **Animation Info** | Dimensions, FPS, duration | P1 |
| **Multiple Animations** | Upload multiple files at once | P2 |
| **Clear All** | Remove all loaded animations | P2 |

### Technical Requirements

**Dependencies:**
- `lottie-web` (bodymovin) — CDN or bundled
- No backend required — 100% client-side

**Structure:**
```
lottie-previewer/
├── index.html      # Main web page
├── styles.css      # Styles (from DESIGN-SYSTEM.md)
├── app.js          # Application logic
└── libs/
    └── lottie.min.js
```

**Key Implementation Notes:**
1. Use `lottie.loadAnimation()` with `renderer: 'svg'` for best quality
2. Support multiple animations in a grid layout
3. Store animation data in a Map for management
4. Responsive design for mobile/tablet

### UI/UX Requirements (Following DESIGN-SYSTEM.md)

**Color Scheme:**
- Background: `#0a0a0a`
- Surface: `rgba(63, 63, 63, 0.3)` + `backdrop-filter: blur(48px)`
- Accent: `#e16105` (orange)
- Text: `#ffffff`

**Typography:**
- Font: Clash Display
- All labels: UPPERCASE
- Letter-spacing: 0.06em–0.15em

**Components to Use:**
- `.btn` — Pill-shaped buttons (64px radius)
- `.palette-card` — Animation cards (32px radius, gradient border)
- `.export-section` — Controls section
- Drag & drop zone with dashed border

**Animations:**
- `fadeInUp` on load
- Staggered delays per section
- Card hover: `translateY(-4px)`

### Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR (sticky)                                              │
│ [Logo]                              [TOOLS] [GAMALELDIEN.COM]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│              LOTTIE PREVIEW                                  │
│              Preview Lottie animations instantly             │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                       │   │
│   │     ┌───────────────────────────────────────────┐    │   │
│   │     │                                           │    │   │
│   │     │        DROP LOTTIE JSON HERE              │    │   │
│   │     │        or click to browse                 │    │   │
│   │     │                                           │    │   │
│   │     └───────────────────────────────────────────┘    │   │
│   │                                                       │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   ┌─────────────────┐  ┌─────────────────┐                  │
│   │  Animation 1    │  │  Animation 2    │                  │
│   │  ┌───────────┐  │  │  ┌───────────┐  │                  │
│   │  │  PREVIEW  │  │  │  │  PREVIEW  │  │                  │
│   │  └───────────┘  │  │  └───────────┘  │                  │
│   │  filename.json  │  │  filename.json  │                  │
│   │  200x200 30fps  │  │  400x400 24fps  │                  │
│   │                 │  │                 │                  │
│   │  [▶] [⏸] [⏹]   │  │  [▶] [⏸] [⏹]   │                  │
│   │  Speed: ──●──   │  │  Speed: ──●──   │                  │
│   │  ████████░░░░   │  │  ████████░░░░   │                  │
│   │                 │  │                 │                  │
│   │  [✕ REMOVE]     │  │  [✕ REMOVE]     │                  │
│   └─────────────────┘  └─────────────────┘                  │
│                                                              │
│              [CLEAR ALL]                                     │
│                                                              │
│   // HOW IT WORKS //                                         │
│                                                              │
│   Lottie is a JSON-based animation format by Airbnb...      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ ©2025 // MADE BY GAMAL ELDIEN                               │
└─────────────────────────────────────────────────────────────┘
```

### SEO Strategy

**Target Keywords:**
- Primary: "lottie preview", "lottie viewer online", "lottie json preview"
- Secondary: "lottie animation viewer", "preview lottie file", "lottie player online"
- Long-tail: "view lottie json animation online free", "lottie file previewer tool"

**Meta Tags:**
```html
<title>Lottie Preview — Free Online Lottie Animation Viewer</title>
<meta name="description" content="Preview Lottie JSON animations instantly in your browser. Free online tool by Gamal Eldien. Drag & drop, play/pause, speed control. No signup required.">
<meta property="og:title" content="Lottie Preview — Free Online Animation Viewer">
<meta property="og:description" content="Preview Lottie JSON animations instantly. Drag & drop, play controls, speed adjustment. Free forever.">
<meta property="og:image" content="https://tools.gamaleldien.com/lottie/og-image.png">
```

### Deliverables Phase 1

1. ✅ `index.html` — Complete web page
2. ✅ `styles.css` — Following DESIGN-SYSTEM.md exactly
3. ✅ `app.js` — Application logic (adapted from popup.js)
4. ✅ `og-image.png` — Open Graph image (1200x630)
5. ✅ Integration with build-router.py for deployment
6. ✅ Google Analytics integration

### Success Metrics Phase 1
- Tool loads in < 2 seconds
- Works on mobile/tablet/desktop
- Handles multiple animations (up to 10)
- 100% client-side (no server calls)

---

## Phase 2: Lottie Editor

### Objective
Allow users to view and edit colors within a Lottie animation, then download the modified JSON.

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Color Extraction** | Parse JSON → list all colors used | P0 |
| **Color Preview** | Show swatches for each color | P0 |
| **Color Picker** | Click swatch → pick new color | P0 |
| **Live Preview** | Animation updates as colors change | P0 |
| **Save JSON** | Download modified JSON file | P0 |
| **Color Groups** | Group by layer/element | P1 |
| **Undo/Redo** | Ctrl+Z / Ctrl+Y support | P1 |
| **Color Replacement** | Find/replace across animation | P2 |
| **History** | Show change history | P2 |

### Technical Challenges

**Color Extraction from Lottie JSON:**
Lottie stores colors in multiple ways:
- `c.k` — Static color (RGBA 0-1)
- `c.k[n].s` — Keyframed color
- Nested in shapes, fills, strokes, effects

**Algorithm:**
1. Recursive traverse of JSON
2. Find all `c` (color) properties
3. Track path for modification
4. Convert 0-1 to hex for display
5. Update in place when edited

**Color Mapping:**
```javascript
// Lottie color format: [R, G, B, A] where values are 0-1
// Example: [1, 0.5, 0, 1] = #ff8000 (orange)

function lottieToHex(lottieColor) {
  const r = Math.round(lottieColor[0] * 255);
  const g = Math.round(lottieColor[1] * 255);
  const b = Math.round(lottieColor[2] * 255);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

function hexToLottie(hex) {
  const r = parseInt(hex.slice(1,3), 16) / 255;
  const g = parseInt(hex.slice(3,5), 16) / 255;
  const b = parseInt(hex.slice(5,7), 16) / 255;
  return [r, g, b, 1];
}
```

### UI Addition (Editor Panel)

```
┌──────────────────────────────────────────────────────────────┐
│  Animation Card (from Phase 1)                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                  [ANIMATION PREVIEW]                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  // COLORS (12 found) //                                      │
│                                                               │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │██████│ │██████│ │██████│ │██████│ │██████│ │██████│      │
│  │#FF5733│ │#3498DB│ │#2ECC71│ │#F39C12│ │#9B59B6│ │#1ABC9C│ │
│  │ Fill │ │Stroke│ │ BG   │ │Accent│ │Shadow│ │ Glow │      │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘      │
│                                                               │
│  [UNDO] [REDO]                    [DOWNLOAD EDITED JSON]     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Deliverables Phase 2

1. ✅ Color extraction algorithm
2. ✅ Color picker integration (native or custom)
3. ✅ Live animation update
4. ✅ JSON download with modifications
5. ✅ Undo/Redo system

### Success Metrics Phase 2
- Extract colors from 95%+ of Lottie files
- Color change reflects instantly (< 100ms)
- Modified JSON plays correctly in other players

---

## Phase 3: Lottie Export

### Objective
Allow users to export the Lottie animation as GIF or video (MP4/WebM).

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Export to GIF** | Render animation as GIF | P0 |
| **Quality Settings** | Low/Medium/High presets | P1 |
| **Size Options** | 1x, 2x, custom dimensions | P1 |
| **Background Color** | Transparent or solid | P1 |
| **FPS Control** | Adjust output frame rate | P1 |
| **Export to Video** | MP4/WebM output | P2 |
| **Loop Options** | Number of loops in GIF | P2 |

### Technical Approach

**GIF Export (gif.js library):**
```javascript
import GIF from 'gif.js';

async function exportToGif(animData, options = {}) {
  const { width, height, fps = 20, quality = 10 } = options;
  
  const gif = new GIF({
    workers: 2,
    quality: quality,
    width: width,
    height: height,
    workerScript: '/libs/gif.worker.js'
  });
  
  // Render each frame to canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  
  const anim = lottie.loadAnimation({
    container: offscreenDiv,
    renderer: 'canvas',
    animationData: animData,
    rendererSettings: { context: ctx }
  });
  
  for (let i = 0; i < totalFrames; i += frameStep) {
    anim.goToAndStop(i, true);
    gif.addFrame(ctx, { copy: true, delay: frameDelay });
  }
  
  gif.on('finished', blob => {
    // Download blob
  });
  
  gif.render();
}
```

**Video Export (via MediaRecorder or FFmpeg.wasm):**
- Option A: MediaRecorder API (simpler, WebM only)
- Option B: FFmpeg.wasm (complex, MP4 support)

### UI Addition (Export Panel)

```
┌──────────────────────────────────────────────────────────────┐
│  // EXPORT //                                                 │
│                                                               │
│  FORMAT:     [GIF] [MP4] [WEBM]                               │
│                                                               │
│  SIZE:       [ORIGINAL] [1x] [2x] [CUSTOM]                    │
│              Width: [____] Height: [____]                     │
│                                                               │
│  QUALITY:    [LOW] [MEDIUM] [HIGH]                            │
│              (Higher quality = larger file)                   │
│                                                               │
│  BACKGROUND: [TRANSPARENT] [WHITE] [BLACK] [CUSTOM]           │
│                                                               │
│  FPS:        [15] [20] [30] (Original: 60fps)                 │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  │ Rendering frame 45 of 120...                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  [CANCEL]                              [EXPORT GIF]           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Deliverables Phase 3

1. ✅ GIF export with gif.js
2. ✅ Quality/size/FPS options
3. ✅ Background color options
4. ✅ Progress indicator
5. ✅ (Optional) Video export via FFmpeg.wasm

### Success Metrics Phase 3
- GIF export works for 90%+ of animations
- Export time < 30 seconds for typical animations
- Output file size is reasonable (< 5MB for most)

---

## Technical Architecture

### File Structure (Final)

```
lottie-previewer/
├── index.html              # Main page
├── styles.css              # All styles
├── app.js                  # Core application
├── modules/
│   ├── preview.js          # Phase 1: Preview functionality
│   ├── editor.js           # Phase 2: Color editing
│   └── export.js           # Phase 3: GIF/video export
├── libs/
│   ├── lottie.min.js       # Lottie player
│   ├── gif.js              # GIF encoder
│   └── gif.worker.js       # GIF worker
├── assets/
│   └── og-image.png        # OG image
└── docs/
    └── EXECUTION-PLAN.md   # This file
```

### Dependencies

| Library | Version | Purpose | Size |
|---------|---------|---------|------|
| lottie-web | 5.x | Animation rendering | ~150KB |
| gif.js | 0.2.0 | GIF encoding | ~50KB |
| (optional) ffmpeg.wasm | 0.12.x | Video export | ~25MB |

### Performance Considerations

1. **Lazy load heavy libraries** — Only load gif.js when export is clicked
2. **Web Workers** — Use workers for GIF encoding (already built into gif.js)
3. **Memory management** — Destroy animations when removed
4. **Canvas pooling** — Reuse canvases for export

---

## Business Integration

### CTA Strategy

**On-page CTAs:**
1. **Newsletter signup** — "Get notified when Lottie Editor launches"
2. **Hire CTA** — "Need custom animation tools? [Work with me]"
3. **Zone 99 CTA** — "Need animation integration? [Zone 99 builds it]"

### Traffic Projections

| Timeframe | Users/Month | Source |
|-----------|-------------|--------|
| Month 1-3 | 500-1,500 | Launch buzz, Product Hunt |
| Month 4-6 | 2,000-5,000 | SEO starting to rank |
| Month 7-12 | 5,000-15,000 | Established + word of mouth |

### Lead Capture

- **Phase 1:** Simple tool, newsletter CTA
- **Phase 2:** "Save to account" option (email capture)
- **Phase 3:** Premium export options (paid tier potential)

---

## Timeline

### Phase 1: Lottie Preview
**Duration:** 2-3 days  
**Effort:** ~8-12 hours

| Task | Hours | Owner |
|------|-------|-------|
| HTML structure | 1 | JO-DevOps/Joo |
| CSS styling (from DESIGN-SYSTEM.md) | 2 | JO-Creative/Joo |
| JavaScript: Drag & drop | 1 | Joo |
| JavaScript: Animation loading | 2 | Joo |
| JavaScript: Controls | 2 | Joo |
| Integration + testing | 2 | JO-DevOps |
| OG image + SEO | 1 | JO-Creative |
| Deployment | 1 | JO-DevOps |

### Phase 2: Lottie Editor
**Duration:** 4-5 days  
**Effort:** ~16-20 hours

| Task | Hours | Owner |
|------|-------|-------|
| Color extraction algorithm | 4 | Joo |
| Color picker integration | 2 | Joo |
| Live update system | 3 | Joo |
| Undo/Redo system | 2 | Joo |
| UI for color panel | 3 | JO-Creative |
| Download functionality | 2 | Joo |
| Testing + edge cases | 4 | JO-DevOps |

### Phase 3: Lottie Export
**Duration:** 3-4 days  
**Effort:** ~12-16 hours

| Task | Hours | Owner |
|------|-------|-------|
| GIF.js integration | 3 | Joo |
| Export options UI | 2 | JO-Creative |
| Quality/size controls | 2 | Joo |
| Progress indicator | 1 | Joo |
| Testing + optimization | 4 | JO-DevOps |
| (Optional) Video export | 4 | Joo |

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Complex Lottie files fail | Medium | High | Graceful error handling, "simplified mode" |
| GIF export slow | High | Medium | Show progress, offer quality presets |
| Color extraction misses some | Medium | Medium | Manual color entry option |
| Browser compatibility | Low | High | Test on Chrome, Firefox, Safari, Edge |
| Mobile performance | Medium | Medium | Limit animations on mobile, reduce preview size |

---

## Competitive Analysis

| Competitor | Preview | Edit Colors | Export GIF | Free |
|------------|---------|-------------|------------|------|
| **LottieFiles.com** | ✅ | ❌ | ✅ (limited) | Freemium |
| **lottielab.com** | ✅ | ✅ (full editor) | ✅ | Paid |
| **SVGator** | ✅ | ✅ | ✅ | Paid |
| **Our Tool** | ✅ | ✅ (colors only) | ✅ | **FREE** |

**Our Advantage:** 
- 100% free, no signup
- Color editing without full editor complexity
- Same premium design as other tools.gamaleldien.com tools
- Educational content on Lottie best practices

---

## Next Steps

1. ✅ Review and approve this plan
2. ⏳ Start Phase 1 development
3. ⏳ Create OG image
4. ⏳ Integrate with build-router.py
5. ⏳ Deploy and test
6. ⏳ Product Hunt launch

---

**END OF EXECUTION PLAN**

---

*This document serves as the complete blueprint for the Lottie Tool development. All phases are designed to be implemented incrementally while maintaining the design standards and business strategy of tools.gamaleldien.com.*

**Document by:** Joo 🛸 + JO-Business 🏢 + JO-Creative 🎨  
**Model:** Claude Opus 4.5 (Anthropic via Google)  
**Date:** 2026-01-31
