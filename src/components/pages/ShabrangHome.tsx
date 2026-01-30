'use client';

import Link from 'next/link';

const VERSION = '5.0.0';
const BUILD_DATE = '2026-01-30';

export function ShabrangHome({ lang }: { lang: string }) {
  return (
    <>
      <style jsx global>{`
        /* ===========================================
           SHABRANG COLOR PALETTE
           Persian Miniature Manuscript Aesthetic
           =========================================== */
        :root {
            --sand: #F5E6C8;
            --sand-light: #FDF8EE;
            --sand-dark: #E8D4A8;
            --parchment: #F9F3E3;
            --gold: #C9A227;
            --gold-light: #D4B84B;
            --gold-dark: #A68A1F;
            --teal: #2D5A6B;
            --teal-dark: #1A4A4A;
            --teal-light: #3D7A8B;
            --crimson: #8B3535;
            --crimson-dark: #6B2525;
            --crimson-light: #A84545;
            --ink: #1A1A18;
            --ink-light: #2D2D2A;
            --green: #3D5C3D;
            --white: #FFFEF9;
        }

        /* Dark mode palette */
        .dark {
            --sand: #0D1A1A;
            --sand-light: #142424;
            --sand-dark: #071212;
            --parchment: #0D1A1A;
            --gold: #D4A84B;
            --gold-light: #E4B85B;
            --gold-dark: #B8922B;
            --teal: #3D7A8B;
            --teal-dark: #2D5A6B;
            --teal-light: #4D8A9B;
            --crimson: #A04545;
            --crimson-dark: #8B3535;
            --crimson-light: #B55555;
            --ink: #F5E6C8;
            --ink-light: #E8D4A8;
            --green: #4D6C4D;
            --white: #1A1A18;
        }

        /* ===========================================
           SHABRANG HORSE SILHOUETTE (SVG Data URI)
           =========================================== */
        :root {
            --horse-silhouette: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 80'%3E%3Cpath d='M85 35c-2-8-8-12-12-12-2 0-3 1-4 2l-4-8c-1-2-3-3-5-3-1 0-2 0-3 1l-6-10c-2-3-6-5-10-5-5 0-9 3-11 7l-3 6c-2 0-4 1-5 3l-4 8c-1-1-2-2-4-2-4 0-10 4-12 12-2 8 2 15 8 18l3 2v12c0 2 2 4 4 4h8c2 0 4-2 4-4v-6h24v6c0 2 2 4 4 4h8c2 0 4-2 4-4v-12l3-2c6-3 10-10 8-18z' fill='%23C9A227' opacity='0.08'/%3E%3C/svg%3E");
            --horse-gold: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 80'%3E%3Cpath d='M85 35c-2-8-8-12-12-12-2 0-3 1-4 2l-4-8c-1-2-3-3-5-3-1 0-2 0-3 1l-6-10c-2-3-6-5-10-5-5 0-9 3-11 7l-3 6c-2 0-4 1-5 3l-4 8c-1-1-2-2-4-2-4 0-10 4-12 12-2 8 2 15 8 18l3 2v12c0 2 2 4 4 4h8c2 0 4-2 4-4v-6h24v6c0 2 2 4 4 4h8c2 0 4-2 4-4v-12l3-2c6-3 10-10 8-18z' fill='%23C9A227' opacity='0.15'/%3E%3C/svg%3E");
            --corner-ornament: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Cpath d='M0 0h60v3H3v57H0z' fill='%23C9A227'/%3E%3Cpath d='M8 8h44v2H10v42H8z' fill='%23C9A227' opacity='0.5'/%3E%3Ccircle cx='4' cy='4' r='2' fill='%23C9A227'/%3E%3C/svg%3E");
        }

        /* ===========================================
           BASE STYLES FOR HOMEPAGE
           =========================================== */
        .shabrang-home {
            font-family: 'Cormorant Garamond', Georgia, serif;
            background-color: var(--parchment);
            color: var(--ink);
            line-height: 1.8;
            font-size: 1.125rem;
            background-image:
                radial-gradient(ellipse at 20% 30%, rgba(201, 162, 39, 0.03) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(139, 53, 53, 0.02) 0%, transparent 50%),
                url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
        }

        .shabrang-home h1, .shabrang-home h2, .shabrang-home h3, .shabrang-home h4, .shabrang-home h5, .shabrang-home h6 {
            font-family: 'Cinzel', serif;
            font-weight: 600;
            letter-spacing: 0.05em;
            line-height: 1.3;
        }

        .shabrang-home a {
            color: var(--teal);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .shabrang-home a:hover {
            color: var(--crimson);
        }

        .shabrang-home .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
        }

        /* ===========================================
           HERO SECTION
           =========================================== */
        .shabrang-home .hero {
            min-height: 90vh;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, var(--sand) 0%, var(--parchment) 50%, var(--sand-dark) 100%);
            position: relative;
            overflow: hidden;
            border-bottom: 4px solid var(--gold);
        }

        .shabrang-home .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image:
                url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L80 40L40 80L0 40z' fill='none' stroke='%23C9A227' stroke-width='0.5' opacity='0.12'/%3E%3C/svg%3E");
            background-size: 80px 80px;
            pointer-events: none;
        }

        .shabrang-home .hero::after {
            content: '';
            position: absolute;
            bottom: 40px;
            right: 40px;
            width: 200px;
            height: 160px;
            background: var(--horse-gold);
            background-size: contain;
            background-repeat: no-repeat;
            opacity: 0.4;
            pointer-events: none;
            transform: scaleX(-1);
        }

        .shabrang-home .hero-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            align-items: center;
            position: relative;
            z-index: 1;
            padding: 80px 0;
        }

        .shabrang-home .hero-text {
            max-width: 600px;
        }

        .shabrang-home .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: var(--teal);
            color: var(--sand);
            padding: 8px 20px;
            font-family: 'Cinzel', serif;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 32px;
        }

        .shabrang-home .hero-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            color: var(--ink);
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .shabrang-home .hero-subtitle {
            font-size: clamp(1.25rem, 2.5vw, 1.75rem);
            color: var(--crimson);
            font-style: italic;
            margin-bottom: 32px;
            font-weight: 400;
        }

        .shabrang-home .hero-description {
            font-size: 1.25rem;
            color: var(--teal-dark);
            margin-bottom: 40px;
            line-height: 1.9;
        }

        .shabrang-home .hero-cta {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .shabrang-home .btn {
            display: inline-block;
            padding: 16px 36px;
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border: 2px solid;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .shabrang-home .btn-primary {
            background: var(--teal);
            color: var(--sand);
            border-color: var(--teal);
        }

        .shabrang-home .btn-primary:hover {
            background: var(--sand);
            color: var(--teal);
        }

        .shabrang-home .btn-secondary {
            background: transparent;
            color: var(--crimson);
            border-color: var(--crimson);
        }

        .shabrang-home .btn-secondary:hover {
            background: var(--crimson);
            color: var(--sand);
        }

        .shabrang-home .btn-gold {
            background: var(--gold);
            color: var(--ink);
            border-color: var(--gold);
        }

        .shabrang-home .btn-gold:hover {
            background: var(--ink);
            color: var(--gold);
        }

        .shabrang-home .hero-image img {
            width: 100%;
            max-width: 500px;
            border: 4px solid var(--ink);
            box-shadow: 12px 12px 0 var(--gold);
        }

        .shabrang-home .hero-image-caption {
            background: var(--ink);
            color: var(--gold);
            padding: 16px 24px;
            font-family: 'Cinzel', serif;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-align: center;
            margin-top: -4px;
        }

        /* ===========================================
           DIVIDERS
           =========================================== */
        .shabrang-home .divider-horse {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 32px 0;
            position: relative;
        }

        .shabrang-home .divider-horse::before,
        .shabrang-home .divider-horse::after {
            content: '';
            flex: 1;
            max-width: 180px;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--gold) 50%, transparent);
        }

        .shabrang-home .divider-horse-icon {
            width: 60px;
            height: 48px;
            background: var(--horse-gold);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin: 0 24px;
            opacity: 0.6;
        }

        /* ===========================================
           SECTIONS
           =========================================== */
        .shabrang-home .section {
            padding: 80px 0;
        }

        .shabrang-home .section-dark {
            background: var(--teal-dark);
            color: var(--sand);
        }

        .shabrang-home .section-cream {
            background: var(--white);
        }

        .shabrang-home .section-sand {
            background: var(--sand);
        }

        .shabrang-home .section-crimson {
            background: var(--crimson);
            color: var(--sand);
        }

        .shabrang-home .section-header {
            text-align: center;
            margin-bottom: 60px;
        }

        .shabrang-home .section-title {
            font-size: clamp(2rem, 4vw, 3rem);
            margin-bottom: 20px;
            position: relative;
            display: inline-block;
            padding-bottom: 16px;
        }

        .shabrang-home .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: var(--gold);
        }

        .shabrang-home .section-dark .section-title {
            color: var(--gold);
        }

        .shabrang-home .section-description {
            font-size: 1.25rem;
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.8;
        }

        /* ===========================================
           BOOK FEATURE
           =========================================== */
        .shabrang-home .book-feature {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 60px;
            align-items: center;
        }

        .shabrang-home .book-cover img {
            width: 100%;
            max-width: 400px;
            border: 4px solid var(--ink);
            box-shadow: 8px 8px 0 var(--gold);
        }

        .shabrang-home .book-info h3 {
            font-size: 2rem;
            color: var(--teal-dark);
            margin-bottom: 16px;
        }

        .shabrang-home .book-info .author {
            font-style: italic;
            color: var(--crimson);
            margin-bottom: 24px;
            font-size: 1.125rem;
        }

        .shabrang-home .book-info p {
            margin-bottom: 24px;
            font-size: 1.125rem;
            line-height: 1.9;
        }

        .shabrang-home .book-stats {
            display: flex;
            gap: 40px;
            margin-bottom: 32px;
            flex-wrap: wrap;
        }

        .shabrang-home .stat {
            text-align: center;
        }

        .shabrang-home .stat-number {
            font-family: 'Cinzel', serif;
            font-size: 2.5rem;
            color: var(--gold);
            font-weight: 700;
        }

        .shabrang-home .stat-label {
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--teal-dark);
        }

        /* ===========================================
           QUOTE BLOCK
           =========================================== */
        .shabrang-home .quote-block {
            padding: 80px 24px;
            background: var(--teal);
            text-align: center;
        }

        .shabrang-home .quote-text {
            font-size: clamp(1.25rem, 3vw, 1.75rem);
            font-style: italic;
            color: var(--sand);
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.9;
        }

        .shabrang-home .quote-author {
            margin-top: 24px;
            color: var(--gold);
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        /* ===========================================
           GUARDIAN GRID
           =========================================== */
        .shabrang-home .guardian-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 16px;
            margin-bottom: 40px;
        }

        @media (max-width: 1200px) {
            .shabrang-home .guardian-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }

        @media (max-width: 768px) {
            .shabrang-home .guardian-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .shabrang-home .guardian-card {
            background: var(--white);
            border: 3px solid var(--ink);
            padding: 24px 16px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            text-decoration: none;
            color: inherit;
            display: block;
        }

        .shabrang-home .guardian-card:hover {
            transform: translateY(-8px);
            box-shadow: 8px 8px 0 var(--gold);
            border-color: var(--teal);
        }

        .shabrang-home .guardian-mu {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--teal);
            color: var(--sand);
            padding: 4px 12px;
            font-family: monospace;
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.05em;
        }

        .shabrang-home .guardian-icon {
            font-size: 2.5rem;
            margin-bottom: 12px;
            display: block;
        }

        .shabrang-home .guardian-title {
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            color: var(--ink);
            margin-bottom: 4px;
        }

        .shabrang-home .guardian-persian {
            font-family: 'Vazirmatn', sans-serif;
            font-size: 0.9rem;
            color: var(--crimson);
            direction: rtl;
        }

        .shabrang-home .guardian-card[data-level="1"] { border-top: 4px solid #8B4513; }
        .shabrang-home .guardian-card[data-level="2"] { border-top: 4px solid #CD853F; }
        .shabrang-home .guardian-card[data-level="3"] { border-top: 4px solid var(--crimson); }
        .shabrang-home .guardian-card[data-level="4"] { border-top: 4px solid var(--teal); }
        .shabrang-home .guardian-card[data-level="5"] { border-top: 4px solid var(--green); }
        .shabrang-home .guardian-card[data-level="6"] { border-top: 4px solid var(--gold); }
        .shabrang-home .guardian-card[data-level="7"] { border-top: 4px solid #9370DB; }

        .shabrang-home .complete-human-box {
            background: var(--teal);
            color: var(--sand);
            padding: 40px;
            text-align: center;
            border: 3px solid var(--gold);
        }

        .shabrang-home .complete-human-box h3 {
            font-family: 'Cinzel', serif;
            color: var(--gold);
            font-size: 1.5rem;
            margin-bottom: 16px;
        }

        .shabrang-home .complete-human-box p {
            font-size: 1.125rem;
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.8;
        }

        /* ===========================================
           TALES GRID
           =========================================== */
        .shabrang-home .tales-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 32px;
        }

        .shabrang-home .tale-card {
            background: var(--white);
            border: 3px solid var(--ink);
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .shabrang-home .tale-card:hover {
            transform: translateY(-4px);
            box-shadow: 8px 8px 0 var(--gold);
        }

        .shabrang-home .tale-image {
            height: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .shabrang-home .tale-emoji {
            font-size: 4rem;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
        }

        .shabrang-home .tale-content {
            padding: 24px;
        }

        .shabrang-home .tale-title {
            font-family: 'Cinzel', serif;
            font-size: 1.25rem;
            color: var(--ink);
            margin-bottom: 8px;
        }

        .shabrang-home .tale-persian {
            font-family: 'Vazirmatn', sans-serif;
            color: var(--crimson);
            font-size: 1rem;
            margin-bottom: 16px;
            direction: rtl;
        }

        .shabrang-home .tale-lesson {
            font-size: 0.9375rem;
            line-height: 1.7;
            color: var(--teal-dark);
        }

        /* ===========================================
           CHAPTERS GRID
           =========================================== */
        .shabrang-home .chapters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
        }

        .shabrang-home .chapter-card {
            background: var(--white);
            border: 2px solid var(--ink);
            padding: 32px;
            transition: all 0.3s ease;
            position: relative;
            text-decoration: none;
            color: inherit;
            display: block;
        }

        .shabrang-home .chapter-card:hover {
            transform: translateY(-4px);
            box-shadow: 6px 6px 0 var(--gold);
            border-color: var(--teal);
        }

        .shabrang-home .chapter-badge {
            position: absolute;
            top: 16px;
            right: 16px;
            font-family: 'Cinzel', serif;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 6px 14px;
        }

        .shabrang-home .chapter-badge.free {
            background: var(--teal);
            color: var(--sand);
        }

        .shabrang-home .chapter-badge.premium {
            background: var(--gold);
            color: var(--ink);
        }

        .shabrang-home .chapter-number {
            font-family: 'Cinzel', serif;
            font-size: 0.875rem;
            color: var(--crimson);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
        }

        .shabrang-home .chapter-title {
            font-size: 1.25rem;
            color: var(--ink);
            margin-bottom: 12px;
            font-family: 'Cinzel', serif;
        }

        .shabrang-home .chapter-meta {
            font-size: 1rem;
            color: var(--teal);
            font-style: italic;
        }

        /* ===========================================
           CTA SECTION
           =========================================== */
        .shabrang-home .section-crimson .section-title {
            color: var(--sand);
        }

        /* ===========================================
           RESPONSIVE
           =========================================== */
        @media (max-width: 968px) {
            .shabrang-home .hero-content {
                grid-template-columns: 1fr;
                text-align: center;
            }

            .shabrang-home .hero-image {
                order: -1;
            }

            .shabrang-home .hero::after {
                display: none;
            }

            .shabrang-home .hero-cta {
                justify-content: center;
            }

            .shabrang-home .book-feature {
                grid-template-columns: 1fr;
                text-align: center;
            }

            .shabrang-home .book-stats {
                justify-content: center;
            }
        }

        @media (max-width: 600px) {
            .shabrang-home .hero {
                min-height: auto;
                padding: 40px 0;
            }

            .shabrang-home .section {
                padding: 48px 0;
            }
        }
      `}</style>

      <main className="shabrang-home">
        {/* HERO SECTION */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <div className="hero-badge">
                  <span>Art, Philosophy &amp; The Persian Spirit</span>
                </div>
                <h1 className="hero-title">The Liquid Fortress</h1>
                <p className="hero-subtitle">A Structural History of the Persian Mind</p>
                <p className="hero-description">
                  Why did Persia survive 3,000 years of invasion when every other ancient civilization died?
                  Discover the architecture of meaning that could not be burned.
                </p>
                <div className="hero-cta">
                  <Link href={`/${lang}/books/liquid-fortress`} className="btn btn-primary">Read Free Chapters</Link>
                  <a href="https://www.amazon.com/LIQUID-FORTRESS-Structural-History-Persian-ebook/dp/B0GBJ47F5X" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Get the Book</a>
                </div>
              </div>
              <div className="hero-image">
                <img src="/images/landing/poster.png" alt="The Liquid Fortress - Persian Miniature" />
                <div className="hero-image-caption">Persian Miniature Tradition</div>
              </div>
            </div>
          </div>
        </section>

        {/* DIVIDER WITH HORSE */}
        <div className="divider-horse">
          <span className="divider-horse-icon"></span>
        </div>

        {/* BOOK SECTION */}
        <section className="section section-cream">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">The Book</h2>
              <p className="section-description">
                30 illustrated chapters exploring 3,000 years of Persian cultural survival through the FRC framework.
              </p>
            </div>
            <div className="book-feature">
              <div className="book-cover">
                <img src="/images/landing/qanat.png" alt="The Qanat - Underground water system" />
              </div>
              <div className="book-info">
                <h3>The Liquid Fortress</h3>
                <p className="author">By Kay Hermes</p>
                <p>
                  Alexander the Great burned Persepolis. The Arabs conquered the empire.
                  The Mongols slaughtered millions. Egypt fell. Babylon fell. Assyria fell.
                  They became footnotes, their languages dead, their identities absorbed.
                </p>
                <p>
                  <strong style={{ color: 'var(--crimson)' }}>But Iran is still here.</strong>{' '}
                  Speaking Persian. Writing poetry. Celebrating Nowruz. How?
                </p>
                <div className="book-stats">
                  <div className="stat">
                    <div className="stat-number">3,000</div>
                    <div className="stat-label">Years</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">7</div>
                    <div className="stat-label">Collapses</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">30</div>
                    <div className="stat-label">Chapters</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <Link href={`/${lang}/books/liquid-fortress`} className="btn btn-gold">Start Reading</Link>
                  <a href="https://www.amazon.com/LIQUID-FORTRESS-Structural-History-Persian-ebook/dp/B0GBJ47F5X" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">Kindle Edition</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section className="quote-block">
          <p className="quote-text">
            "The Persian does not build walls to keep enemies out. He builds gardens to keep meaning in."
          </p>
          <p className="quote-author">— The Liquid Fortress</p>
        </section>

        {/* FRAMEWORK SECTION - The 7 Heavens */}
        <section className="section section-dark" id="seven-heavens">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">The Seven Heavens</h2>
              <p className="section-description" style={{ color: 'var(--sand)' }}>
                The mu-Stack: Seven floors of reality, from Matter to Unity. A vertical architecture for civilizational survival.
              </p>
            </div>

            {/* The Ladder Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
              <div>
                <img src="/images/landing/ladder.png" alt="The Ladder of Consciousness" style={{ width: '100%', border: '4px solid var(--gold)', boxShadow: '8px 8px 0 var(--teal)' }} />
              </div>
              <div>
                <h3 style={{ color: 'var(--gold)', fontFamily: "'Cinzel', serif", fontSize: '1.75rem', marginBottom: '24px' }}>The Ladder of Consciousness</h3>
                <p style={{ color: 'var(--sand)', fontSize: '1.125rem', lineHeight: 1.9, marginBottom: '20px' }}>
                  A civilization is not a territory. It is a <strong>vertical stack of seven resonant layers</strong>.
                  Most civilizations build Stone Fortresses — heavy on the Roots. When the State falls, they die.
                </p>
                <p style={{ color: 'var(--sand)', fontSize: '1.125rem', lineHeight: 1.9, marginBottom: '20px' }}>
                  Persia built a <strong style={{ color: 'var(--gold)' }}>Liquid Fortress</strong> — learning to move its soul up and down the ladder,
                  storing its identity in whichever layer was safe from the fire.
                </p>
                <p style={{ color: 'var(--sand)', fontSize: '1.125rem', lineHeight: 1.9 }}>
                  To survive, a system must be <strong>strong on all seven floors</strong>.
                </p>
                <div style={{ marginTop: '32px' }}>
                  <Link href={`/${lang}/books/liquid-fortress`} className="btn btn-gold">Learn the Framework</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GUARDIAN GRID SECTION */}
        <section className="section section-sand" id="guardians">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">The Seven Guardians</h2>
              <p className="section-description">
                The archetypes who guard the Seven Floors of the Liquid Fortress — the human interface of the mu-Stack.
              </p>
            </div>

            {/* Guardian Grid */}
            <div className="guardian-grid">
              <Link href={`/${lang}/books/liquid-fortress`} className="guardian-card" data-level="1">
                <span className="guardian-mu">μ1</span>
                <span className="guardian-icon">👑</span>
                <h4 className="guardian-title">The King</h4>
                <p className="guardian-persian">شاه</p>
              </Link>
              <Link href={`/${lang}/books/liquid-fortress`} className="guardian-card" data-level="2">
                <span className="guardian-mu">μ2</span>
                <span className="guardian-icon">🌙</span>
                <h4 className="guardian-title">The Mother</h4>
                <p className="guardian-persian">مادر</p>
              </Link>
              <Link href={`/${lang}/books/liquid-fortress`} className="guardian-card" data-level="3">
                <span className="guardian-mu">μ3</span>
                <span className="guardian-icon">⚔️</span>
                <h4 className="guardian-title">The Knight</h4>
                <p className="guardian-persian">پهلوان</p>
              </Link>
              <Link href={`/${lang}/books/liquid-fortress`} className="guardian-card" data-level="4">
                <span className="guardian-mu">μ4</span>
                <span className="guardian-icon">📜</span>
                <h4 className="guardian-title">The Vizier</h4>
                <p className="guardian-persian">وزیر</p>
              </Link>
              <Link href={`/${lang}/books/liquid-fortress`} className="guardian-card" data-level="5">
                <span className="guardian-mu">μ5</span>
                <span className="guardian-icon">🌹</span>
                <h4 className="guardian-title">The Poet</h4>
                <p className="guardian-persian">شاعر</p>
              </Link>
              <Link href={`/${lang}/books/liquid-fortress`} className="guardian-card" data-level="6">
                <span className="guardian-mu">μ6</span>
                <span className="guardian-icon">📖</span>
                <h4 className="guardian-title">The Storyteller</h4>
                <p className="guardian-persian">گوسان</p>
              </Link>
              <Link href={`/${lang}/books/liquid-fortress`} className="guardian-card" data-level="7">
                <span className="guardian-mu">μ7</span>
                <span className="guardian-icon">✨</span>
                <h4 className="guardian-title">The Sage</h4>
                <p className="guardian-persian">پیر</p>
              </Link>
            </div>

            <div className="complete-human-box">
              <h3>The Complete Human — Insān-i Kāmil</h3>
              <p>The Persian ideal is not to <em>become</em> one archetype, but to <em>integrate</em> all seven. The Full-Stack human who can operate on any floor as the situation demands.</p>
            </div>
          </div>
        </section>

        {/* PERSIAN TALES SECTION */}
        <section className="section section-cream">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">The Survival Tales</h2>
              <p className="section-description">
                The folk tales of the nursery are not random entertainment. They form a systematic curriculum in Liquid Fortress strategy.
              </p>
            </div>
            <div className="tales-grid">
              <div className="tale-card">
                <div className="tale-image" style={{ background: 'linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)' }}>
                  <span className="tale-emoji">🐟</span>
                </div>
                <div className="tale-content">
                  <h3 className="tale-title">The Little Black Fish</h3>
                  <p className="tale-persian">ماهی سیاه کوچولو</p>
                  <p className="tale-lesson"><strong>The Lesson:</strong> The individual must sometimes leave the safety of the school to discover truth. Courage is more important than comfort.</p>
                </div>
              </div>
              <div className="tale-card">
                <div className="tale-image" style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}>
                  <span className="tale-emoji">🎃</span>
                </div>
                <div className="tale-content">
                  <h3 className="tale-title">The Rolling Pumpkin</h3>
                  <p className="tale-persian">کدو قلقله زن</p>
                  <p className="tale-lesson"><strong>The Lesson:</strong> When faced with overwhelming force, do not fight directly. Adopt disguises, use momentum, be spherical and slippery.</p>
                </div>
              </div>
              <div className="tale-card">
                <div className="tale-image" style={{ background: 'linear-gradient(135deg, var(--crimson) 0%, var(--crimson-dark) 100%)' }}>
                  <span className="tale-emoji">⚔️</span>
                </div>
                <div className="tale-content">
                  <h3 className="tale-title">Rostam and Sohrab</h3>
                  <p className="tale-persian">رستم و سهراب</p>
                  <p className="tale-lesson"><strong>The Lesson:</strong> Even the greatest hero can commit the greatest crime through ignorance. Recognition comes too late. The price of blindness is irreversible.</p>
                </div>
              </div>
              <div className="tale-card">
                <div className="tale-image" style={{ background: 'linear-gradient(135deg, var(--ink) 0%, var(--teal-dark) 100%)' }}>
                  <span className="tale-emoji">🦅</span>
                </div>
                <div className="tale-content">
                  <h3 className="tale-title">The Conference of the Birds</h3>
                  <p className="tale-persian">منطق الطیر</p>
                  <p className="tale-lesson"><strong>The Lesson:</strong> The God you seek is the Self that seeks. The journey is the destination. The Simorgh is Si-morgh (thirty birds).</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTERS SECTION */}
        <section className="section section-sand">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">The Chapters</h2>
            </div>
            <div className="chapters-grid">
              <Link href={`/${lang}/books/liquid-fortress/chapter/01-enigma`} className="chapter-card">
                <span className="chapter-badge free">Free</span>
                <div className="chapter-number">Chapter 1</div>
                <h3 className="chapter-title">The Fortress and the Corridor</h3>
                <p className="chapter-meta">Roots &amp; Geometry</p>
              </Link>
              <Link href={`/${lang}/books/liquid-fortress/chapter/02-collapse`} className="chapter-card">
                <span className="chapter-badge free">Free</span>
                <div className="chapter-number">Chapter 2</div>
                <h3 className="chapter-title">The Lens of FRC</h3>
                <p className="chapter-meta">Methodology</p>
              </Link>
              <Link href={`/${lang}/books/liquid-fortress/chapter/03-binary`} className="chapter-card">
                <span className="chapter-badge free">Free</span>
                <div className="chapter-number">Chapter 3</div>
                <h3 className="chapter-title">The First Binary</h3>
                <p className="chapter-meta">Asha &amp; Druj</p>
              </Link>
              <Link href={`/${lang}/books/liquid-fortress/chapter/04-border`} className="chapter-card">
                <span className="chapter-badge free">Free</span>
                <div className="chapter-number">Chapter 4</div>
                <h3 className="chapter-title">The Myth of the Border</h3>
                <p className="chapter-meta">Arash &amp; Sacrifice</p>
              </Link>
              <Link href={`/${lang}/books/liquid-fortress/chapter/11-conquest`} className="chapter-card">
                <span className="chapter-badge premium">Premium</span>
                <div className="chapter-number">Chapter 11</div>
                <h3 className="chapter-title">The Shock of Conquest</h3>
                <p className="chapter-meta">Qadisiyah</p>
              </Link>
              <Link href={`/${lang}/books/liquid-fortress/chapter/16-light-architect`} className="chapter-card">
                <span className="chapter-badge premium">Premium</span>
                <div className="chapter-number">Chapter 16</div>
                <h3 className="chapter-title">The Architect of Light</h3>
                <p className="chapter-meta">Suhrawardi</p>
              </Link>
            </div>
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href={`/${lang}/books/liquid-fortress`} className="btn btn-primary">View All 30 Chapters</Link>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="section section-crimson">
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 className="section-title">Enter the Fortress</h2>
            <p className="section-description" style={{ color: 'var(--sand)', marginBottom: '40px' }}>
              The first 5 chapters are completely free. Start your journey into 3,000 years of Persian survival.
            </p>
            <Link href={`/${lang}/books/liquid-fortress`} className="btn btn-gold">Start Reading Free</Link>
          </div>
        </section>

        {/* Version */}
        <div style={{ padding: '16px', textAlign: 'center', background: 'var(--ink)' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(245, 230, 200, 0.3)', fontFamily: 'monospace' }}>
            v{VERSION} · {BUILD_DATE}
          </span>
        </div>
      </main>
    </>
  );
}
