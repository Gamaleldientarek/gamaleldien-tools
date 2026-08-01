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
        font_subtitle = ImageFont.truetype(os.path.join(FONT_DIR, "ClashDisplay-Medium.otf"), 36)
        font_footer = ImageFont.truetype(os.path.join(FONT_DIR, "ClashDisplay-Medium.otf"), 24)
        font_tag = ImageFont.truetype(os.path.join(FONT_DIR, "ClashDisplay-Semibold.otf"), 20)
    except OSError:
        # Fallback if specific font files aren't found (using default)
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()
        font_footer = ImageFont.load_default()
        font_tag = ImageFont.load_default()

    # --- Footer Bar (Background) ---
    footer_height = 60
    footer_bg_color = "#111111"
    draw.rectangle([(0, height - footer_height), (width, height)], fill=footer_bg_color)

    # --- Footer Text ---
    footer_padding = 40
    draw.text((footer_padding, height - footer_height + 18), "TOOLS.GAMALELDIEN.COM", font=font_footer, fill=SUBTEXT_COLOR)
    
    # Right align "BY GAMAL ELDIEN"
    right_text = "BY GAMAL ELDIEN"
    bbox = draw.textbbox((0, 0), right_text, font=font_footer)
    text_width = bbox[2] - bbox[0]
    draw.text((width - footer_padding - text_width, height - footer_height + 18), right_text, font=font_footer, fill=SUBTEXT_COLOR)

    # --- Main Content ---
    
    # Text Position
    start_x = 80
    start_y = height // 2 - 80 

    # Title Line 1
    draw.text((start_x, start_y), "DESIGN &", font=font_title, fill=TEXT_COLOR)
    
    # Title Line 2 (Colored)
    bbox_line1 = draw.textbbox((0, 0), "DESIGN &", font=font_title)
    line_height = bbox_line1[3] - bbox_line1[1] + 15
    draw.text((start_x, start_y + line_height), "DEV TOOLS", font=font_title, fill=ACCENT_COLOR)

    # Subtitle
    subtitle_y = start_y + (line_height * 2) + 10
    draw.text((start_x, subtitle_y), "Professional utilities for modern creators", font=font_subtitle, fill=SUBTEXT_COLOR)

    # --- Abstract Graphics (Right Side) ---
    # Representing the tools abstractly
    
    center_x_shapes = width - (width // 4)
    center_y_shapes = height // 2 - 20
    
    # 1. Dark Mode Toggle (Circle/Moon abstract)
    draw.ellipse([center_x_shapes - 100, center_y_shapes - 100, center_x_shapes + 20, center_y_shapes + 20], outline="#333333", width=3)
    draw.ellipse([center_x_shapes - 100, center_y_shapes - 100, center_x_shapes + 20, center_y_shapes + 20], fill=None, outline=None) # Placeholder
    
    # Create a "Moon" shape by drawing a circle and overlapping another
    draw.chord([center_x_shapes - 80, center_y_shapes - 100, center_x_shapes + 40, center_y_shapes + 20], 120, 300, fill=TEXT_COLOR, outline=None)
    
    # 2. Palette (Rectangles)
    rect_start_x = center_x_shapes + 60
    rect_start_y = center_y_shapes - 80
    rect_width = 30
    rect_height = 80
    gap = 15
    
    colors = [ACCENT_COLOR, BLUE_ACCENT, "#FFFFFF"]
    for i, color in enumerate(colors):
        draw.rounded_rectangle(
            [rect_start_x + (i * (rect_width + gap)), rect_start_y + (i * 20), 
             rect_start_x + (i * (rect_width + gap)) + rect_width, rect_start_y + (i * 20) + rect_height],
            radius=5, fill=color
        )

    # 3. Motion/Lottie (Dashed Line / Path)
    # Simple curve
    curve_points = [
        (center_x_shapes - 50, center_y_shapes + 80),
        (center_x_shapes + 50, center_y_shapes + 120),
        (center_x_shapes + 150, center_y_shapes + 80)
    ]
    draw.line(curve_points, fill=SUBTEXT_COLOR, width=4, joint="curve")
    
    # Small dot at end of curve
    draw.ellipse([center_x_shapes + 145, center_y_shapes + 75, center_x_shapes + 155, center_y_shapes + 85], fill=ACCENT_COLOR)

    # --- Tags/Pills ---
    tags = ["OPEN SOURCE", "FREE", "NO ADS"]
    tag_start_x = start_x
    tag_start_y = subtitle_y + 60
    tag_padding_x = 20
    tag_padding_y = 10
    tag_margin = 15
    
    current_x = tag_start_x
    
    for tag in tags:
        bbox_tag = draw.textbbox((0, 0), tag, font=font_tag)
        t_width = bbox_tag[2] - bbox_tag[0]
        t_height = bbox_tag[3] - bbox_tag[1]
        
        # Draw pill background
        draw.rounded_rectangle(
            [current_x, tag_start_y, current_x + t_width + (tag_padding_x * 2), tag_start_y + t_height + (tag_padding_y * 2)],
            radius=20, outline="#333333", width=1, fill="#111111"
        )
        
        # Draw text
        draw.text((current_x + tag_padding_x, tag_start_y + tag_padding_y - 2), tag, font=font_tag, fill="#AAAAAA")
        
        current_x += t_width + (tag_padding_x * 2) + tag_margin

    # Save
    save_path = os.path.join(OUTPUT_DIR, filename)
    img.save(save_path)
    print(f"Saved: {save_path}")

# Generate Images
create_og_image(1200, 630, "og-image.png")
create_og_image(1200, 1200, "og-image-square.png")
