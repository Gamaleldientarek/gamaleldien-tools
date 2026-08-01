#!/usr/bin/env python3
"""Build & Deploy tools.gamaleldien.com with routing."""
import json, os, subprocess, tempfile, base64, re

ACCOUNT_ID = "b6c05712bc4cb61fccdf5b7600845d03"

# ── Per-tool favicon injection ───────────────────────────────────────────────
def _make_fav(svg):
    b64 = base64.b64encode(svg.strip().encode()).decode()
    return f'<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,{b64}">'

def inject_favicon(html, fav_tag):
    # Remove any existing icon links, then inject ours before </head>
    html = re.sub(r'<link[^>]+rel=["\'](?:shortcut )?icon["\'][^>]*>', '', html)
    html = re.sub(r'<link[^>]+rel=["\']apple-touch-icon["\'][^>]*>', '', html)
    return html.replace('</head>', f'{fav_tag}\n</head>', 1)

FAVICON_DARKMODE = _make_fav("""
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="#0a0a0a"/>
  <circle cx="32" cy="32" r="20" fill="#ffffff"/>
  <path d="M32 12 A20 20 0 0 1 32 52 Z" fill="#1a1a1a"/>
  <circle cx="32" cy="32" r="20" stroke="#e16105" stroke-width="2" fill="none" opacity="0.5"/>
</svg>""")

FAVICON_SHADES = _make_fav("""
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="#0a0a0a"/>
  <rect x="8" y="10" width="14" height="44" rx="4" fill="#fde5cc" opacity="0.9"/>
  <rect x="25" y="10" width="14" height="44" rx="4" fill="#e16105"/>
  <rect x="42" y="10" width="14" height="44" rx="4" fill="#5c2800" opacity="0.9"/>
</svg>""")

FAVICON_NUMERIC = _make_fav("""
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="#0a0a0a"/>
  <text x="6" y="26" font-family="monospace" font-size="14" font-weight="700" fill="#e16105">8</text>
  <text x="6" y="42" font-family="monospace" font-size="14" font-weight="700" fill="#e16105">16</text>
  <text x="32" y="26" font-family="monospace" font-size="20" font-weight="700" fill="#ffffff">32</text>
  <text x="32" y="50" font-family="monospace" font-size="20" font-weight="700" fill="#ffffff">40</text>
</svg>""")

FAVICON_DOTS = _make_fav("""
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="#0a0a0a"/>
  <circle cx="14" cy="16" r="3" fill="#ffffff" opacity="0.4"/>
  <circle cx="32" cy="13" r="3.5" fill="#e16105" opacity="0.7"/>
  <circle cx="50" cy="16" r="3" fill="#ffffff" opacity="0.4"/>
  <circle cx="10" cy="32" r="3.5" fill="#e16105" opacity="0.8"/>
  <circle cx="32" cy="28" r="4.5" fill="#ffffff"/>
  <circle cx="54" cy="32" r="3.5" fill="#e16105" opacity="0.8"/>
  <circle cx="14" cy="48" r="3" fill="#e16105" opacity="0.7"/>
  <circle cx="32" cy="45" r="3.5" fill="#e16105"/>
  <circle cx="50" cy="48" r="3" fill="#e16105" opacity="0.7"/>
</svg>""")

FAVICON_PROMPT = _make_fav("""
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="#0a0a0a"/>
  <rect x="10" y="8" width="44" height="48" rx="7" fill="#1c1c1c"/>
  <rect x="16" y="18" width="20" height="3" rx="1.5" fill="#e16105"/>
  <rect x="16" y="26" width="32" height="2" rx="1" fill="#ffffff" opacity="0.6"/>
  <rect x="16" y="32" width="26" height="2" rx="1" fill="#ffffff" opacity="0.4"/>
  <rect x="16" y="38" width="28" height="2" rx="1" fill="#ffffff" opacity="0.4"/>
  <circle cx="47" cy="16" r="7" fill="#e16105"/>
</svg>""")

FAVICON_LOTTIE = _make_fav("""
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="#0a0a0a"/>
  <path d="M12 52 Q20 22 32 34 T52 14" stroke="#e16105" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>
  <circle cx="12" cy="52" r="5" fill="#e16105"/>
  <circle cx="32" cy="34" r="6" fill="#ffffff" stroke="#e16105" stroke-width="2"/>
  <circle cx="52" cy="14" r="5" fill="#e16105"/>
</svg>""")

FAVICON_LANDING = _make_fav("""
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="#0a0a0a"/>
  <g transform="translate(2,2)">
    <path d="M60.12 35.22v24.9l-24.9-24.9z" fill="#f1f2f2"/>
    <path d="M60.12 10.32 47.67 22.77c-3.44-3.44-7.94-5.16-12.45-5.16s-9.01 1.72-12.45 5.16c-3.44 3.43-5.16 7.94-5.16 12.45s1.72 9.01 5.16 12.45L10.32 60.12C3.94 53.75 0 44.94 0 35.22s3.94-18.53 10.32-24.9C16.69 3.94 25.49 0 35.22 0s18.53 3.94 24.9 10.32" fill="#f1f2f2"/>
  </g>
</svg>""")
WORKER_NAME = "dark-mode-converter"
BASE = os.path.dirname(os.path.abspath(__file__))

print("🛠️  tools.gamaleldien.com — Build & Deploy (Router)")
print("=" * 55)

# Read landing page
landing_path = os.path.join(BASE, "landing", "index.html")
print(f"\n📖 Reading landing page: {landing_path}")
with open(landing_path) as f:
    landing_html = f.read()
landing_html = inject_favicon(landing_html, FAVICON_LANDING)
print(f"   Size: {len(landing_html)} bytes")

# Read dark mode converter
darkmode_path = os.path.join(BASE, "darkmode", "index.html")
print(f"\n📖 Reading dark mode converter: {darkmode_path}")
with open(darkmode_path) as f:
    darkmode_html = f.read()
darkmode_html = inject_favicon(darkmode_html, FAVICON_DARKMODE)
print(f"   Size: {len(darkmode_html)} bytes")

# Read shade generator (if exists)
shades_path = os.path.join(BASE, "shade-generator", "index.html")
shades_html = ""
if os.path.exists(shades_path):
    with open(shades_path) as f:
        shades_html = f.read()
    shades_html = inject_favicon(shades_html, FAVICON_SHADES)
    print(f"\n📖 Reading shade generator: {shades_path}")
    print(f"   Size: {len(shades_html)} bytes")
else:
    print(f"\n⏳ Shade generator not built yet (placeholder route active)")

# Read lottie hub (if exists) — use inlined version for Worker deployment
lottie_inline = os.path.join(BASE, "lottie", "index-inline.html")
lottie_path = lottie_inline if os.path.exists(lottie_inline) else os.path.join(BASE, "lottie", "index.html")
lottie_html = ""
if os.path.exists(lottie_path):
    with open(lottie_path) as f:
        lottie_html = f.read()
    lottie_html = inject_favicon(lottie_html, FAVICON_LOTTIE)
    print(f"\n📖 Reading lottie hub: {lottie_path}")
    print(f"   Size: {len(lottie_html)} bytes")
else:
    print(f"\n⏳ Lottie Hub not built yet (placeholder route active)")

# Read lottie preview (if exists)
preview_path = os.path.join(BASE, "lottie", "preview-inline.html")
preview_html = ""
if os.path.exists(preview_path):
    with open(preview_path) as f:
        preview_html = f.read()
    print(f"\n📖 Reading lottie preview: {preview_path}")
    print(f"   Size: {len(preview_html)} bytes")
else:
    print(f"\n⏳ Lottie Preview not built yet")

# Read numeric scale (if exists)
numeric_path = os.path.join(BASE, "numeric-scale", "index.html")
numeric_html = ""
if os.path.exists(numeric_path):
    with open(numeric_path) as f:
        numeric_html = f.read()
    numeric_html = inject_favicon(numeric_html, FAVICON_NUMERIC)
    print(f"\n📖 Reading numeric scale: {numeric_path}")
    print(f"   Size: {len(numeric_html)} bytes")
else:
    print(f"\n⏳ Numeric Scale not built yet (placeholder route active)")


# Read OG images (base64)
def load_og_image(path, name):
    if os.path.exists(path):
        with open(path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode()
        print(f"\n🖼️  {name} OG image loaded: {len(b64)} chars (base64)")
        return b64
    print(f"\n⚠️  No {name} OG image found, skipping")
    return ""

og_landing_b64 = load_og_image(os.path.join(BASE, "landing", "og-image.png"), "Landing")
og_darkmode_b64 = load_og_image(os.path.join(BASE, "darkmode", "og-image.png"), "Dark Mode")
og_shades_b64 = load_og_image(os.path.join(BASE, "shade-generator", "og-image.png"), "Shade Generator")
og_lottie_b64 = load_og_image(os.path.join(BASE, "lottie", "og-image.png"), "Lottie Hub")
og_numeric_b64 = load_og_image(os.path.join(BASE, "numeric-scale", "og-image.png"), "Numeric Scale")
og_prompt_builder_b64 = load_og_image(os.path.join(BASE, "prompt-builder", "og-image.png"), "Prompt Builder")

# Read prompt builder (if exists)
prompt_builder_path = os.path.join(BASE, "prompt-builder", "index.html")
prompt_builder_html = ""
if os.path.exists(prompt_builder_path):
    with open(prompt_builder_path) as f:
        prompt_builder_html = f.read()
    prompt_builder_html = inject_favicon(prompt_builder_html, FAVICON_PROMPT)
    print(f"\n📖 Reading prompt builder: {prompt_builder_path}")
    print(f"   Size: {len(prompt_builder_html)} bytes")
else:
    print(f"\n⏳ Prompt Builder not found")

# Read dot motion generator (if exists)
dots_path = os.path.join(BASE, "dots", "index.html")
dots_html = ""
if os.path.exists(dots_path):
    with open(dots_path) as f:
        dots_html = f.read()
    dots_html = inject_favicon(dots_html, FAVICON_DOTS)
    print(f"\n📖 Reading dot motion generator: {dots_path}")
    print(f"   Size: {len(dots_html)} bytes")
else:
    print(f"\n⏳ Dot Motion Generator not built yet (placeholder route active)")

# Build worker.js with routing
worker_js = f"""const LANDING_HTML = {json.dumps(landing_html)};
const DARKMODE_HTML = {json.dumps(darkmode_html)};
const SHADES_HTML = {json.dumps(shades_html)};
const LOTTIE_HTML = {json.dumps(lottie_html)};
const PREVIEW_HTML = {json.dumps(preview_html)};
const NUMERIC_HTML = {json.dumps(numeric_html)};
const DOTS_HTML = {json.dumps(dots_html)};
const PROMPT_BUILDER_HTML = {json.dumps(prompt_builder_html)};
const OG_LANDING_B64 = "{og_landing_b64}";
const OG_DARKMODE_B64 = "{og_darkmode_b64}";
const OG_SHADES_B64 = "{og_shades_b64}";
const OG_LOTTIE_B64 = "{og_lottie_b64}";
const OG_NUMERIC_B64 = "{og_numeric_b64}";
const OG_PROMPT_BUILDER_B64 = "{og_prompt_builder_b64}";

export default {{
  async fetch(request, env, ctx) {{
    return handleRequest(request, env, ctx);
  }}
}};

function base64ToArrayBuffer(base64) {{
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {{
    bytes[i] = binaryString.charCodeAt(i);
  }}
  return bytes.buffer;
}}

const SECURITY_HEADERS = {{
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://cdn.jsdelivr.net blob:; style-src 'self' 'unsafe-inline' https://api.fontshare.com; img-src 'self' data: blob: https://images.unsplash.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com https://region1.google-analytics.com; font-src 'self' https://api.fontshare.com https://cdn.fontshare.com; worker-src blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
}};

function htmlResponse(html) {{
  return new Response(html, {{
    headers: {{ "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-cache, no-store, must-revalidate", ...SECURITY_HEADERS }}
  }});
}}

async function handleRequest(request, env, ctx) {{
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Route: /og-image.png → Landing OG image
  if (path === '/og-image.png' && OG_LANDING_B64) {{
    const imageBuffer = base64ToArrayBuffer(OG_LANDING_B64);
    return new Response(imageBuffer, {{
      headers: {{
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      }},
    }});
  }}

  // Route: /darkmode/og-image.png → Dark Mode OG image
  if (path === '/darkmode/og-image.png' && OG_DARKMODE_B64) {{
    const imageBuffer = base64ToArrayBuffer(OG_DARKMODE_B64);
    return new Response(imageBuffer, {{
      headers: {{
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      }},
    }});
  }}
  
  // Route: /shades/og-image.png → Shade Generator OG image
  if (path === '/shades/og-image.png' && OG_SHADES_B64) {{
    const imageBuffer = base64ToArrayBuffer(OG_SHADES_B64);
    return new Response(imageBuffer, {{
      headers: {{
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      }},
    }});
  }}
  
  // Route: /lottie/og-image.png → Lottie Hub OG image
  if (path === '/lottie/og-image.png' && OG_LOTTIE_B64) {{
    const imageBuffer = base64ToArrayBuffer(OG_LOTTIE_B64);
    return new Response(imageBuffer, {{
      headers: {{
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      }},
    }});
  }}
  
  // Route: /numeric-scale/og-image.png → Numeric Scale OG image
  if (path === '/numeric-scale/og-image.png' && OG_NUMERIC_B64) {{
    const imageBuffer = base64ToArrayBuffer(OG_NUMERIC_B64);
    return new Response(imageBuffer, {{
      headers: {{
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      }},
    }});
  }}
  
  // Route: /darkmode → Dark Mode Converter
  if (path === '/darkmode' || path === '/darkmode/') {{
    return htmlResponse(DARKMODE_HTML);
  }}
  
  // Route: /shades → Shade Generator
  if (path === '/shades' || path === '/shades/') {{
    if (SHADES_HTML) {{
      return htmlResponse(SHADES_HTML);
    }}
    return htmlResponse('<html><head><meta http-equiv="refresh" content="0;url=/"></head></html>');
  }}

  // Route: /lottie → Redirect to Vercel (Cloudflare injects scripts that break lottie)
  if (path === '/lottie' || path === '/lottie/') {{
    return Response.redirect('https://lottie.gamaleldien.com/', 302);
  }}
  
  // Route: /lottie/preview → Redirect to Vercel
  if (path === '/lottie/preview' || path === '/lottie/preview/') {{
    return Response.redirect('https://lottie.gamaleldien.com/preview.html', 302);
  }}
  
  // Route: /lottie/og-image.png → keep serving from worker (static asset)
  
  // Route: /numeric-scale → Numeric Scale Generator
  if (path === '/numeric-scale' || path === '/numeric-scale/') {{
    if (NUMERIC_HTML) {{
      return htmlResponse(NUMERIC_HTML);
    }}
    return htmlResponse('<html><head><meta http-equiv="refresh" content="0;url=/"></head></html>');
  }}
  
  // Route: /numeric-scale → Numeric Scale Generator
  if (path === '/numeric-scale' || path === '/numeric-scale/') {{
    if (NUMERIC_HTML) {{
      return htmlResponse(NUMERIC_HTML);
    }}
    return htmlResponse('<html><head><meta http-equiv="refresh" content="0;url=/"></head></html>');
  }}
  
  // Route: /dots → Dot Motion Generator
  if (path === '/dots' || path === '/dots/') {{
    if (DOTS_HTML) {{
      return htmlResponse(DOTS_HTML);
    }}
    return htmlResponse('<html><head><meta http-equiv="refresh" content="0;url=/"></head></html>');
  }}

  // Route: /prompt-builder/og-image.png → Prompt Builder OG image
  if (path === '/prompt-builder/og-image.png' && OG_PROMPT_BUILDER_B64) {{
    const imageBuffer = base64ToArrayBuffer(OG_PROMPT_BUILDER_B64);
    return new Response(imageBuffer, {{
      headers: {{
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      }},
    }});
  }}

  // Route: /prompt-builder → Creative System Prompt Builder
  if (path === '/prompt-builder' || path === '/prompt-builder/') {{
    if (PROMPT_BUILDER_HTML) {{
      return htmlResponse(PROMPT_BUILDER_HTML);
    }}
    return htmlResponse('<html><head><meta http-equiv="refresh" content="0;url=/"></head></html>');
  }}
  
  // Route: / → Landing Page
  if (path === '/' || path === '') {{
    return htmlResponse(LANDING_HTML);
  }}
  
  // Route: /hexer → Hexer Chrome Extension (with click tracking)
  if (path === '/hexer' || path === '/hexer/') {{
    const HEXER_URL = 'https://chromewebstore.google.com/detail/mgbajpnindnpkdgidnijgaklbfbamkab?utm_source=tools-gamaleldien';
    if (env && env.SHORTLINKS) {{
      const ua = request.headers.get('user-agent') || '';
      const cf = request.cf || {{}};
      const device = /mobile|android|iphone|ipad/i.test(ua) ? 'Mobile' : 'Desktop';
      const lc = ua.toLowerCase();
      const browser = lc.includes('edg/') ? 'Edge' : lc.includes('chrome') ? 'Chrome' : lc.includes('firefox') ? 'Firefox' : lc.includes('safari') ? 'Safari' : 'Other';
      const click = {{ ts: new Date().toISOString(), country: cf.country || '??', device, browser, referrer: request.headers.get('referer') || '' }};
      ctx.waitUntil((async () => {{
        try {{
          // Ensure link entry exists
          let linkData = await env.SHORTLINKS.get('link:hexer', 'json');
          if (!linkData) {{
            linkData = {{ url: HEXER_URL, domain: 'tools.gamaleldien.com', created_at: new Date().toISOString(), is_custom: true, total_clicks: 0 }};
            const index = await env.SHORTLINKS.get('meta:index', 'json') || [];
            if (!index.includes('hexer')) {{ index.unshift('hexer'); await env.SHORTLINKS.put('meta:index', JSON.stringify(index)); }}
          }}
          const clicks = await env.SHORTLINKS.get('clicks:hexer', 'json') || [];
          clicks.push(click);
          if (clicks.length > 500) clicks.splice(0, clicks.length - 500);
          await env.SHORTLINKS.put('clicks:hexer', JSON.stringify(clicks));
          linkData.total_clicks = (linkData.total_clicks || 0) + 1;
          await env.SHORTLINKS.put('link:hexer', JSON.stringify(linkData));
        }} catch (e) {{}}
      }})());
    }}
    return Response.redirect(HEXER_URL, 302);
  }}

  // Dynamic shortlinks: look up slug in SHORTLINKS KV (url-shortener worker)
  const slug = path.slice(1).split('/')[0];
  if (slug && env && env.SHORTLINKS) {{
    try {{
      const linkData = await env.SHORTLINKS.get(`link:${{slug}}`, 'json');
      if (linkData && linkData.domain === 'tools.gamaleldien.com') {{
        // Fire-and-forget click tracking
        const ua = request.headers.get('user-agent') || '';
        const cf = request.cf || {{}};
        const device = /mobile|android|iphone|ipad/i.test(ua) ? 'Mobile' : 'Desktop';
        const lc = ua.toLowerCase();
        const browser = lc.includes('edg/') ? 'Edge' : lc.includes('chrome') ? 'Chrome' : lc.includes('firefox') ? 'Firefox' : lc.includes('safari') ? 'Safari' : 'Other';
        const click = {{ ts: new Date().toISOString(), country: cf.country || '??', device, browser, referrer: request.headers.get('referer') || '' }};
        ctx.waitUntil((async () => {{
          const clicks = await env.SHORTLINKS.get(`clicks:${{slug}}`, 'json') || [];
          clicks.push(click);
          if (clicks.length > 500) clicks.splice(0, clicks.length - 500);
          await env.SHORTLINKS.put(`clicks:${{slug}}`, JSON.stringify(clicks));
          linkData.total_clicks = (linkData.total_clicks || 0) + 1;
          await env.SHORTLINKS.put(`link:${{slug}}`, JSON.stringify(linkData));
        }})());
        return Response.redirect(linkData.url, 302);
      }}
    }} catch (e) {{}}
  }}

  // 404 for everything else → redirect to landing
  return Response.redirect(url.origin + '/', 302);
}}
"""

worker_path = os.path.join(BASE, "worker.js")
with open(worker_path, "w") as f:
    f.write(worker_js)
print(f"\n📦 Created router worker.js ({len(worker_js)} bytes)")

# Deploy
print(f"\n🚀 Deploying to Cloudflare Workers...")
print(f"   Worker: {WORKER_NAME}")

metadata = json.dumps({
    "main_module": "worker.js",
    "compatibility_date": "2024-01-01",
    "bindings": [
        {"type": "kv_namespace", "name": "SHORTLINKS", "namespace_id": "6a4611fd1f654a6784f46dbee98a04b3"}
    ]
})

with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as mf:
    mf.write(metadata)
    metadata_path = mf.name

token = os.environ.get('CLOUDFLARE_API_TOKEN')
if not token:
    # Fallback: try reading from .env file
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(env_path):
        with open(env_path) as ef:
            for line in ef:
                if line.strip().startswith('CLOUDFLARE_API_TOKEN='):
                    token = line.strip().split('=', 1)[1].strip().strip('"').strip("'")
    if not token:
        print("❌ CLOUDFLARE_API_TOKEN not set. Set env var or create .env file in tools/ folder.")
        exit(1)

result = subprocess.run([
    "curl", "-s", "-X", "PUT",
    f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/workers/scripts/{WORKER_NAME}",
    "-H", f"Authorization: Bearer {token}",
    "-F", f"metadata=@{metadata_path};type=application/json",
    "-F", f"worker.js=@{worker_path};type=application/javascript+module"
], capture_output=True, text=True)

os.unlink(metadata_path)

resp = json.loads(result.stdout)
if resp.get("success"):
    print("✅ Successfully deployed!")
else:
    print(f"❌ Deploy failed: {resp.get('errors', 'Unknown error')}")
    exit(1)

print(f"\n{'=' * 55}")
print("✅ Build and deployment complete!\n")
print("🌐 Landing:   https://tools.gamaleldien.com")
print("🎨 Dark Mode: https://tools.gamaleldien.com/darkmode")
print("🌈 Shades:    https://tools.gamaleldien.com/shades")
print("🎭 Lottie:    https://tools.gamaleldien.com/lottie")
print("🎥 Preview:   https://tools.gamaleldien.com/lottie/preview")
print("⚫ Dots:     https://tools.gamaleldien.com/dots")
print("✦ Prompt:   https://tools.gamaleldien.com/prompt-builder")
print("🖼️  OG Image: https://tools.gamaleldien.com/darkmode/og-image.png")
