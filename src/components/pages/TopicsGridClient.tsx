'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export interface TopicsGridItem {
  id: string;
  title: string;
  question?: string;
  shortAnswer?: string;
  abstract?: string;
  date?: string;
  href: string;
  tags: string[];
  answersCount?: number;
}

export function TopicsGridClient({ items }: { items: TopicsGridItem[] }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string>('All');

  const tags = useMemo(() => {
    const t = Array.from(new Set(items.flatMap((i) => i.tags || []))).sort((a, b) => a.localeCompare(b));
    return ['All', ...t];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (tag !== 'All' && !(i.tags || []).includes(tag)) return false;
      if (!q) return true;
      const hay = `${i.title} ${i.id} ${(i.question || '')} ${(i.shortAnswer || i.abstract || '')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, tag]);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics…"
            className="w-full sm:max-w-md bg-shabrang-white border-2 border-shabrang-teal/30 px-4 py-2 text-sm text-shabrang-ink placeholder:text-shabrang-ink-dim focus:outline-none focus:border-shabrang-gold transition-colors"
            aria-label="Search topics"
          />
          <div className="text-xs text-shabrang-ink-dim">
            Showing <span className="text-shabrang-ink">{filtered.length}</span> of{' '}
            <span className="text-shabrang-ink">{items.length}</span>
          </div>
        </div>

        {tags.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 18).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`text-[0.65rem] uppercase tracking-wider px-3 py-1.5 border-2 transition-colors ${
                  tag === t
                    ? 'border-shabrang-gold text-shabrang-gold bg-shabrang-gold/10'
                    : 'border-shabrang-teal/30 text-shabrang-ink-dim hover:text-shabrang-ink hover:border-shabrang-gold/50'
                }`}
              >
                {t === 'All' ? 'All tags' : t}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="border-2 border-shabrang-teal/30 p-8 text-center text-shabrang-ink-dim">
          No results. Try a different keyword or tag.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((t) => (
            <Link
              key={t.id}
              href={t.href}
              className="block border-2 border-shabrang-teal/20 bg-shabrang-white px-5 py-4 hover:border-shabrang-gold transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-shabrang-ink group-hover:text-shabrang-gold transition-colors font-display tracking-wide">
                    {t.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-shabrang-ink-dim">
                    {t.date && <span>{t.date}</span>}
                    {typeof t.answersCount === 'number' && (
                      <span className="font-mono">{t.answersCount} answers</span>
                    )}
                  </div>
                  {(t.shortAnswer || t.abstract) && (
                    <p className="text-sm text-shabrang-ink-dim mt-2 line-clamp-2 italic">
                      {t.shortAnswer || t.abstract}
                    </p>
                  )}
                </div>
                <span className="text-shabrang-teal group-hover:text-shabrang-gold transition-colors shrink-0">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
