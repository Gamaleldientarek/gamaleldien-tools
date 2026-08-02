#!/usr/bin/env python3
"""Build & Deploy shorten.gamaleldien.com URL Shortener Worker."""
import json, os, subprocess, tempfile, sys

ACCOUNT_ID = "b6c05712bc4cb61fccdf5b7600845d03"
ZONE_ID = "356be8b57644a92fb81f4660c7b1dc7f"
WORKER_NAME = "url-shortener"
BASE = os.path.dirname(os.path.abspath(__file__))
KV_NAMESPACE_ID = "6a4611fd1f654a6784f46dbee98a04b3"

# Admin password is a secret — never hardcode it here (this repo is public).
# Read from the environment, or from the local secrets file.
_pw_file = os.path.expanduser("~/.claude/.secrets/shorten-admin-password.txt")
ADMIN_PASSWORD = os.environ.get("SHORTEN_ADMIN_PASSWORD") or (
    open(_pw_file).read().strip() if os.path.exists(_pw_file) else None
)

DRY_RUN = "--dry-run" in sys.argv

if not ADMIN_PASSWORD and not DRY_RUN:
    print("❌ No admin password. Set SHORTEN_ADMIN_PASSWORD or create")
    print(f"   {_pw_file}")
    sys.exit(1)

print("🔗  shorten.gamaleldien.com — URL Shortener Deploy")
print("=" * 52)

# Read admin HTML
admin_path = os.path.join(BASE, "admin.html")
with open(admin_path) as f:
    admin_html = f.read()
print(f"📖 admin.html: {len(admin_html)} bytes")

# Load CF token
token = os.environ.get("CLOUDFLARE_API_TOKEN")
if not token:
    env_path = os.path.join(os.path.dirname(BASE), ".env")
    if os.path.exists(env_path):
        with open(env_path) as ef:
            for line in ef:
                if line.strip().startswith("CLOUDFLARE_API_TOKEN="):
                    token = line.strip().split("=", 1)[1].strip().strip('"').strip("'")
if not token:
    print("❌ CLOUDFLARE_API_TOKEN not found.")
    sys.exit(1)

# Build worker JS
worker_js = f"""const ADMIN_HTML = {json.dumps(admin_html)};

export default {{
  async fetch(request, env, ctx) {{
    return handleRequest(request, env, ctx);
  }}
}};

// ── Helpers ──────────────────────────────────────────────

function jsonResponse(data, status = 200) {{
  return new Response(JSON.stringify(data), {{
    status,
    headers: {{ "Content-Type": "application/json" }}
  }});
}}

function htmlResponse(html) {{
  return new Response(html, {{
    headers: {{ "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-store" }}
  }});
}}

function parseUA(ua) {{
  const device = /mobile|android|iphone|ipad/i.test(ua) ? "Mobile" : "Desktop";
  const lc = ua.toLowerCase();
  let browser = "Other";
  if (lc.includes("edg/") || lc.includes("edge/")) browser = "Edge";
  else if (lc.includes("chrome")) browser = "Chrome";
  else if (lc.includes("firefox")) browser = "Firefox";
  else if (lc.includes("safari")) browser = "Safari";
  return {{ device, browser }};
}}

function generateSlug() {{
  const chars = "23456789abcdefghjkmnpqrstuvwxyz";
  return Array.from({{ length: 6 }}, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}}

async function requireAuth(request, env) {{
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/sl_session=([^;\\s]+)/);
  if (!match) return false;
  const session = await env.KV.get(`session:${{match[1]}}`, "json");
  return !!(session && session.expires > Date.now());
}}

function sessionCookie(token, maxAge) {{
  return `sl_session=${{token}}; HttpOnly; Secure; SameSite=Strict; Max-Age=${{maxAge}}; Path=/`;
}}

// ── Router ───────────────────────────────────────────────

async function handleRequest(request, env, ctx) {{
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (path === "/admin" || path === "/admin/") return htmlResponse(ADMIN_HTML);
  if (path === "/" || path === "") return Response.redirect(url.origin + "/admin", 302);

  if (path === "/api/login" && method === "POST") return handleLogin(request, env);
  if (path === "/api/logout" && method === "POST") return handleLogout(request, env);
  if (path === "/api/links" && method === "GET") return handleListLinks(request, env);
  if (path === "/api/links" && method === "POST") return handleCreateLink(request, env);
  if (path.startsWith("/api/links/") && method === "DELETE") {{
    const slug = path.split("/api/links/")[1].split("/")[0];
    return handleDeleteLink(request, env, slug);
  }}
  if (path.startsWith("/api/clicks/") && method === "GET") {{
    const slug = path.split("/api/clicks/")[1].split("/")[0];
    return handleGetClicks(request, env, slug);
  }}

  const slug = path.slice(1);
  if (slug && !slug.includes("/")) return handleRedirect(request, env, slug, ctx);

  return new Response("Not found", {{ status: 404 }});
}}

// ── Auth ─────────────────────────────────────────────────

async function handleLogin(request, env) {{
  let body;
  try {{ body = await request.json(); }} catch {{ return jsonResponse({{ error: "Invalid JSON" }}, 400); }}
  if (body.password !== env.ADMIN_PASSWORD) return jsonResponse({{ error: "Invalid password" }}, 401);
  const token = crypto.randomUUID().replace(/-/g, "");
  await env.KV.put(`session:${{token}}`, JSON.stringify({{ expires: Date.now() + 86400000 }}), {{ expirationTtl: 86400 }});
  return new Response(JSON.stringify({{ ok: true }}), {{
    status: 200,
    headers: {{ "Content-Type": "application/json", "Set-Cookie": sessionCookie(token, 86400) }}
  }});
}}

async function handleLogout(request, env) {{
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/sl_session=([^;\\s]+)/);
  if (match) await env.KV.delete(`session:${{match[1]}}`);
  return new Response(JSON.stringify({{ ok: true }}), {{
    headers: {{ "Content-Type": "application/json", "Set-Cookie": sessionCookie("deleted", 0) }}
  }});
}}

// ── Links ─────────────────────────────────────────────────

async function handleListLinks(request, env) {{
  if (!await requireAuth(request, env)) return jsonResponse({{ error: "Unauthorized" }}, 401);
  const index = await env.KV.get("meta:index", "json") || [];
  const links = await Promise.all(index.map(async slug => {{
    const data = await env.KV.get(`link:${{slug}}`, "json");
    return data ? {{ ...data, slug }} : null;
  }}));
  return jsonResponse(links.filter(Boolean));
}}

async function handleCreateLink(request, env) {{
  if (!await requireAuth(request, env)) return jsonResponse({{ error: "Unauthorized" }}, 401);
  let body;
  try {{ body = await request.json(); }} catch {{ return jsonResponse({{ error: "Invalid JSON" }}, 400); }}
  const {{ url, domain, slug: customSlug }} = body;
  if (!url || !domain) return jsonResponse({{ error: "url and domain are required" }}, 400);

  const allowedDomains = ["l.gamaleldien.com", "tools.gamaleldien.com"];
  if (!allowedDomains.includes(domain)) return jsonResponse({{ error: "Invalid domain" }}, 400);

  let slug = customSlug || generateSlug();
  if (customSlug) {{
    const existing = await env.KV.get(`link:${{slug}}`);
    if (existing) return jsonResponse({{ error: `Slug '/${{slug}}' is already taken` }}, 409);
  }} else {{
    let attempts = 0;
    while (await env.KV.get(`link:${{slug}}`) && attempts < 10) {{
      slug = generateSlug();
      attempts++;
    }}
  }}

  const linkData = {{
    url, domain,
    created_at: new Date().toISOString(),
    is_custom: !!customSlug,
    total_clicks: 0
  }};
  await env.KV.put(`link:${{slug}}`, JSON.stringify(linkData));
  await env.KV.put(`clicks:${{slug}}`, JSON.stringify([]));

  const index = await env.KV.get("meta:index", "json") || [];
  index.unshift(slug);
  await env.KV.put("meta:index", JSON.stringify(index));

  return jsonResponse({{ slug, ...linkData }}, 201);
}}

async function handleDeleteLink(request, env, slug) {{
  if (!await requireAuth(request, env)) return jsonResponse({{ error: "Unauthorized" }}, 401);
  await env.KV.delete(`link:${{slug}}`);
  await env.KV.delete(`clicks:${{slug}}`);
  const index = (await env.KV.get("meta:index", "json") || []).filter(s => s !== slug);
  await env.KV.put("meta:index", JSON.stringify(index));
  return jsonResponse({{ ok: true }});
}}

async function handleGetClicks(request, env, slug) {{
  if (!await requireAuth(request, env)) return jsonResponse({{ error: "Unauthorized" }}, 401);
  const clicks = await env.KV.get(`clicks:${{slug}}`, "json") || [];
  return jsonResponse(clicks);
}}

// ── Redirect + tracking ───────────────────────────────────

async function handleRedirect(request, env, slug, ctx) {{
  const linkData = await env.KV.get(`link:${{slug}}`, "json");
  if (!linkData) {{
    const origin = new URL(request.url).origin;
    return Response.redirect(origin + "/admin", 302);
  }}

  const cf = request.cf || {{}};
  const ua = request.headers.get("user-agent") || "";
  const {{ device, browser }} = parseUA(ua);
  const click = {{
    ts: new Date().toISOString(),
    country: cf.country || "??",
    device,
    browser,
    referrer: request.headers.get("referer") || ""
  }};

  // Register background tracking with CF execution context so it survives after response is sent
  ctx.waitUntil((async () => {{
    try {{
      const clicks = await env.KV.get(`clicks:${{slug}}`, "json") || [];
      clicks.push(click);
      if (clicks.length > 500) clicks.splice(0, clicks.length - 500);
      await env.KV.put(`clicks:${{slug}}`, JSON.stringify(clicks));
      linkData.total_clicks = (linkData.total_clicks || 0) + 1;
      await env.KV.put(`link:${{slug}}`, JSON.stringify(linkData));
    }} catch (e) {{}}
  }})());

  return new Response(null, {{
    status: 302,
    headers: {{ "Location": linkData.url }}
  }});
}}
"""

if DRY_RUN:
    print("\n📝 DRY RUN — worker JS preview (first 800 chars):")
    print(worker_js[:800])
    print("\n✅ Dry run complete. Run without --dry-run to deploy.")
    sys.exit(0)

# Write generated worker.js
worker_path = os.path.join(BASE, "worker.js")
with open(worker_path, "w") as f:
    f.write(worker_js)
print(f"\n📦 Generated worker.js: {len(worker_js)} bytes")

# Deploy worker with KV binding
print(f"\n🚀 Deploying worker: {WORKER_NAME}")
metadata = json.dumps({
    "main_module": "worker.js",
    "compatibility_date": "2024-01-01",
    "bindings": [
        {"type": "kv_namespace", "name": "KV", "namespace_id": KV_NAMESPACE_ID}
    ]
})

with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as mf:
    mf.write(metadata)
    meta_path = mf.name

result = subprocess.run([
    "curl", "-s", "-X", "PUT",
    f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/workers/scripts/{WORKER_NAME}",
    "-H", f"Authorization: Bearer {token}",
    "-F", f"metadata=@{meta_path};type=application/json",
    "-F", f"worker.js=@{worker_path};type=application/javascript+module"
], capture_output=True, text=True)
os.unlink(meta_path)

resp = json.loads(result.stdout)
if not resp.get("success"):
    print(f"❌ Deploy failed: {resp.get('errors')}")
    sys.exit(1)
print("✅ Worker deployed!")

# Set ADMIN_PASSWORD secret
print(f"\n🔑 Setting ADMIN_PASSWORD secret...")
sec_result = subprocess.run([
    "curl", "-s", "-X", "PUT",
    f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/workers/scripts/{WORKER_NAME}/secrets",
    "-H", f"Authorization: Bearer {token}",
    "-H", "Content-Type: application/json",
    "--data", json.dumps({"name": "ADMIN_PASSWORD", "text": ADMIN_PASSWORD, "type": "secret_text"})
], capture_output=True, text=True)
sec_resp = json.loads(sec_result.stdout)
if sec_resp.get("success"):
    print("✅ Secret set!")
else:
    print(f"⚠️  Secret: {sec_resp.get('errors')} (may need Workers:Edit full permission)")

# Create DNS CNAME: shorten.gamaleldien.com → proxied
print(f"\n🌐 Creating DNS CNAME: shorten.gamaleldien.com")
dns_result = subprocess.run([
    "curl", "-s", "-X", "POST",
    f"https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/dns_records",
    "-H", f"Authorization: Bearer {token}",
    "-H", "Content-Type: application/json",
    "--data", json.dumps({
        "type": "CNAME",
        "name": "shorten",
        "content": f"{WORKER_NAME}.zone99.workers.dev",
        "proxied": True,
        "ttl": 1
    })
], capture_output=True, text=True)
dns_resp = json.loads(dns_result.stdout)
if dns_resp.get("success"):
    print("✅ DNS CNAME created!")
elif "already exists" in str(dns_resp.get("errors", "")).lower():
    print("ℹ️  DNS record already exists")
else:
    print(f"⚠️  DNS: {dns_resp.get('errors')}")

# Create Worker Route
print(f"\n🗺️  Creating Worker route: shorten.gamaleldien.com/*")
route_result = subprocess.run([
    "curl", "-s", "-X", "POST",
    f"https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/workers/routes",
    "-H", f"Authorization: Bearer {token}",
    "-H", "Content-Type: application/json",
    "--data", json.dumps({
        "pattern": "shorten.gamaleldien.com/*",
        "script": WORKER_NAME
    })
], capture_output=True, text=True)
route_resp = json.loads(route_result.stdout)
if route_resp.get("success"):
    print("✅ Worker route created!")
elif "already" in str(route_resp.get("errors", "")).lower():
    print("ℹ️  Route already exists")
else:
    print(f"⚠️  Route: {route_resp.get('errors')}")

# Add l.gamaleldien.com as Workers Custom Domain (auto-creates DNS)
print(f"\n🌐 Setting up l.gamaleldien.com as custom domain...")
cdn_result = subprocess.run([
    "curl", "-s", "-X", "PUT",
    f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/workers/domains",
    "-H", f"Authorization: Bearer {token}",
    "-H", "Content-Type: application/json",
    "--data", json.dumps({
        "environment": "production",
        "hostname": "l.gamaleldien.com",
        "service": WORKER_NAME,
        "zone_id": ZONE_ID
    })
], capture_output=True, text=True)
cdn_resp = json.loads(cdn_result.stdout)
if cdn_resp.get("success"):
    print("✅ l.gamaleldien.com custom domain set!")
else:
    print(f"⚠️  Custom domain: {cdn_resp.get('errors')}")
    # Fallback: try worker route
    print(f"   Trying worker route fallback...")
    r2 = subprocess.run([
        "curl", "-s", "-X", "POST",
        f"https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/workers/routes",
        "-H", f"Authorization: Bearer {token}",
        "-H", "Content-Type: application/json",
        "--data", json.dumps({"pattern": "l.gamaleldien.com/*", "script": WORKER_NAME})
    ], capture_output=True, text=True)
    r2_resp = json.loads(r2.stdout)
    if r2_resp.get("success"):
        print("✅ Worker route l.gamaleldien.com/* created!")
    elif "already" in str(r2_resp.get("errors", "")).lower():
        print("ℹ️  Route l.gamaleldien.com/* already exists")
    else:
        print(f"⚠️  Route: {r2_resp.get('errors')}")

print(f"\n{'=' * 52}")
print("✅ Deployment complete!\n")
print("🔗 Admin:    https://shorten.gamaleldien.com/admin")
print("🔗 Short:    https://l.gamaleldien.com/{slug}")
print("🔑 Password: (from ~/.claude/.secrets/shorten-admin-password.txt — never printed)")
