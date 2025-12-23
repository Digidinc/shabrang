import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const siteConfig = await import('virtual:site-config').then(m => m.default).catch(() => ({ name: 'Site', seo: {} }));
  const posts = import.meta.glob('../content/posts/*.mdx', { eager: true });

  const items = Object.values(posts)
    .filter((post: any) => !post.frontmatter.draft)
    .sort((a: any, b: any) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
    .map((post: any) => ({
      title: post.frontmatter.title,
      pubDate: new Date(post.frontmatter.date),
      description: post.frontmatter.description || '',
      link: post.url,
    }));

  return rss({
    title: siteConfig.name,
    description: siteConfig.seo?.description || '',
    site: context.site || '',
    items,
  });
}
