# URL Shortener — shorten.gamaleldien.com

Password-protected URL shortener on Cloudflare Workers + KV.

## Deploy

Two paths:

```bash
# Full deploy (worker + secret + DNS/routes) — needs CLOUDFLARE_API_TOKEN
python3 deploy.py

# Worker-only redeploy via wrangler login (secrets and routes persist)
python3 deploy.py --dry-run   # sanity-check the build first
npx wrangler deploy           # uses wrangler.jsonc; needs worker.js from a deploy.py run
```

Note: wrangler cannot write its cache inside the Google Drive folder — copy
`worker.js` + `wrangler.jsonc` to a local temp dir and run `npx wrangler deploy` there.

## CF Resources

- Worker: `url-shortener`
- KV namespace: `SHORTLINKS` (ID: `6a4611fd1f654a6784f46dbee98a04b3`)
- Admin domain: `shorten.gamaleldien.com` (CF Custom Domain)
- Secret: `ADMIN_PASSWORD` (set on worker)

## How it works

- Admin panel: `https://shorten.gamaleldien.com/admin`
- Password: stored as CF Worker secret `ADMIN_PASSWORD`
- Create links → short URL on `gamaleldien.com` or `tools.gamaleldien.com`
- Both workers look up slugs from the shared SHORTLINKS KV namespace

## Supported redirect domains

| Domain | How |
|--------|-----|
| `tools.gamaleldien.com` | dark-mode-converter worker has SHORTLINKS KV binding, does fallback lookup |
| `gamaleldien.com` | Not yet — Framer site, no CF Worker intercept |

## Tracking

Each click records: timestamp, country (CF header), device (UA), browser (UA), referrer.
View in admin panel → click "▾ clicks" next to any link.

## Change password

1. Edit `ADMIN_PASSWORD` in `deploy.py`
2. Run `deploy.py` again (it re-sets the secret)
