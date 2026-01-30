'use client';

import Link from 'next/link';
import { useState } from 'react';

export interface ArtifactItem {
  id: string;
  title: string;
  level?: string;
  artifact_type?: string;
  frc_analysis?: string;
}

interface MuseumIndexProps {
  basePath: string;
  items: ArtifactItem[];
}

export function MuseumIndex({ basePath, items }: MuseumIndexProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // List of artifacts that have been upgraded to OpenAI PNGs
  const upgradedArtIds = new Set([
    'cyrus-cylinder',
    'qanat-mother-well',
    'winged-figure-pasargadae',
    'shahnameh-tahmasp',
    'qashqai-tribal-rug',
    'dervish-sikka',
    'rostam-relief-archetype',
    'turquoise-dome-isfahan',
    'persian-astrolabe',
    'ardabil-carpet'
  ]);

  const getImagePath = (id: string) => {
    if (imageErrors.has(id)) {
      return null; // Show fallback
    }
    return upgradedArtIds.has(id) ? `/images/artifacts/${id}.png` : `/images/artifacts/${id}.svg`;
  };

  const handleImageError = (id: string) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

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
        {items.length === 0 ? (
          <div className="border-2 border-shabrang-teal/30 p-12 text-center text-shabrang-ink-dim">
            <p className="text-lg mb-2">The gallery is being prepared.</p>
            <p className="text-sm">Artifacts will appear here soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {items.map((item) => {
              const imagePath = getImagePath(item.id);

              return (
                <Link
                  key={item.id}
                  href={`${basePath}/art/${item.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-shabrang-ink border-2 border-shabrang-teal group-hover:border-shabrang-gold transition-all duration-500 shadow-lg group-hover:shadow-xl">
                    {/* Art Image or Fallback */}
                    {imagePath ? (
                      <img
                        src={imagePath}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        onError={() => handleImageError(item.id)}
                      />
                    ) : (
                      /* Fallback: Decorative placeholder */
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-shabrang-teal/20 to-shabrang-ink">
                        <div className="text-center">
                          <div className="text-5xl text-shabrang-gold/40 font-display mb-2">✦</div>
                          <span className="text-shabrang-gold/60 text-xs uppercase tracking-widest">
                            {item.artifact_type || 'Artifact'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-shabrang-ink/90 via-shabrang-ink/20 to-transparent" />

                    {/* Labels */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {item.level && (
                        <span className="bg-shabrang-gold text-shabrang-ink px-2.5 py-1 text-[10px] font-mono font-bold tracking-tighter">
                          {item.level.toUpperCase()}
                        </span>
                      )}
                      <span className="bg-shabrang-white/90 text-shabrang-teal px-2.5 py-1 text-[9px] uppercase tracking-widest border border-shabrang-teal/30">
                        {item.artifact_type || 'Artifact'}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="font-display text-lg md:text-xl text-shabrang-white group-hover:text-shabrang-gold transition-colors mb-2 uppercase tracking-wide">
                        {item.title}
                      </h3>
                      <div className="h-0.5 w-0 group-hover:w-full bg-shabrang-gold transition-all duration-500" />
                      {item.frc_analysis && (
                        <p className="mt-3 text-[11px] text-shabrang-white/60 line-clamp-2 uppercase tracking-widest">
                          {item.frc_analysis}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

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
