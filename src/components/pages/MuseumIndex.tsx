import Link from 'next/link';
import { getArtItems, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

interface MuseumIndexProps {
  lang: string;
  basePath: string;
  view: PerspectiveView;
}

export function MuseumIndex({ lang, basePath, view }: MuseumIndexProps) {
  const artifacts = getArtItems(lang)
    .filter((a) => matchesPerspectiveView(a.frontmatter.perspective, view));

  // Helper to safely access extended frontmatter properties
  const getFm = (a: typeof artifacts[0]) => a.frontmatter as unknown as Record<string, unknown>;

  return (
    <div className="min-h-screen py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-16 md:mb-24 text-center">
          <div className="inline-block px-4 py-1.5 border-2 border-shabrang-gold text-shabrang-gold text-[10px] uppercase tracking-[0.3em] mb-8">
            The Imaginal Gallery
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-shabrang-ink mb-8 uppercase tracking-wider">
            Museum of Coherence
          </h1>
          <p className="text-shabrang-ink-dim text-lg md:text-xl max-w-2xl mx-auto leading-relaxed italic">
            Reading history through the X-ray of FRC. Every artifact is a node in the 3,000-year flow of the Liquid Fortress.
          </p>
        </header>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {artifacts.map((a) => (
            <Link
              key={a.frontmatter.id}
              href={`${basePath}/art/${a.frontmatter.id}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-shabrang-white border-3 border-shabrang-teal group-hover:border-shabrang-gold transition-all duration-500 shadow-lg group-hover:shadow-xl">
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-shabrang-teal/20 via-shabrang-parchment to-shabrang-gold/10 group-hover:scale-105 transition-transform duration-700">
                  <div className="w-full h-full flex items-center justify-center text-shabrang-teal/30 text-6xl font-display">
                    {String(getFm(a).level || '').toUpperCase()}
                  </div>
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-shabrang-ink/90 via-shabrang-ink/20 to-transparent" />

                {/* Labels */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-shabrang-gold text-shabrang-ink px-2.5 py-1 text-[10px] font-mono font-bold tracking-tighter">
                    {String(getFm(a).level || '').toUpperCase()}
                  </span>
                  <span className="bg-shabrang-white/90 text-shabrang-teal px-2.5 py-1 text-[9px] uppercase tracking-widest border border-shabrang-teal/30">
                    {String(getFm(a).artifact_type || 'Artifact')}
                  </span>
                </div>

                {/* Info */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-display text-lg md:text-xl text-shabrang-white group-hover:text-shabrang-gold transition-colors mb-2 uppercase tracking-wide">
                    {a.frontmatter.title}
                  </h3>
                  <div className="h-0.5 w-0 group-hover:w-full bg-shabrang-gold transition-all duration-500" />
                  <p className="mt-3 text-[11px] text-shabrang-white/60 line-clamp-2 uppercase tracking-widest">
                    {String(getFm(a).frc_analysis || '')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-24 md:mt-32 text-center border-t-2 border-shabrang-gold/30 pt-12">
          <p className="text-shabrang-ink-dim text-xs uppercase tracking-[0.4em]">
            Artifacts are seeds. The garden is eternal.
          </p>
        </div>
      </div>
    </div>
  );
}
