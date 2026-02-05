import type { Metadata } from 'next';
import { getLanguages, getStaticPageAlternates, getPapers } from '@/lib/content';
import { getLangBasePath } from '@/lib/site';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const alternates = getStaticPageAlternates('papers');
  return {
    title: 'Papers',
    description: 'Research papers and technical notes (when published).',
    alternates: {
      canonical: alternates[lang] || alternates.en,
      languages: alternates,
    },
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

export default async function PapersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const basePath = getLangBasePath(lang);
  const papers = getPapers(lang);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl font-light text-frc-gold tracking-tight">Papers</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
      </div>

      {papers.length === 0 ? (
        <div className="border border-frc-blue rounded-lg p-6 text-sm text-frc-text-dim">
          No papers published yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {papers.map((p) => (
            <li key={p.frontmatter.id}>
              <Link href={`${basePath}/papers/${p.frontmatter.id}`} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors">
                {p.frontmatter.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={`${basePath}/books`} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors">
          Books
        </Link>
        <Link href={`${basePath}/blog`} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors">
          Blog
        </Link>
        <Link href={`${basePath}/topics`} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors">
          Topics
        </Link>
      </div>
    </main>
  );
}

