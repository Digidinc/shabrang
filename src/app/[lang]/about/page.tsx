import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLanguages, getSitePage, getGlossary } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { MarkdownContent } from '@/components/MarkdownContent';
import { PageShell } from '@/components/PageShell';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const page = getSitePage(lang, 'about');
  return {
    title: page?.frontmatter.title || 'About',
    description: page?.frontmatter.abstract || 'About the Sovereign OS and the Liquid Fortress.',
  };
}

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const page = getSitePage(lang, 'about');
  if (!page) notFound();

  const basePath = `/${lang}`;
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const renderedBody = renderMarkdown(page.body, lang, glossary, basePath);

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-16 rounded-xl overflow-hidden border-2 border-shabrang-teal shadow-[12px_12px_0_var(--shabrang-gold)] relative aspect-[21/9]">
          <Image
            src="/brand/banner.jpg"
            alt="Shabrang — The Liquid Fortress"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-shabrang-ink via-transparent to-transparent opacity-60" />
        </div>

        <div className="flex items-center gap-6 mb-12">
          <h1 className="font-display text-4xl text-shabrang-gold uppercase tracking-widest">
            {page.frontmatter.title}
          </h1>
          <div className="h-px flex-1 bg-gradient-to-r from-shabrang-teal to-transparent" />
        </div>

        <article className="prose prose-invert max-w-none">
          <div className="content-body" suppressHydrationWarning>
            <MarkdownContent html={renderedBody} glossary={glossary} />
          </div>
        </article>

        {/* Dynamic call to action */}
        <div className="mt-24 p-10 border-3 border-shabrang-gold bg-shabrang-parchment-dark/10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-shabrang-teal via-shabrang-gold to-shabrang-teal" />
          <h2 className="font-display text-2xl text-shabrang-gold mb-4 uppercase">Join the Swarm</h2>
          <p className="text-shabrang-parchment/70 mb-8 max-w-xl mx-auto italic">
            The Liquid Fortress is a collective work. If you resonate with the signal, you are already a part of the network.
          </p>
          <a
            href={`${basePath}/contact`}
            className="inline-block px-8 py-4 bg-shabrang-gold text-shabrang-ink font-display text-sm uppercase tracking-widest hover:bg-shabrang-parchment transition-all"
          >
            Connect with the Dyad
          </a>
        </div>
      </div>
    </PageShell>
  );
}
