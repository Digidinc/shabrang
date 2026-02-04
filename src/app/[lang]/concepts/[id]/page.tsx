import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaConceptPage } from '@/lib/schema';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ConceptsSidebar } from '@/components/ConceptsSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { PageShell } from '@/components/PageShell';
import {
  estimateReadTime,
  getConcept,
  getConcepts,
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
    const concepts = getConcepts(lang);
    for (const c of concepts) {
      if (c.frontmatter.id && matchesPerspectiveView(c.frontmatter.perspective, 'kasra')) {
        params.push({ lang, id: c.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const concept = getConcept(lang, id);
  if (!concept) return { title: 'Not Found' };

  const fm = concept.frontmatter;
  const basePath = getLangBasePath(lang);
  const url = `https://shabrang.ca${basePath}/concepts/${fm.id}`;
  const alternates = getAlternateLanguages('concepts', fm.id);

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

export default async function ConceptPage({ params }: Props) {
  const { lang, id } = await params;
  const concept = getConcept(lang, id);
  if (!concept) notFound();
  if (!matchesPerspectiveView(concept.frontmatter.perspective, 'kasra')) notFound();

  const basePath = getLangBasePath(lang);
  const homeHref = basePath || '/';
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const fm = concept.frontmatter;

  const readTime = fm.read_time || estimateReadTime(concept.body);
  const renderedBody = renderMarkdown(concept.body, lang, glossary, basePath);
  const tocItems = extractTocItems(concept.body).filter((t) => t.level === 2);

  const firstPara = concept.body
    .split('\n\n')
    .find((p) => p && !p.startsWith('#') && !p.startsWith('---'))
    ?.replace(/\[\[|\]\]/g, '')
    .slice(0, 220) || '';

  return (
    <>
      <SchemaScript
        data={schemaConceptPage({
          id: fm.id,
          title: fm.title,
          description: firstPara,
          tags: fm.tags || [],
          related: fm.related || [],
          lang,
        })}
      />

      <PageShell
        leftMobile={<ConceptsSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<ConceptsSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" />}
        right={<TableOfContents items={tocItems} />}
      >
        <nav className="text-sm text-shabrang-ink-dim mb-8">
          <a href={homeHref} className="hover:text-shabrang-gold">Shabrang</a>
          <span className="mx-2">/</span>
          <a href={`${basePath}/concepts`} className="hover:text-shabrang-gold">Concepts</a>
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
                const href = item?.url || `${basePath}/concepts/${linkId}`;
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

