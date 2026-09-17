import numpy as np
from PIL import Image, ImageDraw, ImageFilter

banner_path = 'E:/StartUp/framer-buddy/public/hyrux-logo-banner.jpg'
img = Image.open(banner_path).convert('RGB')
arr = np.array(img, dtype=np.float32)

# Sample background color from top-left corner
bg_color = np.median(arr[:40, :40, :], axis=(0, 1))
print(f'Detected background color: RGB({bg_color[0]:.1f}, {bg_color[1]:.1f}, {bg_color[2]:.1f})')

# 1. GENERATE HYRUX-LOGO-CARD.PNG (balanced crop of full logo with padding)
# Logo bounding box: X(224 to 1017), Y(262 to 585)
pad_x = 70
pad_y = 55
x1 = max(0, 224 - pad_x)
x2 = min(img.width, 1017 + pad_x)
y1 = max(0, 262 - pad_y)
y2 = min(img.height, 585 + pad_y)

logo_crop = img.crop((x1, y1, x2, y2))
logo_crop.save('E:/StartUp/framer-buddy/public/hyrux-logo-card.png', 'PNG', quality=95)
print(f'Saved hyrux-logo-card.png with size: {logo_crop.size}')

# 2. GENERATE HYRUX-LOGO-TRANSPARENT.PNG (keyed background with smooth alpha)
# Calculate distance from background color
crop_arr = np.array(logo_crop, dtype=np.float32)
dist = np.sqrt(np.sum((crop_arr - bg_color) ** 2, axis=2))

# Anything very close to bg_color is transparent (alpha = 0)
# Dark pixels (dist high) are opaque (alpha = 255)
# Smooth threshold between dist 15 and dist 95
alpha = np.clip((dist - 15.0) / (95.0 - 15.0), 0.0, 1.0) * 255.0

# Set RGB of text to clean dark charcoal #080808 to avoid blue halo
r_out = np.clip(crop_arr[:, :, 0] * (1.0 - (1.0 - alpha/255.0)*0.5), 0, 255)
g_out = np.clip(crop_arr[:, :, 1] * (1.0 - (1.0 - alpha/255.0)*0.5), 0, 255)
b_out = np.clip(crop_arr[:, :, 2] * (1.0 - (1.0 - alpha/255.0)*0.5), 0, 255)

rgba = np.dstack((r_out, g_out, b_out, alpha)).astype(np.uint8)
trans_logo = Image.fromarray(rgba, 'RGBA')
trans_logo.save('E:/StartUp/framer-buddy/public/hyrux-logo-transparent.png', 'PNG')
print(f'Saved hyrux-logo-transparent.png')

# 3. GENERATE FAVICON FROM THE CALLIGRAPHIC 'ह'
# Ha bbox: X(224 to 524), Y(262 to 585) -> size ~ 300x323
ha_cx = (224 + 524) // 2
ha_cy = (262 + 585) // 2
ha_radius = int(max(524 - 224, 585 - 262) * 0.72)

ha_x1 = max(0, ha_cx - ha_radius)
ha_y1 = max(0, ha_cy - ha_radius)
ha_x2 = min(img.width, ha_cx + ha_radius)
ha_y2 = min(img.height, ha_cy + ha_radius)

ha_square = img.crop((ha_x1, ha_y1, ha_x2, ha_y2)).resize((512, 512), Image.Resampling.LANCZOS)

# Create rounded squircle mask
mask = Image.new('L', (512, 512), 0)
draw = ImageDraw.Draw(mask)
draw.rounded_rectangle((0, 0, 512, 512), radius=110, fill=255)

favicon_img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
favicon_img.paste(ha_square, (0, 0), mask=mask)
favicon_img.save('E:/StartUp/framer-buddy/public/favicon.png', 'PNG')
favicon_img.save('E:/StartUp/framer-buddy/public/apple-touch-icon.png', 'PNG')
print(f'Saved favicon.png and apple-touch-icon.png')

# 4. Also generate favicon.svg embedding this exact favicon
import base64
with open('E:/StartUp/framer-buddy/public/favicon.png', 'rb') as f:
    b64_fav = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="64" height="64">
  <image href="data:image/png;base64,{b64_fav}" width="512" height="512" />
</svg>'''

with open('E:/StartUp/framer-buddy/public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)
print('Updated favicon.svg with the calligraphic Ha favicon')

print('ALL ASSETS GENERATED SUCCESSFULLY!')
