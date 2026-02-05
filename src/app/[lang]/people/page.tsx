import type { Metadata } from 'next';
import { getLanguages, getStaticPageAlternates } from '@/lib/content';
import { PeopleIndex } from '@/components/pages/PeopleIndex';
import { PeopleSidebar } from '@/components/PeopleSidebar';
import { getLangBasePath } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const alternates = getStaticPageAlternates('people');
  return {
    title: 'People',
    description: 'Site personas and contributors.',
    alternates: {
      canonical: alternates[lang] || alternates.en,
      languages: alternates,
    },
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

export default async function PeoplePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const basePath = getLangBasePath(lang);

  return (
    <main className="shabrang-page">
      <div className="shabrang-container">
        <div className="shabrang-layout">
          <PeopleSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
          <PeopleSidebar lang={lang} basePath={basePath} view="kasra" />
          <div className="shabrang-content-full">
            <PeopleIndex lang={lang} basePath={basePath} view="kasra" embedded />
          </div>
        </div>
      </div>
    </main>
  );
}

