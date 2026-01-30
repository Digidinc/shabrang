'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Shabrang navigation
  const navLinks = [
    { path: '/books/liquid-fortress', label: 'Book' },
    { path: '/art', label: 'Art' },
    { path: '/blog', label: 'Blog' },
    { path: '/topics', label: 'Topics' },
    { path: '/about', label: 'About' },
  ];

  const toggleSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <>
      <style jsx>{`
        .shabrang-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--sand, #F5E6C8);
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        .search-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border: 1px solid var(--gold, #C9A227);
          background: var(--parchment, #F9F3E3);
          color: var(--teal-dark, #1A4A4A);
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-trigger:hover {
          background: var(--gold, #C9A227);
          color: var(--ink, #1A1A18);
        }

        .search-kbd {
          background: var(--teal, #2D5A6B);
          color: var(--sand, #F5E6C8);
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.6rem;
        }

        /* Top micro-bar */
        .micro-bar {
          border-bottom: 1px solid var(--gold, #C9A227);
          background: var(--parchment, #F9F3E3);
        }

        .micro-bar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 6px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .micro-bar-left {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 0.6875rem;
          color: var(--teal-dark, #1A4A4A);
          letter-spacing: 0.05em;
        }

        .micro-bar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .micro-bar-divider {
          color: var(--gold, #C9A227);
          opacity: 0.5;
        }

        /* Main navigation */
        .main-nav {
          border-bottom: 2px solid var(--gold, #C9A227);
          background: var(--sand, #F5E6C8);
        }

        .main-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: opacity 0.3s ease;
        }

        .logo-link:hover {
          opacity: 0.8;
        }

        .logo-img {
          width: 36px;
          height: 36px;
          opacity: 0.9;
        }

        .logo-text {
          font-family: 'Cinzel', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--teal, #2D5A6B);
          letter-spacing: 0.05em;
        }

        /* Desktop nav - Tailwind handles visibility via hidden/flex md:flex */
        .nav-links {
          align-items: center;
          gap: 8px;
        }

        .nav-link {
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--teal-dark, #1A4A4A);
          text-decoration: none;
          padding: 8px 16px;
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
        }

        .nav-link:hover {
          color: var(--crimson, #8B3535);
          border-bottom-color: var(--gold, #C9A227);
        }

        .nav-link.active {
          color: var(--crimson, #8B3535);
          border-bottom-color: var(--gold, #C9A227);
        }

        /* Mobile menu button */
        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: transparent;
          border: 1px solid var(--gold, #C9A227);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
          background: var(--gold, #C9A227);
        }

        .mobile-menu-btn:hover .menu-icon {
          stroke: var(--ink, #1A1A18);
        }

        .menu-icon {
          width: 20px;
          height: 20px;
          stroke: var(--teal, #2D5A6B);
          stroke-width: 2;
          fill: none;
        }

        /* Mobile menu */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 54px; /* Height of header approximately */
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--parchment, #F9F3E3);
          border-top: 2px solid var(--gold, #C9A227);
          padding: 24px;
          z-index: 100;
          overflow-y: auto;
        }

        .mobile-menu.open {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .mobile-menu {
            display: none !important;
          }
        }

        .mobile-nav-link {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 1.25rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--teal-dark, #1A4A4A);
          text-decoration: none;
          padding: 16px 0;
          border-bottom: 1px solid var(--gold, #C9A227);
          transition: color 0.3s ease;
          text-align: center;
        }

        .mobile-nav-link:hover {
          color: var(--crimson, #8B3535);
        }

        .mobile-nav-link:last-child {
          border-bottom: none;
        }
      `}</style>

      <header className="shabrang-header" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Top micro-bar */}
        <div className="micro-bar">
          <div className="micro-bar-inner">
            <span className="micro-bar-left">
              شبرنگ — shabrang.ca
            </span>
            <div className="micro-bar-right">
              <LanguageSelector />
              <span className="micro-bar-divider">|</span>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="main-nav">
          <div className="main-nav-inner">
            <Link href={basePath} className="logo-link">
              <Image
                src="/brand/logo.png"
                alt="Shabrang"
                width={36}
                height={36}
                className="logo-img"
              />
              <span className="logo-text">Shabrang</span>
            </Link>

            {/* Desktop nav - hidden on mobile, flex on md+ */}
            <div className="nav-links hidden md:flex">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  href={`${basePath}${link.path}`}
                  className={`nav-link ${pathname === `${basePath}${link.path}` ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={toggleSearch}
                className="search-trigger ml-4"
                title="Search (Cmd+K)"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
                <kbd className="search-kbd">⌘K</kbd>
              </button>
            </div>

            {/* Mobile menu button - visible on mobile, hidden on md+ */}
            <button
              className="mobile-menu-btn flex md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="menu-icon" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg className="menu-icon" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu - placed outside header to escape stacking context */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link
            key={link.path}
            href={`${basePath}${link.path}`}
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
