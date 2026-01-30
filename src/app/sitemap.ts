import type { MetadataRoute } from 'next';
import { getBooks, getBlogPosts, getTopics, getArtItems, getLanguages, getAlternateLanguages, getStaticPageAlternates } from '@/lib/content';

export const dynamic = 'force-static';

const SITE_URL = 'https://shabrang.ca';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = getLanguages();
  const entries: MetadataRoute.Sitemap = [];

  // Homepage with language alternates
  const homeAlternates: Record<string, string> = {};
  for (const lang of languages) {
    homeAlternates[lang] = `${SITE_URL}/${lang}`;
  }
  entries.push({
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: { languages: homeAlternates },
  });

  // Static pages with language alternates (only pages that exist)
  const staticPages = ['about', 'books', 'art', 'blog', 'topics', 'contact', 'privacy', 'terms'];

  for (const page of staticPages) {
    const alternates = getStaticPageAlternates(page);
    for (const lang of languages) {
      entries.push({
        url: `${SITE_URL}/${lang}/${page}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages: alternates },
      });
    }
  }

  // Content type helper
  const addContentToSitemap = (type: string, getter: (lang: string) => any[], priority: number) => {
    const seenIds = new Set<string>();
    for (const lang of languages) {
      const items = getter(lang);
      for (const item of items) {
        const id = item.frontmatter.id;
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        const alternates = getAlternateLanguages(type as any, id);
        for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
          entries.push({
            url: `${SITE_URL}/${altLang}/${type}/${id}`,
            lastModified: item.frontmatter.date ? new Date(item.frontmatter.date) : new Date(),
            changeFrequency: 'monthly',
            priority,
            alternates: { languages: alternates },
          });
        }
      }
    }
  };

  // Content types with existing routes
  addContentToSitemap('blog', getBlogPosts, 0.85);
  addContentToSitemap('books', getBooks, 0.9);
  addContentToSitemap('art', getArtItems, 0.8);
  addContentToSitemap('topics', getTopics, 0.8);

  return entries;
}
