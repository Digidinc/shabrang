import type { MetadataRoute } from 'next';
import { getBooks, getBlogPosts, getTopics, getArtItems, getConcepts, getArticles, getPeople, getPapers, getLanguages, getAlternateLanguages, getStaticPageAlternates, getAllTags } from '@/lib/content';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

const SITE_URL = 'https://shabrang.ca';

function safeDateMs(raw: unknown): number | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const ms = Date.parse(raw);
  return Number.isFinite(ms) ? ms : null;
}

function maxMs(values: Array<number | null | undefined>): number | null {
  let out: number | null = null;
  for (const v of values) {
    if (typeof v !== 'number' || !Number.isFinite(v)) continue;
    out = out === null ? v : Math.max(out, v);
  }
  return out;
}

function safeFileMtimeMs(relPathFromRepoRoot: string): number | null {
  try {
    const full = path.join(process.cwd(), relPathFromRepoRoot);
    const stat = fs.statSync(full);
    return stat.mtimeMs;
  } catch {
    return null;
  }
}

function safeContentFileMtimeMs(lang: string, page: string): number | null {
  const candidates = [
    path.join('content', lang, 'site', `${page}.md`),
    path.join('content', 'en', 'site', `${page}.md`),
  ];
  return maxMs(candidates.map((p) => safeFileMtimeMs(p)));
}

function latestItemDateMs(lang: string, getter: (lang: string) => any[]): number | null {
  const items = getter(lang);
  return maxMs(items.map((i) => safeDateMs(i?.frontmatter?.date)));
}

function latestContentDateMs(languages: string[]): number | null {
  const values: Array<number | null> = [];
  for (const lang of languages) {
    values.push(latestItemDateMs(lang, getBlogPosts));
    values.push(latestItemDateMs(lang, getBooks));
    values.push(latestItemDateMs(lang, getArtItems));
    values.push(latestItemDateMs(lang, getTopics));
    values.push(latestItemDateMs(lang, getConcepts));
    values.push(latestItemDateMs(lang, getArticles));
    values.push(latestItemDateMs(lang, getPeople));
    values.push(latestItemDateMs(lang, getPapers));
  }
  return maxMs(values);
}

function itemDateMsById(getter: (lang: string) => any[], lang: string, id: string): number | null {
  const items = getter(lang);
  const found = items.find((i) => i?.frontmatter?.id === id);
  return safeDateMs(found?.frontmatter?.date);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = getLanguages();
  const globalLastModifiedMs =
    latestContentDateMs(languages) ??
    safeFileMtimeMs('content') ??
    safeFileMtimeMs('README.md') ??
    Date.now();
  const entries: MetadataRoute.Sitemap = [];

  // Homepage with language alternates
  const homeAlternates: Record<string, string> = {};
  for (const lang of languages) {
    homeAlternates[lang] = lang === 'en' ? `${SITE_URL}/` : `${SITE_URL}/${lang}`;
  }
  homeAlternates['x-default'] = `${SITE_URL}/`;
  entries.push({
    url: SITE_URL,
    lastModified: new Date(globalLastModifiedMs),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: { languages: homeAlternates },
  });

  // Static pages with language alternates (only pages that exist)
  const staticPages = ['start', 'about', 'books', 'art', 'blog', 'topics', 'concepts', 'articles', 'people', 'papers', 'contact', 'privacy', 'terms'];

  for (const page of staticPages) {
    const alternates = getStaticPageAlternates(page);
    for (const lang of languages) {
      const url = alternates[lang];
      if (!url) continue;

      const lastMs =
        page === 'start'
          ? safeFileMtimeMs('src/app/[lang]/start/page.tsx')
          : page === 'about'
          ? safeContentFileMtimeMs(lang, 'about')
          : page === 'privacy'
            ? safeFileMtimeMs('src/app/[lang]/privacy/page.tsx')
            : page === 'terms'
              ? safeFileMtimeMs('src/app/[lang]/terms/page.tsx')
              : page === 'contact'
                ? safeFileMtimeMs('src/app/[lang]/contact/page.tsx')
                : page === 'blog'
                  ? latestItemDateMs(lang, getBlogPosts)
                  : page === 'books'
                    ? latestItemDateMs(lang, getBooks)
                    : page === 'art'
                      ? latestItemDateMs(lang, getArtItems)
                      : page === 'topics'
                        ? latestItemDateMs(lang, getTopics)
                        : page === 'concepts'
                          ? latestItemDateMs(lang, getConcepts)
                          : page === 'articles'
                            ? latestItemDateMs(lang, getArticles)
                            : page === 'people'
                              ? latestItemDateMs(lang, getPeople)
                              : page === 'papers'
                                ? latestItemDateMs(lang, getPapers)
                        : null;

      entries.push({
        url,
        lastModified: new Date(lastMs ?? globalLastModifiedMs),
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
        for (const altLang of Object.keys(alternates).filter((l) => l !== 'x-default')) {
          const lastMs = itemDateMsById(getter, altLang, id) ?? globalLastModifiedMs;
          entries.push({
            url: alternates[altLang],
            lastModified: new Date(lastMs),
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
  addContentToSitemap('concepts', getConcepts, 0.75);
  addContentToSitemap('articles', getArticles, 0.8);
  addContentToSitemap('people', getPeople, 0.6);
  addContentToSitemap('papers', getPapers, 0.6);

  // Tag archive pages
  for (const lang of languages) {
    const tags = getAllTags(lang);
    const langPrefix = lang === 'en' ? '' : `/${lang}`;
    for (const tag of tags) {
      entries.push({
        url: `${SITE_URL}${langPrefix}/tags/${tag}`,
        lastModified: new Date(globalLastModifiedMs),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
