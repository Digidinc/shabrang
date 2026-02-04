import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaPaperPage, schemaFAQ, type FAQItem } from '@/lib/schema';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { BlogSidebar } from '@/components/BlogSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import { VoiceTag } from '@/components/VoiceTag';
import { GitHubDialectic } from '@/components/GitHubDialectic';
import { RelatedPosts } from '@/components/RelatedPosts';
import { FeaturedSidebar } from '@/components/FeaturedSidebar';
import { estimateReadTime, getBlogPost, getBlogPosts, getLanguages, toPaperMeta, buildBacklinks, getGlossary, getAlternateLanguages, matchesPerspectiveView } from '@/lib/content';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';
import { getLangBasePath } from '@/lib/site';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const posts = getBlogPosts(lang);
    for (const post of posts) {
      if (post.frontmatter.id && matchesPerspectiveView(post.frontmatter.perspective, 'kasra')) {
        params.push({ lang, id: post.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const post = getBlogPost(lang, id);
  if (!post) return { title: 'Not Found' };

  const fm = post.frontmatter;
  const langPrefix = lang === 'en' ? '' : `/${lang}`;
  const postUrl = `https://shabrang.ca${langPrefix}/blog/${fm.id}`;
  const alternates = getAlternateLanguages('blog', fm.id);

  return {
    title: fm.title,
    description: fm.abstract,
    keywords: fm.tags,
    alternates: {
      canonical: postUrl,
      languages: alternates,
    },
    openGraph: {
      type: 'article',
      title: fm.title as string,
      description: fm.abstract as string,
      publishedTime: fm.date,
      locale: lang,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, id } = await params;
  const post = getBlogPost(lang, id);
  if (!post) notFound();
  if (!matchesPerspectiveView(post.frontmatter.perspective, 'kasra')) notFound();

  const basePath = getLangBasePath(lang);
  const homeHref = basePath || '/';
  const meta = toPaperMeta(post);
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const fm = post.frontmatter;
  const fmExt = fm as unknown as Record<string, unknown>;
  const readTime = fm.read_time || estimateReadTime(post.body);
  const tocItems = extractTocItems(post.body).filter((t) => t.level === 2);
  const renderedBody = renderMarkdown(post.body, lang, glossary, basePath);

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'blog', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const prereqLinks = ((fmExt.prerequisites as string[]) || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `${basePath}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `${basePath}/concepts/${pid}` };
  });

  const voice = fm.voice || (fm.perspective === 'river' ? 'river' : fm.perspective === 'kasra' ? 'kasra' : undefined);

  // Get featured posts for sidebar
  const essentialIds = ['adab-social-handshake', 'taarof-game-theory', 'qanats-decentralized-grid', 'shahnameh-civilizational-hard-drive', 'simurgh-swarm-intelligence'];
  const allBlogPosts = getBlogPosts(lang).filter((p) => matchesPerspectiveView(p.frontmatter.perspective, 'kasra'));
  const featuredSidebarPosts = essentialIds
    .map((essId) => {
      const p = allBlogPosts.find((bp) => bp.frontmatter.id === essId);
      if (!p || p.frontmatter.id === id) return null; // Exclude current post
      return {
        id: p.frontmatter.id,
        title: p.frontmatter.title,
        readTime: p.frontmatter.read_time || estimateReadTime(p.body),
      };
    })
    .filter((p) => p !== null)
    .slice(0, 5);

  // Check for FAQ data in frontmatter
  const faqData = fmExt.faqs as FAQItem[] | undefined;

  return (
    <>
      <SchemaScript data={schemaPaperPage(meta)} />
      {faqData && faqData.length > 0 && (
        <SchemaScript data={schemaFAQ(faqData)} />
      )}

      <PageShell
        leftMobile={<BlogSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<BlogSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" />}
        right={
          <>
            <GitHubDialectic
              pageId={`blog-${id}`}
              pageTitle={fm.title as string}
            />
            <TableOfContents items={tocItems} />
            {featuredSidebarPosts.length > 0 && (
              <FeaturedSidebar
                posts={featuredSidebarPosts as { id: string; title: string; readTime: string }[]}
                basePath={basePath}
                title="Essential Reading"
              />
            )}
          </>
        }
      >
        {/* Breadcrumb */}
        <nav className="text-sm text-frc-text-dim mb-8">
          <a href={homeHref} className="hover:text-frc-gold">Shabrang</a>
          <span className="mx-2">/</span>
          <a href={`${basePath}/blog`} className="hover:text-frc-gold">Blog</a>
          <span className="mx-2">/</span>
          <span className="text-frc-text">{post.frontmatter.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            {typeof fmExt.level === 'string' && (
              <span className="bg-frc-gold/10 text-frc-gold border border-frc-gold/30 px-2 py-0.5 text-xs font-mono font-bold uppercase rounded">
                {fmExt.level}
              </span>
            )}
            <h1 className="text-3xl font-light text-frc-gold">
              {post.frontmatter.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-frc-text-dim items-center">
            <VoiceTag voice={voice} />
            {post.frontmatter.date && <span>{post.frontmatter.date}</span>}
            <span className="font-mono text-xs">{readTime}</span>
          </div>
          {post.frontmatter.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.frontmatter.tags.map(tag => (
                <Link
                  key={tag}
                  href={`${basePath}/tags/${encodeURIComponent(tag)}`}
                  className="tag hover:text-frc-gold hover:border-frc-gold transition-colors"
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

        {post.frontmatter.abstract && (
          <blockquote className="border-l-3 border-frc-gold pl-4 text-frc-text-dim italic mb-8">
            {post.frontmatter.abstract}
          </blockquote>
        )}

        <div className="content-body" suppressHydrationWarning>
          <MarkdownContent html={renderedBody} glossary={glossary} />
        </div>

        <RelatedPosts
          lang={lang}
          currentId={id}
          currentTags={fm.tags || []}
          basePath={basePath}
          view="kasra"
          maxResults={3}
        />

        {pageBacklinks.length > 0 && (
          <section className="backlinks">
            <h3 className="text-sm font-medium text-frc-text-dim uppercase tracking-wider mb-3">
              Linked from
            </h3>
            <ul className="space-y-1">
              {pageBacklinks.map(linkId => {
                const item = glossary[linkId];
                const href = item?.url || `${basePath}/papers/${linkId}`;
                return (
                  <li key={linkId}>
                    <a href={href} className="text-frc-gold hover:underline text-sm">
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
