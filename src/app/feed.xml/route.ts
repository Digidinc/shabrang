import { getBlogPosts } from '@/lib/content';

export const dynamic = 'force-static';

const SITE_URL = 'https://shabrang.ca';
const SITE_TITLE = 'Shabrang — The Liquid Fortress';
const SITE_DESCRIPTION = 'Persian wisdom through dialectic: A living conversation between opposing perspectives.';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = getBlogPosts('en');

  // Filter published posts (status === 'published' or no status field) and sort by date descending
  const publishedPosts = posts
    .filter(post => !post.frontmatter.status || post.frontmatter.status === 'published')
    .sort((a, b) => {
      const dateA = a.frontmatter.date || '';
      const dateB = b.frontmatter.date || '';
      return dateB.localeCompare(dateA);
    });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${publishedPosts.map(post => {
  const { id, title, author, date, abstract } = post.frontmatter;
  const link = `${SITE_URL}/en/blog/${id}`;
  const description = abstract || '';
  const pubDate = date ? new Date(date).toUTCString() : new Date().toUTCString();

  return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      ${author ? `<dc:creator>${escapeXml(author)}</dc:creator>` : ''}
    </item>`;
}).join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
