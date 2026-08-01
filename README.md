# gamaleldien-tools

Free tools by [Gamal Eldien](https://gamaleldien.com) — hosted at [tools.gamaleldien.com](https://tools.gamaleldien.com)

## Tools

| Tool | Live URL | Source |
|------|----------|--------|
| Turn Order Generator | [tools.gamaleldien.com/random-selector](https://tools.gamaleldien.com/random-selector) | [`random-selector/`](./random-selector) |
| Dark Mode Converter | [tools.gamaleldien.com/darkmode](https://tools.gamaleldien.com/darkmode) | [`darkmode/`](./darkmode) |
| Shade Generator | [tools.gamaleldien.com/shades](https://tools.gamaleldien.com/shades) | [`shade-generator/`](./shade-generator) |
| Lottie Previewer | [tools.gamaleldien.com/lottie](https://tools.gamaleldien.com/lottie) | [`lottie/`](./lottie) |
| Numeric Scale | [tools.gamaleldien.com/numeric-scale](https://tools.gamaleldien.com/numeric-scale) | [`numeric-scale/`](./numeric-scale) |
| Dot Motion Generator | [tools.gamaleldien.com/dots](https://tools.gamaleldien.com/dots) | [`dots/`](./dots) |
| Prompt Builder | [tools.gamaleldien.com/prompt-builder](https://tools.gamaleldien.com/prompt-builder) | [`prompt-builder/`](./prompt-builder) |
| URL Shortener | [tools.gamaleldien.com/s](https://tools.gamaleldien.com/s) | [`url-shortener/`](./url-shortener) |
| Brand Brief | [brief.gamaleldien.com](https://brief.gamaleldien.com) | [`brand-brief/`](./brand-brief) |
| Hexer (Chrome Extension) | [Chrome Web Store](https://chromewebstore.google.com/detail/mgbajpnindnpkdgidnijgaklbfbamkab) | [`hexer/`](./hexer) |
| Figma Slide Numbering | [Figma Community](https://www.figma.com/community/plugin/1611086088438508623/page-number-for-presentations) | [`figma-slide-numbering/`](./figma-slide-numbering) |
| Landing Page | [tools.gamaleldien.com](https://tools.gamaleldien.com) | [`landing/`](./landing) |

## Deployment

All web tools are deployed via a single **Cloudflare Worker** (`build-router.py`).

```bash
python3 build-router.py
```

Pushes to `main` trigger auto-deploy via GitHub Actions.

## Structure

Each tool lives in its own folder with a self-contained `index.html`.

**One exception:** `random-selector/` (Turn Order Generator) is a Next.js app with a
Supabase backend, because a live shared room needs a server, a database and a realtime
channel. It deploys to its own Vercel project, and the Worker reverse-proxies
`/random-selector/**` to it so the public URL stays on this domain. See
[`random-selector/README.md`](./random-selector/README.md).
