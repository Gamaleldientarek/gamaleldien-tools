# gamaleldien-tools

Free tools by [Gamal Eldien](https://gamaleldien.com) — hosted at [tools.gamaleldien.com](https://tools.gamaleldien.com)

## Tools

| Tool | Path | Description |
|------|------|-------------|
| Dark Mode Converter | `/darkmode` | Convert Figma light-mode variables to dark mode |
| Shade Generator | `/shade-generator` | Generate color shade palettes |
| Lottie Previewer | `/lottie` | Preview Lottie animations |
| Numeric Scale | `/numeric-scale` | Generate typographic/spacing scales |
| Dot Motion Generator | `/dots` | Create animated dot patterns |
| Prompt Builder | `/prompt-builder` | Build structured AI prompts |
| URL Shortener | `/s` | Branded short links |

## Deployment

All tools are deployed via a single **Cloudflare Worker** (`build-router.py`).

```bash
cd /root/clawd/projects/business/gamaleldien.com/tools
python3 build-router.py
```

The router reads each tool's `index.html` and serves them at the correct paths.

## Structure

Each tool lives in its own folder with a self-contained `index.html`.
