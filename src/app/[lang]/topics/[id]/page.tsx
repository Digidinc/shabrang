import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaTopicPage } from '@/lib/schema';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { TopicsSidebar } from '@/components/TopicsSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import {
  estimateReadTime,
  getTopic,
  getTopics,
  getPerson,
  getLanguages,
  buildBacklinks,
  getGlossary,
  getAlternateLanguages,
  matchesPerspectiveView,
} from '@/lib/content';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';
import { getLensLabel, normalizeLensKey } from '@/lib/lenses';

export const dynamicParams = false;

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const topics = getTopics(lang);
    for (const t of topics) {
      if (t.frontmatter.id && matchesPerspectiveView(t.frontmatter.perspective, 'kasra')) {
        params.push({ lang, id: t.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const topic = getTopic(lang, id);
  if (!topic) return { title: 'Not Found' };

  const fm = topic.frontmatter;
  const author = fm.author || 'Shabrang';
  const url = `https://shabrang.ca/${lang}/topics/${fm.id}`;
  const alternates = getAlternateLanguages('topics', fm.id);

  return {
    title: fm.title,
    description: fm.abstract || fm.short_answer,
    keywords: fm.tags,
    authors: [{ name: author }],
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      type: 'article',
      title: fm.title,
      description: fm.abstract || fm.short_answer,
      publishedTime: fm.date,
      authors: [author],
      tags: fm.tags,
      locale: lang,
    },
  };
}

function SpectrumBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-2 border-shabrang-teal/30 bg-shabrang-white p-5">
      <h2 className="text-xs uppercase tracking-wider text-shabrang-teal mb-3">{title}</h2>
      {children}
    </section>
  );
}

export default async function TopicPage({ params }: Props) {
  const { lang, id } = await params;
  const topic = getTopic(lang, id);
  if (!topic) notFound();
  if (!matchesPerspectiveView(topic.frontmatter.perspective, 'kasra')) notFound();

  const basePath = `/${lang}`;
  const fm = topic.frontmatter;
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const readTime = fm.read_time || estimateReadTime(topic.body);
  const voiceId = typeof fm.voice === 'string' ? fm.voice.trim() : '';
  const voicePerson = voiceId ? (getPerson(lang, voiceId) || getPerson('en', voiceId)) : null;

  const staticTargets = new Set([
    'about',
    'articles',
    'papers',
    'books',
    'blog',
    'topics',
    'formulas',
    'positioning',
    'mu-levels',
    'graph',
    'privacy',
    'terms',
  ]);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `${basePath}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `${basePath}/concepts/${pid}` };
  });

  const renderedBody = renderMarkdown(topic.body, lang, glossary, basePath);
  const tocItems = extractTocItems(topic.body).filter((t) => t.level === 2);

  const authorities = Array.isArray(fm.authorities) ? fm.authorities : [];
  const answers = Array.isArray(fm.answers) ? fm.answers : [];

  const answerGroups = (() => {
    const groups = new Map<string, { key: string; label: string; items: typeof answers }>();
    for (const ans of answers) {
      const rawKey = normalizeLensKey(ans.lens) || normalizeLensKey(ans.by) || 'other';
      const key = rawKey || 'other';
      if (!groups.has(key)) {
        groups.set(key, { key, label: getLensLabel(key), items: [] });
      }
      groups.get(key)?.items.push(ans);
    }
    return Array.from(groups.values());
  })();

  return (
    <>
      <SchemaScript
        data={schemaTopicPage({
          id: fm.id,
          title: fm.title,
          question: fm.question || fm.title,
          shortAnswer: fm.short_answer || fm.abstract || '',
          tags: fm.tags || [],
          lang,
          date: fm.date,
          author: fm.author || 'Shabrang',
        })}
      />

      <PageShell
        leftMobile={<TopicsSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<TopicsSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" />}
        right={<TableOfContents items={tocItems} />}
      >
        <nav className="text-sm text-shabrang-ink-dim mb-8">
          <a href={basePath} className="hover:text-shabrang-gold">Shabrang</a>
          <span className="mx-2">/</span>
          <a href={`${basePath}/topics`} className="hover:text-shabrang-gold">Topics</a>
          <span className="mx-2">/</span>
          <span className="text-shabrang-ink">{fm.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl text-shabrang-ink mb-4 uppercase tracking-wide">{fm.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-shabrang-ink-dim">
            <span>{fm.author || 'Shabrang'}</span>
            {voiceId && (
              voicePerson ? (
                <Link href={`${basePath}/people/${voicePerson.frontmatter.id}`} className="hover:text-shabrang-gold transition-colors">
                  Voice: {voicePerson.frontmatter.title}
                </Link>
              ) : (
                <span>Voice: {voiceId}</span>
              )
            )}
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

        <ContentDigest
          tldr={fm.tldr}
          keyPoints={fm.key_points}
          prerequisites={prereqLinks}
          readTime={readTime}
        />

        <InlineToc items={tocItems} />

        {(fm.question || fm.short_answer || authorities.length || answers.length) && (
          <section className="grid gap-4 mb-10">
            {fm.question && (
              <SpectrumBlock title="Question">
                <p className="text-shabrang-ink leading-relaxed">{fm.question}</p>
              </SpectrumBlock>
            )}

            {fm.short_answer && (
              <SpectrumBlock title="Short Answer">
                <p className="text-shabrang-ink-dim leading-relaxed italic">{fm.short_answer}</p>
              </SpectrumBlock>
            )}

            {authorities.length > 0 && (
              <SpectrumBlock title="Authority">
                <ul className="space-y-3 text-sm">
                  {authorities.map((a, idx) => (
                    <li key={idx} className="border-2 border-shabrang-teal/20 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-shabrang-ink truncate">{a.title || a.name || 'Source'}</div>
                          <div className="text-xs text-shabrang-ink-dim truncate">
                            {[a.publisher, a.name].filter(Boolean).join(' • ')}
                            {a.published_at ? ` • ${a.published_at}` : ''}
                          </div>
                        </div>
                        {a.url && (
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-shabrang-gold hover:underline shrink-0"
                          >
                            link
                          </a>
                        )}
                      </div>
                      {a.quote && (
                        <blockquote className="mt-2 text-shabrang-ink-dim italic border-l-2 border-shabrang-gold/60 pl-3">
                          {a.quote}
                        </blockquote>
                      )}
                    </li>
                  ))}
                </ul>
              </SpectrumBlock>
            )}

            {answerGroups.length > 0 && (
              <SpectrumBlock title="Answers (Spectrum)">
                {answerGroups.length > 1 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {answerGroups.map((g) => (
                      <a
                        key={g.key}
                        href={`#lens-${encodeURIComponent(g.key)}`}
                        className="text-[0.65rem] uppercase tracking-wider px-2.5 py-1 border-2 border-shabrang-teal/30 text-shabrang-ink-dim hover:text-shabrang-ink hover:border-shabrang-gold transition-colors"
                      >
                        {g.label}
                      </a>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  {answerGroups.map((g) => (
                    <section key={g.key} id={`lens-${g.key}`} className="border-2 border-shabrang-teal/20 p-3">
                      <h3 className="text-sm text-shabrang-ink mb-2 font-display uppercase tracking-wide">{g.label}</h3>
                      <div className="space-y-3">
                        {g.items.map((ans, idx) => (
                          <div key={idx} className="border border-shabrang-teal/20 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-shabrang-ink truncate">
                                  {ans.by || ans.role || 'Answer'}
                                  {ans.stance ? <span className="text-shabrang-ink-dim"> — {ans.stance}</span> : null}
                                </div>
                                {ans.role && ans.by && <div className="text-xs text-shabrang-ink-dim truncate">{ans.role}</div>}
                              </div>
                              {ans.url && (
                                <a
                                  href={ans.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-mono text-shabrang-gold hover:underline shrink-0"
                                >
                                  link
                                </a>
                              )}
                            </div>
                            {ans.answer && <p className="mt-2 text-shabrang-ink-dim text-sm leading-relaxed italic">{ans.answer}</p>}
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </SpectrumBlock>
            )}
          </section>
        )}

        <div className="content-body" suppressHydrationWarning>
          <MarkdownContent html={renderedBody} glossary={glossary} />
        </div>

        {pageBacklinks.length > 0 && (
          <section className="mt-16 pt-8 border-t border-shabrang-teal/20">
            <h3 className="text-xs uppercase tracking-wider text-shabrang-ink-dim mb-4">
              Linked from
            </h3>
            <ul className="space-y-2">
              {pageBacklinks.map((linkId) => {
                const item = glossary[linkId];
                const href = item?.url || `${basePath}/papers/${linkId}`;
                return (
                  <li key={linkId}>
                    <a href={href} className="text-shabrang-gold hover:text-shabrang-crimson transition-colors text-sm">
                      {item?.title || linkId}
                    </a>
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
