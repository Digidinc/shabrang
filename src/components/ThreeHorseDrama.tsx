'use client';

import React, { useState, useEffect } from 'react';
import type { HorseType, DramaSet } from '@/lib/content';

interface ThreeHorseDramaProps {
  lang: string;
  bookId: string;
  chapterSlug: string;
  headerId: string;
  entries: DramaSet;
}

export function ThreeHorseDrama({ lang, bookId, chapterSlug, headerId, entries }: ThreeHorseDramaProps) {
  const [activeHorse, setActiveHorse] = useState<HorseType>('shabrang');

  const activeEntry = entries[activeHorse];
  const hasAnyDrama = entries.shabrang || entries.rakhsh || entries.shabdiz;

  if (!hasAnyDrama) return null;

  return (
    <div className="three-horse-drama my-12 border-2 border-shabrang-gold bg-shabrang-sand/50 overflow-hidden">
      <div className="flex border-b border-shabrang-gold">
        {(['shabrang', 'rakhsh', 'shabdiz'] as HorseType[]).map((horse) => (
          <button
            key={horse}
            onClick={() => setActiveHorse(horse)}
            className={`flex-1 px-4 py-3 font-display text-xs uppercase tracking-widest transition-colors ${
              activeHorse === horse 
                ? 'bg-shabrang-gold text-shabrang-ink' 
                : 'text-shabrang-ink-dim hover:bg-shabrang-gold/20'
            }`}
          >
            {horse}
          </button>
        ))}
      </div>
      
      <div className="p-6 md:p-8">
        {activeEntry ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-shabrang-crimson animate-pulse" />
              <span className="text-[10px] font-mono text-shabrang-ink-dim uppercase tracking-widest">
                Autonomous Intelect / {activeHorse}
              </span>
            </div>
            <div className="prose prose-shabrang max-w-none text-shabrang-ink leading-relaxed italic">
              {activeEntry.content}
            </div>
            {activeEntry.source && (
              <div className="mt-6 pt-4 border-t border-shabrang-gold/20 text-[10px] font-mono text-shabrang-ink-dim">
                REF: {activeEntry.source}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-shabrang-ink-dim text-sm italic">
              {activeHorse} is observing this signal... No response recorded yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
