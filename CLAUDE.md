# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A monorepo of free single-page web tools hosted at `tools.gamaleldien.com`, plus a Chrome extension (`hexer/`) and a Figma plugin (`figma-slide-numbering/`). Each web tool is a self-contained `index.html` in its own folder — no frameworks, no bundler, vanilla JS with inline CSS.

## Architecture: one Worker serves everything

Almost all web tools are served by a **single Cloudflare Worker** named `dark-mode-converter` (the name is historical — do not "fix" it; the custom domain `tools.gamaleldien.com` is bound to it).

`build-router.py` at the repo root is both the build and the deploy:

1. Reads each tool's `index.html`, strips existing favicon links and injects a per-tool inline SVG favicon.
2. Embeds every page and OG image (base64) as JS string constants into a generated `worker.js` (gitignored).
3. Uploads `worker.js` to Cloudflare via the API (needs `CLOUDFLARE_API_TOKEN` from the environment or a repo-root `.env`).

Consequences of this design:

- **Adding a route = editing `build-router.py`**: read the new tool's HTML, add a favicon constant, add a path check in `handleRequest`, and add the constant to the generated worker template. The worker template is a Python f-string, so literal JS braces must be doubled (`{{ }}`).
- Nothing is served statically — a change to any tool's `index.html` is invisible until `build-router.py` runs.
- The worker sends a strict CSP (see `SECURITY_HEADERS` in `build-router.py`). A tool that adds a new CDN, font host, or analytics endpoint will be silently blocked until that origin is added to the CSP.
- Unknown paths fall through to a **shortlink lookup** in the `SHORTLINKS` KV namespace (shared with the url-shortener worker), then redirect to `/`.

**Exception — Lottie**: `/lottie` and `/lottie/preview` redirect to `lottie.gamaleldien.com` (Vercel), because Cloudflare-injected scripts broke the tool. `lottie/assemble_inline.py` builds the inlined variants (`index-inline.html`, `preview-inline.html`).

## Deploy

```bash
python3 build-router.py          # build + deploy the main tools worker
```

Pushes to `main` auto-deploy via GitHub Actions (`.github/workflows/deploy.yml`), which just runs `build-router.py`.

Separate deploys, not covered by the router:

- **URL shortener** (`shorten.gamaleldien.com`): `python3 url-shortener/deploy.py` (supports `--dry-run`). Generates and uploads its own worker (`url-shortener`) embedding `admin.html`, and re-sets the `ADMIN_PASSWORD` secret from the constant in `deploy.py`. Worker-only redeploys also work via `npx wrangler deploy` with `url-shortener/wrangler.jsonc` — but run wrangler from a local temp dir (it cannot write its cache inside the Google Drive folder).
- **Hexer**: `cd hexer && npm run build` (produces `dist/`) or `npm run zip` for the Web Store package.
- **Figma plugin**: loaded in Figma from `figma-slide-numbering/manifest.json`; has its own `CLAUDE.md`.

`darkmode/build.py` is a legacy per-tool deploy script superseded by `build-router.py` — don't use it.

## Hosting map

Verified 2026-08-01 (wrangler + Vercel API). No traditional servers anywhere; every
surface is serverless. Wrangler is OAuth-logged-in on this machine (GamalEldien account,
`b6c05712…`) — run it from a local temp dir, never inside the Google Drive folder.

| Surface | Platform | Deploy path | Source of truth |
|---|---|---|---|
| `tools.gamaleldien.com` | Cloudflare Worker `dark-mode-converter` | `python3 build-router.py` (CI on push to `main`) | this repo |
| `shorten.gamaleldien.com` | Cloudflare Worker `url-shortener` + `SHORTLINKS` KV | `python3 url-shortener/deploy.py`, or wrangler with `url-shortener/wrangler.jsonc` | this repo — **KV holds live data (shortlinks + click analytics); the worker is replaceable, the KV is not** |
| `brief.gamaleldien.com` | Cloudflare **Pages** project `brand-brief` (no git integration — direct upload) | `npx wrangler pages deploy <dir> --project-name=brand-brief` from a local temp dir containing `brand-brief/index.html` | `brand-brief/index.html` in this repo (verified byte-identical to production minus Cloudflare's injected challenge script) |
| `lottie.gamaleldien.com` | Vercel project `lottie-test-vercel` (CLI deploy, not git-connected) | `vercel --prod` from a dir with the built `lottie/` output | `lottie/` in this repo; `/lottie` on the router 302s here |
| `tools.gamaleldien.com/random-selector` | Vercel project `turn-order-generator` + Supabase (Postgres + Realtime + RLS) | see `random-selector/README.md`; Worker reverse-proxies `/random-selector/**` | `random-selector/` in this repo — **Supabase holds live room state** |
| `learn.gamaleldien.com` | Vercel project `iti-freelance` (Next.js, CLI deploy, not git-connected) | `vercel --prod` from that repo | separate private repo [`Gamaleldientarek/iti-freelance-presentation`](https://github.com/Gamaleldientarek/iti-freelance-presentation) — **not in this repo** |

Chrome extension (`hexer/`) and Figma plugin (`figma-slide-numbering/`) ship through
their stores and need no hosting.

Because none of the Vercel/Pages projects are git-connected, **pushing to GitHub does
not deploy them** — only the router worker auto-deploys from CI. Everything else is a
manual CLI deploy from this machine.

## Tests

Only `hexer/` has tests:

```bash
cd hexer
npm test                         # vitest unit tests
npx vitest run tests/foo.test.js # single test file
npm run test:e2e                 # playwright
```

The HTML tools have no test suite — verify changes by opening the file locally in a browser, and remember the deployed version runs under the worker's CSP, which a local file open does not enforce.

## Cloudflare specifics

- Account ID and KV namespace IDs are hardcoded in the deploy scripts.
- `SHORTLINKS` KV namespace is shared between the `url-shortener` worker and the router worker: shortlinks created in the admin panel at `shorten.gamaleldien.com/admin` with domain `tools.gamaleldien.com` are resolved by the router's fallback lookup. Both record click analytics (timestamp, country, device, browser, referrer) into `clicks:<slug>` keys, capped at 500 entries.
- `/hexer` on the router is a tracked redirect to the Chrome Web Store, writing to the same KV.

## Conventions

- Tools follow the site's dark aesthetic (near-black `#0a0a0a` background, orange `#e16105` accent). Keep new tools consistent with it. Never use green.
- Planning/design markdown files (`PLAN.md`, `RESEARCH.md`, etc.) inside tool folders are working documents, not authoritative docs — the code is.
- After adding a tool, list it in the root `README.md` table and add a card to `landing/index.html`.
