import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MarkdownContent } from '@/components/MarkdownContent';
import { PageShell } from '@/components/PageShell';
import { PeopleSidebar } from '@/components/PeopleSidebar';
import { getPerson, getPeople, getLanguages, getGlossary, getAlternateLanguages, matchesPerspectiveView } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { getLangBasePath } from '@/lib/site';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const people = getPeople(lang);
    for (const p of people) {
      if (p.frontmatter.id && matchesPerspectiveView(p.frontmatter.perspective, 'kasra')) {
        params.push({ lang, id: p.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const person = getPerson(lang, id);
  if (!person) return { title: 'Not Found' };

  const fm = person.frontmatter;
  const basePath = getLangBasePath(lang);
  const url = `https://shabrang.ca${basePath}/people/${fm.id}`;
  const alternates = getAlternateLanguages('people', fm.id);

  return {
    title: fm.title,
    description: fm.tagline || fm.abstract,
    keywords: fm.tags,
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      type: 'profile',
      title: fm.title,
      description: fm.tagline || fm.abstract,
      locale: lang,
      url,
      ...(fm.avatar ? { images: [fm.avatar] } : {}),
    },
  };
}

export default async function PersonPage({ params }: Props) {
  const { lang, id } = await params;
  const person = getPerson(lang, id);
  if (!person) notFound();
  if (!matchesPerspectiveView(person.frontmatter.perspective, 'kasra')) notFound();

  const basePath = getLangBasePath(lang);
  const homeHref = basePath || '/';
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const fm = person.frontmatter;
  const renderedBody = renderMarkdown(person.body, lang, glossary, basePath);

  return (
    <PageShell
      leftMobile={<PeopleSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" variant="mobile" />}
      leftDesktop={<PeopleSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" />}
      articleClassName="shabrang-content-full"
    >
      <nav className="text-sm text-shabrang-ink-dim mb-8">
        <a href={homeHref} className="hover:text-shabrang-gold">Shabrang</a>
        <span className="mx-2">/</span>
        <a href={`${basePath}/people`} className="hover:text-shabrang-gold">People</a>
        <span className="mx-2">/</span>
        <span className="text-shabrang-ink">{fm.title}</span>
      </nav>

      <header className="mb-10 flex items-start gap-6">
        {fm.avatar ? (
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-shabrang-gold/40 bg-shabrang-ink/10 shrink-0">
            <Image src={fm.avatar} alt={fm.title} fill className="object-cover" />
          </div>
        ) : null}

        <div className="min-w-0">
          <h1 className="font-display text-3xl md:text-4xl text-shabrang-ink uppercase tracking-wide">
            {fm.title}
          </h1>
          <div className="mt-2 text-sm text-shabrang-ink-dim flex flex-wrap gap-3">
            {fm.role ? <span>{fm.role}</span> : null}
            {fm.tagline ? <span className="italic">{fm.tagline}</span> : null}
            {fm.perspective ? <span className="font-mono text-xs">{fm.perspective}</span> : null}
          </div>

          {Array.isArray(fm.links) && fm.links.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {fm.links.map((l, idx) => {
                const href = l?.url ? String(l.url) : '';
                if (!href) return null;
                const label = l?.label ? String(l.label) : href;
                const isExternal = href.startsWith('http');
                return (
                  <a
                    key={`${href}-${idx}`}
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="text-xs uppercase tracking-wider px-3 py-2 border-2 border-shabrang-teal/30 text-shabrang-ink-dim hover:text-shabrang-gold hover:border-shabrang-gold transition-colors"
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </header>

      <div className="content-body" suppressHydrationWarning>
        <MarkdownContent html={renderedBody} glossary={glossary} />
      </div>
    </PageShell>
  );
}

