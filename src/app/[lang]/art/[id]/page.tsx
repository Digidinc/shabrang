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
  const canonicalUrl = `https://shabrang.ca/${lang}/art/${fm.id}`;
  const alternates = getAlternateLanguages('articles', fm.id); // Artifacts use the article-like meta for now

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
  const norm = normalizeContentPerspective(artifact.frontmatter.perspective);

  const basePath = `/${lang}`;
  const meta = toPaperMeta(artifact);
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const fm = artifact.frontmatter;
  const fmExt = fm as unknown as Record<string, unknown>;
  const readTime = fm.read_time || estimateReadTime(artifact.body);

  const renderedBody = renderMarkdown(artifact.body, lang, glossary, basePath);
  const tocItems = extractTocItems(artifact.body).filter((t) => t.level === 2);

  // Navigation Logic
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
          <nav className="text-sm text-frc-text-dim mb-8">
            <a href={basePath} className="hover:text-frc-gold">Shabrang</a>
            <span className="mx-2">/</span>
            <a href={`${basePath}/art`} className="hover:text-frc-gold">Imaginal Gallery</a>
            <span className="mx-2">/</span>
            <span className="text-frc-text">{artifact.frontmatter.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-frc-gold text-frc-void px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded">
                {(fmExt.level as string) || 'μ-STACK'}
              </span>
              <span className="text-[10px] text-frc-steel uppercase tracking-widest">
                {(fmExt.artifact_type as string) || 'Artifact'}
              </span>
            </div>
            <h1 className="text-4xl font-display text-frc-gold mb-3 uppercase tracking-wide">
              {artifact.frontmatter.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-frc-text-dim">
              <span>{artifact.frontmatter.author || 'H. Servat'}</span>
              <span>{artifact.frontmatter.date}</span>
            </div>
          </header>

          <InlineToc items={tocItems} />

          {/* Body */}
          <div className="content-body" suppressHydrationWarning>
            <MarkdownContent html={renderedBody} glossary={glossary} />
          </div>

          {/* Walkthrough Navigation */}
          <div className="mt-20 pt-10 border-t border-frc-blue/30 flex items-center justify-between">
            {prev ? (
              <Link href={`${basePath}/art/${prev.frontmatter.id}`} className="group flex flex-col items-start gap-2">
                <span className="text-[10px] text-frc-steel uppercase tracking-widest">Previous Artifact</span>
                <span className="text-frc-text group-hover:text-frc-gold transition-colors font-display text-sm uppercase">← {prev.frontmatter.title}</span>
              </Link>
            ) : <div />}
            
            {next ? (
              <Link href={`${basePath}/art/${next.frontmatter.id}`} className="group flex flex-col items-end gap-2 text-right">
                <span className="text-[10px] text-frc-steel uppercase tracking-widest">Next Artifact</span>
                <span className="text-frc-text group-hover:text-frc-gold transition-colors font-display text-sm uppercase">{next.frontmatter.title} →</span>
              </Link>
            ) : <div />}
          </div>

          {/* Backlinks */}
          {pageBacklinks.length > 0 && (
            <section className="mt-20 pt-10 border-t border-frc-blue/10">
              <h3 className="text-xs font-medium text-frc-steel uppercase tracking-[0.2em] mb-6">
                Connected Nodes
              </h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {pageBacklinks.map(linkId => {
                  const item = glossary[linkId];
                  const href = item?.url || `${basePath}/papers/${linkId}`;
                  return (
                    <li key={linkId}>
                      <Link href={href} className="card block p-4 group">
                        <span className="text-frc-text group-hover:text-frc-gold transition-colors text-sm">
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
