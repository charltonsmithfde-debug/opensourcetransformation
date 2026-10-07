import os
from playwright.sync_api import sync_playwright

def render_slides():
    html_file = os.path.abspath("case-studies/02-aws-ducklabs-acquisition/carousel/src/slides.html")
    export_dir = os.path.abspath("case-studies/02-aws-ducklabs-acquisition/carousel/exports")
    os.makedirs(export_dir, exist_ok=True)
    
    file_url = f"file:///{html_file.replace(os.sep, '/')}"
    print(f"Loading {file_url}...")

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(
            viewport={"width": 1080, "height": 1920},
            device_scale_factor=1
        )
        page.goto(file_url)
        page.wait_for_load_state("networkidle")
        
        # Ensure Inter fonts are fully loaded
        page.evaluate("document.fonts.ready")
        
        for i in range(1, 9):
            selector = f"#slide-{i}"
            slide_elem = page.locator(selector)
            out_path = os.path.join(export_dir, f"slide_{i:02d}.png")
            
            slide_elem.screenshot(path=out_path)
            print(f"Exported Slide {i:02d}: {out_path}")
            
        browser.close()
        print("All 8 TikTok slides exported successfully!")

if __name__ == "__main__":
    render_slides()
