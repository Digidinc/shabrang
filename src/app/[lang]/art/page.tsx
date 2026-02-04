import type { Metadata } from 'next';
import { getLanguages, getArtItems, matchesPerspectiveView, getStaticPageAlternates } from '@/lib/content';
import { MuseumIndex, type ArtifactItem } from '@/components/pages/MuseumIndex';
import { getLangBasePath } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const alternates = getStaticPageAlternates('art');
  return {
    title: 'The Imaginal Gallery',
    description: 'A museum of artifacts and images — reading Persian history through the Shabrang lens.',
    alternates: {
      canonical: alternates[lang] || alternates.en,
      languages: alternates,
    },
  };
}

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ArtPage({ params }: Props) {
  const { lang } = await params;
  const basePath = getLangBasePath(lang);

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
