'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getBasePath, getLangFromPathname, getPerspectiveFromPathname } from '@/lib/site';

interface SearchItem {
  id: string;
  title: string;
  abstract?: string;
  type: string;
  lang: string;
  path: string;
  content: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const lang = getLangFromPathname(pathname, 'en');
  const isFA = lang === 'fa';

  // Fetch index on mount
  useEffect(() => {
    fetch('/search-index.json')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Failed to load search index', err));
  }, []);

  const navigate = (url: string) => {
    const perspective = getPerspectiveFromPathname(pathname);
    const basePath = getBasePath(lang, perspective);

    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Adjust path for current language/perspective
    if (url.startsWith(`/${lang}/`)) {
      const tail = url.slice(`/${lang}`.length);
      router.push(`${basePath}${tail}`);
      return;
    }

    router.push(url);
  };

  // Toggle on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filter items
  const filteredItems = useMemo(() => {
    // Only show items for the current language
    const langItems = items.filter(i => i.lang === lang);
    if (!query) return langItems.slice(0, 5);
    
    const lowerQ = query.toLowerCase();
    return langItems.filter(item => 
      item.title.toLowerCase().includes(lowerQ) || 
      item.id.toLowerCase().includes(lowerQ) ||
      item.abstract?.toLowerCase().includes(lowerQ)
    ).slice(0, 8);
  }, [items, query, lang]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Navigation Logic
  useEffect(() => {
    if (!isOpen || filteredItems.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          navigate(filteredItems[selectedIndex].path);
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-shabrang-ink/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-shabrang-parchment border border-shabrang-gold/30 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-shabrang-teal/20 px-4 py-4 bg-shabrang-parchment-dark">
          <svg className="w-5 h-5 text-shabrang-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
            <input
              autoFocus
              type="text"
              placeholder={isFA ? "جستجو در کتاب، دست‌سازه‌ها، یادداشت‌ها..." : "Search book, artifacts, blog..."}
              className="flex-1 bg-transparent border-none outline-none text-shabrang-ink placeholder:text-shabrang-ink-dim text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              dir={isFA ? "rtl" : "ltr"}
            />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-shabrang-teal border border-shabrang-teal/30 rounded bg-shabrang-parchment">
            ESC
          </kbd>
        </div>

        <div className="py-2 max-h-[60vh] overflow-y-auto bg-shabrang-parchment">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-shabrang-ink-dim text-sm">
              {isFA ? `نتیجه‌ای برای "${query}" یافت نشد` : `No results found for "${query}"`}
            </div>
          ) : (
            <ul className="text-sm">
              {filteredItems.map((item, index) => (
                <li
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-4 py-3 cursor-pointer flex items-center justify-between group transition-colors ${
                    index === selectedIndex ? 'bg-shabrang-gold/10 border-l-2 border-shabrang-gold' : 'border-l-2 border-transparent'
                  }`}
                  dir={isFA ? "rtl" : "ltr"}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-shabrang-teal bg-shabrang-teal/10 px-1.5 py-0.5 rounded">
                        {item.type}
                      </span>
                      <span className={`font-display uppercase tracking-wide truncate ${index === selectedIndex ? 'text-shabrang-ink' : 'text-shabrang-ink-dim group-hover:text-shabrang-ink'}`}>
                        {item.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-shabrang-ink-dim/60 font-mono truncate">
                      {item.id} {item.abstract ? `• ${item.abstract}` : ''}
                    </div>
                  </div>
                  {index === selectedIndex && (
                     <svg className="w-4 h-4 text-shabrang-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isFA ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                     </svg>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-shabrang-ink px-4 py-2 border-t border-shabrang-gold/20 flex justify-between items-center text-[9px] text-shabrang-gold/50 uppercase tracking-widest">
           <span>
             <strong className="text-shabrang-gold">Shabrang</strong> Search Engine
           </span>
           <div className="flex gap-4">
             <span>Select <kbd className="font-sans">↵</kbd></span>
             <span>Navigate <kbd className="font-sans">↑↓</kbd></span>
           </div>
        </div>
      </div>
    </div>
  );
}
