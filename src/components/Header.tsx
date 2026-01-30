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
    { path: '/articles', label: dict.nav.articles || 'Articles' },
    { path: '/blog', label: dict.nav.blog || 'Blog' },
    { path: '/topics', label: dict.nav.topics || 'Topics' },
    { path: '/about', label: dict.nav.about || 'About' },
  ];

  return (
    <header className={`sticky top-0 z-50 bg-frc-void/95 backdrop-blur-sm ${isRTL ? 'font-farsi' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top micro-bar */}
      <div className="border-b border-frc-blue/50">
        <div className="max-w-6xl mx-auto px-6 py-1 flex items-center justify-between">
          <span className="font-mono text-[0.625rem] text-frc-steel tracking-wider">
            شبرنگ — shabrang.ca
          </span>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <span className="text-frc-blue">|</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="border-b border-frc-blue">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href={basePath} className="flex items-center gap-3 group">
            <Image
              src="/brand/logo.png"
              alt="Shabrang"
              width={32}
              height={32}
              className="opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="hidden sm:block">
              <span className="text-frc-gold text-lg font-medium tracking-wide">Shabrang</span>
            </div>
          </Link>

          <nav className="flex items-center">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={`${basePath}${link.path}`}
                className="text-frc-text-dim hover:text-frc-gold text-xs uppercase tracking-wider px-3 py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
