# Lottie Hub — Professional Lottie Animation Suite

A comprehensive web-based tool for previewing, editing, and exporting Lottie animations directly in the browser.

## Features

### Phase 1: Lottie Preview
- ✅ Drag & drop upload of Lottie JSON files
- ✅ Multiple animation support
- ✅ Real-time preview with SVG renderer
- ✅ Playback controls (play/pause/stop)
- ✅ Progress bar with seeking
- ✅ Animation metadata display (dimensions, FPS, duration)
- ✅ Responsive design for all devices

### Phase 2: Lottie Editor (Current Focus)
- ✅ Color extraction from Lottie JSON
- ✅ Visual color palette with swatches
- ✅ Click-to-edit color functionality
- ✅ Live preview of color changes
- ✅ Download edited JSON files
- ✅ Color type detection (Fill, Stroke, etc.)
- ✅ Light/Dark mode toggle
- 🔄 Undo/Redo functionality (coming soon)

### Available at
- **Live URL**: https://lottie.gamaleldien.com (Vercel)
- **Redirect**: https://tools.gamaleldien.com/lottie → lottie.gamaleldien.com
- **Multi Preview**: https://lottie.gamaleldien.com/preview.html
- **Hosting**: Vercel (moved from Cloudflare Workers due to script injection issues)
- **Free Forever**: No signup required

## Technologies Used

- **Frontend**: Pure HTML/CSS/JavaScript (no framework)
- **Animation Engine**: Lottie-Web by Bodymovin
- **Styling**: Custom CSS with design system from tools.gamaleldien.com
- **Theme System**: CSS variables with localStorage persistence

## How It Works

### Color Editing Process
1. Upload a Lottie JSON file via drag & drop or file selection
2. Click on any animation card to reveal its color palette
3. Click on any color swatch to open the color picker
4. Select a new color and see the animation update in real-time
5. Download the edited JSON file when finished

### Technical Implementation
- **Color Extraction**: Recursively parses Lottie JSON to find all color properties
- **Color Format Conversion**: Converts between Lottie's 0-1 RGB format and standard hex
- **Real-time Updates**: Destroys and recreates animation with updated data
- **Theme System**: CSS variables with data attributes for theme switching

## File Structure

```
lottie-previewer/
├── index.html          # Main HTML structure
├── styles.css          # All styling with light/dark themes
├── app.js              # Core application logic
├── README.md           # This file
├── backups/            # Automatic backups of previous versions
└── EXECUTION-PLAN.md   # Original project plan
```

## Usage Tips

- **Performance**: Large animations with many layers may take longer to process
- **Compatibility**: Works with most Lottie files exported from After Effects
- **Colors**: Currently detects fill colors, stroke colors, and basic color types
- **Themes**: Toggle between light and dark mode using the sun/moon icon in the navbar

## Roadmap

### Phase 3: Lottie Export
- GIF export functionality
- Video export (MP4/WebM)
- Quality and size controls
- Background color options

### Future Enhancements
- Advanced editing tools (opacity, transforms)
- Animation timeline editing
- Batch processing for multiple files
- Color palette saving and sharing

## License

Built for [tools.gamaleldien.com](https://tools.gamaleldien.com) by Gamal Eldien.