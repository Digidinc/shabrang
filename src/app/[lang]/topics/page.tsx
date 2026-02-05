import type { Metadata } from 'next';
import { getLanguages, getStaticPageAlternates } from '@/lib/content';
import { TopicsIndex } from '@/components/pages/TopicsIndex';
import { TopicsSidebar } from '@/components/TopicsSidebar';
import { getLangBasePath } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const alternates = getStaticPageAlternates('topics');
  return {
    title: 'Topics',
    description: 'Guides and question-led hubs across Shabrang (culture, philosophy, myth).',
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

export default async function TopicsPage({ params }: Props) {
  const { lang } = await params;
  const basePath = getLangBasePath(lang);

  return (
    <main className="shabrang-page">
      <div className="shabrang-container">
        <div className="shabrang-layout">
          <TopicsSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
          <TopicsSidebar lang={lang} basePath={basePath} view="kasra" />
          <div className="shabrang-content-full">
            <TopicsIndex lang={lang} basePath={basePath} view="kasra" embedded />
          </div>
        </div>
      </div>
    </main>
  );
}
