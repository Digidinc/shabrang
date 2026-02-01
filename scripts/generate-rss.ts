import fs from 'fs';
import path from 'path';
import { getBlogPosts } from '../src/lib/content';

const SITE_URL = 'https://shabrang.ca';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generateRSS() {
  const posts = getBlogPosts('en');

  const publishedPosts = posts
    .filter(post => !post.frontmatter.status || post.frontmatter.status === 'published')
    .sort((a, b) => (b.frontmatter.date || '').localeCompare(a.frontmatter.date || ''))
    .slice(0, 50);

  const rssItems = publishedPosts.map(post => {
    const { id, title, abstract, date, tags } = post.frontmatter;
    const link = `${SITE_URL}/en/blog/${id}`;
    const pubDate = date ? new Date(date).toUTCString() : new Date().toUTCString();

    return `    <item>
      <title>${escapeXml(title || '')}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(abstract || '')}</description>
      <pubDate>${pubDate}</pubDate>
      ${tags?.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ') || ''}
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shabrang Blog</title>
    <link>${SITE_URL}/en/blog</link>
    <description>Art, philosophy, and the Persian spirit. A journey through 3,000 years of cultural resilience.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

  // Write to public directory (will be copied to out/ during build)
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'feed.xml'), rss, 'utf-8');

  console.log(`✅ Generated RSS feed with ${publishedPosts.length} posts`);
}

generateRSS().catch(console.error);
