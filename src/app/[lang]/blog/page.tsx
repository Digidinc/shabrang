import type { Metadata } from 'next';
import { getLanguages, getStaticPageAlternates } from '@/lib/content';
import { BlogIndex } from '@/components/pages/BlogIndex';
import { BlogSidebar } from '@/components/BlogSidebar';
import { getLangBasePath } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const alternates = getStaticPageAlternates('blog');
  return {
    title: 'Blog',
    description: 'Essays and field notes from Shabrang — Persian wisdom through dialogue.',
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

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  const basePath = getLangBasePath(lang);

  return (
    <main className="shabrang-page">
      <div className="shabrang-container">
        <div className="shabrang-layout">
          <BlogSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
          <BlogSidebar lang={lang} basePath={basePath} view="kasra" />
          <div className="shabrang-content-full">
            <BlogIndex lang={lang} basePath={basePath} view="kasra" embedded />
          </div>
        </div>
      </div>
    </main>
  );
}
