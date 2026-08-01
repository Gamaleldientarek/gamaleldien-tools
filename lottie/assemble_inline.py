import re
import json
import os

BASE_DIR = "/root/clawd/projects/business/gamaleldien.com/tools/lottie-previewer/v3"
JSON_PATH = "/root/clawd/projects/business/gamaleldien.com/tools/lottie-previewer/v3/samples/shopping-cart.json"
OUTPUT_FILE = "/root/clawd/projects/business/gamaleldien.com/tools/lottie-previewer/index-inline.html"

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def process_js(content):
    # Remove import lines (must start at beginning of line)
    content = re.sub(r'^import\s+.*$', '', content, flags=re.MULTILINE)
    # Remove export { ... } statements
    content = re.sub(r'^export\s*\{[^}]*\};?\s*$', '', content, flags=re.MULTILINE)
    # Remove export keywords from declarations (handling async too)
    content = re.sub(r'^export\s+(async\s+)?(function|class|const|let|var)', r'\1\2', content, flags=re.MULTILINE)
    # Just in case, simple replace for specific failures
    content = content.replace('export default ', '')
    return content

# 1. Read files
html = read_file(os.path.join(BASE_DIR, "index.html"))
css = read_file(os.path.join(BASE_DIR, "styles.css"))
js_color = read_file(os.path.join(BASE_DIR, "js/color-utils.js"))
js_layer = read_file(os.path.join(BASE_DIR, "js/layer-parser.js"))
js_exporter = read_file(os.path.join(BASE_DIR, "js/exporter.js"))
js_color_extractor = read_file(os.path.join(BASE_DIR, "js/color-extractor.js"))  # P2: Color extraction module
js_app = read_file(os.path.join(BASE_DIR, "js/app.js"))
sample_json = read_file(JSON_PATH)

# 2. Process JS
# Clean up modules
js_color = process_js(js_color)
js_layer = process_js(js_layer)
js_exporter = process_js(js_exporter)
js_color_extractor = process_js(js_color_extractor)  # P2
js_app = process_js(js_app)

# Inject JSON
embedded_json_script = f"const EMBEDDED_SAMPLE_ANIMATION = {sample_json};\n"

# Modify app.js to use embedded JSON
js_app = js_app.replace("const SAMPLE_ANIMATION_URL = 'samples/shopping-cart.json';", "const SAMPLE_ANIMATION_URL = null;")

# Custom logic for loadSampleAnimation replacement
load_sample_pattern = r"async function loadSampleAnimation\(\)\s*\{[\s\S]*?catch"
load_sample_replacement = """async function loadSampleAnimation() {
    try {
        showToast('Loading sample...');
        
        // Use embedded data
        const data = deepClone(EMBEDDED_SAMPLE_ANIMATION);

        // Validate Lottie structure
        if (!data.v || !data.layers) {
            showToast('Invalid sample file');
            return;
        }

        loadAnimation(data, 'shopping-cart.json');
    } catch"""

js_app = re.sub(load_sample_pattern, load_sample_replacement, js_app)

# Combine JS (order matters: dependencies first, then app last)
full_js = f"{embedded_json_script}\n{js_color}\n{js_layer}\n{js_exporter}\n{js_color_extractor}\n{js_app}"

# 3. Process HTML
# Inline CSS
html = html.replace('<link rel="stylesheet" href="styles.css">', f'<style>\n{css}\n</style>')

# Inline JS
html = html.replace('<script type="module" src="js/app.js"></script>', f'<script>\n{full_js}\n</script>')

# Add GA
ga_tag = """<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-KSQ52DZN13"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-KSQ52DZN13');
</script>
"""
html = html.replace('</head>', f'{ga_tag}</head>')

# Update OG Tags
html = html.replace('content="https://tools.gamaleldien.com/lottie/color-editor"', 'content="https://tools.gamaleldien.com/lottie"')

# Ensure OG/Twitter Image
og_image_tag = '<meta property="og:image" content="https://tools.gamaleldien.com/lottie/og-image.png">'
twitter_image_tag = '<meta name="twitter:image" content="https://tools.gamaleldien.com/lottie/og-image.png">'

# Check if they exist, if not add them, if so replace them
if '<meta property="og:image"' not in html:
    html = html.replace('<meta property="og:type"', f'{og_image_tag}\n    <meta property="og:type"')
else:
    html = re.sub(r'<meta property="og:image" content="[^"]*">', og_image_tag, html)

if '<meta name="twitter:image"' not in html:
    html = html.replace('<meta name="twitter:card"', f'{twitter_image_tag}\n    <meta name="twitter:card"')
else:
    html = re.sub(r'<meta name="twitter:image" content="[^"]*">', twitter_image_tag, html)


# 4. Write Output
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(html)

print("Assembly complete.")
