import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { BooksIndex } from '@/components/pages/BooksIndex';
import { BooksSidebar } from '@/components/BooksSidebar';

export const metadata: Metadata = {
  title: 'Books',
  description: 'Longer-form writing for Shabrang (primers, textbooks, and narrative frames).',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function BooksPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
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
