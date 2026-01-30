const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(process.cwd(), 'content');
const OUT_FILE = path.join(process.cwd(), 'public/search-index.json');

const KNOWN_LANGS = ['en', 'fa'];
const CONTENT_TYPES = ['papers', 'articles', 'blog', 'books', 'topics', 'concepts', 'art'];

function parseSimpleFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  
  const yaml = match[1];
  const content = match[2];
  const data = {};
  
  yaml.split('\n').forEach(line => {
    const [key, ...valParts] = line.split(':');
    if (key && valParts.length) {
      data[key.trim()] = valParts.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });
  
  return { data, content };
}

function buildIndex() {
  const index = [];

  for (const lang of KNOWN_LANGS) {
    for (const type of CONTENT_TYPES) {
      const dir = path.join(CONTENT_DIR, lang, type);
      if (!fs.existsSync(dir)) continue;

      const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const raw = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = parseSimpleFrontmatter(raw);

        // Extract clean text for searching
        const cleanContent = content
          .replace(/[[^]]*?|[^]]*?]/g, '$2') // strip wikilinks
          .replace(/![\[\]]*\([^)]*\)/g, '') // remove images
          .replace(/::video\[[^\]]*\]/g, '') // remove video shortcodes
          .replace(/[#*`>]/g, '') // remove markdown symbols
          .slice(0, 1000); // sample first 1000 chars

        index.push({
          id: data.id || file.replace('.md', ''),
          title: data.title || 'Untitled',
          abstract: data.abstract || data.short_answer || '',
          type,
          lang,
          tags: data.tags || [],
          level: data.level || '',
          path: `/${lang}/${type}/${data.id || file.replace('.md', '')}`,
          content: cleanContent
        });
      }
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(index, null, 2));
  console.log(`Search index built with ${index.length} items at ${OUT_FILE}`);
}

buildIndex();