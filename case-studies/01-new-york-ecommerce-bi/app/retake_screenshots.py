import subprocess
import os
import shutil

SCREENSHOTS_DIR = "/mnt/c/Users/G988557/Documents/Code/antigravity/linkedln/thin-web-app/screenshots"
GIT_SCREENSHOTS_DIR = "/mnt/c/Users/G988557/Documents/Code/antigravity/opensourcetransformation/thin-web-app/screenshots"
BRAIN_DIR = "/mnt/c/Users/G988557/.gemini/antigravity-ide/brain/e4728991-5484-4eb9-b5d6-429aa2b81e55"

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(GIT_SCREENSHOTS_DIR, exist_ok=True)

base_url = "http://localhost:8085"

# 1. Executive Hero View (1920x1080)
hero_file = os.path.join(SCREENSHOTS_DIR, "executive_hero_view.png")
print("Capturing Executive Hero View (1920x1080)...")
subprocess.run([
    "chromium",
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--window-size=1920,1080",
    "--virtual-time-budget=3000",
    f"--screenshot={hero_file}",
    base_url
], check=True)
shutil.copyfile(hero_file, os.path.join(GIT_SCREENSHOTS_DIR, "executive_hero_view.png"))
shutil.copyfile(hero_file, os.path.join(BRAIN_DIR, "executive_hero_view.png"))
print("  -> Saved Executive Hero View!")

# 2. 9:16 Mobile View (1080x1920)
mobile_file = os.path.join(SCREENSHOTS_DIR, "executive_hero_9_16_mobile.png")
print("Capturing 9:16 Mobile Portrait View (1080x1920)...")
subprocess.run([
    "chromium",
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--window-size=1080,1920",
    "--virtual-time-budget=3000",
    f"--screenshot={mobile_file}",
    base_url
], check=True)
shutil.copyfile(mobile_file, os.path.join(GIT_SCREENSHOTS_DIR, "executive_hero_9_16_mobile.png"))
shutil.copyfile(mobile_file, os.path.join(BRAIN_DIR, "executive_hero_9_16_mobile.png"))
print("  -> Saved 9:16 Mobile Portrait View!")

# 3. Also retake full longform view (1800x2100) for completeness
longform_file = os.path.join(SCREENSHOTS_DIR, "05_full_dashboard_longform.png")
print("Capturing Full Longform View (1800x2100)...")
subprocess.run([
    "chromium",
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--window-size=1800,2100",
    "--virtual-time-budget=3000",
    f"--screenshot={longform_file}",
    base_url
], check=True)
shutil.copyfile(longform_file, os.path.join(GIT_SCREENSHOTS_DIR, "05_full_dashboard_longform.png"))
shutil.copyfile(longform_file, os.path.join(BRAIN_DIR, "05_full_dashboard_longform.png"))
print("  -> Saved Full Longform View!")

print("\nDone retaking all requested views!")
