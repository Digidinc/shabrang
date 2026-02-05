import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaBlogPosting } from '@/lib/schema';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ArticlesSidebar } from '@/components/ArticlesSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { PageShell } from '@/components/PageShell';
import {
  estimateReadTime,
  getArticle,
  getArticles,
  getLanguages,
  buildBacklinks,
  getGlossary,
  getAlternateLanguages,
  matchesPerspectiveView,
} from '@/lib/content';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';
import { getLangBasePath } from '@/lib/site';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const items = getArticles(lang);
    for (const a of items) {
      if (a.frontmatter.id && matchesPerspectiveView(a.frontmatter.perspective, 'kasra')) {
        params.push({ lang, id: a.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const article = getArticle(lang, id);
  if (!article) return { title: 'Not Found' };

  const fm = article.frontmatter;
  const basePath = getLangBasePath(lang);
  const url = `https://shabrang.ca${basePath}/articles/${fm.id}`;
  const alternates = getAlternateLanguages('articles', fm.id);

  return {
    title: fm.title,
    description: fm.abstract,
    keywords: fm.tags,
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      type: 'article',
      title: fm.title,
      description: fm.abstract,
      publishedTime: fm.date,
      authors: [fm.author || 'Shabrang'],
      tags: fm.tags,
      locale: lang,
      url,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { lang, id } = await params;
  const article = getArticle(lang, id);
  if (!article) notFound();
  if (!matchesPerspectiveView(article.frontmatter.perspective, 'kasra')) notFound();

  const basePath = getLangBasePath(lang);
  const homeHref = basePath || '/';
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const fm = article.frontmatter;
  const readTime = fm.read_time || estimateReadTime(article.body);

  const renderedBody = renderMarkdown(article.body, lang, glossary, basePath);
  const tocItems = extractTocItems(article.body).filter((t) => t.level === 2);

  return (
    <>
      <SchemaScript
        data={schemaBlogPosting({
          id: fm.id,
          title: fm.title,
          description: fm.abstract || '',
          lang,
          date: fm.date,
          author: fm.author,
          tags: fm.tags,
          url: `https://shabrang.ca${basePath}/articles/${fm.id}`,
        })}
      />

      <PageShell
        leftMobile={<ArticlesSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<ArticlesSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" />}
        right={<TableOfContents items={tocItems} />}
      >
        <nav className="text-sm text-shabrang-ink-dim mb-8">
          <a href={homeHref} className="hover:text-shabrang-gold">Shabrang</a>
          <span className="mx-2">/</span>
          <a href={`${basePath}/articles`} className="hover:text-shabrang-gold">Articles</a>
          <span className="mx-2">/</span>
          <span className="text-shabrang-ink">{fm.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl text-shabrang-ink mb-4 uppercase tracking-wide">
            {fm.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-shabrang-ink-dim">
            <span>{fm.author || 'Shabrang'}</span>
            {fm.date && <span>{fm.date}</span>}
            <span className="font-mono text-xs">{readTime}</span>
          </div>

          {fm.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {fm.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`${basePath}/tags/${encodeURIComponent(tag)}`}
                  className="text-[0.65rem] uppercase tracking-wider px-2.5 py-1 border-2 border-shabrang-teal/30 text-shabrang-ink-dim hover:text-shabrang-gold hover:border-shabrang-gold transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {fm.abstract ? (
          <blockquote className="border-l-3 border-shabrang-gold pl-4 text-shabrang-ink-dim italic mb-8">
            {fm.abstract}
          </blockquote>
        ) : null}

        <div className="content-body" suppressHydrationWarning>
          <MarkdownContent html={renderedBody} glossary={glossary} />
        </div>

        {pageBacklinks.length > 0 && (
          <section className="backlinks mt-16 pt-10 border-t border-shabrang-teal/20">
            <h3 className="text-xs font-medium text-shabrang-ink-dim uppercase tracking-[0.2em] mb-6">
              Linked from
            </h3>
            <ul className="grid sm:grid-cols-2 gap-4">
              {pageBacklinks.map((linkId) => {
                const item = glossary[linkId];
                const href = item?.url || `${basePath}/articles/${linkId}`;
                return (
                  <li key={linkId}>
                    <Link href={href} className="card block p-4 group">
                      <span className="text-shabrang-ink group-hover:text-shabrang-gold transition-colors text-sm">
                        {item?.title || linkId}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </PageShell>
    </>
  );
}

