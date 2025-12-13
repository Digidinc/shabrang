#!/usr/bin/env python3
"""
Shabrang Engine - Build Script
Transform books into immersive web experiences.

Usage:
    python build.py                    # Build from current directory
    python build.py --source ./book    # Build from specific directory
    python build.py --watch            # Watch mode for development
    python build.py --serve            # Build and serve locally
"""

import os
import sys
import shutil
import json
import subprocess
from pathlib import Path
from datetime import datetime

import yaml
import click
from jinja2 import Environment, FileSystemLoader
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn

console = Console()

# =============================================================================
# CONFIGURATION
# =============================================================================

DEFAULT_CONFIG = {
    'book': {
        'title': 'Untitled Book',
        'author': 'Anonymous',
        'language': 'en',
        'rtl': False,
    },
    'theme': 'alette',
    'palette': {
        'background': '#F5E6C8',
        'text': '#1A1A18',
        'accent1': '#2D5A6B',
        'accent2': '#8B3535',
        'gold': '#C9A227',
        'green': '#3D5C3D',
    },
    'experience': {
        'ambient': {'enabled': True},
        'progress': {'enabled': True},
        'narration': {'enabled': False},
        'animations': {'page_transitions': True},
    },
    'media': {'enabled': True},
    'sharing': {
        'enabled': True,
        'platforms': ['twitter', 'whatsapp', 'telegram', 'copy', 'download'],
    },
    'paywall': {'enabled': False},
    'build': {
        'output_dir': 'dist',
        'source_format': 'html',
        'pwa': {'enabled': True},
    },
}


def deep_merge(base: dict, override: dict) -> dict:
    """Deep merge two dictionaries."""
    result = base.copy()
    for key, value in override.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = deep_merge(result[key], value)
        else:
            result[key] = value
    return result


def load_config(source_dir: Path) -> dict:
    """Load and merge configuration."""
    config = DEFAULT_CONFIG.copy()

    config_file = source_dir / 'config.yaml'
    if config_file.exists():
        with open(config_file, 'r', encoding='utf-8') as f:
            user_config = yaml.safe_load(f) or {}
            config = deep_merge(config, user_config)

    return config


# =============================================================================
# PARSERS
# =============================================================================

def parse_html(file_path: Path) -> dict:
    """Parse an existing HTML chapter file."""
    from bs4 import BeautifulSoup

    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'lxml')

    # Extract title
    title_tag = soup.find('h1')
    title = title_tag.get_text() if title_tag else file_path.stem

    # Extract content (everything inside .container)
    container = soup.find('div', class_='container')
    if container:
        # Remove elements we'll regenerate
        for el in container.find_all(['nav', 'div', 'header'], class_=[
            'nav-footer', 'nav-header', 'sticky-header', 'chapter-header',
            'media-console', 'resource-box'
        ]):
            el.decompose()

        # Remove the first h1 (we'll add it in template)
        first_h1 = container.find('h1')
        if first_h1:
            first_h1.decompose()

        # Remove home icon link at top
        home_link = container.find('a', href='index.html')
        if home_link and home_link.parent:
            home_link.parent.decompose()

        # Get inner HTML without the container div itself
        content = ''.join(str(child) for child in container.children)

        # Extract first paragraph for preview (premium content)
        first_p = container.find('p')
        first_paragraph = str(first_p) if first_p else ''
    else:
        body = soup.find('body')
        content = str(body) if body else ''
        first_paragraph = ''

    return {
        'title': title,
        'content': content,
        'first_paragraph': first_paragraph,
        'slug': file_path.stem,
    }


def parse_markdown(file_path: Path) -> dict:
    """Parse a Markdown file to HTML."""
    import markdown
    from markdown.extensions import codehilite, fenced_code, tables, toc

    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Extract front matter if present
    meta = {}
    if text.startswith('---'):
        parts = text.split('---', 2)
        if len(parts) >= 3:
            meta = yaml.safe_load(parts[1]) or {}
            text = parts[2]

    # Convert to HTML
    md = markdown.Markdown(extensions=[
        'fenced_code',
        'tables',
        'toc',
        'smarty',
        'attr_list',
    ])
    content = md.convert(text)

    title = meta.get('title', file_path.stem.replace('-', ' ').title())

    return {
        'title': title,
        'content': content,
        'slug': file_path.stem,
        'meta': meta,
    }


def parse_latex(file_path: Path, output_dir: Path) -> dict:
    """Convert LaTeX to HTML using Pandoc."""
    output_file = output_dir / f"{file_path.stem}.html"

    try:
        subprocess.run([
            'pandoc',
            str(file_path),
            '-o', str(output_file),
            '--standalone',
            '--mathjax',
        ], check=True, capture_output=True)

        return parse_html(output_file)
    except subprocess.CalledProcessError as e:
        console.print(f"[red]Error converting LaTeX: {e}[/red]")
        return None
    except FileNotFoundError:
        console.print("[red]Pandoc not found. Please install: brew install pandoc[/red]")
        return None


# =============================================================================
# BUILD FUNCTIONS
# =============================================================================

def natural_sort_key(path):
    """Natural sorting key for chapter files (chapter1, chapter2, ... chapter10)."""
    import re
    stem = path.stem

    # Define reading order for special files
    order_map = {
        'preface': 0,
        'introduction': 1,
        'appendices': 100,
        'conclusion': 99,
        'app': 101,
        'index': -1,
        'template': -1,
    }

    # Check for special files
    for name, order in order_map.items():
        if stem.lower() == name:
            return (order, 0, stem)

    # Extract chapter number
    match = re.search(r'chapter(\d+)', stem.lower())
    if match:
        return (2, int(match.group(1)), stem)

    # Default: alphabetical after chapters
    return (50, 0, stem)


def discover_chapters(source_dir: Path, config: dict) -> list:
    """Discover and order chapters from source directory."""
    chapters = []
    content_dir = source_dir / 'content' / 'chapters'

    # If content/chapters exists, use that
    if content_dir.exists():
        search_dir = content_dir
    else:
        # Otherwise look in source_dir directly (for existing books like Liquid Fortress)
        search_dir = source_dir

    # Get format from config
    source_format = config['build'].get('source_format', 'html')

    # Find files
    patterns = {
        'html': '*.html',
        'markdown': '*.md',
        'latex': '*.tex',
    }
    pattern = patterns.get(source_format, '*.html')

    files = sorted(search_dir.glob(pattern), key=natural_sort_key)

    # Get free chapters list
    free_chapters = config.get('structure', {}).get('free_chapters', [])

    for i, file_path in enumerate(files):
        # Skip index files
        if file_path.stem in ['index', 'template']:
            continue

        # Parse based on format
        if source_format == 'markdown':
            chapter = parse_markdown(file_path)
        elif source_format == 'latex':
            chapter = parse_latex(file_path, source_dir / 'temp')
        else:
            chapter = parse_html(file_path)

        if chapter:
            # Determine if free (exact match only)
            slug = chapter['slug']
            chapter['is_free'] = slug in free_chapters

            # Set prev/next
            chapter['prev'] = files[i - 1].stem if i > 0 else None
            chapter['next'] = files[i + 1].stem if i < len(files) - 1 else None

            chapters.append(chapter)

    return chapters


def load_context_data(source_dir: Path) -> dict:
    """Load context data for chapters."""
    context_file = source_dir / 'context.yaml'
    if context_file.exists():
        with open(context_file, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f) or {}

    # Try Python format (for existing Liquid Fortress)
    context_py = source_dir / 'context_data.py'
    if context_py.exists():
        # Import and extract CONTEXT_DATA
        import importlib.util
        spec = importlib.util.spec_from_file_location("context_data", context_py)
        module = importlib.util.module_from_spec(spec)
        try:
            spec.loader.exec_module(module)
            return getattr(module, 'CONTEXT_DATA', {})
        except Exception:
            pass

    return {}


def copy_static_files(engine_dir: Path, output_dir: Path):
    """Copy static files (CSS, JS, fonts) to output."""
    static_src = engine_dir / 'static'
    static_dst = output_dir

    for subdir in ['css', 'js', 'fonts']:
        src = static_src / subdir
        dst = static_dst / subdir
        if src.exists():
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)


def copy_assets(source_dir: Path, output_dir: Path):
    """Copy images and media from source to output."""
    for folder in ['images', 'media']:
        src = source_dir / folder
        dst = output_dir / folder
        if src.exists():
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)


def generate_pwa_manifest(config: dict, output_dir: Path):
    """Generate PWA manifest.json."""
    pwa_config = config.get('build', {}).get('pwa', {})
    if not pwa_config.get('enabled'):
        return

    manifest = {
        'name': pwa_config.get('name', config['book']['title']),
        'short_name': pwa_config.get('short_name', config['book']['title'][:12]),
        'description': config['book'].get('description', ''),
        'start_url': '/',
        'display': 'standalone',
        'background_color': pwa_config.get('background_color', '#F5E6C8'),
        'theme_color': pwa_config.get('theme_color', '#2D5A6B'),
        'icons': [
            {'src': 'images/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
            {'src': 'images/icon-512.png', 'sizes': '512x512', 'type': 'image/png'},
        ]
    }

    with open(output_dir / 'manifest.json', 'w') as f:
        json.dump(manifest, f, indent=2)


def generate_service_worker(output_dir: Path, chapters: list):
    """Generate service worker for offline support."""
    files_to_cache = [
        '/',
        '/index.html',
        '/css/base.css',
        '/css/experience.css',
        '/css/viral.css',
        '/js/book.js',
        '/js/experience.js',
        '/js/viral.js',
    ]

    # Add chapter files
    for chapter in chapters:
        files_to_cache.append(f"/{chapter['slug']}.html")

    sw_content = f'''
const CACHE_NAME = 'shabrang-v1';
const urlsToCache = {json.dumps(files_to_cache)};

self.addEventListener('install', event => {{
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
}});

self.addEventListener('fetch', event => {{
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
}});
'''

    with open(output_dir / 'sw.js', 'w') as f:
        f.write(sw_content)


# =============================================================================
# MAIN BUILD
# =============================================================================

@click.command()
@click.option('--source', '-s', default='.', help='Source directory')
@click.option('--output', '-o', default=None, help='Output directory')
@click.option('--watch', '-w', is_flag=True, help='Watch for changes')
@click.option('--serve', is_flag=True, help='Serve locally after build')
@click.option('--port', '-p', default=8000, help='Port for local server')
def build(source, output, watch, serve, port):
    """Build the Shabrang book."""
    source_dir = Path(source).resolve()
    engine_dir = Path(__file__).parent.resolve()

    console.print(f"\n[bold gold1]✦ Shabrang Engine[/bold gold1]")
    console.print(f"  Source: {source_dir}\n")

    # Load configuration
    config = load_config(source_dir)

    # Determine output directory
    output_dir = Path(output) if output else source_dir / config['build']['output_dir']
    output_dir = output_dir.resolve()

    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)

    # Setup Jinja2
    template_dir = engine_dir / 'templates'
    env = Environment(loader=FileSystemLoader(str(template_dir)))

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:

        # Discover chapters
        task = progress.add_task("Discovering chapters...", total=None)
        chapters = discover_chapters(source_dir, config)
        progress.update(task, description=f"Found {len(chapters)} chapters")

        # Load context data
        task = progress.add_task("Loading context data...", total=None)
        context_data = load_context_data(source_dir)

        # Copy static files
        task = progress.add_task("Copying static files...", total=None)
        copy_static_files(engine_dir, output_dir)
        copy_assets(source_dir, output_dir)

        # Merge source CSS with engine base CSS (source styles come first, engine adds missing)
        source_css = source_dir / 'style.css'
        if source_css.exists():
            engine_css = output_dir / 'css' / 'base.css'
            with open(source_css, 'r', encoding='utf-8') as src:
                source_content = src.read()
            with open(engine_css, 'r', encoding='utf-8') as eng:
                engine_content = eng.read()
            # Combine: source styles + engine additions (sticky header, nav, etc.)
            combined = source_content + "\n\n/* === SHABRANG ENGINE ADDITIONS === */\n\n" + engine_content
            with open(engine_css, 'w', encoding='utf-8') as out:
                out.write(combined)

        # Generate chapters
        task = progress.add_task("Generating chapters...", total=len(chapters))
        template = env.get_template('chapter.html')

        for chapter in chapters:
            # Add context data if available
            chapter['context'] = context_data.get(chapter['slug'], {})

            # Add media info if available in context
            if 'media' not in chapter:
                chapter['media'] = context_data.get(chapter['slug'], {}).get('media', {})

            # Render template
            html = template.render(
                config=config,
                chapter=chapter,
            )

            # Write output
            output_file = output_dir / f"{chapter['slug']}.html"
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html)

            progress.advance(task)

        # Generate index
        task = progress.add_task("Generating index...", total=None)
        index_template = env.get_template('index.html') if (template_dir / 'index.html').exists() else None
        if index_template:
            index_html = index_template.render(config=config, chapters=chapters)
            with open(output_dir / 'index.html', 'w', encoding='utf-8') as f:
                f.write(index_html)

        # Generate PWA files
        task = progress.add_task("Generating PWA files...", total=None)
        generate_pwa_manifest(config, output_dir)
        generate_service_worker(output_dir, chapters)

    console.print(f"\n[green]✓ Build complete![/green]")
    console.print(f"  Output: {output_dir}\n")

    # Serve if requested
    if serve:
        console.print(f"[blue]Starting server at http://localhost:{port}[/blue]\n")
        os.chdir(output_dir)
        subprocess.run([sys.executable, '-m', 'http.server', str(port)])


if __name__ == '__main__':
    build()
