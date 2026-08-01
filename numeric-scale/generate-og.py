#!/usr/bin/env python3
"""Generate OG image for Numeric Scale Generator tool"""

from PIL import Image, ImageDraw, ImageFont
import os

# Dimensions
WIDTH = 1200
HEIGHT = 630

# Colors
BG_COLOR = (10, 10, 10)  # #0a0a0a
TEXT_COLOR = (255, 255, 255)
ACCENT_COLOR = (225, 97, 5)  # #e16105
TEXT_MUTED = (128, 128, 128)

# Create image
img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
draw = ImageDraw.Draw(img)

# Load fonts
font_path_bold = '/usr/local/share/fonts/clash-display/ClashDisplay-Bold.otf'
font_path_medium = '/usr/local/share/fonts/clash-display/ClashDisplay-Medium.otf'

try:
    font_title = ImageFont.truetype(font_path_bold, 84)
    font_subtitle = ImageFont.truetype(font_path_medium, 36)
    font_numbers = ImageFont.truetype(font_path_bold, 32)
except Exception as e:
    print(f"Font loading error: {e}")
    font_title = ImageFont.load_default()
    font_subtitle = ImageFont.load_default()
    font_numbers = ImageFont.load_default()

# Title
title_text = "NUMERIC SCALE"
title_text2 = "GENERATOR"
title_y = 180

# Get text bounding boxes
bbox_title = draw.textbbox((0, 0), title_text, font=font_title)
title_width = bbox_title[2] - bbox_title[0]
title_x = (WIDTH - title_width) // 2

bbox_title2 = draw.textbbox((0, 0), title_text2, font=font_title)
title2_width = bbox_title2[2] - bbox_title2[0]
title2_x = (WIDTH - title2_width) // 2

# Draw title
draw.text((title_x, title_y), title_text, fill=TEXT_COLOR, font=font_title)
draw.text((title2_x, title_y + 90), title_text2, fill=ACCENT_COLOR, font=font_title)

# Subtitle
subtitle_text = "Generate Figma numeric variables"
bbox_subtitle = draw.textbbox((0, 0), subtitle_text, font=font_subtitle)
subtitle_width = bbox_subtitle[2] - bbox_subtitle[0]
subtitle_x = (WIDTH - subtitle_width) // 2
draw.text((subtitle_x, title_y + 210), subtitle_text, fill=TEXT_MUTED, font=font_subtitle)

# Visual element: numeric scale representation
# Draw a series of numbers with increasing sizes
numbers = [8, 16, 24, 32, 40, 48]
start_x = 120
base_y = 450
spacing = 170

for i, num in enumerate(numbers):
    x = start_x + (i * spacing)
    # Draw number
    num_text = str(num)
    draw.text((x, base_y), num_text, fill=ACCENT_COLOR, font=font_numbers)
    
    # Draw horizontal line under the number
    line_y = base_y + 50
    line_width = 60
    draw.rectangle(
        [x, line_y, x + line_width, line_y + 3],
        fill=ACCENT_COLOR
    )

# Add decorative elements - dots connecting numbers
dot_y = base_y + 52
for i in range(len(numbers) - 1):
    x1 = start_x + (i * spacing) + 70
    x2 = start_x + ((i + 1) * spacing) - 10
    
    # Draw connecting line
    draw.line([(x1, dot_y), (x2, dot_y)], fill=(225, 97, 5, 50), width=2)

# Footer text
footer_text = "TOOLS.GAMALELDIEN.COM"
footer_font = ImageFont.truetype(font_path_medium, 18)
bbox_footer = draw.textbbox((0, 0), footer_text, font=footer_font)
footer_width = bbox_footer[2] - bbox_footer[0]
footer_x = (WIDTH - footer_width) // 2
draw.text((footer_x, HEIGHT - 60), footer_text, fill=TEXT_MUTED, font=footer_font)

# Save image
output_path = '/root/clawd/projects/business/gamaleldien.com/tools/numeric-scale/og-image.png'
img.save(output_path, 'PNG', optimize=True)
print(f"✓ OG image saved to: {output_path}")
