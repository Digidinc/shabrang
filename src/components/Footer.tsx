'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import { getBasePath, getLangFromPathname, getPerspectiveFromPathname } from '@/lib/site';

// RTL languages
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

export function Footer() {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname, 'en');
  const perspective = getPerspectiveFromPathname(pathname);
  const basePath = getBasePath(lang, perspective);
  const isRTL = RTL_LANGUAGES.includes(lang);
  const dict = getDictionary(lang);

  return (
    <footer className={`border-t-2 border-shabrang-teal bg-shabrang-teal-dark mt-auto ${isRTL ? 'font-farsi' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-shabrang-crimson via-shabrang-gold to-shabrang-crimson" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid sm:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Image src="/brand/logo.png" alt="Shabrang" width={40} height={40} className="opacity-90" />
              <div className="flex flex-col">
                <span className="font-display text-xl text-shabrang-gold tracking-wide">Shabrang</span>
                <span className="font-farsi text-sm text-shabrang-parchment/70" dir="rtl">شبرنگ</span>
              </div>
            </div>
            <p className="text-shabrang-parchment/80 text-base leading-relaxed max-w-sm mb-6">
              Art, philosophy, and the Persian spirit. The Liquid Fortress — a journey through coherence.
            </p>
            <div className="flex items-center gap-4 text-sm text-shabrang-parchment/60">
              <span>Kay Hermes</span>
              <span className="text-shabrang-gold">|</span>
              <span>CC BY-NC-ND 4.0</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-display text-sm text-shabrang-gold uppercase tracking-[0.2em] mb-6">{dict.footer.navigate || 'Navigate'}</p>
            <div className="flex flex-col gap-3">
              <Link href={`${basePath}/books`} className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors">{dict.nav.books || 'Book'}</Link>
              <Link href={`${basePath}/art`} className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors">Art</Link>
              <Link href={`${basePath}/blog`} className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors">{dict.nav.blog || 'Blog'}</Link>
              <Link href={`${basePath}/topics`} className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors">{dict.nav.topics || 'Topics'}</Link>
              <Link href={`${basePath}/about`} className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors">{dict.nav.about || 'About'}</Link>
            </div>
          </div>

          {/* External */}
          <div>
            <p className="font-display text-sm text-shabrang-gold uppercase tracking-[0.2em] mb-6">{dict.footer.external || 'Connect'}</p>
            <div className="flex flex-col gap-3">
              <a href="https://www.amazon.com/LIQUID-FORTRESS-Structural-History-Persian-ebook/dp/B0GBJ47F5X" target="_blank" rel="noopener noreferrer" className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors">
                Kindle
              </a>
              <a href="https://github.com/Digidinc/shabrang-cms" target="_blank" rel="noopener noreferrer" className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors">
                GitHub
              </a>
              <Link href="/llms.txt" className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors">
                llms.txt
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-shabrang-parchment/20">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <span className="font-farsi text-sm text-shabrang-parchment/60" dir="ltr">
            شبرنگ — The Liquid Fortress
          </span>
          <div className="flex items-center gap-6">
            <Link href={`${basePath}/privacy`} className="text-sm text-shabrang-parchment/60 hover:text-shabrang-gold transition-colors">
              {dict.footer.privacy || 'Privacy'}
            </Link>
            <Link href={`${basePath}/terms`} className="text-sm text-shabrang-parchment/60 hover:text-shabrang-gold transition-colors">
              {dict.footer.terms || 'Terms'}
            </Link>
            <span className="text-sm text-shabrang-parchment/60">
              Shabrang {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
