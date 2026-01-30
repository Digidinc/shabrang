'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const SHABRANG_VIDEO = 'g0NU9xjdn38';
const PART_IV_VIDEO = 'Fp1Z3KpuSng';

const MU_LEVELS = [
  {
    level: 1,
    name: 'Roots',
    persian: 'ریشه',
    part: 'THE PHYSICS OF SURVIVAL',
    image: '/images/chapters/INTRODUCTION- THE PHYSICS OF SURVIVAL.png',
    video: SHABRANG_VIDEO,
    quote: 'Why did Persia survive when every other ancient civilization died? The answer is not military. It is structural.',
    description: 'Matter & State. Territory, armies, law. The hardware of civilization — necessary, but the most fragile.',
    color: 'crimson',
  },
  {
    level: 2,
    name: 'Rhythm',
    persian: 'ریتم',
    part: 'THE RHYTHM',
    image: '/images/chapters/PART II- THE RHYTHM.png',
    video: SHABRANG_VIDEO,
    quote: 'Culture is not what you think. It is what your body does when you are not thinking.',
    description: 'Body & Habit. The embodied traditions that survive in the bones when banned in the streets.',
    color: 'gold',
  },
  {
    level: 3,
    name: 'Fire',
    persian: 'آتش',
    part: 'THE ALCHEMY',
    image: '/images/chapters/PART III- THE ALCHEMY.png',
    video: SHABRANG_VIDEO,
    quote: 'The alchemists were not trying to turn lead into gold. They were trying to turn the soul into coherence.',
    description: 'Emotion & Ethics. The cultivation of Adab — refined character and the regulation of friction.',
    color: 'teal',
  },
  {
    level: 4,
    name: 'Map',
    persian: 'نقشه',
    part: 'THE IMAGINAL',
    image: '/images/chapters/PART IV- THE IMAGINAL.png',
    video: PART_IV_VIDEO,
    quote: 'Between the world of matter and the world of pure spirit lies a third realm: the Imaginal. It is more real than either.',
    description: 'Logic & System. The cognitive grid that organizes complexity into navigable architecture.',
    color: 'crimson',
  },
  {
    level: 5,
    name: 'Garden',
    persian: 'باغ',
    part: 'THE FORTRESS',
    image: '/images/chapters/PART V- THE FORTRESS.png',
    video: SHABRANG_VIDEO,
    quote: 'The Persian does not build walls to keep enemies out. He builds gardens to keep meaning in.',
    description: 'Symbol & Image. The Rose, the Mirror, the Wine. Meaning compressed into portable images.',
    color: 'gold',
  },
  {
    level: 6,
    name: 'Story',
    persian: 'داستان',
    part: 'THE UNITY',
    image: '/images/chapters/PART VI- THE UNITY.png',
    video: SHABRANG_VIDEO,
    quote: 'The Shahnameh is not a book. It is a living library that survives when libraries burn.',
    description: 'Myth & Narrative. The civilizational operating system encoded in 50,000 verses.',
    color: 'teal',
  },
  {
    level: 7,
    name: 'Sky',
    persian: 'آسمان',
    part: 'THE HORIZON',
    image: '/images/chapters/PART VII- THE HORIZON.png',
    video: SHABRANG_VIDEO,
    quote: 'At the highest level, survival is no longer about preservation. It is about transformation.',
    description: 'Unity & Metaphysics. The ultimate orientation toward the Absolute — the magnetic north.',
    color: 'crimson',
  },
];

const GUARDIANS = [
  { level: 1, icon: '👑', name: 'The King', persian: 'شاه' },
  { level: 2, icon: '🌙', name: 'The Mother', persian: 'مادر' },
  { level: 3, icon: '⚔️', name: 'The Knight', persian: 'پهلوان' },
  { level: 4, icon: '📜', name: 'The Vizier', persian: 'وزیر' },
  { level: 5, icon: '🌹', name: 'The Poet', persian: 'شاعر' },
  { level: 6, icon: '📖', name: 'The Storyteller', persian: 'گوسان' },
  { level: 7, icon: '✨', name: 'The Sage', persian: 'پیر' },
];

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null);
  // Always visible - removed animation to ensure content shows on SSR
  const isInView = true;
  return { ref, isInView };
}

function MuSidebar({ activeLevel }: { activeLevel: number }) {
  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-center gap-1">
      {/* Vertical line */}
      <div className="absolute top-4 bottom-4 left-1/2 w-px bg-gradient-to-b from-shabrang-crimson via-shabrang-gold to-shabrang-teal -translate-x-1/2 -z-10 opacity-60" />

      {MU_LEVELS.slice().reverse().map((m) => (
        <a
          key={m.level}
          href={`#mu-${m.level}`}
          className={`group relative w-12 h-12 flex items-center justify-center transition-all duration-500 ${
            activeLevel === m.level
              ? 'scale-110'
              : 'hover:scale-105'
          }`}
        >
          {/* Outer ring */}
          <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
            activeLevel === m.level
              ? 'border-shabrang-gold bg-shabrang-gold/20 scale-110'
              : 'border-shabrang-teal/50 group-hover:border-shabrang-gold'
          }`} />

          {/* Inner circle */}
          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
            activeLevel === m.level
              ? 'bg-shabrang-gold text-shabrang-ink'
              : 'bg-shabrang-parchment border border-shabrang-teal text-shabrang-teal group-hover:bg-shabrang-teal group-hover:text-shabrang-parchment'
          }`}>
            μ{m.level}
          </div>

          {/* Label on hover */}
          <span className="absolute right-16 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <span className="bg-shabrang-ink/95 text-shabrang-gold px-4 py-2 text-sm font-display uppercase tracking-wider block shadow-lg">
              {m.name}
            </span>
            <span className="font-farsi text-shabrang-parchment text-xs bg-shabrang-teal px-4 py-1 block" dir="rtl">
              {m.persian}
            </span>
          </span>
        </a>
      ))}
    </nav>
  );
}

function HeroSection() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Decorative corner patterns */}
      <div className="absolute top-0 left-0 w-40 h-40 border-l-4 border-t-4 border-shabrang-gold/30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-40 h-40 border-r-4 border-t-4 border-shabrang-gold/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 border-l-4 border-b-4 border-shabrang-gold/30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-40 h-40 border-r-4 border-b-4 border-shabrang-gold/30 pointer-events-none" />

      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          src={`https://www.youtube.com/embed/${SHABRANG_VIDEO}?autoplay=1&mute=1&loop=1&playlist=${SHABRANG_VIDEO}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] min-w-[300%] min-h-[300%] pointer-events-none"
          allow="autoplay"
          style={{ filter: 'brightness(0.3) saturate(0.8)' }}
        />
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-shabrang-ink via-shabrang-ink/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-shabrang-ink via-transparent to-shabrang-ink/50" />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text content */}
        <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="w-12 h-px bg-shabrang-gold" />
            <span className="font-display text-shabrang-gold text-sm uppercase tracking-[0.3em]">
              3,000 Years of Survival
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-shabrang-parchment mb-6 uppercase tracking-wide leading-[1.1]">
            The Liquid
            <span className="block text-shabrang-gold">Fortress</span>
          </h1>

          <p className="font-body text-xl sm:text-2xl text-shabrang-gold/90 italic mb-8 leading-relaxed">
            A Structural History of the Persian Mind
          </p>

          <p className="text-lg text-shabrang-parchment/80 mb-12 leading-relaxed max-w-lg">
            Alexander burned Persepolis. The Arabs conquered. The Mongols slaughtered millions.
            Egypt fell. Babylon fell. Assyria fell.{' '}
            <strong className="text-shabrang-gold font-semibold">But Iran is still here.</strong>
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/book/chapter1.html"
              className="group relative px-8 py-4 bg-shabrang-gold text-shabrang-ink font-display text-sm uppercase tracking-wider overflow-hidden"
            >
              <span className="relative z-10">Read Free Chapters</span>
              <div className="absolute inset-0 bg-shabrang-parchment -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </Link>
            <a
              href="#mu-1"
              className="px-8 py-4 border-2 border-shabrang-parchment/50 text-shabrang-parchment font-display text-sm uppercase tracking-wider hover:border-shabrang-gold hover:text-shabrang-gold transition-all duration-300"
            >
              Explore Seven Floors
            </a>
          </div>
        </div>

        {/* Right: Decorative element */}
        <div className={`relative hidden lg:block transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
          <div className="relative">
            {/* Decorative frame */}
            <div className="absolute -inset-8 border border-shabrang-gold/20" />
            <div className="absolute -inset-4 border border-shabrang-gold/40" />

            {/* Main content box */}
            <div className="bg-shabrang-ink/50 backdrop-blur-sm border-2 border-shabrang-gold p-8">
              <p className="font-farsi text-2xl text-shabrang-gold text-center mb-4" dir="rtl">
                قلعه‌ای که شکست نمی‌خورد
              </p>
              <p className="font-body text-shabrang-parchment/80 text-center italic">
                &ldquo;The fortress that does not fall&rdquo;
              </p>

              <div className="my-8 flex items-center gap-4">
                <span className="flex-1 h-px bg-gradient-to-r from-transparent via-shabrang-gold to-transparent" />
                <span className="text-shabrang-gold text-xl">❖</span>
                <span className="flex-1 h-px bg-gradient-to-r from-transparent via-shabrang-gold to-transparent" />
              </div>

              {/* Seven levels preview */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <div
                    key={n}
                    className="w-8 h-8 rounded-full border border-shabrang-gold/50 flex items-center justify-center text-shabrang-gold/70 font-mono text-xs hover:bg-shabrang-gold hover:text-shabrang-ink transition-all cursor-pointer"
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-shabrang-gold/60 text-sm font-display uppercase tracking-wider">Descend</span>
        <svg className="w-6 h-6 text-shabrang-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

function MuSection({ level, isReversed }: { level: typeof MU_LEVELS[0]; isReversed: boolean }) {
  const { ref, isInView } = useInView(0.15);

  const colorClasses = {
    crimson: 'border-shabrang-crimson bg-shabrang-crimson',
    gold: 'border-shabrang-gold bg-shabrang-gold',
    teal: 'border-shabrang-teal bg-shabrang-teal',
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={`mu-${level.level}`}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, var(--shabrang-teal) 0, var(--shabrang-teal) 1px, transparent 0, transparent 50%)`,
        backgroundSize: '20px 20px'
      }} />

      <div className="max-w-7xl mx-auto px-8">
        {/* Section header */}
        <div className={`flex items-center gap-6 mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className={`w-20 h-20 rounded-full ${colorClasses[level.color as keyof typeof colorClasses]} flex items-center justify-center shadow-lg`}>
            <span className="font-mono text-2xl font-bold text-shabrang-parchment">μ{level.level}</span>
          </div>
          <div>
            <h2 className="font-display text-4xl sm:text-5xl text-shabrang-ink uppercase tracking-wide">
              {level.name}
            </h2>
            <p className="font-farsi text-xl text-shabrang-teal mt-1" dir="rtl">{level.persian}</p>
          </div>
          <span className="hidden sm:block flex-1 h-px bg-gradient-to-r from-shabrang-gold/50 to-transparent ml-4" />
          <span className="hidden sm:block font-display text-sm text-shabrang-crimson uppercase tracking-widest">
            Part {level.level}
          </span>
        </div>

        {/* Content grid */}
        <div className={`grid lg:grid-cols-12 gap-8 lg:gap-12 items-start ${isReversed ? 'lg:grid-flow-dense' : ''}`}>
          {/* Image column */}
          <div className={`lg:col-span-5 ${isReversed ? 'lg:col-start-8' : ''} transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-x-0' : isReversed ? 'opacity-0 translate-x-12' : 'opacity-0 -translate-x-12'}`}>
            <div className="relative group">
              {/* Decorative offset frame */}
              <div className={`absolute -top-4 ${isReversed ? '-right-4' : '-left-4'} w-full h-full border-2 ${colorClasses[level.color as keyof typeof colorClasses].replace('bg-', 'border-')} opacity-30 group-hover:opacity-60 transition-opacity`} />

              {/* Main image */}
              <div className="relative border-4 border-shabrang-ink shadow-2xl overflow-hidden">
                <Image
                  src={level.image}
                  alt={level.part}
                  width={600}
                  height={450}
                  className="w-full transform group-hover:scale-105 transition-transform duration-700"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-shabrang-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>

          {/* Content column */}
          <div className={`lg:col-span-7 ${isReversed ? 'lg:col-start-1' : ''} transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-x-0' : isReversed ? 'opacity-0 -translate-x-12' : 'opacity-0 translate-x-12'}`}>
            {/* Part title */}
            <p className="font-display text-sm text-shabrang-gold uppercase tracking-[0.2em] mb-6">
              {level.part}
            </p>

            {/* Quote */}
            <blockquote className="relative mb-10">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-shabrang-gold via-shabrang-gold to-transparent" />
              <p className="text-2xl sm:text-3xl text-shabrang-teal-dark font-body italic leading-relaxed pl-6">
                &ldquo;{level.quote}&rdquo;
              </p>
              <cite className="block mt-4 pl-6 text-shabrang-crimson font-display text-sm uppercase tracking-wider not-italic">
                — The Liquid Fortress
              </cite>
            </blockquote>

            {/* Description */}
            <p className="text-lg text-shabrang-ink-dim leading-relaxed mb-10 max-w-xl">
              {level.description}
            </p>

            {/* Video embed */}
            <div className="relative group">
              <div className="absolute -inset-2 border border-shabrang-teal/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="aspect-video border-2 border-shabrang-teal overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${level.video}`}
                  title={level.part}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="mt-24 flex items-center justify-center gap-6">
        <span className="w-24 h-px bg-gradient-to-r from-transparent to-shabrang-gold/50" />
        <span className="text-shabrang-gold text-lg">❖</span>
        <span className="w-24 h-px bg-gradient-to-l from-transparent to-shabrang-gold/50" />
      </div>
    </section>
  );
}

function GuardiansSection() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24 bg-shabrang-teal-dark relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-shabrang-gold to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-shabrang-gold to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-display text-shabrang-gold text-sm uppercase tracking-[0.3em] mb-4">
            The Archetypes
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-shabrang-parchment mb-6">
            The Seven Guardians
          </h2>
          <p className="text-lg text-shabrang-parchment/70 max-w-2xl mx-auto">
            The archetypes who guard the Seven Floors of the Liquid Fortress
          </p>
        </div>

        {/* Guardian grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-6">
          {GUARDIANS.map((g, idx) => (
            <Link
              key={g.level}
              href="/book/appendix-b.html"
              className={`group relative bg-shabrang-parchment p-6 text-center transition-all duration-500 hover:-translate-y-3 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {/* Level badge */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-shabrang-teal text-shabrang-parchment px-3 py-1 text-xs font-mono font-bold shadow-md">
                μ{g.level}
              </span>

              {/* Icon */}
              <span className="text-4xl block mb-3 transform group-hover:scale-110 transition-transform">
                {g.icon}
              </span>

              {/* Name */}
              <h4 className="font-display text-sm text-shabrang-ink uppercase tracking-wide mb-2">
                {g.name}
              </h4>

              {/* Persian name */}
              <p className="font-farsi text-shabrang-crimson text-lg" dir="rtl">
                {g.persian}
              </p>

              {/* Hover border effect */}
              <div className="absolute inset-0 border-3 border-transparent group-hover:border-shabrang-gold transition-colors pointer-events-none" />

              {/* Shadow on hover */}
              <div className="absolute inset-0 shadow-none group-hover:shadow-[8px_8px_0_var(--shabrang-gold)] transition-shadow" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24 bg-shabrang-crimson relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-shabrang-gold via-shabrang-parchment to-shabrang-gold" />
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
        <div className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-display text-shabrang-parchment/70 text-sm uppercase tracking-[0.3em] mb-6">
            Begin the Journey
          </p>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-shabrang-parchment mb-8">
            Enter the Fortress
          </h2>

          <blockquote className="mb-12">
            <p className="text-xl sm:text-2xl text-shabrang-parchment/90 italic font-body leading-relaxed">
              &ldquo;Survival is not about building higher walls.<br />
              It is about building deeper meaning.&rdquo;
            </p>
          </blockquote>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book/chapter1.html"
              className="group relative px-10 py-5 bg-shabrang-gold text-shabrang-ink font-display text-sm uppercase tracking-wider overflow-hidden"
            >
              <span className="relative z-10">Start Reading Free</span>
              <div className="absolute inset-0 bg-shabrang-parchment -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </Link>
            <a
              href="https://www.amazon.com/LIQUID-FORTRESS-Structural-History-Persian-ebook/dp/B0GBJ47F5X"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 border-2 border-shabrang-gold text-shabrang-gold font-display text-sm uppercase tracking-wider hover:bg-shabrang-gold hover:text-shabrang-ink transition-all duration-300"
            >
              Get the Book
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ShabrangHome({ lang }: { lang: string }) {
  const [activeLevel, setActiveLevel] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = MU_LEVELS.map(m => document.getElementById(`mu-${m.level}`));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveLevel(MU_LEVELS[i].level);
          return;
        }
      }
      setActiveLevel(0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-shabrang-parchment">
      <MuSidebar activeLevel={activeLevel} />
      <HeroSection />

      {MU_LEVELS.map((m, idx) => (
        <MuSection key={m.level} level={m} isReversed={idx % 2 === 1} />
      ))}

      <GuardiansSection />
      <CtaSection />
    </main>
  );
}
