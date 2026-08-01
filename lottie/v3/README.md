# Lottie Color Editor

A professional, layer-based color editor for Lottie animations.

## Features

- **Layer-Based Editing**: Select individual layers and edit their color properties
- **Controller Support**: Automatically detects and displays color controller layers
- **Expression Awareness**: Shows when colors are controlled by expressions
- **Live Preview**: Changes update the animation in real-time
- **Download Edited JSON**: Export your modified animation for use anywhere

## How to Use

1. **Upload**: Drag and drop a Lottie JSON file onto the upload zone
2. **Select Layer**: Click on a layer in the Layers panel
3. **Edit Colors**: Use the color pickers in the Properties panel
4. **Download**: Click "Download JSON" to get your edited file

## Controller Colors

Many professional Lottie animations use a "color controller" pattern where:
- A null layer contains color effect controls
- Other layers reference these colors via expressions
- Editing the controller updates all connected layers

The Color Editor detects these automatically and displays them in the "COLOR CONTROLLERS" section.

## Technical Details

- Built with vanilla HTML/CSS/JavaScript
- Uses ES6 modules
- Lottie-web for animation rendering
- No build step required

## File Structure

```
lottie-color-editor/
├── index.html          # Main HTML page
├── styles.css          # Complete design system
├── js/
│   ├── app.js          # Main application
│   ├── layer-parser.js # Layer extraction logic
│   └── color-utils.js  # Color conversion utilities
├── libs/
│   └── lottie.min.js   # Lottie web player
└── README.md           # This file
```

## Running Locally

```bash
# Start a local server (required for ES6 modules)
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

## Design System

The editor follows the gamaleldien.com design language:
- **Background**: `#0a0a0a` (dark mode) / `#fafafa` (light mode)
- **Accent**: `#e16105` (orange)
- **Typography**: Clash Display font
- **Effects**: Glass-morphism, gradient borders

## License

Built for [tools.gamaleldien.com](https://tools.gamaleldien.com) by Gamal Eldien.
