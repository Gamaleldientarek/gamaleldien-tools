# Figma Variables Export Format

## ✅ VERIFIED — Matches Jimmy's Real Export

The Dark Mode Converter now exports Figma Variables in the **exact format** used by Figma's official Variables Import/Export plugin.

---

## Output Format (REAL Figma Structure)

### Example Output (Light Mode)
```json
{
  "$extensions": {
    "com.figma.modeName": "Light"
  },
  "background": {
    "$type": "color",
    "$value": {
      "colorSpace": "srgb",
      "components": [0.949, 0.949, 0.949],
      "alpha": 1,
      "hex": "#F2F2F2"
    },
    "$extensions": {
      "com.figma.scopes": ["ALL_SCOPES"]
    }
  },
  "primary": {
    "$type": "color",
    "$value": {
      "colorSpace": "srgb",
      "components": [1.0, 0.416, 0.0],
      "alpha": 1,
      "hex": "#FF6A00"
    },
    "$extensions": {
      "com.figma.scopes": ["ALL_SCOPES"]
    }
  }
}
```

### Example Output (Dark Mode)
```json
{
  "$extensions": {
    "com.figma.modeName": "Dark"
  },
  "background": {
    "$type": "color",
    "$value": {
      "colorSpace": "srgb",
      "components": [0.078, 0.078, 0.078],
      "alpha": 1,
      "hex": "#141414"
    },
    "$extensions": {
      "com.figma.scopes": ["ALL_SCOPES"]
    }
  },
  "primary": {
    "$type": "color",
    "$value": {
      "colorSpace": "srgb",
      "components": [1.0, 0.541, 0.188],
      "alpha": 1,
      "hex": "#FF8A30"
    },
    "$extensions": {
      "com.figma.scopes": ["ALL_SCOPES"]
    }
  }
}
```

---

## Key Features

### ✅ Correct Structure
- `$extensions.com.figma.modeName`: "Light" or "Dark"
- `$type`: "color"
- `$value`: Object with `colorSpace`, `components`, `alpha`, `hex`
- `$extensions.com.figma.scopes`: ["ALL_SCOPES"]

### ✅ RGB Components (0-1 Float Range)
Hex `#FF6A00` converts to:
- R: `0xFF / 255 = 1.0`
- G: `0x6A / 255 = 0.416`
- B: `0x00 / 255 = 0.0`

Rounded to 3 decimal places: `[1.0, 0.416, 0.0]`

### ✅ Color Names (kebab-case)
- "Primary Color" → "primary-color"
- "Light Gray" → "light-gray"
- "Background" → "background"

### ✅ Download Behavior
When clicking **Download** on the Figma tab:
1. Downloads `colors-light.tokens.json` (Light mode)
2. Downloads `colors-dark.tokens.json` (Dark mode)
3. Both files download automatically

### ✅ Preview Shows Both Modes
The export preview displays BOTH Light and Dark JSON with clear separators:
```
/* ===== LIGHT MODE ===== */
/* Download this as: colors-light.tokens.json */

{ ... light mode JSON ... }


/* ===== DARK MODE ===== */
/* Download this as: colors-dark.tokens.json */

{ ... dark mode JSON ... }
```

---

## How to Import into Figma

1. **Add colors** in the Dark Mode Converter tool
2. Click the **"Figma Variables"** tab
3. Click **"Download"** → gets both `colors-light.tokens.json` and `colors-dark.tokens.json`
4. Open Figma → Open **Variables** panel
5. Click **Import** → Select `colors-light.tokens.json`
6. Repeat for `colors-dark.tokens.json` to add Dark mode

---

## Technical Implementation

### Hex → sRGB Components
```javascript
const hexToComponents = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [
    Math.round(r * 1000) / 1000,  // Round to 3 decimals
    Math.round(g * 1000) / 1000,
    Math.round(b * 1000) / 1000
  ];
};
```

### Name Sanitization
```javascript
const sanitizeName = (name) => {
  return name.toLowerCase().replace(/[\s_]+/g, '-');
};
```

---

## ✅ Status: DEPLOYED
- 🌐 **Live:** https://tools.gamaleldien.com/darkmode
- 📦 **Deployed:** Cloudflare Workers
- ✅ **Format:** Matches Figma's official plugin EXACTLY
