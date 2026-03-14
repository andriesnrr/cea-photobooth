from PIL import Image
import struct, io, os

logo = Image.open(r'd:\NextJS\cea-photobooth\public\logo.png').convert('RGBA')

# Create resized images
sizes_list = [16, 32, 48, 64]
images = []
for s in sizes_list:
    images.append(logo.resize((s, s), Image.LANCZOS))

# Save each as PNG buffer
png_buffers = []
for img in images:
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    png_buffers.append(buf.getvalue())

# Build ICO file manually
num_images = len(sizes_list)
header = struct.pack('<HHH', 0, 1, num_images)

data_offset = 6 + num_images * 16
entries = b''
image_data = b''

for i, (s, buf) in enumerate(zip(sizes_list, png_buffers)):
    w = s if s < 256 else 0
    h = s if s < 256 else 0
    entry = struct.pack('<BBBBHHII',
        w, h, 0, 0, 1, 32,
        len(buf),
        data_offset + len(image_data)
    )
    entries += entry
    image_data += buf

ico_data = header + entries + image_data

with open(r'd:\NextJS\cea-photobooth\public\favicon.ico', 'wb') as f:
    f.write(ico_data)

size = os.path.getsize(r'd:\NextJS\cea-photobooth\public\favicon.ico')
print(f'New favicon.ico: {size} bytes')

# Also regenerate PWA icons
for s, name in [(192, 'icon-192.png'), (512, 'icon-512.png'), (180, 'apple-touch-icon.png')]:
    resized = logo.resize((s, s), Image.LANCZOS)
    resized.save(os.path.join(r'd:\NextJS\cea-photobooth\public', name), format='PNG')
    fsize = os.path.getsize(os.path.join(r'd:\NextJS\cea-photobooth\public', name))
    print(f'{name}: {fsize} bytes')

print('Done!')
