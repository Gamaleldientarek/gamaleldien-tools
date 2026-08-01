# UI Colors (uicolors.app) — Full Research

## What It Is
Tailwind CSS Color Shade Generator — input a hex/HSL color, get a full 11-shade scale (50-950) compatible with Tailwind CSS.

## URL Structure
- `/generate` — Main generator tool (default page)
- `/tailwind-colors` — Browse all Tailwind v3/v4 default colors
- `/my-palettes` — Saved palettes (requires sign-in)

## Core Features

### 1. Color Input
- Enter hex code manually
- Enter HSL color
- Generate random color (Spacebar shortcut)
- Click to pick from color wheel

### 2. Shade Generation
- Auto-generates 11 shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- The input color maps to shade 500 (mid-point)
- Lighter shades above (50-400), darker below (600-950)
- Algorithm creates perceptually even distribution

### 3. Manual Editing
- Each shade can be individually adjusted
- Full control over every shade in the scale

### 4. Secondary Color
- "Add secondary color scale" — generates a complementary/secondary palette
- Color combination schemes: auto, complementary, analogous, triadic, etc.

### 5. Preview Visualizations (Tabs)
- **Cards** — Preview colors on card UI components
- **Components** — Preview on various UI components (buttons, inputs, etc.)
- **Charts** — Preview colors on chart/graph visualizations
- **Gradients** — Preview gradient combinations
- **Logos** — Preview colors applied to logo mockups
- **Headings** — Preview colors on typography/headings

### 6. Export Formats
- Tailwind CSS config (JS module.exports)
- CSS Variables
- SCSS Variables
- Hex codes
- HSL values
- OKLCH values (Tailwind v4)

### 7. Save & Share
- Save palettes (requires account)
- Share via URL
- Figma Plugin available

### 8. Color Info Display
- Each shade shows: hex, HSL, RGB, OKLCH values
- Click-to-copy any value
- Contrast ratio information

## Pricing (Paid Features)
- **Free:** Basic generation, limited previews
- **Starter ($5/mo):** More preview examples
- **Growth ($10/mo):** All previews, more features
- **Business ($15/mo):** Full access, priority support

## What We'll Build (FREE — All Features)
Our version at tools.gamaleldien.com/shades:
- ALL features above — completely FREE
- Our design system (dark theme, Clash Display, orange accent)
- No external links
- No sign-in required for basic usage
- Export: Tailwind v3, Tailwind v4 (OKLCH), CSS Variables, Figma Variables, JSON Tokens
