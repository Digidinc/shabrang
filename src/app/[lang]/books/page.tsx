import type { Metadata } from 'next';
import { getLanguages, getStaticPageAlternates } from '@/lib/content';
import { BooksIndex } from '@/components/pages/BooksIndex';
import { BooksSidebar } from '@/components/BooksSidebar';
import { getLangBasePath } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const alternates = getStaticPageAlternates('books');
  return {
    title: 'Books',
    description: 'Long-form reading in Shabrang: The Liquid Fortress and other works.',
    alternates: {
      canonical: alternates[lang] || alternates.en,
      languages: alternates,
    },
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function BooksPage({ params }: Props) {
  const { lang } = await params;
  const basePath = getLangBasePath(lang);
  return (
    <main className="shabrang-page">
      <div className="shabrang-container">
        <div className="shabrang-layout">
          <BooksSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
          <BooksSidebar lang={lang} basePath={basePath} view="kasra" />
          <div className="shabrang-content-full">
            <BooksIndex lang={lang} basePath={basePath} view="kasra" embedded />
          </div>
        </div>
      </div>
    </main>
  );
}
