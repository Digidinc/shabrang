import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaPaperPage } from '@/lib/schema';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ArtSidebar } from '@/components/ArtSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import { VoiceTag } from '@/components/VoiceTag';
import {
  estimateReadTime,
  getArtItem,
  getArtItems,
  getLanguages,
  toPaperMeta,
  buildBacklinks,
  getGlossary,
  getAlternateLanguages,
  normalizeContentPerspective,
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
    const artifacts = getArtItems(lang);
    for (const art of artifacts) {
      if (art.frontmatter.id) {
        params.push({ lang, id: art.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const artifact = getArtItem(lang, id);
  if (!artifact) return { title: 'Not Found' };

  const fm = artifact.frontmatter;
  const author = fm.author || 'H. Servat';
  const norm = normalizeContentPerspective(fm.perspective);
  const langPrefix = lang === 'en' ? '' : `/${lang}`;
  const canonicalUrl = `https://shabrang.ca${langPrefix}/art/${fm.id}`;
  const alternates = getAlternateLanguages('articles', fm.id);

  return {
    title: `${fm.title} | Imaginal Gallery`,
    description: fm.abstract,
    keywords: fm.tags,
    authors: [{ name: author }],
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    ...(norm === 'river' ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'article',
      title: fm.title,
      description: fm.abstract,
      publishedTime: fm.date,
      authors: [author],
      tags: fm.tags,
      locale: lang,
    },
  };
}

export default async function ArtifactPage({ params }: Props) {
  const { lang, id } = await params;
  const artifact = getArtItem(lang, id);
  if (!artifact) notFound();

  const basePath = getLangBasePath(lang);
  const homeHref = basePath || '/';
  const meta = toPaperMeta(artifact);
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const fm = artifact.frontmatter;
  const fmExt = fm as unknown as Record<string, unknown>;

  const renderedBody = renderMarkdown(artifact.body, lang, glossary, basePath);
  const tocItems = extractTocItems(artifact.body).filter((t) => t.level === 2);

  const allArtifacts = getArtItems(lang).filter(a => matchesPerspectiveView(a.frontmatter.perspective, 'kasra'));
  const currentIndex = allArtifacts.findIndex(a => a.frontmatter.id === id);
  const prev = currentIndex > 0 ? allArtifacts[currentIndex - 1] : null;
  const next = currentIndex < allArtifacts.length - 1 ? allArtifacts[currentIndex + 1] : null;

  if (!matchesPerspectiveView(artifact.frontmatter.perspective, 'kasra')) notFound();

  return (
    <>
      <SchemaScript data={schemaPaperPage(meta)} />

      <PageShell
        leftMobile={<ArtSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<ArtSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" />}
        right={<TableOfContents items={tocItems} />}
      >
        {/* Breadcrumb */}
        <nav className="text-sm text-shabrang-ink-dim mb-8">
          <a href={homeHref} className="hover:text-shabrang-gold transition-colors">Shabrang</a>
          <span className="mx-2">/</span>
          <a href={`${basePath}/art`} className="hover:text-shabrang-gold transition-colors">Imaginal Gallery</a>
          <span className="mx-2">/</span>
          <span className="text-shabrang-ink">{artifact.frontmatter.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-shabrang-gold text-shabrang-ink px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
              {(fmExt.level as string) || 'Artifact'}
            </span>
            <span className="text-[10px] text-shabrang-ink-dim uppercase tracking-widest">
              {(fmExt.artifact_type as string) || 'Persian Heritage'}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-shabrang-gold mb-4 uppercase tracking-wide leading-tight">
            {artifact.frontmatter.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-shabrang-ink-dim border-b border-shabrang-teal/20 pb-6">
            <span>{artifact.frontmatter.author || 'Kay Hermes'}</span>
            <span>{artifact.frontmatter.date}</span>
            {fm.tags && fm.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {fm.tags.slice(0, 4).map((tag: string) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 border border-shabrang-teal/30 text-shabrang-teal uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <InlineToc items={tocItems} />

        {/* Body */}
        <div className="content-body" suppressHydrationWarning>
          <MarkdownContent html={renderedBody} glossary={glossary} />
        </div>

        {/* Prev / Next Navigation */}
        <div className="mt-20 pt-10 border-t border-shabrang-teal/20 flex items-center justify-between gap-4">
          {prev ? (
            <Link href={`${basePath}/art/${prev.frontmatter.id}`} className="group flex flex-col items-start gap-1 max-w-[45%]">
              <span className="text-[10px] text-shabrang-ink-dim uppercase tracking-widest">Previous</span>
              <span className="text-shabrang-ink group-hover:text-shabrang-gold transition-colors font-display text-sm uppercase leading-snug">← {prev.frontmatter.title}</span>
            </Link>
          ) : <div />}

          {next ? (
            <Link href={`${basePath}/art/${next.frontmatter.id}`} className="group flex flex-col items-end gap-1 text-right max-w-[45%]">
              <span className="text-[10px] text-shabrang-ink-dim uppercase tracking-widest">Next</span>
              <span className="text-shabrang-ink group-hover:text-shabrang-gold transition-colors font-display text-sm uppercase leading-snug">{next.frontmatter.title} →</span>
            </Link>
          ) : <div />}
        </div>

        {/* Backlinks */}
        {pageBacklinks.length > 0 && (
          <section className="mt-20 pt-10 border-t border-shabrang-teal/10">
            <h3 className="text-xs font-medium text-shabrang-ink-dim uppercase tracking-[0.2em] mb-6">
              Connected Nodes
            </h3>
            <ul className="grid sm:grid-cols-2 gap-4">
              {pageBacklinks.map(linkId => {
                const item = glossary[linkId];
                const href = item?.url || `${basePath}/papers/${linkId}`;
                return (
                  <li key={linkId}>
                    <Link href={href} className="block p-4 border border-shabrang-teal/20 hover:border-shabrang-gold transition-colors group">
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

        {/* Comments placeholder */}
        <section className="mt-20 pt-10 border-t border-shabrang-teal/10">
          <h3 className="font-display text-shabrang-gold text-sm uppercase tracking-widest mb-2">
            The Dialectic
          </h3>
          <p className="text-xs text-shabrang-ink-dim italic mb-6">Thesis · Antithesis · Synthesis</p>
          <div className="border border-shabrang-teal/30 p-8 text-center">
            <p className="text-shabrang-ink-dim text-sm italic mb-2">
              Community discussion coming soon.
            </p>
            <p className="text-shabrang-ink-dim text-xs">
              A moderated space for thesis, antithesis, and synthesis on this artifact.
            </p>
          </div>
        </section>
      </PageShell>
    </>
  );
}
