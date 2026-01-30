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
    <footer className={`border-t-2 border-shabrang-gold bg-shabrang-sand mt-auto ${isRTL ? 'font-farsi' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/brand/logo.png" alt="Shabrang" width={32} height={32} className="opacity-80" />
              <span className="text-shabrang-teal text-lg font-medium tracking-wide font-display">
                Shabrang
              </span>
            </div>
            <p className="text-shabrang-ink-dim text-sm leading-relaxed max-w-sm mb-4">
              Art, philosophy, and the Persian spirit. The Liquid Fortress — a journey through coherence.
            </p>
            <div className="flex items-center gap-4 text-xs text-shabrang-ink-dim mt-4">
              <span>Kay Hermes</span>
              <span className="text-shabrang-gold">◆</span>
              <span>CC BY-NC-ND 4.0</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-display text-xs text-shabrang-teal uppercase tracking-widest mb-4 border-b border-shabrang-gold/30 pb-2">
              {dict.footer.navigate || 'Navigate'}
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href={`${basePath}/books/liquid-fortress`} className="text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
                The Liquid Fortress
              </Link>
              <Link href={`${basePath}/art`} className="text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
                Museum of Coherence
              </Link>
              <Link href={`${basePath}/blog`} className="text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
                {dict.nav.blog || 'Blog'}
              </Link>
              <Link href={`${basePath}/topics`} className="text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
                Knowledge Garden
              </Link>
              <Link href={`${basePath}/about`} className="text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
                {dict.nav.about || 'About'}
              </Link>
            </div>
          </div>

          {/* The Seven Spheres */}
          <div>
            <p className="font-display text-xs text-shabrang-teal uppercase tracking-widest mb-4 border-b border-shabrang-gold/30 pb-2">
              Seven Spheres
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-shabrang-ink-dim">
              <span>Water — Flow</span>
              <span>Earth — Foundation</span>
              <span>Fire — Transformation</span>
              <span>Air — Spirit</span>
              <span>Gold — Sacred</span>
            </div>
          </div>

          {/* External & Social */}
          <div>
            <p className="font-display text-xs text-shabrang-teal uppercase tracking-widest mb-4 border-b border-shabrang-gold/30 pb-2">
              {dict.footer.external || 'Connect'}
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="https://www.amazon.com/LIQUID-FORTRESS-Structural-History-Persian-ebook/dp/B0GBJ47F5X" target="_blank" rel="noopener noreferrer" className="text-shabrang-ink-dim hover:text-shabrang-gold transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595.427-.163.612-.09.753.134.192.303.054.614-.334.784a21.07 21.07 0 01-8.88 1.93c-4.468 0-8.632-1.09-12.5-3.274-.16-.093-.248-.161-.248-.396v-.028c0-.124.035-.223.045-.358l-.001-.341zM5.5 12.5c0-.807.326-1.494.979-2.059.653-.565 1.436-.848 2.35-.848 1.011 0 1.778.341 2.303 1.023.478.632.717 1.414.717 2.345v.596c0 .095-.027.176-.082.244-.055.068-.127.102-.216.102H6.75c-.068 0-.102.02-.102.061 0 .463.19.862.571 1.198.38.336.856.504 1.428.504.694 0 1.267-.262 1.719-.787.089-.095.173-.142.253-.142.089 0 .165.039.228.116l.571.7c.063.082.095.163.095.244 0 .095-.047.187-.142.277-.679.665-1.617.998-2.814.998-1.113 0-2.024-.341-2.734-1.022-.71-.681-1.065-1.558-1.065-2.631v-.919h-.002zm5.094-1.25H6.852c-.068 0-.102.02-.102.061 0 .368.155.684.466.95.31.265.681.398 1.112.398.436 0 .804-.133 1.104-.398.3-.266.449-.582.449-.95 0-.041-.034-.061-.102-.061h-1.185v-.001zm8.35 1.799l2.707-4.236c.05-.095.033-.163-.051-.204l-1.063-.489c-.119-.055-.207-.027-.265.082l-1.758 2.947-1.738-2.947c-.058-.109-.146-.137-.265-.082l-1.083.489c-.085.041-.102.109-.051.204l2.687 4.236v2.539c0 .122.055.184.163.184h1.266c.109 0 .163-.062.163-.184v-2.539h-.712z" /></svg>
                Kindle Edition
              </a>
              <a href="https://github.com/Digidinc/shabrang-cms" target="_blank" rel="noopener noreferrer" className="text-shabrang-ink-dim hover:text-shabrang-gold transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                GitHub
              </a>
              <Link href="/llms.txt" className="text-shabrang-ink-dim hover:text-shabrang-gold transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                llms.txt
              </Link>
              <Link href={`${basePath}/contact`} className="text-shabrang-ink-dim hover:text-shabrang-gold transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-shabrang-teal/20 bg-shabrang-parchment">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-farsi text-sm text-shabrang-teal tracking-wider" dir="ltr">
            شبرنگ — The Liquid Fortress
          </span>
          <div className="flex items-center gap-6 text-xs">
            <Link href={`${basePath}/privacy`} className="text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
              {dict.footer.privacy || 'Privacy'}
            </Link>
            <Link href={`${basePath}/terms`} className="text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
              {dict.footer.terms || 'Terms'}
            </Link>
            <span className="text-shabrang-ink-dim">
              © {new Date().getFullYear()} Shabrang
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
