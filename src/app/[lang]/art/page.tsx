import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { MuseumIndex } from '@/components/pages/MuseumIndex';

export const metadata: Metadata = {
  title: 'The Imaginal Gallery | Museum of Coherence',
  description: 'Reading history through the FRC lens. A collection of Persian artifacts analyzed through the physics of resonance and survival.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ArtPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
  return (
    <main className="shabrang-page">
      <div className="shabrang-container">
        <MuseumIndex lang={lang} basePath={basePath} view="kasra" />
      </div>
    </main>
  );
}
