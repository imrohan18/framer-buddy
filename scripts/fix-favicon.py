import numpy as np
from PIL import Image, ImageDraw

banner_path = 'E:/StartUp/framer-buddy/public/hyrux-logo-banner.jpg'
img = Image.open(banner_path).convert('RGB')
arr = np.array(img, dtype=np.float32)
bg_color = np.median(arr[:40, :40, :], axis=(0, 1))

ha_isolated = img.copy()
ha_draw = ImageDraw.Draw(ha_isolated)
bg_tuple = (int(bg_color[0]), int(bg_color[1]), int(bg_color[2]))

# Erase the entire right area where Y starts
# Ha's stem drops at x~350-400, belly loops back to x~400-430
# Erase everything for x >= 445 down to y=420, and x >= 460 down to y=520
ha_draw.rectangle([440, 280, img.width, 410], fill=bg_tuple)
ha_draw.rectangle([460, 410, img.width, 515], fill=bg_tuple)
ha_draw.rectangle([505, 0, img.width, img.height], fill=bg_tuple)

# Find exact bbox of isolated Ha
arr_iso = np.array(ha_isolated)
mask_iso = (arr_iso[:, :, 0] < 120) & (arr_iso[:, :, 1] < 120) & (arr_iso[:, :, 2] < 120)
y_i, x_i = np.where(mask_iso)
min_x, max_x = int(x_i.min()), int(x_i.max())
min_y, max_y = int(y_i.min()), int(y_i.max())
print(f'Isolated Ha bbox: X({min_x} to {max_x}), Y({min_y} to {max_y}), W={max_x-min_x}, H={max_y-min_y}')

cx = (min_x + max_x) // 2
cy = (min_y + max_y) // 2
half_size = int(max(max_x - min_x, max_y - min_y) * 0.65)

x1 = cx - half_size
x2 = cx + half_size
y1 = cy - half_size
y2 = cy + half_size

ha_crop = ha_isolated.crop((x1, y1, x2, y2)).resize((512, 512), Image.Resampling.LANCZOS)

mask = Image.new('L', (512, 512), 0)
draw = ImageDraw.Draw(mask)
draw.rounded_rectangle((0, 0, 512, 512), radius=120, fill=255)

favicon_img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
favicon_img.paste(ha_crop, (0, 0), mask=mask)
favicon_img.save('E:/StartUp/framer-buddy/public/favicon.png', 'PNG')
favicon_img.save('E:/StartUp/framer-buddy/public/apple-touch-icon.png', 'PNG')

import base64
with open('E:/StartUp/framer-buddy/public/favicon.png', 'rb') as f:
    b64_fav = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="64" height="64">
  <image href="data:image/png;base64,{b64_fav}" width="512" height="512" />
</svg>'''

with open('E:/StartUp/framer-buddy/public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print('Clean isolated Ha favicon generated successfully!')
