import os
from playwright.sync_api import sync_playwright

html = os.path.abspath("case-studies/02-aws-ducklabs-acquisition/post/post_image.html")
out = os.path.abspath("case-studies/02-aws-ducklabs-acquisition/post/post_image.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1080, "height": 1350})
    page.goto(f"file:///{html.replace(os.sep, '/')}")
    page.wait_for_load_state("networkidle")
    page.screenshot(path=out)
    browser.close()
    print("Rendered:", out)
