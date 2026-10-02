import subprocess
import os
import shutil

SCREENSHOTS_DIR = "/mnt/c/Users/G988557/Documents/Code/antigravity/linkedln/thin-web-app/screenshots"
BRAIN_DIR = "/mnt/c/Users/G988557/.gemini/antigravity-ide/brain/e4728991-5484-4eb9-b5d6-429aa2b81e55"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

targets = [
    {
        "name": "01_executive_dashboard_hero.png",
        "width": 1920,
        "height": 1080,
        "desc": "Full 1080p Executive Command Center View"
    },
    {
        "name": "02_kpi_cards_and_telemetry.png",
        "width": 1800,
        "height": 650,
        "desc": "Close-up of Scaled KPI Cards & Real-time DuckLake Telemetry"
    },
    {
        "name": "03_metabase_charts_grid.png",
        "width": 1800,
        "height": 1100,
        "desc": "Multi-Channel & Category Revenue Distribution Visualizations"
    },
    {
        "name": "04_cosmetics_sku_catalog_table.png",
        "width": 1800,
        "height": 950,
        "desc": "Cosmetics SKU Catalog Depth & Conversion Rate Table"
    },
    {
        "name": "05_full_dashboard_longform.png",
        "width": 1800,
        "height": 2100,
        "desc": "Complete End-to-End Vertical Dashboard Layout"
    }
]

base_url = "http://localhost:8085"

for t in targets:
    out_file = os.path.join(SCREENSHOTS_DIR, t["name"])
    print(f"Capturing: {t['name']} ({t['width']}x{t['height']})...")
    cmd = [
        "chromium",
        "--headless",
        "--no-sandbox",
        "--disable-gpu",
        f"--window-size={t['width']},{t['height']}",
        "--virtual-time-budget=3000",
        f"--screenshot={out_file}",
        base_url
    ]
    subprocess.run(cmd, check=True)
    brain_dest = os.path.join(BRAIN_DIR, t["name"])
    shutil.copyfile(out_file, brain_dest)
    print(f"  -> Saved to: {out_file} and brain artifact")

print("\nAll 5 dashboard screenshots captured successfully!")
