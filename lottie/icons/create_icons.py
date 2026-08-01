import zlib
import struct
import os

def create_png(width, height, pixels):
    """Create a PNG file from pixel data"""
    def make_chunk(chunk_type, data):
        chunk_len = struct.pack('>I', len(data))
        chunk_crc = struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
        return chunk_len + chunk_type + data + chunk_crc
    
    # PNG signature
    signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)  # 8-bit RGBA
    ihdr = make_chunk(b'IHDR', ihdr_data)
    
    # IDAT chunk (compressed pixel data)
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # filter byte
        for x in range(width):
            raw_data += pixels[y * width + x]
    compressed = zlib.compress(raw_data, 9)
    idat = make_chunk(b'IDAT', compressed)
    
    # IEND chunk
    iend = make_chunk(b'IEND', b'')
    
    return signature + ihdr + idat + iend

def create_icon(size, filepath):
    """Create a play button icon"""
    pixels = []
    blue = bytes([21, 93, 252, 255])  # #155DFC
    white = bytes([255, 255, 255, 255])
    transparent = bytes([0, 0, 0, 0])
    
    center = size / 2
    radius = size * 0.45
    
    # Triangle points
    margin = size * 0.32
    t_left = margin
    t_right = size - margin * 0.65
    t_top = margin * 0.75
    t_bottom = size - margin * 0.75
    
    for y in range(size):
        for x in range(size):
            # Check if inside rounded rectangle
            dist_from_center = ((x - center)**2 + (y - center)**2)**0.5
            
            # Simple circle check for rounded corners
            corner_radius = size * 0.15
            in_rect = True
            
            if x < corner_radius and y < corner_radius:
                in_rect = ((x - corner_radius)**2 + (y - corner_radius)**2) <= corner_radius**2
            elif x >= size - corner_radius and y < corner_radius:
                in_rect = ((x - (size - corner_radius))**2 + (y - corner_radius)**2) <= corner_radius**2
            elif x < corner_radius and y >= size - corner_radius:
                in_rect = ((x - corner_radius)**2 + (y - (size - corner_radius))**2) <= corner_radius**2
            elif x >= size - corner_radius and y >= size - corner_radius:
                in_rect = ((x - (size - corner_radius))**2 + (y - (size - corner_radius))**2) <= corner_radius**2
            
            if not in_rect:
                pixels.append(transparent)
                continue
            
            # Check if inside play triangle
            # Triangle: left vertex at (t_left, center), right at (t_right, t_top to t_bottom)
            in_triangle = False
            if t_left <= x <= t_right:
                # Calculate triangle bounds at this x
                progress = (x - t_left) / (t_right - t_left)
                tri_top = center - (center - t_top) * progress
                tri_bottom = center + (t_bottom - center) * progress
                if tri_top <= y <= tri_bottom:
                    in_triangle = True
            
            if in_triangle:
                pixels.append(white)
            else:
                pixels.append(blue)
    
    png_data = create_png(size, size, pixels)
    with open(filepath, 'wb') as f:
        f.write(png_data)

script_dir = os.path.dirname(os.path.abspath(__file__))
create_icon(16, os.path.join(script_dir, "icon16.png"))
create_icon(48, os.path.join(script_dir, "icon48.png"))
create_icon(128, os.path.join(script_dir, "icon128.png"))
print("Icons created!")
