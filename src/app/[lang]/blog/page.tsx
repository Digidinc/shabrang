import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { BlogIndex } from '@/components/pages/BlogIndex';
import { BlogSidebar } from '@/components/BlogSidebar';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Down-to-earth notes and field reports from the Fractal Resonance Cognition project.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;

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

