'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';

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

function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-shabrang-ink">
      {/* Full-screen YouTube video - the video has its own title */}
      <div className="absolute inset-0">
        <iframe
          src={`https://www.youtube.com/embed/${SHABRANG_VIDEO}?autoplay=1&mute=1&loop=1&playlist=${SHABRANG_VIDEO}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] h-[180vh] min-w-[180vw] min-h-[180vh]"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="The Liquid Fortress"
        />
      </div>

      {/* Subtle scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 animate-bounce">
        <span className="text-shabrang-gold/80 text-base font-display uppercase tracking-[0.2em]">Scroll</span>
        <svg className="w-8 h-8 text-shabrang-gold/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      <div className="max-w-3xl mx-auto px-6 lg:px-12">
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

        {/* Full-width image */}
        <div className={`mb-12 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative group">
            {/* Main image - full width */}
            <div className="relative border-4 border-shabrang-ink shadow-2xl overflow-hidden">
              <Image
                src={level.image}
                alt={level.part}
                width={900}
                height={600}
                className="w-full transform group-hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
          <p className="text-lg text-shabrang-ink-dim leading-relaxed mb-10">
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
  return (
    <main className="min-h-screen bg-shabrang-parchment">
      <HeroSection />

      {MU_LEVELS.map((m, idx) => (
        <MuSection key={m.level} level={m} isReversed={idx % 2 === 1} />
      ))}

      <GuardiansSection />
      <CtaSection />
    </main>
  );
}
