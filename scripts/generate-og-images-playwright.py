#!/usr/bin/env python3
"""
OG Image Generator using Playwright
Generates 1200x630px Open Graph images for Shabrang CMS blog posts and topic pages

Requirements:
    pip install playwright
    playwright install chromium

Usage:
    python3 scripts/generate-og-images-playwright.py
    python3 scripts/generate-og-images-playwright.py --id taarof-game-theory
"""

import json
import os
import sys
from pathlib import Path
from urllib.parse import quote

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("❌ Playwright not installed. Run: pip install playwright")
    print("   Then: playwright install chromium")
    sys.exit(1)


def generate_og_image(playwright_instance, template_path, output_path, title, tagline, category):
    """Generate a single OG image using Playwright"""

    # Encode URL parameters
    url = f"file://{template_path}?title={quote(title)}&tagline={quote(tagline)}&category={quote(category)}"

    browser = playwright_instance.chromium.launch()
    page = browser.new_page(viewport={"width": 1200, "height": 630})

    try:
        page.goto(url, wait_until="networkidle")
        page.wait_for_timeout(1000)  # Wait for fonts to load

        page.screenshot(path=output_path, type="jpeg", quality=90)

        print(f"   ✅ Saved: {os.path.basename(output_path)}")
        return True

    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

    finally:
        browser.close()


def main():
    script_dir = Path(__file__).parent.absolute()
    project_root = script_dir.parent

    data_file = script_dir / "og-image-data.json"
    template_file = script_dir / "og-template.html"
    og_dir = project_root / "public" / "images" / "og"

    # Ensure output directory exists
    og_dir.mkdir(parents=True, exist_ok=True)

    # Load data
    with open(data_file, 'r') as f:
        og_data = json.load(f)

    # Filter by ID if specified
    if len(sys.argv) > 2 and sys.argv[1] == '--id':
        target_id = sys.argv[2]
        og_data = [item for item in og_data if item['id'] == target_id]
        if not og_data:
            print(f"❌ No post found with ID: {target_id}")
            sys.exit(1)

    print("🎨 Generating OG images for Shabrang CMS")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    success_count = 0
    total_count = len(og_data)

    with sync_playwright() as playwright:
        for idx, item in enumerate(og_data, 1):
            post_id = item['id']
            title = item['title']
            tagline = item['tagline']
            category = item['category']
            post_type = item.get('type', 'blog')

            output_path = og_dir / f"{post_id}.jpg"

            print(f"{idx}/{total_count}. {title}")
            print(f"   Type: {post_type} | Category: {category}")

            if generate_og_image(
                playwright,
                str(template_file),
                str(output_path),
                title,
                tagline,
                category
            ):
                success_count += 1

            print()

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"✨ Generated {success_count}/{total_count} OG images")
    print(f"📁 Output directory: {og_dir}")
    print("\n📋 Next steps:")
    print("   1. Review generated images in public/images/og/")
    print("   2. Update blog post frontmatter with: image: /images/og/[post-id].jpg")
    print("   3. Test social sharing with Facebook/Twitter card validators\n")


if __name__ == "__main__":
    main()
