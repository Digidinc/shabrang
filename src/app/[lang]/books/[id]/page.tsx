import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { BooksSidebar } from '@/components/BooksSidebar';
import { PageShell } from '@/components/PageShell';
import { getBook, getBooks, getLanguages, toPaperMeta, getAlternateLanguages, matchesPerspectiveView } from '@/lib/content';
import { schemaPaperPage } from '@/lib/schema';
import { getChapterList } from '@/lib/bookChapters';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const books = getBooks(lang);
    for (const book of books) {
      if (book.frontmatter.id && matchesPerspectiveView(book.frontmatter.perspective, 'kasra')) {
        params.push({ lang, id: book.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const book = getBook(lang, id);
  if (!book) return { title: 'Not Found' };

  const fm = book.frontmatter;
  const author = fm.author || 'H. Servat';
  
  // Logical Canonical: Technical FRC books point to fractalresonance.com, 
  // while the primary narrative (Liquid Fortress) is canonical to shabrang.ca
  const isTechnicalFrc = fm.id.startsWith('frc-');
  const canonicalBase = isTechnicalFrc ? 'https://fractalresonance.com' : 'https://shabrang.ca';
  const bookUrl = `${canonicalBase}/${lang}/books/${fm.id}`;
  
  const alternates = getAlternateLanguages('books', fm.id);

  return {
    title: fm.title,
    description: fm.abstract,
    keywords: fm.tags,
    authors: [{ name: author }],
    alternates: {
      canonical: bookUrl,
      languages: alternates,
    },
    openGraph: {
      type: 'book',
      title: fm.title,
      description: fm.abstract,
      authors: [author],
      tags: fm.tags,
      locale: lang,
    },
  };
}

export default async function BookPage({ params }: Props) {
  const { lang, id } = await params;
  const book = getBook(lang, id);
  if (!book) notFound();

  const basePath = `/${lang}`;
  const meta = toPaperMeta(book);
  const fm = book.frontmatter;
  const chapterItems = getChapterList(book.body);

  return (
    <>
      <SchemaScript data={schemaPaperPage(meta)} />

      <PageShell
        leftMobile={<BooksSidebar lang={lang} currentId={id} chapters={chapterItems} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<BooksSidebar lang={lang} currentId={id} chapters={chapterItems} basePath={basePath} view="kasra" />}
      >
        {/* Breadcrumb */}
        <nav className="text-sm text-shabrang-ink-dim mb-6">
          <a href={basePath} className="hover:text-shabrang-gold">Shabrang</a>
          <span className="mx-2">/</span>
          <a href={`${basePath}/books`} className="hover:text-shabrang-gold">Books</a>
          <span className="mx-2">/</span>
          <span className="text-shabrang-ink">{book.frontmatter.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-shabrang-ink mb-4 uppercase tracking-wide">
            {book.frontmatter.title}
          </h1>
          <p className="text-lg text-shabrang-ink-dim italic max-w-2xl mx-auto mb-6">
            {book.frontmatter.abstract}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-shabrang-ink-dim">
            <span>{book.frontmatter.author || 'Kay Hermes'}</span>
            {book.frontmatter.date && <span>{book.frontmatter.date}</span>}
            <span>{chapterItems.length} chapters</span>
          </div>
        </header>

        {/* Chapter Grid */}
        {chapterItems.length > 0 && (
          <section>
            <h2 className="text-xs text-shabrang-teal uppercase tracking-[0.2em] mb-6 text-center">Table of Contents</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {chapterItems.map((c, idx) => (
                <Link
                  key={c.slug}
                  href={`${basePath}/books/${id}/chapter/${c.slug}`}
                  className="group block p-5 bg-shabrang-sand border-2 border-shabrang-teal/20 hover:border-shabrang-gold transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-base text-shabrang-gold font-bold shrink-0 tabular-nums w-8">
                      {String(idx).padStart(2, '0')}
                    </span>
                    <span className="text-shabrang-ink group-hover:text-shabrang-gold transition-colors font-display tracking-wide leading-snug normal-case">
                      {c.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-16 mb-8 text-center">
          <Link
            href={`${basePath}/books/${id}/chapter/${chapterItems[0]?.slug}`}
            className="inline-block px-10 py-4 bg-shabrang-teal text-shabrang-sand font-display text-lg uppercase tracking-wider hover:bg-shabrang-gold hover:text-shabrang-ink transition-all shadow-lg"
          >
            Start Reading →
          </Link>
        </div>
      </PageShell>
    </>
  );
}
