import os
import subprocess
from PIL import Image

BASE_DIR = r"c:\Users\G988557\Documents\Code\antigravity\linkedln\case-studies\01-new-york-ecommerce-bi\carousel"
SRC_DIR = os.path.join(BASE_DIR, "src")
EXPORTS_DIR = os.path.join(BASE_DIR, "exports")

os.makedirs(EXPORTS_DIR, exist_ok=True)

# WSL paths
WSL_SRC = "/mnt/c/Users/G988557/Documents/Code/antigravity/linkedln/case-studies/01-new-york-ecommerce-bi/carousel/src"
WSL_EXPORTS = "/mnt/c/Users/G988557/Documents/Code/antigravity/linkedln/case-studies/01-new-york-ecommerce-bi/carousel/exports"

image_files = []

for i in range(1, 12):
    src_html = f"{WSL_SRC}/slide_{i}.html"
    dest_png = f"{WSL_EXPORTS}/slide_{i}.png"
    win_png = os.path.join(EXPORTS_DIR, f"slide_{i}.png")
    image_files.append(win_png)
    
    cmd = [
        "wsl", "-d", "Debian", "-u", "charlton", "--", "bash", "-c",
        f"chromium --headless --disable-gpu --ignore-certificate-errors --hide-scrollbars --window-size=1080,1350 --screenshot={dest_png} file://{src_html}"
    ]
    print(f"Rendering slide {i} of 11...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error on slide {i}: {res.stderr}")
    else:
        print(f"Slide {i} rendered successfully ({os.path.getsize(win_png) if os.path.exists(win_png) else 0} bytes).")

# Compile to PDF
pdf_path = os.path.join(EXPORTS_DIR, "Charlton_Smith_Open_Lakehouse_BI_Carousel.pdf")
print("Compiling all 11 slides into PDF...")

pil_images = []
for p in image_files:
    if os.path.exists(p):
        img = Image.open(p).convert("RGB")
        pil_images.append(img)
    else:
        print(f"Warning: {p} not found!")

if pil_images:
    first_img = pil_images[0]
    first_img.save(
        pdf_path,
        save_all=True,
        append_images=pil_images[1:],
        resolution=150.0
    )
    print(f"PDF successfully created at: {pdf_path} ({os.path.getsize(pdf_path)} bytes)")
else:
    print("No images found to compile PDF.")
