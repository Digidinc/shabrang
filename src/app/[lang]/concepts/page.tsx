import type { Metadata } from 'next';
import { getLanguages, getStaticPageAlternates } from '@/lib/content';
import { ConceptsIndex } from '@/components/pages/ConceptsIndex';
import { ConceptsSidebar } from '@/components/ConceptsSidebar';
import { getLangBasePath } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const alternates = getStaticPageAlternates('concepts');
  return {
    title: 'Concepts',
    description: 'Key terms and connective concepts used across Shabrang.',
    alternates: {
      canonical: alternates[lang] || alternates.en,
      languages: alternates,
    },
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

export default async function ConceptsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const basePath = getLangBasePath(lang);

  return (
    <main className="shabrang-page">
      <div className="shabrang-container">
        <div className="shabrang-layout">
          <ConceptsSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
          <ConceptsSidebar lang={lang} basePath={basePath} view="kasra" />
          <div className="shabrang-content-full">
            <ConceptsIndex lang={lang} basePath={basePath} view="kasra" embedded />
          </div>
        </div>
      </div>
    </main>
  );
}

