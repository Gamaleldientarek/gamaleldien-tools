#!/usr/bin/env python3
"""
Build script for Tools website
Packages all HTML pages into worker.js and deploys to Cloudflare Workers
"""

import os
import json
import requests
from pathlib import Path

# Configuration
SCRIPT_DIR = Path(__file__).parent
ALL_TOOLS_HTML = SCRIPT_DIR / "all-tools.html"
CONVERTER_HTML = SCRIPT_DIR / "index.html"
WORKER_JS = SCRIPT_DIR / "worker.js"
WORKER_NAME = "dark-mode-converter"

# Cloudflare credentials
ACCOUNT_ID = "b6c05712bc4cb61fccdf5b7600845d03"
API_TOKEN = "C5G9HUJkYJSJtk_zadNjPhJeKs-I3qpLGmGuiKaz"

def read_file(filepath):
    """Read a file"""
    with open(filepath, 'r') as f:
        return f.read()

def create_worker_js(all_tools_html, converter_html):
    """Create worker.js with embedded HTML pages and routing"""
    # Use JSON encoding to properly escape the HTML
    all_tools_json = json.dumps(all_tools_html)
    converter_json = json.dumps(converter_html)
    
    # Service Worker format with routing
    worker_code = f"""const ALL_TOOLS_HTML = {all_tools_json};
const CONVERTER_HTML = {converter_json};

addEventListener('fetch', event => {{
  event.respondWith(handleRequest(event.request));
}});

async function handleRequest(request) {{
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Route handling
  let html;
  if (path === '/' || path === '') {{
    // Landing page - All Tools
    html = ALL_TOOLS_HTML;
  }} else if (path === '/dark-mode-converter' || path === '/dark-mode-converter/') {{
    // Dark Mode Converter tool
    html = CONVERTER_HTML;
  }} else {{
    // 404 - redirect to home
    return Response.redirect(url.origin + '/', 302);
  }}
  
  return new Response(html, {{
    headers: {{ 
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "public, max-age=3600"
    }},
  }});
}}"""
    
    return worker_code

def save_worker_js(worker_code):
    """Save worker.js file"""
    with open(WORKER_JS, 'w') as f:
        f.write(worker_code)
    print(f"✓ Updated {WORKER_JS}")

def deploy_to_cloudflare(worker_code):
    """Deploy worker to Cloudflare Workers"""
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/workers/scripts/{WORKER_NAME}"
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/javascript",
    }
    
    print(f"\n🚀 Deploying to Cloudflare Workers...")
    print(f"   Worker: {WORKER_NAME}")
    print(f"   Account: {ACCOUNT_ID}")
    
    response = requests.put(url, headers=headers, data=worker_code)
    
    if response.status_code in [200, 201]:
        print(f"✅ Successfully deployed to Cloudflare Workers")
        print(f"   URL: https://{WORKER_NAME}.zone99.workers.dev")
        print(f"   Custom domain: https://tools.gamaleldien.com")
        return True
    else:
        print(f"❌ Deployment failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return False

def main():
    print("🎨 Tools Website - Build & Deploy")
    print("=" * 60)
    
    # Read HTML files
    print(f"\n📖 Reading HTML files...")
    all_tools = read_file(ALL_TOOLS_HTML)
    converter = read_file(CONVERTER_HTML)
    print(f"   All Tools: {len(all_tools):,} bytes")
    print(f"   Converter: {len(converter):,} bytes")
    
    # Create worker.js
    print(f"\n📦 Creating worker.js with routing...")
    print(f"   Routes:")
    print(f"   • / → All Tools landing page")
    print(f"   • /dark-mode-converter → Dark Mode Converter")
    worker_code = create_worker_js(all_tools, converter)
    
    # Save worker.js
    save_worker_js(worker_code)
    
    # Deploy to Cloudflare
    success = deploy_to_cloudflare(worker_code)
    
    print("\n" + "=" * 60)
    if success:
        print("✅ Build and deployment complete!")
        print(f"\n🌐 Live at:")
        print(f"   • https://tools.gamaleldien.com/")
        print(f"   • https://tools.gamaleldien.com/dark-mode-converter")
    else:
        print("❌ Deployment failed. Check errors above.")
        exit(1)

if __name__ == "__main__":
    main()
