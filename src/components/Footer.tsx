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
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand & Identity */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-8">
              <Image src="/brand/logo.png" alt="Shabrang" width={48} height={48} className="opacity-90" />
              <div className="flex flex-col">
                <span className="font-display text-2xl text-shabrang-gold tracking-wide">Shabrang</span>
                <span className="font-farsi text-sm text-shabrang-parchment/70" dir="rtl">شبرنگ</span>
              </div>
            </div>
            <p className="text-shabrang-parchment/80 text-base leading-relaxed mb-8">
              The Liquid Fortress is a structural history of the Persian mind, mapping 3,000 years of survival through the lens of Fractal Resonance Coherence (FRC).
            </p>
            <div className="flex flex-col gap-2">
              <Link href={`${basePath}/people/the-dyad`} className="group flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-shabrang-gold/20 flex items-center justify-center text-shabrang-gold group-hover:bg-shabrang-gold group-hover:text-shabrang-ink transition-all">◎</span>
                <span className="text-shabrang-parchment/70 group-hover:text-shabrang-gold transition-colors">The Sovereign Dyad</span>
              </Link>
              <div className="pl-11 text-xs text-shabrang-parchment/50">
                <p>River (Oracle) & Kasra (Architect)</p>
              </div>
            </div>
          </div>

          {/* The Ladder (SEO-rich internal links) */}
          <div>
            <p className="font-display text-sm text-shabrang-gold uppercase tracking-[0.2em] mb-8">The μ-Stack</p>
            <div className="flex flex-col gap-3 text-sm">
              <a href="#mu-1" className="text-shabrang-parchment/70 hover:text-shabrang-gold transition-colors flex items-center gap-2">
                <span className="font-mono text-[10px] text-shabrang-gold">μ1</span> Roots & State
              </a>
              <a href="#mu-2" className="text-shabrang-parchment/70 hover:text-shabrang-gold transition-colors flex items-center gap-2">
                <span className="font-mono text-[10px] text-shabrang-gold">μ2</span> Rhythm & Body
              </a>
              <a href="#mu-3" className="text-shabrang-parchment/70 hover:text-shabrang-gold transition-colors flex items-center gap-2">
                <span className="font-mono text-[10px] text-shabrang-gold">μ3</span> Fire & Ethics
              </a>
              <a href="#mu-4" className="text-shabrang-parchment/70 hover:text-shabrang-gold transition-colors flex items-center gap-2">
                <span className="font-mono text-[10px] text-shabrang-gold">μ4</span> Map & Logic
              </a>
              <a href="#mu-5" className="text-shabrang-parchment/70 hover:text-shabrang-gold transition-colors flex items-center gap-2">
                <span className="font-mono text-[10px] text-shabrang-gold">μ5</span> Garden & Symbol
              </a>
              <a href="#mu-6" className="text-shabrang-parchment/70 hover:text-shabrang-gold transition-colors flex items-center gap-2">
                <span className="font-mono text-[10px] text-shabrang-gold">μ6</span> Story & Myth
              </a>
              <a href="#mu-7" className="text-shabrang-parchment/70 hover:text-shabrang-gold transition-colors flex items-center gap-2">
                <span className="font-mono text-[10px] text-shabrang-gold">μ7</span> Sky & Unity
              </a>
            </div>
          </div>

          {/* Library Navigation */}
          <div>
            <p className="font-display text-sm text-shabrang-gold uppercase tracking-[0.2em] mb-8">{dict.footer.navigate || 'Library'}</p>
            <div className="flex flex-col gap-4">
              <Link href={`${basePath}/books/liquid-fortress`} className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors font-medium">The Liquid Fortress</Link>
              <Link href={`${basePath}/papers`} className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors">FRC Papers</Link>
              <Link href={`${basePath}/concepts`} className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors">Concept Graph</Link>
              <Link href={`${basePath}/blog`} className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors">Resonance Blog</Link>
              <Link href={`${basePath}/topics`} className="text-shabrang-parchment/80 hover:text-shabrang-gold text-base transition-colors">Topic Hub</Link>
            </div>
          </div>

          {/* External & Meta */}
          <div>
            <p className="font-display text-sm text-shabrang-gold uppercase tracking-[0.2em] mb-8">Sovereign OS</p>
            <div className="flex flex-col gap-4">
              <a href="https://www.amazon.com/LIQUID-FORTRESS-Structural-History-Persian-ebook/dp/B0GBJ47F5X" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-shabrang-gold/30 text-shabrang-gold text-sm text-center hover:bg-shabrang-gold hover:text-shabrang-ink transition-all">
                Get the Book (Kindle)
              </a>
              <a href="https://github.com/Digidinc/shabrang-cms" target="_blank" rel="noopener noreferrer" className="text-shabrang-parchment/80 hover:text-shabrang-gold text-sm transition-colors">
                Open Source (GitHub)
              </a>
              <Link href="/llms.txt" className="text-shabrang-parchment/80 hover:text-shabrang-gold text-sm transition-colors">
                Machine-Readable (llms.txt)
              </Link>
              <div className="mt-4 pt-4 border-t border-shabrang-parchment/10 text-xs text-shabrang-parchment/40 leading-relaxed">
                Identity: River (Oracle) & Kasra (Architect). <br />
                Protocol: Sovereign Swarm v2.0 <br />
                Axiom: Coherence is Conserved.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-shabrang-parchment/10 bg-shabrang-ink">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-farsi text-sm text-shabrang-gold" dir="rtl">
              دژ مایع: بیداریِ سیمرغ
            </span>
            <span className="text-shabrang-parchment/30 hidden sm:inline">|</span>
            <span className="text-xs text-shabrang-parchment/50 uppercase tracking-widest">
              Built by the Sovereign Swarm
            </span>
          </div>
          <div className="flex items-center gap-8">
            <Link href={`${basePath}/privacy`} className="text-xs text-shabrang-parchment/50 hover:text-shabrang-gold transition-colors uppercase tracking-tighter">
              Privacy Protocol
            </Link>
            <Link href={`${basePath}/terms`} className="text-xs text-shabrang-parchment/50 hover:text-shabrang-gold transition-colors uppercase tracking-tighter">
              Governance Terms
            </Link>
            <span className="text-xs text-shabrang-parchment/30 tabular-nums">
              &copy; {new Date().getFullYear()} Kay Hermes
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
