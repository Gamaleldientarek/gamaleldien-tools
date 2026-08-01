# URL Shortener — shorten.gamaleldien.com

Password-protected URL shortener on Cloudflare Workers + KV.

## Deploy

```bash
cd /root/clawd
python3 projects/business/gamaleldien.com/tools/url-shortener/deploy.py
```

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
