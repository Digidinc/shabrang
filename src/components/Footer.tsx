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
    <footer className={`border-t border-frc-blue mt-auto ${isRTL ? 'font-farsi' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/brand/logo.png" alt="Shabrang" width={24} height={24} className="opacity-70" />
              <span className="text-frc-gold text-sm font-medium tracking-wide">
                Shabrang
              </span>
            </div>
            <p className="text-frc-text-dim text-xs leading-relaxed max-w-sm mb-4">
              Art, philosophy, and the Persian spirit. The Liquid Fortress — a journey through coherence.
            </p>
            <div className="flex items-center gap-4 text-xs text-frc-steel">
              <span>Hadi Servat</span>
              <span className="text-frc-blue">|</span>
              <span>CC BY-NC-ND 4.0</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">{dict.footer.navigate || 'Navigate'}</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href={`${basePath}/books`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.books || 'Book'}</Link>
              <Link href={`${basePath}/articles`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.articles || 'Articles'}</Link>
              <Link href={`${basePath}/blog`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.blog || 'Blog'}</Link>
              <Link href={`${basePath}/topics`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.topics || 'Topics'}</Link>
              <Link href={`${basePath}/about`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.about || 'About'}</Link>
            </div>
          </div>

          {/* External */}
          <div>
            <p className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">{dict.footer.external || 'Connect'}</p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://www.amazon.com/dp/B0F1234567" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                Kindle
              </a>
              <a href="https://github.com/Digidinc/shabrang-cms" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                GitHub
              </a>
              <Link href="/llms.txt" className="text-frc-text-dim hover:text-frc-gold">
                llms.txt
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-frc-blue/50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="font-mono text-[0.5625rem] text-frc-steel tracking-wider" dir="ltr">
            شبرنگ — The Liquid Fortress
          </span>
          <div className="flex items-center gap-4">
            <Link href={`${basePath}/privacy`} className="font-mono text-[0.5625rem] text-frc-steel hover:text-frc-gold tracking-wider">
              {dict.footer.privacy || 'Privacy'}
            </Link>
            <Link href={`${basePath}/terms`} className="font-mono text-[0.5625rem] text-frc-steel hover:text-frc-gold tracking-wider">
              {dict.footer.terms || 'Terms'}
            </Link>
            <span className="font-mono text-[0.5625rem] text-frc-steel tracking-wider">
              Shabrang {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
