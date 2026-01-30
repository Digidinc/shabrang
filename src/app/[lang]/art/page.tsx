import type { Metadata } from 'next';
import { getLanguages, getArtItems, matchesPerspectiveView } from '@/lib/content';
import { MuseumIndex, type ArtifactItem } from '@/components/pages/MuseumIndex';

export const metadata: Metadata = {
  title: 'The Imaginal Gallery | Museum of Coherence',
  description: 'Reading history through the Shabrang lens. A collection of Persian artifacts analyzed through the physics of resonance and survival.',
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

  // Fetch art items server-side and transform for client component
  const rawItems = getArtItems(lang)
    .filter((a) => matchesPerspectiveView(a.frontmatter.perspective, 'kasra'));

  const items: ArtifactItem[] = rawItems.map((a) => {
    const fm = a.frontmatter as unknown as Record<string, unknown>;
    return {
      id: a.frontmatter.id,
      title: a.frontmatter.title,
      level: typeof fm.level === 'string' ? fm.level : undefined,
      artifact_type: typeof fm.artifact_type === 'string' ? fm.artifact_type : undefined,
      frc_analysis: typeof fm.frc_analysis === 'string' ? fm.frc_analysis : undefined,
    };
  });

  return (
    <main className="shabrang-page">
      <div className="shabrang-container">
        <MuseumIndex basePath={basePath} items={items} />
      </div>
    </main>
  );
}
