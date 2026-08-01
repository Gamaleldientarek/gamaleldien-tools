from PIL import Image, ImageDraw, ImageFont
import os

# Configuration
OUTPUT_DIR = "/root/clawd/projects/business/gamaleldien.com/tools/landing/"
FONT_DIR = "/usr/local/share/fonts/clash-display/"
BG_COLOR = "#0a0a0a"
ACCENT_COLOR = "#E16105"  # Gamal Orange
TEXT_COLOR = "#FFFFFF"
SUBTEXT_COLOR = "#888888"
BLUE_ACCENT = "#0055FF" # Secondary brand color

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_og_image(width, height, filename):
    img = Image.new('RGB', (width, height), color=BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Load Fonts
    try:
        font_title = ImageFont.truetype(os.path.join(FONT_DIR, "ClashDisplay-Bold.otf"), 90)
        font_subtitle = ImageFont.truetype(os.path.join(FONT_DIR, "ClashDisplay-Medium.otf"), 32)
        font_footer = ImageFont.truetype(os.path.join(FONT_DIR, "ClashDisplay-Medium.otf"), 20)
        font_tag = ImageFont.truetype(os.path.join(FONT_DIR, "ClashDisplay-Semibold.otf"), 16)
    except OSError:
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()
        font_footer = ImageFont.load_default()
        font_tag = ImageFont.load_default()

    # --- Background Pattern (Subtle Grid) ---
    grid_size = 40
    grid_color = "#111111"
    for x in range(0, width, grid_size):
        draw.line([(x, 0), (x, height)], fill=grid_color, width=1)
    for y in range(0, height, grid_size):
        draw.line([(0, y), (width, y)], fill=grid_color, width=1)

    # --- Footer Bar ---
    footer_height = 60
    draw.rectangle([(0, height - footer_height), (width, height)], fill="#0f0f0f")
    
    # Footer Text
    footer_padding = 40
    draw.text((footer_padding, height - footer_height + 20), "TOOLS.GAMALELDIEN.COM", font=font_footer, fill=SUBTEXT_COLOR)
    
    right_text = "BY GAMAL ELDIEN"
    bbox = draw.textbbox((0, 0), right_text, font=font_footer)
    text_width = bbox[2] - bbox[0]
    draw.text((width - footer_padding - text_width, height - footer_height + 20), right_text, font=font_footer, fill=SUBTEXT_COLOR)

    # --- Main Content Layout ---
    content_start_x = 100
    
    # Dynamic Y positioning based on height to center content
    # Calculating content height roughly
    # Title (2 lines ~220px) + Subtitle (~40px) + Tags (~40px) = ~300px
    content_start_y = (height - 300) // 2 

    # Title Line 1
    draw.text((content_start_x, content_start_y), "DESIGN &", font=font_title, fill=TEXT_COLOR)
    
    # Title Line 2 (Colored)
    bbox_line1 = draw.textbbox((0, 0), "DESIGN &", font=font_title)
    line_height = bbox_line1[3] - bbox_line1[1] + 20 # Spacing
    draw.text((content_start_x, content_start_y + line_height), "DEV TOOLS", font=font_title, fill=ACCENT_COLOR)

    # Subtitle
    subtitle_y = content_start_y + (line_height * 2) + 10
    draw.text((content_start_x, subtitle_y), "Professional utilities for modern creators", font=font_subtitle, fill=SUBTEXT_COLOR)

    # Tags
    tags = ["OPEN SOURCE", "FREE", "NO ADS"]
    tag_start_y = subtitle_y + 80
    current_x = content_start_x
    
    for tag in tags:
        bbox_tag = draw.textbbox((0, 0), tag, font=font_tag)
        t_width = bbox_tag[2] - bbox_tag[0] + 30
        t_height = bbox_tag[3] - bbox_tag[1] + 16
        
        # Pill Background
        draw.rounded_rectangle(
            [current_x, tag_start_y, current_x + t_width, tag_start_y + t_height],
            radius=20, outline="#333333", width=1, fill="#111111"
        )
        
        # Tag Text centering
        text_w = bbox_tag[2] - bbox_tag[0]
        text_h = bbox_tag[3] - bbox_tag[1]
        text_x = current_x + (t_width - text_w) / 2
        text_y = tag_start_y + (t_height - text_h) / 2 - 2
        
        draw.text((text_x, text_y), tag, font=font_tag, fill="#AAAAAA")
        current_x += t_width + 15

    # --- Abstract Visuals (Right Side) ---
    # Only adding complex visuals if there's enough width (avoid cramping square version)
    if width > 800:
        visual_center_x = width - 300
        visual_center_y = height // 2
        
        # 1. Circle (Sun/Moon/Color Wheel abstract)
        draw.ellipse([visual_center_x - 100, visual_center_y - 100, visual_center_x + 100, visual_center_y + 100], outline="#222222", width=2)
        
        # 2. Color Palette Swatches (Floating)
        swatch_w, swatch_h = 60, 60
        swatch_colors = [ACCENT_COLOR, "#FFFFFF", BLUE_ACCENT]
        offsets = [(-80, -40), (40, -80), (-20, 60)] # (x, y) relative to center
        
        for i, color in enumerate(swatch_colors):
            ox, oy = offsets[i]
            sx = visual_center_x + ox
            sy = visual_center_y + oy
            draw.rounded_rectangle([sx, sy, sx + swatch_w, sy + swatch_h], radius=12, fill=color)

    # Save
    save_path = os.path.join(OUTPUT_DIR, filename)
    img.save(save_path)
    print(f"Saved: {save_path}")

# Generate
create_og_image(1200, 630, "og-image.png")
create_og_image(1200, 1200, "og-image-square.png")
