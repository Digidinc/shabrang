import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogGridClient, type BlogGridItem } from '@/components/pages/BlogGridClient';
import { PageShell } from '@/components/PageShell';
import { BlogSidebar } from '@/components/BlogSidebar';
import { getContentsByTag, getAllTags, getLanguages, estimateReadTime, matchesPerspectiveView } from '@/lib/content';
import { getLangBasePath } from '@/lib/site';

interface Props {
  params: Promise<{ lang: string; tag: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; tag: string }[] = [];

  for (const lang of languages) {
    const tags = getAllTags(lang);
    for (const tag of tags) {
      params.push({ lang, tag });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `Posts tagged "${decodedTag}"`,
    description: `All content tagged with ${decodedTag} on Shabrang.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { lang, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const basePath = getLangBasePath(lang);
  const homeHref = basePath || '/';

  // Get all content with this tag
  const contents = getContentsByTag(lang, decodedTag);

  if (contents.length === 0) {
    notFound();
  }

  // Filter by perspective (kasra view) and convert to grid items
  const items: BlogGridItem[] = contents
    .filter((c) => matchesPerspectiveView(c.frontmatter.perspective, 'kasra'))
    .map((content, idx) => {
      const fm = content.frontmatter;
      const readTime = fm.read_time || estimateReadTime(content.body);
      const voice = fm.voice || (fm.perspective === 'river' ? 'river' : fm.perspective === 'kasra' ? 'kasra' : undefined);
      const level = (fm as any).level || undefined;

      // Determine content type and URL
      let href = `${basePath}/blog/${fm.id}`;
      if (fm.question) {
        href = `${basePath}/topics/${fm.id}`;
      } else if (fm.role || fm.tagline) {
        href = `${basePath}/people/${fm.id}`;
      }

      return {
        id: fm.id,
        title: fm.title,
        abstract: fm.abstract || fm.short_answer || fm.tagline,
        date: fm.date,
        href,
        tags: fm.tags || [],
        voice,
        level,
        readTime,
        ordinal: idx + 1,
      };
    });

  return (
    <PageShell
      leftMobile={<BlogSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />}
      leftDesktop={<BlogSidebar lang={lang} basePath={basePath} view="kasra" />}
    >
      {/* Breadcrumb */}
      <nav className="text-sm text-frc-text-dim mb-8">
        <a href={homeHref} className="hover:text-frc-gold">Shabrang</a>
        <span className="mx-2">/</span>
        <a href={`${basePath}/blog`} className="hover:text-frc-gold">Blog</a>
        <span className="mx-2">/</span>
        <span className="text-frc-text">#{decodedTag}</span>
      </nav>

      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="tag text-lg px-4 py-2">#{decodedTag}</span>
            <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
          </div>
          <p className="text-frc-text-dim leading-relaxed">
            {items.length} {items.length === 1 ? 'post' : 'posts'} tagged with <strong className="text-frc-gold">{decodedTag}</strong>
          </p>
        </header>

        <BlogGridClient items={items} lang={lang} />
      </div>
    </PageShell>
  );
}
