# Dark Mode Converter Tool

**A perceptual color science tool for converting light mode palettes to dark mode equivalents**

---

## 🌐 Live URLs

- **Production:** [https://tools.gamaleldien.com](https://tools.gamaleldien.com)
- **Worker:** [https://dark-mode-converter.zone99.workers.dev](https://dark-mode-converter.zone99.workers.dev)

---

## 📋 Overview

The Dark Mode Converter is a web-based tool that intelligently converts light mode color palettes to dark mode using **OKLCH perceptual color science**. It provides multiple conversion methods, live preview, and exports in various formats (CSS Variables, Tailwind, JSON).

### Key Features

- **Color Management**
  - Visual color picker with hex input
  - Add/remove colors dynamically
  - Name each color (primary, background, text-primary, etc.)
  - Drag & drop reordering
  - Lock colors to prevent conversion
  - Undo/Redo support (Ctrl+Z/Ctrl+Y)

- **Conversion Methods**
  - **OKLCH Remap** (Default) — Perceptual lightness remapping
  - **OKLCH Invert** — Perceptual inversion with chroma preservation
  - **HSL Invert** — Traditional HSL-based inversion
  - **Ant Design Style** — Inspired by Ant Design's dark theme algorithm
  - **Chroma Adjustment** — Fine-tune color saturation (0-200%)
  - **Custom Dark Background** — Choose the target dark background color

- **Presets**
  - **Brand** — 8-color brand palette (primary, secondary, accent, text, surfaces)
  - **Neutral** — 7-color neutral palette (grays and text colors)
  - **Semantic** — 9-color semantic palette (success, warning, error, info)

- **Live Preview**
  - Side-by-side light/dark mode cards
  - Real UI elements: headings, body text, buttons, links, inputs, badges, tags
  - WCAG contrast ratio badges (AAA/AA/Fail)
  - Intelligent token mapping (auto-detects roles from color names)

- **Export Formats**
  - CSS Variables
  - Tailwind Config (v3)
  - Tailwind v4 (OKLCH-native)
  - OKLCH Values (raw color data)
  - JSON Design Tokens

- **Palette Management**
  - Save palettes to local storage
  - Load saved palettes
  - Bulk import (paste colors with optional names)
  - Share-friendly format

---

## 🎨 Design System

The tool matches the **gamaleldien.com visual identity**:

### Typography
- **Font:** [Clash Display](https://www.fontshare.com/fonts/clash-display) (weights: 400, 500, 600, 700)
- **Style:** UPPERCASE labels, headings, and buttons
- **Letter-spacing:** Generous spacing on all UI elements

### Color Palette
- **Background:** `#0a0a0a` (black) with subtle dot pattern overlay
- **Text Primary:** `rgb(255, 255, 255)` (white)
- **Text Secondary:** `rgb(128, 128, 128)` (medium gray)
- **Text Muted:** `rgb(73, 73, 73)` (dark gray)
- **Borders:** `rgb(51, 51, 51)` (very dark gray, 1px)
- **Card Backgrounds:** `rgba(63, 63, 63, 0.25)` (glassmorphism with backdrop-filter blur)
- **Accent/Brand:** `rgb(225, 97, 5)` (warm orange)
- **Links:** `rgb(0, 153, 255)` (blue)

### UI Patterns
- **Glassmorphism cards** — `backdrop-filter: blur(48px)`, semi-transparent backgrounds, 20-32px border-radius
- **Pill buttons** — `border-radius: 64px`, white border (1px), 600 weight, UPPERCASE text
- **Section dividers** — `// SECTION NAME //` pattern with 1px top border
- **Minimal borders** — Only top borders, 1px, dark gray
- **No emojis/icons** — Clean text-only UI with CSS-only indicators
- **Editorial aesthetic** — Lots of whitespace, clean typography

### Custom Elements
- **Logo** — Actual SVG logo from `assets/logo-full.svg` (geometric icon + "Gamal Eldien" text)
- **Lock indicators** — CSS-only: `◯` (unlocked) / `●` (locked)
- **Drag handles** — CSS-only: `::` (double colon)

---

## 🛠 Tech Stack

- **Frontend:** Pure HTML/CSS/JavaScript (no dependencies, no build step for UI)
- **Color Science:** Custom OKLCH implementation (perceptual color space)
- **HSL Conversion:** Fallback method for traditional inversion
- **Hosting:** Cloudflare Workers (edge network, global CDN)
- **Deployment:** Python build script packages HTML into Worker
- **Fonts:** Clash Display via [Fontshare CDN](https://www.fontshare.com/)

### Why OKLCH?

OKLCH (Oklab Lightness Chroma Hue) is a perceptual color space designed for:
- **Uniform lightness** — Equal lightness values look equally bright to human eyes
- **Predictable hue rotation** — Hue changes are visually consistent
- **Better dark mode conversion** — Preserves perceived brightness when inverting

Unlike HSL (which is device-dependent), OKLCH matches human perception.

---

## 📂 File Structure

```
dark-mode-converter/
├── index.html              # Main tool (single HTML file with inline CSS/JS)
├── worker.js               # Auto-generated Cloudflare Worker (contains index.html)
├── build.py                # Build & deployment script
├── metadata.json           # Cloudflare Worker metadata
│
├── assets/
│   ├── logo-full.svg       # Main logo (geometric icon + text)
│   └── logo-with-text.svg  # Logo variant
│
├── README.md               # This file (comprehensive documentation)
├── design-brief.md         # Original design brief (gamaleldien.com visual identity)
├── CHANGELOG.md            # Version history and updates
├── PREVIEW-FIX.md          # Technical documentation of preview token mapping fix
└── REDESIGN-SUMMARY.md     # Redesign history (archived, see below)
```

---

## 🚀 Deployment

### Prerequisites
- Python 3.x
- Cloudflare account with Workers enabled
- API token with "Edit Workers" permission

### Deployment Process

**Option 1: Using build.py (Recommended)**
```bash
cd /root/clawd/projects/business/gamaleldien.com/tools/dark-mode-converter
python3 build.py
```

The script will:
1. Read `index.html`
2. Embed it in `worker.js` (Service Worker format)
3. Deploy to Cloudflare Workers via API
4. Confirm deployment with HTTP status check

**Option 2: Manual Deployment**
```bash
# 1. Generate worker.js
python3 -c "
import json
with open('index.html', 'r') as f:
    html = f.read()
html_json = json.dumps(html)
worker = f'''const HTML = {html_json};

addEventListener('fetch', event => {{
  event.respondWith(handleRequest(event.request));
}});

async function handleRequest(request) {{
  return new Response(HTML, {{
    headers: {{ \"Content-Type\": \"text/html;charset=UTF-8\" }},
  }});
}}'''
with open('worker.js', 'w') as f:
    f.write(worker)
"

# 2. Deploy to Cloudflare
ACCOUNT_ID="b6c05712bc4cb61fccdf5b7600845d03"
API_TOKEN="<your-token>"
WORKER_NAME="dark-mode-converter"

curl -X PUT "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_NAME}" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/javascript" \
  --data-binary @worker.js
```

### Cloudflare Configuration

- **Account ID:** `b6c05712bc4cb61fccdf5b7600845d03`
- **Worker Name:** `dark-mode-converter`
- **Worker Subdomain:** `zone99.workers.dev`
- **Custom Domain:** `tools.gamaleldien.com` (configured via Cloudflare Dashboard → Workers → Custom Domains)
- **Zone ID (gamaleldien.com):** `356be8b57644a92fb81f4660c7b1dc7f`

### Verification

```bash
# Check production
curl -s -o /dev/null -w "%{http_code}" https://tools.gamaleldien.com
# Expected: 200

# Check worker URL
curl -s -o /dev/null -w "%{http_code}" https://dark-mode-converter.zone99.workers.dev
# Expected: 200
```

---

## 🧪 Development Workflow

1. **Edit UI/Features:** Modify `index.html` directly
2. **Test Locally:** Open `index.html` in a browser
3. **Deploy:** Run `python3 build.py`
4. **Verify:** Check live URLs (tools.gamaleldien.com and worker URL)

### Important Notes
- **DO NOT manually edit `worker.js`** — It's auto-generated by `build.py`
- All changes should be made in `index.html`
- The build script handles proper escaping and Worker formatting

---

## 📖 Usage Guide

### Adding Colors
1. Click "+ Add Color" button
2. Use color picker or paste hex code
3. Name the color (e.g., "primary", "text-primary", "background")
4. Repeat for all colors in your palette

### Converting to Dark Mode
1. Choose conversion method (OKLCH Remap recommended)
2. Adjust chroma slider if needed (default: 100%)
3. Set custom dark background if desired (default: #111827)
4. Preview results in the side-by-side cards

### Using Presets
- Click "Brand", "Neutral", or "Semantic" to load preset palettes
- Presets demonstrate best practices for color naming
- You can modify preset colors after loading

### Locking Colors
- Click the lock icon (◯) next to a color to lock it
- Locked colors won't be converted (useful for brand colors you want to keep)
- Locked indicator shows as filled dot (●) in dark palette

### Exporting
1. Click export format button (CSS Variables, Tailwind, etc.)
2. Code is automatically copied to clipboard
3. Paste into your project

### Keyboard Shortcuts
- **Ctrl+Z** — Undo
- **Ctrl+Y** — Redo

---

## 🎯 Technical Details

### Preview Token Mapping

The preview intelligently maps color names to UI roles:

| UI Role | Detected Names |
|---------|---------------|
| **Background** | "background", "bg", "base" |
| **Surface** | "surface", "card", "panel" |
| **Text Primary** | "text-primary", "foreground", "heading" |
| **Text Secondary** | "text-secondary", "text-muted", "muted" |
| **Primary/Brand** | "primary", "brand", "accent", "action", "cta", "blue" |
| **Border** | "border", "divider", "outline" |

**Fallback Strategy:**
- Background → Lightest color by luminance
- Text → Darkest color by luminance (excluding background)
- Primary → Sensible blue (#3b82f6) if not found
- All others → Tailwind defaults

See `PREVIEW-FIX.md` for detailed technical documentation.

### Color Conversion Algorithm

**OKLCH Remap (Default):**
1. Convert hex → RGB → Linear RGB → Oklab → OKLCH
2. Remap lightness: `L_dark = 1.0 - L_light`
3. Preserve chroma and hue
4. Apply chroma adjustment (0-200%)
5. Convert back: OKLCH → Oklab → Linear RGB → RGB → Hex

**OKLCH Invert:**
- Similar to Remap but inverts lightness differently
- Better for mid-tone colors

**HSL Invert:**
- Traditional method: invert lightness in HSL space
- Faster but less perceptually accurate

**Ant Design Style:**
- Inspired by Ant Design's dark theme algorithm
- Reduces saturation and adjusts lightness

---

## 📝 Design History

### 2025-01-31: Full Redesign Complete

**Major Changes:**
- **Real Logo** — Replaced text-based logo with actual SVG from `assets/logo-full.svg`
- **No Emojis** — Removed all emoji indicators (🔒🔓⋮⋮), replaced with CSS-only (`◯●::`)
- **Visual Identity Match** — Perfect alignment with gamaleldien.com design system
- **Footer Update** — Changed to `©2025 // MADE BY GAMAL ELDIEN` (UPPERCASE, no space)
- **Token Mapping Fix** — Complete rewrite of preview color mapping logic (see `PREVIEW-FIX.md`)

**Preserved Features:**
- All JavaScript functionality intact
- OKLCH color conversion working perfectly
- Drag & drop, undo/redo, presets, export — all functional
- No breaking changes to API or user workflows

**Result:** Tool now perfectly matches gamaleldien.com's editorial, premium aesthetic while maintaining all functionality.

### Earlier Updates

- **2025-01-31:** Added navbar and footer with glassmorphism effect
- **2025-01-31:** Initial build and deployment with OKLCH color science

See `CHANGELOG.md` for complete version history.

---

## 🐛 Known Issues

None currently. All major issues resolved in the 2025-01-31 redesign.

If you find a bug:
1. Document it in `CHANGELOG.md` under "Known Issues"
2. Create a dated `.md` file with technical details (like `PREVIEW-FIX.md`)
3. Fix it in `index.html`
4. Deploy with `python3 build.py`
5. Update changelog when fixed

---

## 🔮 Future Enhancements (Optional)

Ideas for potential improvements:

1. **Social Links** — Add Twitter/LinkedIn links to footer (like main site)
2. **Keyboard Shortcuts Overlay** — Show shortcuts hint on first visit
3. **More Presets** — Material Design, Tailwind, Bootstrap palettes
4. **Color Blind Mode** — Preview how colors look with different types of color blindness
5. **Contrast Checker** — Expanded WCAG compliance testing
6. **Dark/Light Mode Toggle** — Switch the tool's own theme (currently dark-only)
7. **Export to Figma** — Generate Figma color styles JSON
8. **Import from CSS** — Parse CSS variables to auto-populate palette

---

## 📄 License & Credits

- **Created by:** Gamal Eldien
- **Website:** [gamaleldien.com](https://gamaleldien.com)
- **Tool URL:** [tools.gamaleldien.com](https://tools.gamaleldien.com)
- **Built:** 2025-01-31

All rights reserved © 2025 Gamal Eldien.

---

## 📞 Support

For issues or questions:
- Visit [gamaleldien.com](https://gamaleldien.com)
- Contact via website

---

**Last Updated:** 2025-01-31
