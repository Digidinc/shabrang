import os
import re
from bs4 import BeautifulSoup
import markdownify

SOURCE_DIR = "/opt/shabrang/repo/Book/"
TARGET_DIR = "../shabrang-cms/content/en/books/the-liquid-fortress/"

# Define order for special files
SPECIAL_ORDER = {
    "preface.html": 0,
    "introduction.html": 1,
    "conclusion.html": 99,
    "appendices.html": 100
}

def get_order(filename):
    if filename in SPECIAL_ORDER:
        return SPECIAL_ORDER[filename]
    match = re.search(r'chapter(\d+)', filename)
    if match:
        # Chapters start at 2 to leave room for preface/intro
        return int(match.group(1)) + 1
    return 999

def convert_chapter(filename):
    source_path = os.path.join(SOURCE_DIR, filename)
    if not os.path.exists(source_path):
        print(f"Skipping {filename} (not found)")
        return

    with open(source_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Extract Title
    title_tag = soup.find('title')
    title = title_tag.text.split('—')[0].strip() if title_tag else filename.replace('.html', '').replace('-', ' ').title()
    
    # Extract Content - focus on article or container
    content_div = soup.find('article', class_='chapter-content')
    if not content_div:
        content_div = soup.find('div', class_='container')
        
    # Clean up navigation/headers if taking the whole container
    if content_div:
        for tag in content_div.find_all(['nav', 'header', 'div'], class_=['nav-footer', 'sticky-header', 'audio-player-bar']):
            tag.decompose()
        # Remove the first H1 as it will be in frontmatter
        h1 = content_div.find('h1')
        if h1:
            h1.decompose()
            
    raw_html = str(content_div) if content_div else ""
    
    # Convert to Markdown
    md_content = markdownify.markdownify(raw_html, heading_style="ATX")
    
    # Clean up excessive newlines
    md_content = re.sub(r'\n{3,}', '\n\n', md_content).strip()

    # Determine ID and Filename
    slug = filename.replace('.html', '')
    md_filename = f"{slug}.md"
    
    # YAML Frontmatter
    frontmatter = f"""---
id: {slug}
title: "{title}" 
book: the-liquid-fortress
order: {get_order(filename)}
---

"""
    
    # Write to target
    target_path = os.path.join(TARGET_DIR, md_filename)
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(frontmatter + md_content)
    
    print(f"Converted {filename} -> {md_filename}")

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith('.html') and f != 'index.html']
    # Sort to ensure we process in a logical order
    files.sort(key=lambda x: get_order(x))
    
    for file in files:
        convert_chapter(file)

if __name__ == "__main__":
    main()