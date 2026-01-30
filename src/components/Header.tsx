'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { getDictionary } from '@/lib/dictionaries';
import { getLangFromPathname } from '@/lib/site';

// RTL languages
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

export function Header() {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname, 'en');
  const basePath = `/${lang}`;
  const isRTL = RTL_LANGUAGES.includes(lang);
  const dict = getDictionary(lang);

  // Shabrang navigation - focused on artsy content
  const navLinks = [
    { path: '/books', label: dict.nav.books || 'Book' },
    { path: '/art', label: 'Art' },
    { path: '/blog', label: dict.nav.blog || 'Blog' },
    { path: '/topics', label: dict.nav.topics || 'Topics' },
    { path: '/about', label: dict.nav.about || 'About' },
  ];

  return (
    <header className={`sticky top-0 z-50 bg-shabrang-parchment/95 backdrop-blur-sm border-b-2 border-shabrang-teal ${isRTL ? 'font-farsi' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main navigation - Persian miniature aesthetic */}
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo and brand */}
        <Link href={basePath} className="flex items-center gap-4 group">
          <Image
            src="/brand/logo.png"
            alt="Shabrang"
            width={48}
            height={48}
            className="opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <div className="flex flex-col">
            <span className="font-display text-2xl text-shabrang-teal tracking-wide">Shabrang</span>
            <span className="font-farsi text-sm text-shabrang-crimson" dir="rtl">شبرنگ</span>
          </div>
        </Link>

        {/* Navigation links - larger, bolder */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map(link => (
            <Link
              key={link.path}
              href={`${basePath}${link.path}`}
              className="font-display text-base text-shabrang-ink hover:text-shabrang-crimson uppercase tracking-wider px-4 py-2 transition-colors relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-shabrang-gold group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Language and theme controls */}
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <span className="w-px h-6 bg-shabrang-teal/30" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
