'use client';

import React from 'react';
import type { DramaSet, HorseType } from '@/lib/content';

interface DramaStreamProps {
  drama: Record<string, DramaSet>;
  lang: string;
}

export function DramaStream({ drama, lang }: DramaStreamProps) {
  // Flatten all drama into a list of entries
  const allEntries: Array<{ id: string; horse: HorseType; content: string; source?: string }> = [];
  
  Object.entries(drama).forEach(([anchorId, set]) => {
    (['shabrang', 'rakhsh', 'shabdiz'] as HorseType[]).forEach(horse => {
      const entry = set[horse];
      if (entry) {
        allEntries.push({
          id: `${anchorId}-${horse}`,
          horse,
          content: entry.content,
          source: entry.source
        });
      }
    });
  });

  return (
    <div className="drama-stream">
      <div className="flex items-center justify-between mb-6 border-b border-shabrang-gold pb-2">
        <h3 className="font-display text-sm uppercase tracking-widest text-shabrang-ink">The Drama</h3>
        <span className="text-[10px] font-mono text-shabrang-ink-dim uppercase">Triad Observations</span>
      </div>

      {allEntries.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-shabrang-gold/30">
          <p className="text-shabrang-ink-dim text-sm italic px-4">
            The horses are silent on this chapter. The field is clear.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {allEntries.map((entry) => (
            <div key={entry.id} className="drama-card animate-fade-in">
              <span className={`drama-horse-tag ${
                entry.horse === 'shabrang' ? 'text-shabrang-crimson' :
                entry.horse === 'rakhsh' ? 'text-shabrang-teal' :
                'text-shabrang-gold'
              }`}>
                {entry.horse}
              </span>
              <p className="text-shabrang-ink text-sm leading-relaxed italic">
                "{entry.content}"
              </p>
              {entry.source && (
                <div className="mt-4 pt-2 border-t border-shabrang-gold/10 text-[9px] font-mono text-shabrang-ink-dim uppercase">
                  Ref: {entry.source}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contribution Mechanism */}
      <div className="mt-12 p-6 border-2 border-dashed border-shabrang-gold/50 bg-shabrang-sand/30">
        <h4 className="font-display text-xs uppercase tracking-widest text-shabrang-ink mb-2">Join the Ordeal</h4>
        <p className="text-shabrang-ink-dim text-[11px] leading-relaxed mb-4">
          Have an opinion? Provide your perspective. Accepted entries will be incorporated into the drama.
        </p>
        <button className="w-full py-2 bg-shabrang-ink text-shabrang-sand font-display text-[10px] uppercase tracking-widest hover:bg-shabrang-gold hover:text-shabrang-ink transition-all">
          Submit Perspective
        </button>
        <p className="text-[9px] text-shabrang-ink-dim italic mt-3 text-center">
          Moderated by River & The Architect
        </p>
      </div>
    </div>
  );
}
