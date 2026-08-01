# UI Color Generator -- Comprehensive Documentation

**URL:** [tools.gamaleldien.com/shades](https://tools.gamaleldien.com/shades)
**Version:** 1.0
**Author:** Gamal Eldien
**Last Updated:** 2026-01-31

---

## Table of Contents

1. [Overview](#1-overview)
2. [Design System](#2-design-system)
3. [Color Science and Algorithm](#3-color-science-and-algorithm)
4. [Features](#4-features)
5. [Preview System](#5-preview-system)
6. [Export System](#6-export-system)
7. [Architecture](#7-architecture)
8. [CSS Animations](#8-css-animations)
9. [Responsive Design](#9-responsive-design)
10. [Problems Solved During Development](#10-problems-solved-during-development)
11. [SEO and Meta](#11-seo-and-meta)
12. [Competitive Analysis](#12-competitive-analysis)

---

## 1. Overview

### What It Is

The UI Color Generator is a professional-grade color tool hosted at `tools.gamaleldien.com/shades`. It generates complete 11-shade color scales (weights 50 through 950) from any input color, using the OKLCH perceptually uniform color space. The output is directly compatible with Tailwind CSS, Figma Variables, and modern design systems.

### Purpose

Designers and developers building UI systems need a full spectrum of shades for every brand color -- light tints for backgrounds, mid-tones for interactive elements, and dark shades for text and emphasis. This tool automates that process with mathematically correct color science, producing scales that look naturally balanced across the entire lightness range.

### Key Characteristics

- **Single-file architecture:** One `index.html` file, approximately 2,692 lines and ~150KB uncompressed
- **Zero external JavaScript dependencies:** All color math, rendering, and state management is vanilla JS
- **Only external resource:** Clash Display font loaded from Fontshare CDN (one network request)
- **Completely free:** No paywall, no sign-in required, no feature gating
- **Client-side only:** All computation happens in the browser; no data is sent to any server

### How It Works (High Level)

1. User enters or generates a hex color
2. The tool converts it to OKLCH color space
3. Smart weight detection maps the input to the nearest shade weight (not always 500)
4. 11 shades are generated using target lightness values and chroma curves
5. Colors are rendered as interactive swatches with live previews
6. Users can export in 6 formats: Tailwind v3, Tailwind v4, CSS Variables, Figma Variables (DTCG), JSON Tokens, and CSS

---

## 2. Design System

### Theme Architecture

The tool supports two themes via CSS custom properties, toggled with a button in the navbar. All surface colors, text colors, borders, and shadows adapt through variable overrides.

**Dark Theme (default variables on `:root`):**

| Token               | Value                          |
|----------------------|--------------------------------|
| `--bg`              | `#0a0a0a`                      |
| `--surface`         | `rgba(63, 63, 63, 0.3)`       |
| `--surface-2`       | `rgba(80, 80, 80, 0.35)`      |
| `--surface-elevated`| `rgba(90, 90, 90, 0.25)`      |
| `--text`            | `rgb(255, 255, 255)`           |
| `--text-muted`      | `rgb(128, 128, 128)`           |
| `--text-secondary`  | `rgb(153, 153, 153)`           |
| `--border`          | `rgb(51, 51, 51)`              |
| `--border-light`    | `rgba(255, 255, 255, 0.08)`   |

**Light Theme (applied via `body.light-theme`):**

| Token               | Value                          |
|----------------------|--------------------------------|
| `--bg`              | `#f5f5f5`                      |
| `--surface`         | `rgba(255, 255, 255, 0.8)`    |
| `--surface-2`       | `rgba(240, 240, 240, 0.9)`    |
| `--text`            | `#0a0a0a`                      |
| `--text-muted`      | `#6b6b6b`                      |
| `--text-secondary`  | `#4a4a4a`                      |
| `--border`          | `#e0e0e0`                      |
| `--border-light`    | `rgba(0, 0, 0, 0.08)`         |

**Default theme on first visit is light.** The `loadTheme()` function inverts the logic: light is the default state, and dark is only applied if `localStorage` explicitly contains `'dark'`.

### Brand Accent

The primary accent color is **`#e16105`** (a warm orange), stored as `--accent: rgb(225, 97, 5)`. It is used for:

- The H1 title ("UI COLOR GENERATOR")
- All primary action buttons (`.btn-primary`)
- Active tab indicators (export tabs, preview tabs)
- Hover states on navigation links
- Text selection highlight (`::selection`)
- Glow shadow: `--shadow-glow: 0 0 24px rgba(225, 97, 5, 0.12)`

### Typography

**Primary Font:** Clash Display from Fontshare CDN

```html
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap">
```

Weights used:
- **400** -- Body text, descriptions
- **500** -- Secondary text, card body copy
- **600** -- Labels, meta text, typography meta
- **700** -- Headings, buttons, badges, all uppercase UI chrome

**Monospace Font (code blocks):**

```css
--font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;
```

### Text Conventions

- **UI chrome** (buttons, labels, tabs, badges, section dividers): `text-transform: uppercase` with `letter-spacing: 0.06em` to `0.1em`
- **Content** (descriptions, card body text, hero description): Sentence case with normal letter-spacing

### Border Radius Scale

| Token            | Value  | Usage                    |
|------------------|--------|--------------------------|
| `--radius`       | `24px` | Default elements         |
| `--radius-lg`    | `32px` | Cards, preview content   |
| `--radius-pill`  | `64px` | Buttons, badges, tabs    |

### Glassmorphism Surfaces

Major surfaces (palette cards, preview content, export section, modals, toast) use a layered glass effect:

```css
background: var(--surface);
backdrop-filter: blur(48px);
-webkit-backdrop-filter: blur(48px);
border: 1px solid var(--border-light);
```

Cards also include a gradient pseudo-element border for the glass edge:

```css
.element::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

### Background Pattern

The body has a subtle dot grid pattern:

- **Dark theme:** `radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)` at 32px spacing
- **Light theme:** `radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)` at 32px spacing

---

## 3. Color Science and Algorithm

### OKLCH Color Space

The tool uses **OKLCH** (Oklab Lightness, Chroma, Hue) for shade generation. OKLCH is a perceptually uniform color space, meaning equal numerical changes produce equal perceived visual changes. This is a significant advantage over HSL, where lightness steps appear uneven across hues (e.g., yellow appears much brighter than blue at the same HSL lightness).

### Color Conversion Pipeline

The full conversion pipeline implemented in Module 1 (~180 lines):

```
Input Hex
  --> sRGB (0-255)
    --> Linear RGB (gamma-decoded via srgbToLinear)
      --> OKLab (L, a, b) via linearRgbToOklab()
        --> OKLCH (L, C, H) via polar conversion
```

And the reverse path:

```
OKLCH (L, C, H)
  --> OKLab (L, a, b) via trigonometry
    --> Linear RGB via oklabToLinearRgb()
      --> sRGB (gamma-encoded via linearToSrgb)
        --> Hex string
```

### Key Conversion Functions

**`srgbToLinear(c)`** -- Applies inverse sRGB transfer function (gamma decoding):
```javascript
return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
```

**`linearToSrgb(c)`** -- Applies sRGB transfer function (gamma encoding):
```javascript
return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
```

**`linearRgbToOklab(r, g, b)`** -- Converts linear RGB to OKLab using the Oklab matrix multiplication (cube roots of LMS intermediates).

**`oklabToLinearRgb(L, a, b)`** -- Inverse of the above, cubing the LMS intermediates.

**`hexToOklch(hex)`** -- Full pipeline from hex to OKLCH:
```javascript
function hexToOklch(hex) {
  const rgb = hexToRgb(hex);
  const lr = srgbToLinear(rgb.r / 255);
  const lg = srgbToLinear(rgb.g / 255);
  const lb = srgbToLinear(rgb.b / 255);
  const lab = linearRgbToOklab(lr, lg, lb);
  const C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let H = Math.atan2(lab.b, lab.a) * (180 / Math.PI);
  if (H < 0) H += 360;
  return { L: lab.L, C: C, H: H };
}
```

### Gamut Clamping via Binary Search

When generating shades at extreme lightness or high chroma, the resulting color may fall outside the sRGB gamut (RGB values below 0 or above 1). The `oklchToHex()` function handles this with a binary search:

```javascript
if (r < 0 || r > 1 || g < 0 || g > 1 || bl < 0 || bl > 1) {
  let lo = 0, hi = C;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    const ma = mid * Math.cos(hRad);
    const mb = mid * Math.sin(hRad);
    const t = oklabToLinearRgb(L, ma, mb);
    if (t.r >= -0.001 && t.r <= 1.001 &&
        t.g >= -0.001 && t.g <= 1.001 &&
        t.b >= -0.001 && t.b <= 1.001) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  // Use lo (maximum in-gamut chroma) for final conversion
}
```

This performs 20 iterations of binary search, converging on the maximum chroma that stays within sRGB bounds. The tolerance of 0.001 prevents rounding artifacts.

### Smart Weight Detection

Unlike most tools that assume the input color is always shade 500, this tool detects which shade weight the input color's lightness is closest to:

```javascript
function detectShadeWeight(L) {
  let bestKey = 500, bestDist = Infinity;
  for (const key of SHADE_KEYS) {
    const dist = Math.abs(L - SHADE_LIGHTNESS[key]);
    if (dist < bestDist) { bestDist = dist; bestKey = key; }
  }
  return bestKey;
}
```

If you input a very dark color (e.g., `#1a1a2e`), it will map to shade 900 rather than forcing it to 500 and producing a distorted scale.

### Shade Lightness Targets

Each of the 11 shade weights has a target OKLCH lightness value:

| Weight | Lightness | Nickname |
|--------|-----------|----------|
| 50     | 0.97      | Ghost    |
| 100    | 0.93      | Mist     |
| 200    | 0.87      | Breeze   |
| 300    | 0.78      | Sky      |
| 400    | 0.67      | Clear    |
| 500    | 0.56      | Core     |
| 600    | 0.48      | Deep     |
| 700    | 0.39      | Bold     |
| 800    | 0.31      | Night    |
| 900    | 0.24      | Shadow   |
| 950    | 0.16      | Abyss    |

### Chroma Curve Multipliers

Natural colors do not maintain uniform chroma across all lightness levels. The chroma curve models how saturation should distribute:

| Weight | Multiplier | Behavior                |
|--------|------------|-------------------------|
| 50     | 0.45       | Very desaturated (tint) |
| 100    | 0.65       | Light and soft           |
| 200    | 0.82       | Building saturation      |
| 300    | 0.92       | Approaching full         |
| 400    | 0.97       | Nearly full              |
| 500    | 1.00       | Reference (anchor)       |
| 600    | 1.08       | Slightly boosted         |
| 700    | 1.12       | Peak chroma              |
| 800    | 1.08       | Starting to recede       |
| 900    | 0.98       | Darkening, less chroma   |
| 950    | 0.80       | Deep and muted           |

The chroma peaks at weight 700 (1.12x) rather than 500, reflecting how human perception sees deeper mid-tones as more vivid.

### Shade Generation Function

```javascript
function generateShades(baseHex) {
  const oklch = hexToOklch(baseHex);
  const anchorKey = detectShadeWeight(oklch.L);
  const anchorCurveFactor = CHROMA_CURVE[anchorKey];
  const shades = {};

  for (const key of SHADE_KEYS) {
    if (key === anchorKey) {
      shades[key] = baseHex;  // Anchor shade is the input color itself
      continue;
    }
    const targetL = SHADE_LIGHTNESS[key];
    const targetC = oklch.C * (CHROMA_CURVE[key] / anchorCurveFactor);
    shades[key] = oklchToHex(targetL, targetC, oklch.H);
  }
  return { shades, anchorKey };
}
```

The hue (H) is held constant across all shades. Lightness is set to the target for each weight. Chroma is scaled proportionally from the input color's chroma, adjusted by the curve multiplier ratio.

### Color Scheme Calculations

For the secondary color modal, the tool computes scheme-based colors in OKLCH:

| Scheme               | Hue Rotation |
|----------------------|-------------|
| Complementary        | +180 degrees |
| Analogous            | +30 degrees  |
| Triadic              | +120 degrees |
| Split-Complementary  | +150 degrees |
| Custom               | User picks   |

### Additional Color Utilities

- **`hexToHsl(hex)`** -- Converts hex to HSL for display
- **`formatColor(hex, format)`** -- Formats a hex value as HEX, HSL, OKLCH, or RGB string
- **`getLuminance(hex)`** -- WCAG relative luminance calculation
- **`getContrastRatio(hex1, hex2)`** -- WCAG contrast ratio between two colors
- **`contrastText(bgHex)`** -- Returns `#000000` or `#ffffff` depending on which has better contrast against the background

---

## 4. Features

### 4.1 Color Input

The controls section provides multiple ways to set the primary color:

- **Native color picker** (`<input type="color">`): Click the color swatch to open the OS-native picker
- **Hex text field**: Type a 6-digit hex code (e.g., `#3b82f6`); validated with regex `/^#[0-9a-fA-F]{6}$/` and debounced at 300ms
- **Random color button**: Generates a random hex via `Math.floor(Math.random() * 0xFFFFFF)`, accessible via the "GENERATE RANDOM" button or the **Spacebar** keyboard shortcut
- **Color picker and hex field stay synchronized**: Changing one updates the other

### 4.2 Random Color on Every Page Load

The `init()` function always generates a fresh random color on page load, regardless of whether localStorage has saved state:

```javascript
(function init() {
  loadTheme();
  loadFromStorage();
  const hex = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  document.getElementById('primaryColorInput').value = hex;
  document.getElementById('hexInput').value = hex;
  if (colors.length === 0) {
    addColor('primary', hex);
  } else {
    updateColorBase(colors[0].id, hex);
  }
})();
```

If colors exist in localStorage, the tool updates the existing primary color base with the new random hex rather than creating a duplicate.

### 4.3 Eleven-Shade Scale Generation

From any input color, the tool produces shades at weights: **50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950**. The anchor shade (the one matching the input) is marked with a "BASE" badge showing the detected weight.

### 4.4 Per-Shade Editing

Clicking any shade swatch opens a color picker overlay (`<input type="color">` positioned absolutely over the swatch). Manually edited shades receive an **"EDITED"** badge. Edited shades persist across regeneration -- when the base color changes, edited shades are not overwritten.

### 4.5 Lock/Unlock Individual Shades

Each shade has a lock toggle button. Locked shades:
- Display a locked icon
- Are preserved when the base color changes (same behavior as edited shades)
- Are tracked in `color.lockedShades[key]`

### 4.6 Format Toggle Per Shade

Below each shade value, four format buttons allow switching the displayed value:

| Format | Example Output                    |
|--------|-----------------------------------|
| HEX    | `#3b82f6`                         |
| HSL    | `hsl(217, 91%, 60%)`             |
| OKLCH  | `oklch(0.62 0.214 259)`          |
| RGB    | `rgb(59, 130, 246)`              |

Format selection is stored per-shade in the `shadeFormats` object (keyed as `colorId_shadeKey`).

### 4.7 Click-to-Copy with Toast Notification

Clicking a shade value copies it to the clipboard via `navigator.clipboard.writeText()`. A toast notification slides up from the bottom of the screen showing "COPIED #3B82F6" (or the relevant value). The toast auto-dismisses after 2 seconds.

### 4.8 Secondary Color with Scheme Selection

The "ADD SECONDARY COLOR" button opens a modal with:
- A color picker for the secondary color
- A dropdown for color scheme: Custom, Complementary, Analogous, Triadic, Split-Complementary
- Selecting a scheme auto-calculates the secondary color from the primary
- Once added, the button changes to "REMOVE SECONDARY" (red danger style)

When a secondary color exists, all preview sections (Cards, Components, Charts, Gradients, Headings) render additional content showcasing cross-palette combinations.

### 4.9 Undo/Redo

The tool maintains a history stack (up to 50 states):

- **Undo:** `Cmd/Ctrl + Z` -- restores the previous state
- **Redo:** `Cmd/Ctrl + Y` or `Cmd/Ctrl + Shift + Z` -- restores the next state

Each state is a JSON snapshot of the entire `colors` array. History is managed via `pushHistory()`, called after every color action.

### 4.10 localStorage Persistence

The `colors` array is saved to `localStorage` under the key `shade-gen-colors` after every change. On page load, `loadFromStorage()` restores the saved colors (with backward-compatibility handling for the `anchorKey` field).

Theme preference is stored under `shade-gen-theme` as `'light'` or `'dark'`.

### 4.11 Light/Dark Theme Toggle

A theme toggle button in the navbar (crescent moon icon for dark, sun icon for light) toggles `body.light-theme` class. **Light mode is the default** on first visit. The toggle also updates the body background dot pattern to match the theme.

### 4.12 Floating Keyboard Shortcuts Hint

A fixed-position hint bar near the bottom of the viewport displays available shortcuts:

```
[SPACE] RANDOM   [CMD/CTRL+Z] UNDO   [CMD/CTRL+Y] REDO
```

The hint has 60% opacity by default, increasing to 100% on hover. It is hidden on screens narrower than 640px.

---

## 5. Preview System

### Layout Structure

The preview section is divided into two rows:

1. **Top row (Cards carousel):** Always visible, rendered in `#previewCardsContent`
2. **Bottom row (Switchable tabs):** One of four views rendered in `#previewContent`, selected via tab buttons

Bottom tabs: **Components** | **Charts** | **Gradients** | **Headings**

### CSS-Only Infinite Carousel

All preview content uses a CSS-driven infinite scroll carousel:

```css
.preview-carousel-track {
  display: flex;
  gap: 24px;
  width: max-content;
  animation: carouselScroll 35s linear infinite;
}

@keyframes carouselScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

The HTML content is duplicated (`allCards + allCards`) so the scroll loops seamlessly. Hovering pauses the animation via `animation-play-state: paused`.

**Edge Fade:** A `mask-image` creates transparent edges at 1.5% from each side:

```css
mask-image: linear-gradient(to right, transparent, black 1.5%, black 98.5%, transparent);
```

### Cards Carousel (Top Row)

The Cards carousel renders up to 10 card types:

1. **Full-photo human card -- Hannah Laurent** (pravatar.cc img=1, shade 600 gradient overlay)
2. **Full-photo human card -- Marcus Rivera** (pravatar.cc img=3, shade 700 gradient overlay)
3. **Full-photo human card -- Elise Moreau** (pravatar.cc img=5, accent/secondary overlay)
4. **Full-photo human card -- David Okafor** (pravatar.cc img=8, shade 800 gradient overlay)
5. **Hero card** -- Gradient header area (300-500-700) with "FEATURED" badge
6. **Product card** -- Radial gradient image, price in accent color, "SALE" badge
7. **Testimonial card** -- Dark background (shade 900), quote with author photo
8. **Shade scale card** -- Typographic hero with "SHADE SCALE" text
9. **Notification card** -- Three stacked notification messages using different shades
10. **Secondary photo card -- Sophia Kim** (only rendered when secondary color exists)

### Fisher-Yates Shuffle with Interleaving

To prevent adjacent photo cards, the rendering separates cards into two arrays (`photoCards` and `textCards`), shuffles each independently with Fisher-Yates, then interleaves them:

```javascript
// Pattern: 1 photo, then 2 text cards, then 1 photo...
while (pi < photoCards.length || ti < textCards.length) {
  if (pi < photoCards.length) ordered.push(photoCards[pi++]);
  if (ti < textCards.length) ordered.push(textCards[ti++]);
  if (ti < textCards.length) ordered.push(textCards[ti++]);
}
```

### Tooltip System

The tooltip is a fixed-position element (`#shadeTooltip`) that follows the cursor and displays shade metadata.

**Content format:** `primary . Core 500 . #3b82f6 [color swatch]`

**Implementation via event delegation:**

```javascript
section.addEventListener('mouseover', function(e) {
  let el = e.target.closest('[data-shade-color]');
  if (!el) {
    // Fallback: check if inside a .preview-card and find first child with data attribute
    const card = e.target.closest('.preview-card');
    if (card) el = card.querySelector('[data-shade-color]');
  }
  if (el) {
    // Show tooltip with shade name, weight, nickname, and hex
  }
});
```

The event delegation is attached to `.preview-section` to handle all dynamically rendered content. The fallback detection (`closest('.preview-card')` then `querySelector('[data-shade-color]')`) ensures tooltips appear even when hovering over card backgrounds that lack direct `data-shade-color` attributes.

A tooltip mock illustration sits next to the "PREVIEW YOUR COLORS" heading, showing users what the tooltip will look like.

### Components Tab

Renders a carousel of component cards:
- **Buttons card:** Primary, Hover, Active, Outline, and Subtle button states
- **Inputs card:** Default and focused input states with cursor blink animation
- **Badges card:** Info, Primary, Dark, Outline, and Subtle badge variants
- **Alerts card:** Light and dark alert messages with left border accents
- **Toggles and Progress card:** Animated toggle switches and progress bar

With a secondary color, three additional cards appear: Dual Buttons, Mixed Badges, and Dual Progress.

### Charts Tab

Renders chart visualizations:
- **Bar chart:** 7 bars using shades 200-800, with `barGrow` animation and staggered delays
- **Pie chart:** SVG with individual `<path>` slices (not conic-gradient divs), each with its own `data-shade-color` attribute for independent tooltips
- **Line chart:** SVG with `<polyline>`, area fill gradient, animated `drawLine` stroke, and data point circles at each vertex
- **Area chart:** Three layered semi-transparent `<path>` fills with staggered `pulse` animations

With a secondary color, additional dual-colored versions of bar and pie charts appear.

### Gradients Tab

Renders gradient pattern cards:
- **Linear gradients:** 2x2 grid showing 200-600, 300-700, 400-800, and 100-500-900 gradients with `gradientShift` animation
- **Radial gradients:** Circle and ellipse variants with `pulse` animation
- **Conic and patterns:** Conic gradient and repeating 45-degree striped pattern
- **Text gradients:** Large text with gradient fill and animated `background-position`

**Color-stop indicator dots:** Each gradient card displays 14px circular indicators (with 2px white borders) at each color stop, providing individual shade tooltips:

```html
<span style="width:14px;height:14px;border-radius:50%;background:${s[200]};
  border:2px solid rgba(255,255,255,0.6);cursor:pointer"
  data-shade-color="${s[200]}" data-shade-weight="200" data-color-name="${pName}">
</span>
```

With a secondary color, Cross-Palette and Mesh Gradient cards appear.

### Headings Tab

Renders typography previews:
- **H1 card:** Large gradient text with `gradientShift` shimmer animation
- **H2 card:** Typewriter effect with cursor blink
- **H3 + Body card:** Heading with paragraph text
- **Light BG card:** Text on shade 50 background
- **Dark BG card:** Text on shade 900 background
- **Gradient text card:** Large gradient heading (400 to 700)
- **Contrast grid card:** 2x2 grid showing shade 50/900, 100/800, 500/white, and 900/100 combinations

With a secondary color, additional cards show cross-palette contrast combinations.

---

## 6. Export System

### Export Formats

The tool supports 6 export formats, each accessible via tabs in the Export section. The default active tab is **Figma Variables**.

#### 1. Tailwind v3

Outputs a `module.exports` configuration block for `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#f0f7ff',
          100: '#dceeff',
          // ...all 11 shades
        },
      },
    },
  },
}
```

**Download filename:** `{name}-tailwind.config.js`

#### 2. Tailwind v4 (OKLCH)

Outputs `@theme` block with OKLCH values for Tailwind CSS v4:

```css
/* Tailwind CSS v4 */
@theme {
  --color-primary-50: oklch(0.970 0.010 259.0);
  --color-primary-100: oklch(0.930 0.025 259.0);
  /* ...all 11 shades */
}
```

**Download filename:** `{name}-tailwind-v4.css`

#### 3. CSS Variables

Outputs a `:root` block with hex values:

```css
:root {
  /* Primary */
  --primary-50: #f0f7ff;
  --primary-100: #dceeff;
  /* ...all 11 shades */
}
```

**Download filename:** `{name}-variables.css`

#### 4. Figma Variables (DTCG)

Outputs Design Tokens Community Group (DTCG) format JSON, directly importable as Figma Variables:

```json
{
  "$extensions": {
    "com.figma.modeName": "Default"
  },
  "primary": {
    "50": {
      "$type": "color",
      "$value": {
        "colorSpace": "srgb",
        "components": [0.941, 0.969, 1.0],
        "alpha": 1,
        "hex": "#F0F7FF"
      },
      "$extensions": {
        "com.figma.scopes": ["ALL_SCOPES"]
      }
    }
  }
}
```

Key details:
- Component values are in 0-1 range (RGB divided by 255, rounded to 3 decimal places)
- Color space is explicitly `srgb`
- Each token includes hex for reference
- Figma scopes set to `ALL_SCOPES`

**Download filename:** `{name}-figma.tokens.json`

#### 5. JSON Tokens

Outputs a comprehensive JSON object with all format representations:

```json
{
  "primary": {
    "baseColor": "#3b82f6",
    "shades": {
      "50": {
        "hex": "#f0f7ff",
        "rgb": "rgb(240, 247, 255)",
        "hsl": "hsl(212, 100%, 97%)",
        "oklch": "oklch(0.970 0.010 259.0)"
      }
    }
  }
}
```

**Download filename:** `{name}-tokens.json`

#### 6. CSS (labeled "CSS" in tab, internally `scss`)

Outputs CSS custom properties using `$` prefix notation with a Sass map:

```css
// Primary
$primary-50: #f0f7ff;
$primary-100: #dceeff;
/* ...all 11 shades */

$primary: (
  50: $primary-50,
  100: $primary-100,
  /* ...all 11 shades */
);
```

**Download filename:** `{name}-variables.scss`

### Export Actions

- **Copy to Clipboard:** Orange primary button, copies the rendered code text content
- **Download File:** Outline button, creates a Blob, triggers download with appropriate filename

### Code Preview

The export code is displayed in a `<pre>` element with:
- Max-height of 200px with vertical scroll
- Monospace font (`var(--font-mono)`)
- Dark inset shadow for depth
- `white-space: pre-wrap` and `word-break: break-word` for readability

---

## 7. Architecture

### Single File Structure

The entire tool is contained in one `index.html` file at approximately 2,692 lines and ~150KB uncompressed. After gzip compression, it is approximately ~28KB.

### Internal Organization

The file is structured in clearly delimited sections:

#### CSS Sections (Lines 22-934)

| Section                  | Description                                                |
|--------------------------|------------------------------------------------------------|
| 1. CSS Variables         | Design tokens (`:root` and `.light-theme` overrides)      |
| 2. Reset + Base          | Box-sizing reset, body styles, font smoothing              |
| 3. Keyframe Animations   | All `@keyframes` definitions                               |
| 4. Navbar                | Sticky navigation bar with blur backdrop                   |
| 5. Main Wrapper          | Container and max-width constraints                        |
| 6. Header/Hero           | Title, subtitle, description styling                       |
| 7. Controls              | Input area layout and button styles                        |
| 8. Buttons               | `.btn`, `.btn-primary`, `.btn-outline`, `.btn-danger`      |
| 9. Palette Cards         | Card container, header, shade items, swatches              |
| 10. Section Divider      | Horizontal rule with centered text label                   |
| 11. Preview Hint         | Tooltip mock and instruction area                          |
| 12. Preview Tabs/Content | Tab buttons and content area styling                       |
| 13. Preview Cards        | Card base styles, hover effects, carousel                  |
| 14. Export Section        | Tab buttons, code container, action buttons                |
| 15. Modal                | Overlay, modal box, form elements                          |
| 16. Toast                | Fixed notification bar with slide-up animation             |
| 17. Footer               | Copyright and links                                        |
| 18. Keyboard Hint        | Fixed shortcut bar, `<kbd>` styling                        |
| 18b. Shade Tooltip       | Tooltip element and swatch indicator                       |
| 19. Responsive           | `@media` queries at 768px and 640px                        |

#### HTML Structure (Lines 936-1084)

```
<body>
  <nav class="navbar">          -- Sticky navigation
  <div class="main-wrapper">
    <div class="container">
      <header>                  -- H1 title and description
      <section class="controls"> -- Color input controls
      <div class="palettes">    -- Dynamic palette cards container
      <section class="preview-section">
        <div id="previewCardsContent">  -- Cards carousel (always visible)
        <div class="preview-tabs">       -- Tab buttons
        <div id="previewContent">        -- Switchable preview content
      <section class="export-section">   -- Export tabs and code
  <footer>                       -- Copyright
  <div class="modal-overlay">    -- Secondary color modal
  <div class="shade-tooltip">    -- Hover tooltip
  <div class="toast">            -- Notification toast
  <div class="shortcuts-hint">   -- Keyboard shortcuts bar
```

#### JavaScript Modules (Lines 1085-2689)

| Module | Name                | Lines (approx.) | Responsibility                                    |
|--------|---------------------|-----------------|---------------------------------------------------|
| 1      | Color Science       | ~180            | sRGB/Linear/OKLab/OKLCH conversions, gamut clamp  |
| 2      | Shade Generation    | ~100            | `SHADE_LIGHTNESS`, `CHROMA_CURVE`, `generateShades()`, `getSchemeColor()` |
| 3      | State Management    | ~120            | `colors[]`, history stack, undo/redo, localStorage |
| 4      | Rendering System    | ~400            | `render()`, `renderPalettes()`, `renderShadeItems()`, controls UI sync |
| 5      | Export Generators   | ~300            | 6 export format functions, filename generation     |
| 6      | Preview Renderers   | ~600            | `renderCardsPreview()`, `renderComponentsPreview()`, `renderChartsPreview()`, `renderGradientsPreview()`, `renderHeadingsPreview()` |
| 7      | UI Utilities        | ~200            | `showToast()`, `copyShadeValue()`, `copyExport()`, `downloadExport()`, `switchPreview()`, `switchExport()`, modal show/hide |
| 8      | Event Listeners     | ~100            | Input syncing, keyboard shortcuts, theme toggle, tooltip init, `init()` |

### Dependencies

- **External JavaScript:** None (zero dependencies)
- **External CSS:** None (all inline)
- **External Font:** Clash Display via Fontshare CDN (`https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap`)
- **External Images:** Human portrait photos from `i.pravatar.cc` (used in Cards carousel preview)

### State Shape

The primary state is the `colors` array, where each entry has the following shape:

```javascript
{
  id: "lxyz1234abcd",        // Unique ID (timestamp + random)
  name: "primary",            // User-editable name
  baseHex: "#3b82f6",        // Original input hex
  anchorKey: 500,             // Detected shade weight for input
  shades: {                   // All 11 shade hex values
    50: "#f0f7ff",
    100: "#dceeff",
    // ...
    950: "#0a1628"
  },
  manualShades: {             // Tracks manually edited shades
    300: true                 // Only present for edited shades
  },
  lockedShades: {             // Tracks locked shades
    700: true                 // Only present for locked shades
  }
}
```

---

## 8. CSS Animations

The tool defines the following keyframe animations:

### 1. `fadeIn`
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```
**Usage:** Body entrance, footer entrance, navbar entrance.

### 2. `fadeInUp`
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
```
**Usage:** Header, controls, palette cards, export section, modal entrance. The primary entrance animation for most sections.

### 3. `fadeInSlide`
```css
@keyframes fadeInSlide {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
```
**Usage:** Preview card text animations (e.g., "CLICKED!" label, heading card entrance, "EXPLORE SHADES" text). Often used with `infinite alternate` for a breathing effect.

### 4. `barGrow`
```css
@keyframes barGrow {
  0% { transform: scaleY(0); }
  100% { transform: scaleY(1); }
}
```
**Usage:** Bar chart bars growing from bottom. Applied with staggered `animation-delay` per bar and `transform-origin: bottom`.

### 5. `drawLine`
```css
@keyframes drawLine {
  0% { stroke-dashoffset: 1000; }
  100% { stroke-dashoffset: 0; }
}
```
**Usage:** Line chart polyline stroke drawing animation. Creates the effect of the line being "drawn" across the SVG.

### 6. `gradientShift`
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
```
**Usage:** Animated gradient backgrounds and text gradients in the Gradients and Headings preview tabs. Requires `background-size: 200% 200%` on the element.

### 7. `spinSlow`
```css
@keyframes spinSlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```
**Usage:** Pie chart SVG slow rotation (20s linear infinite). The secondary pie chart uses `reverse` direction.

### 8. `pulse`
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```
**Usage:** Cursor blink in input preview, area chart layered fills, radial gradient breathing effect.

### 9. `pulseBtn`
```css
@keyframes pulseBtn {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.95); }
}
```
**Usage:** Active button state in Components preview, "SALE" badge pulse, inverted logo pulse.

### 10. `floatUp`
```css
@keyframes floatUp {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
```
**Usage:** "FEATURED" badge float, Primary badge float, monochrome logo float in Logos preview. Creates a gentle hovering effect.

### Additional Animations

- **`carouselScroll`** -- Translates carousel track by -50% over 35 seconds for infinite scroll
- **`progressFill`** -- Animates progress bar width from 0% to 85% and back
- **`toggleSlide`** -- Slides toggle handle from left:2px to left:26px
- **`typewriter`** -- Animates width from 0 to 100% for typewriter text effect
- **`flashGreen`** -- Brief green flash for copy confirmation feedback

---

## 9. Responsive Design

### Breakpoints

The tool uses two CSS breakpoints:

#### At 768px and below

```css
@media (max-width: 768px) {
  .shade-swatch-container { height: 70px; }
  .shade-label { font-size: 9px; padding: 6px 0 1px; }
  .shade-value { font-size: 8px; }
  .gradient-grid { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
  .logos-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
  .charts-showcase { grid-template-columns: 1fr; }
  .preview-card { flex: 0 0 260px; min-height: 300px; }
}
```

#### At 640px and below

```css
@media (max-width: 640px) {
  .controls { gap: 8px; }
  .btn { min-width: auto; padding: 12px 20px; font-size: 11px; }
  .export-tabs { gap: 6px; }
  .export-tab { padding: 8px 14px; font-size: 10px; }
  .preview-tab { padding: 10px 16px; font-size: 10px; }
  .modal { padding: 24px; }
  .shade-swatch-container { height: 56px; }
  .shade-label { font-size: 8px; }
  .shade-value { font-size: 7px; }
  .shade-formats { display: none; }        /* Format toggles hidden on mobile */
  .shortcuts-hint { display: none; }       /* Keyboard hints hidden on mobile */
  .navbar-links { gap: 16px; }
}
```

### Fluid Typography

The tool uses `clamp()` extensively for fluid sizing:

| Element           | `clamp()` value                      |
|-------------------|--------------------------------------|
| H1 title          | `clamp(32px, 6vw, 56px)`            |
| Hero subtitle     | `clamp(16px, 3vw, 22px)`            |
| Hero description  | `clamp(11px, 2vw, 14px)`            |
| Container padding | `clamp(16px, 4vw, 48px)`            |
| Section margins   | `clamp(48px, 8vw, 80px)`            |
| Gradient text     | `clamp(32px, 6vw, 48px)`            |
| Heading previews  | `clamp(28px, 5vw, 40px)`            |

### Mobile Adaptations

- **Controls** wrap naturally via `flex-wrap: wrap` with reduced gap
- **Shade format toggle buttons** are hidden below 640px (HEX shown by default)
- **Keyboard shortcuts hint** is hidden below 640px (touch users do not need it)
- **Preview cards** reduce from 320px to 260px minimum width
- **Export tabs** get tighter padding and smaller font size
- **Carousel** adapts to viewport via percentage-based mask and `max-content` track width

---

## 10. Problems Solved During Development

### Problem 1: Card Hover Cropping in Carousel

**Symptom:** Cards with `transform: translateY(-4px)` on hover were being clipped at the top because the carousel container had `overflow: hidden`.

**Root Cause:** CSS `overflow: hidden` clips all content outside the element boundary, including transforms that move elements above the container edge.

**Solution:** Changed `overflow: hidden` to `overflow: clip` with `overflow-clip-margin: 8px`:

```css
.preview-carousel {
  overflow: clip;
  overflow-clip-margin: 8px;
}
```

`overflow: clip` respects `overflow-clip-margin`, allowing a configurable amount of overflow before clipping. The 8px margin accommodates the 4px translateY hover lift plus the box-shadow spread.

---

### Problem 2: Light Mode Hover on Tabs

**Symptom:** Preview and export tabs with `color: white` on hover were invisible against light theme backgrounds.

**Root Cause:** Hover styles were hard-coded for dark theme only.

**Solution:** Added `.light-theme` overrides for tab hover states:

```css
.light-theme .preview-tab:hover:not(.active) {
  background: rgba(0,0,0,0.06);
  border-color: rgba(0,0,0,0.15);
  color: #333;
}
.light-theme .export-tab:hover:not(.active) {
  background: rgba(0,0,0,0.06);
  border-color: rgba(0,0,0,0.15);
  color: #333;
}
```

---

### Problem 3: Surface Card Dark Backgrounds

**Symptom:** Chart containers, gradient sections, and heading sections had hard-coded `background: rgba(20, 20, 20, 0.4)` which looked wrong in light mode (dark patches on a light page).

**Root Cause:** Approximately 20 instances of hard-coded dark rgba values instead of CSS custom properties.

**Solution:** Replaced all occurrences of `rgba(20, 20, 20, 0.4)` with `var(--surface)`, which automatically adapts between themes.

---

### Problem 4: Controls Alignment

**Symptom:** Buttons appeared higher than input fields in the controls row because `align-items: center` centered buttons against the combined height of label + input.

**Root Cause:** Control items have a label above the input, making them taller than buttons. Centering vertically misaligned the button baselines.

**Solution:** Changed controls to `align-items: flex-end` and added self-alignment for buttons:

```css
.controls {
  align-items: flex-end;
}
.controls > .btn {
  align-self: center;
  margin-top: 10px;
}
```

---

### Problem 5: Random Color Only on First Visit

**Symptom:** After the first visit, the tool always loaded the saved localStorage color instead of generating a fresh random color on every page load.

**Root Cause:** The init function only generated a random color when `colors.length === 0` (no localStorage data).

**Solution:** Modified `init()` to always generate a random hex and use `updateColorBase()` on existing colors:

```javascript
(function init() {
  loadTheme();
  loadFromStorage();
  const hex = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  if (colors.length === 0) {
    addColor('primary', hex);
  } else {
    updateColorBase(colors[0].id, hex);  // Update existing, not just create new
  }
})();
```

---

### Problem 6: Light Mode Not Default

**Symptom:** On first visit (no localStorage), the tool loaded in dark mode instead of light mode.

**Root Cause:** `loadTheme()` only applied light mode if localStorage explicitly contained `'light'`. With no saved value, neither branch executed, leaving the body without `.light-theme`.

**Solution:** Inverted the logic -- light is the default, dark is only applied when explicitly saved:

```javascript
function loadTheme() {
  const saved = localStorage.getItem('shade-gen-theme');
  if (saved === 'dark') {
    document.body.classList.remove('light-theme');
    // Apply dark theme...
  } else {
    document.body.classList.add('light-theme');
    // Apply light theme (default)...
  }
}
```

---

### Problem 7: Tooltip Not Showing on Surface Cards

**Symptom:** Hovering the background of a preview card (the colored surface area) did not trigger the tooltip, even though the card contained elements with `data-shade-color` attributes.

**Root Cause:** The tooltip handler only checked `e.target.closest('[data-shade-color]')`. Card backgrounds themselves do not have that attribute -- only child elements do.

**Solution:** Added a fallback that traverses up to `.preview-card` and then queries down for the first child with `data-shade-color`:

```javascript
let el = e.target.closest('[data-shade-color]');
if (!el) {
  const card = e.target.closest('.preview-card');
  if (card) el = card.querySelector('[data-shade-color]');
}
```

---

### Problem 8: Photo Cards All Grouped Together

**Symptom:** After Fisher-Yates shuffle, all 4 human portrait cards appeared consecutively in the carousel, creating a visually monotonous section.

**Root Cause:** Shuffling all cards in a single array did not guarantee distribution of photo cards among text cards.

**Solution:** Separated cards into `photoCards[]` and `textCards[]` arrays, shuffled each independently, then interleaved with a pattern of 1 photo followed by 2 text cards:

```javascript
const ordered = [];
let pi = 0, ti = 0;
while (pi < photoCards.length || ti < textCards.length) {
  if (pi < photoCards.length) ordered.push(photoCards[pi++]);
  if (ti < textCards.length) ordered.push(textCards[ti++]);
  if (ti < textCards.length) ordered.push(textCards[ti++]);
}
```

---

### Problem 9: Carousel Edge Fade Too Aggressive

**Symptom:** The mask-image fade at carousel edges was too strong at 3%, making cards near the edges barely visible.

**Root Cause:** The `mask-image` gradient transition was set at 3% from each edge.

**Solution:** Reduced the fade width from 3% to 1.5%:

```css
mask-image: linear-gradient(to right, transparent, black 1.5%, black 98.5%, transparent);
```

---

### Problem 10: Pie Chart Single Tooltip

**Symptom:** The pie chart rendered as a single `<div>` with `conic-gradient`, meaning the entire pie had only one tooltip for all slices.

**Root Cause:** A `conic-gradient` background is a single CSS property on one element. There is no way to attach different data attributes to different segments of a gradient.

**Solution:** Replaced the conic-gradient div with an SVG containing individual `<path>` elements for each slice, each with its own `data-shade-color`, `data-shade-weight`, and `data-color-name` attributes:

```javascript
pieSlices.forEach((sl, i) => {
  const startAngle = (pieAcc / 100) * 360;
  const endAngle = ((pieAcc + sl) / 100) * 360;
  // Calculate arc path coordinates...
  pieSvgSlices += `<path d="M80,80 L${x1},${y1} A72,72 0 ${largeArc},1 ${x2},${y2} Z"
    fill="${pieColorArr[i]}"
    data-shade-color="${pieColorArr[i]}"
    data-shade-weight="${pieWeights[i]}"
    data-color-name="${pieNames[i]}"
    style="cursor:pointer"/>`;
  pieAcc += sl;
});
```

---

### Problem 11: Gradient Single Tooltip

**Symptom:** Each gradient preview showed only one tooltip for the entire gradient area, making it impossible to identify which shade was at which color stop.

**Root Cause:** A gradient is a single CSS property on one element -- same fundamental issue as the pie chart.

**Solution:** Added color-stop indicator dots (14px circles with white borders) overlaid on each gradient, each carrying its own data attributes:

```html
<div style="display:flex;gap:4px">
  <span style="width:14px;height:14px;border-radius:50%;
    background:${s[200]};border:2px solid rgba(255,255,255,0.6);cursor:pointer"
    data-shade-color="${s[200]}" data-shade-weight="200" data-color-name="${pName}">
  </span>
  <span style="width:14px;height:14px;border-radius:50%;
    background:${s[600]};border:2px solid rgba(255,255,255,0.6);cursor:pointer"
    data-shade-color="${s[600]}" data-shade-weight="600" data-color-name="${pName}">
  </span>
</div>
```

---

### Problem 12: Conic Gradient Spinning 360 Degrees

**Symptom:** The conic gradient pattern card had the `spinSlow` animation applied, causing the entire card to rotate continuously, which was disorienting and served no design purpose.

**Root Cause:** The `spinSlow` animation was accidentally applied to the conic gradient card instead of only the pie chart SVG.

**Solution:** Removed the `spinSlow` animation from the conic gradient card. The animation is only used on pie chart SVGs where rotation provides visual interest without confusion.

---

## 11. SEO and Meta

### Title and Description

```html
<title>UI Color Generator -- Free Tailwind CSS Color Tool</title>
<meta name="description" content="Generate perfect Tailwind color shades (50-950) from any color.
  Uses OKLCH for perceptually uniform colors. Export to CSS, Figma, Tailwind v3/v4. Free forever.">
```

### Keywords

```html
<meta name="keywords" content="tailwind css, shade generator, color palette, oklch, color tool,
  figma variables, css variables">
```

### Open Graph Tags

```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://tools.gamaleldien.com/shades">
<meta property="og:title" content="UI Color Generator: Free Tailwind CSS Color Tool">
<meta property="og:description" content="Generate perfect Tailwind color shades (50-950) from any color.
  Uses OKLCH for perceptually uniform colors. Export to CSS, Figma, Tailwind v3/v4. Free forever.">
<meta property="og:site_name" content="Gamal Eldien Tools">
```

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="UI Color Generator: Free Tailwind CSS Color Tool">
<meta name="twitter:description" content="Generate perfect Tailwind color shades (50-950) from any color.
  Uses OKLCH for perceptually uniform colors.">
```

### Additional Meta

```html
<meta name="author" content="Gamal Eldien">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://tools.gamaleldien.com/shades">
<meta name="theme-color" content="#0a0a0a">
```

### Semantic HTML

The page uses semantic elements:
- `<nav>` for the navigation bar
- `<header>` for the hero section
- `<section>` for controls, preview, and export areas
- `<footer>` for the copyright bar
- `<h1>` for the main title (only one per page)
- `<h3>` and `<h4>` for card and section headings within previews

---

## 12. Competitive Analysis

### Market Context

The primary competitor is **uicolors.app**, which charges $5-$15/month for full access to preview tabs and advanced features. Other competitors include Tailwind's own default palette explorer and various open-source generators.

### UI Color Generator Advantages

| Feature                        | UI Color Generator | uicolors.app              |
|-------------------------------|-------------------|---------------------------|
| **Price**                     | Free forever       | $5-$15/month              |
| **Sign-in required**          | No                | Yes (for save/share)       |
| **Color space**               | OKLCH              | HSL                       |
| **Perceptually uniform**      | Yes               | No (HSL has uneven steps)  |
| **Smart weight detection**    | Yes (auto-maps)   | No (always maps to 500)   |
| **Figma Variables export**    | Yes (DTCG format) | No                        |
| **Tailwind v4 export**        | Yes (OKLCH)       | Limited                   |
| **JSON Tokens export**        | Yes               | No                        |
| **Interactive tooltips**      | Yes (every element)| No                       |
| **Per-shade format toggle**   | HEX/HSL/OKLCH/RGB | Limited                   |
| **Shade nicknames**           | Yes (Ghost...Abyss)| No                       |
| **External dependencies**     | Zero JS deps      | Multiple npm packages      |

### Technical Differentiators

1. **OKLCH vs HSL:** HSL lightness is not perceptually uniform. A yellow at HSL lightness 50% looks far brighter than a blue at HSL lightness 50%. OKLCH fixes this by modeling human vision, so shade 500 of any hue has genuinely equal perceived brightness.

2. **Smart weight detection:** Most tools force the input color to shade 500 regardless of its actual lightness. This tool detects where the input naturally falls (e.g., a pastel input maps to shade 200, a near-black input maps to shade 900) and generates the remaining shades from that anchor point.

3. **Figma Variables in DTCG format:** The Design Tokens Community Group specification is the emerging standard for design token interchange. The export includes `$type`, `$value`, `$extensions`, `colorSpace`, and `components` -- ready for direct import into Figma.

4. **Zero-dependency single-file architecture:** No build step, no npm packages, no framework overhead. The entire tool loads in one HTTP request plus one font request.

### Business Model

The tool operates as a **free lead magnet** within the broader tools.gamaleldien.com platform. By providing professional-grade functionality at no cost, it attracts designers and developers who may later engage with consulting services. There is no paywall, no feature gating, and no mandatory sign-up.

---

## Appendix: Complete CSS Custom Property Reference

```css
:root {
  /* Backgrounds */
  --bg: #0a0a0a;
  --surface: rgba(63, 63, 63, 0.3);
  --surface-2: rgba(80, 80, 80, 0.35);
  --surface-elevated: rgba(90, 90, 90, 0.25);

  /* Text */
  --text: rgb(255, 255, 255);
  --text-muted: rgb(128, 128, 128);
  --text-secondary: rgb(153, 153, 153);

  /* Borders */
  --border: rgb(51, 51, 51);
  --border-light: rgba(255, 255, 255, 0.08);

  /* Accent */
  --accent: rgb(225, 97, 5);
  --accent-hover: rgb(255, 117, 25);
  --accent-glow: rgba(225, 97, 5, 0.15);

  /* Semantic Colors */
  --danger: #ef4444;
  --danger-hover: #dc2626;
  --success: #10b981;
  --warning: #f59e0b;
  --info: #3b82f6;

  /* Border Radius */
  --radius: 24px;
  --radius-lg: 32px;
  --radius-pill: 64px;

  /* Typography */
  --font-display: 'Clash Display', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.16), 0 2px 4px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.24), 0 4px 8px rgba(0, 0, 0, 0.12);
  --shadow-glow: 0 0 24px rgba(225, 97, 5, 0.12);
}
```

## Appendix: Shade Nicknames Quick Reference

| Weight | Nickname | Lightness | Chroma Multiplier |
|--------|----------|-----------|-------------------|
| 50     | Ghost    | 0.97      | 0.45              |
| 100    | Mist     | 0.93      | 0.65              |
| 200    | Breeze   | 0.87      | 0.82              |
| 300    | Sky      | 0.78      | 0.92              |
| 400    | Clear    | 0.67      | 0.97              |
| 500    | Core     | 0.56      | 1.00              |
| 600    | Deep     | 0.48      | 1.08              |
| 700    | Bold     | 0.39      | 1.12              |
| 800    | Night    | 0.31      | 1.08              |
| 900    | Shadow   | 0.24      | 0.98              |
| 950    | Abyss    | 0.16      | 0.80              |

## Appendix: Keyboard Shortcuts

| Shortcut              | Action                    |
|-----------------------|---------------------------|
| `Space`               | Generate random color      |
| `Cmd/Ctrl + Z`        | Undo                      |
| `Cmd/Ctrl + Y`        | Redo                      |
| `Cmd/Ctrl + Shift + Z`| Redo (alternate)          |
| `Escape`              | Close secondary color modal|
