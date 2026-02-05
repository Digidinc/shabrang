import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaScript } from '@/components/SchemaScript';
import { PageShell } from '@/components/PageShell';
import { getLanguages, getStaticPageAlternates } from '@/lib/content';
import { schemaFAQ, type FAQItem } from '@/lib/schema';
import { getLangBasePath } from '@/lib/site';

function getCopy(lang: string) {
  const isFA = lang === 'fa';

  if (isFA) {
    const faqs: FAQItem[] = [
      {
        question: 'شبرنگ چیست؟',
        answer:
          'شبرنگ یک پروژهٔ هنری-فلسفی است که تلاش می‌کند «حکمت ایرانی» را به شکل یک گفت‌وگوی زنده نشان دهد: از فرهنگ روزمره تا اسطوره، از ساختار تا معنا.',
      },
      {
        question: '«دژِ سیال» چیست؟',
        answer:
          '«دژِ سیال» (The Liquid Fortress) کتابِ شبرنگ است: ۳۰ فصلِ مصور دربارهٔ این‌که ایران چگونه در طول ۳۰۰۰ سالِ سقوط و هجوم، معنای خود را حفظ کرده است.',
      },
      {
        question: 'از کجا شروع کنم؟',
        answer:
          'اگر ۵ دقیقه وقت دارید: این صفحه را بخوانید و سپس «مطالعهٔ ضروری» را ببینید. اگر ۱ ساعت وقت دارید: چند پستِ شروع + چند فصلِ رایگانِ کتاب را بخوانید.',
      },
      {
        question: 'این سایت چه زبان‌هایی دارد؟',
        answer:
          'انگلیسی و فارسی. برخی بخش‌ها ممکن است هنوز در حال ترجمه باشند.',
      },
      {
        question: 'چطور می‌توانم در گفت‌وگو شرکت کنم؟',
        answer:
          'روی هر صفحه می‌توانید «Add Your Voice» را بزنید و نظر خود را در GitHub Discussions ثبت کنید.',
      },
    ];

    return {
      title: 'شروع کنید: شبرنگ چیست؟',
      description:
        'نقشهٔ ورود به شبرنگ: دژِ سیال چیست، برای چه کسی است، و بهترین مسیرِ مطالعه برای شروع.',
      eyebrow: 'نقشهٔ ورود',
      headline: 'شروع کنید: شبرنگ چیست؟',
      subhead:
        'شبرنگ یک گفت‌وگوی زنده دربارهٔ «معماریِ بقا»ست: هنر + فلسفه + روحِ ایران، از آدابِ روزمره تا اسطوره و ساختار.',
      oneLinerTitle: 'در یک جمله',
      oneLiner:
        'شبرنگ تلاش می‌کند نشان دهد ایران چگونه معنای خود را «سیال» نگه داشت تا با هر سقوط، دوباره بازسازی شود.',
      pathsTitle: 'مسیرِ پیشنهادی',
      paths: [
        {
          title: 'کتاب را از فصل‌های رایگان شروع کنید',
          desc: '۵ فصل اول رایگان است. اگر دنبال یک روایتِ پیوسته هستید، این بهترین نقطهٔ شروع است.',
          href: '/books/liquid-fortress',
          cta: 'شروع مطالعهٔ رایگان',
        },
        {
          title: 'مطالعهٔ ضروری (پست‌های کوتاه‌تر)',
          desc: 'هستهٔ ایده‌ها با مثال‌های ملموس از فرهنگِ ایرانی.',
          href: '/blog',
          cta: 'دیدن پست‌ها',
        },
        {
          title: 'موضوعات (مرور بر اساس سؤال)',
          desc: 'اگر با یک سؤال خاص آمده‌اید، از این‌جا وارد شوید.',
          href: '/topics',
          cta: 'مرور موضوعات',
        },
      ],
      themesTitle: 'پنج دروازهٔ سریع',
      themes: [
        { title: 'آداب و امنیت اجتماعی', href: '/blog/adab-social-handshake' },
        { title: 'تعارف به‌مثابهٔ نظریهٔ بازی', href: '/blog/taarof-game-theory' },
        { title: 'قنات و شبکهٔ غیرمتمرکز', href: '/blog/qanats-decentralized-grid' },
        { title: 'شاهنامه به‌عنوان حافظهٔ تمدنی', href: '/blog/shahnameh-civilizational-hard-drive' },
        { title: 'سیمرغ و هوشِ جمعی', href: '/blog/simurgh-swarm-intelligence' },
      ],
      faqTitle: 'سوالات پرتکرار',
      faqs,
    };
  }

  const faqs: FAQItem[] = [
    {
      question: 'What is Shabrang?',
      answer:
        'Shabrang is an art + philosophy project that explores Persian wisdom through a living dialectic—moving between structure and meaning, everyday culture and myth.',
    },
    {
      question: 'What is The Liquid Fortress?',
      answer:
        'The Liquid Fortress is Shabrang’s illustrated book: 30 chapters on how Persian culture preserved meaning through 3,000 years of invasion, collapse, and renewal.',
    },
    {
      question: 'Where should I start?',
      answer:
        'If you have 5 minutes: read this page, then skim Essential Reading. If you have 1 hour: read a few starter posts, then the free chapters of the book.',
    },
    {
      question: 'Is Shabrang available in multiple languages?',
      answer:
        'Yes—English and Farsi. Some sections may still be in translation.',
    },
    {
      question: 'How do I join the conversation?',
      answer:
        'On most pages you can click “Add Your Voice” to leave a comment via GitHub Discussions.',
    },
  ];

  return {
    title: 'Start Here: What is Shabrang?',
    description:
      'A clear entry point to Shabrang: what it is, who it’s for, and the best reading path to begin with The Liquid Fortress.',
    eyebrow: 'Start Here',
    headline: 'Start Here: What is Shabrang?',
    subhead:
      'Shabrang is a living dialectic about survival architecture: art + philosophy + the Persian spirit, from everyday protocol to myth and structure.',
    oneLinerTitle: 'In one sentence',
    oneLiner:
      'Shabrang explores how Persian culture kept meaning “liquid” enough to survive collapse—so identity could rebuild, again and again.',
    pathsTitle: 'Choose a path',
    paths: [
      {
        title: 'Read the book (free chapters)',
        desc: 'The first chapters are free. Best if you want the full narrative arc.',
        href: '/books/liquid-fortress',
        cta: 'Start Reading Free',
      },
      {
        title: 'Essential Reading (shorter posts)',
        desc: 'Core ideas explained through everyday Persian cultural artifacts.',
        href: '/blog',
        cta: 'Browse Posts',
      },
      {
        title: 'Browse by question (Topics)',
        desc: 'If you arrived with a specific question, start from a topic hub.',
        href: '/topics',
        cta: 'Explore Topics',
      },
    ],
    themesTitle: 'Five fast entry points',
    themes: [
      { title: 'Adab as social security', href: '/blog/adab-social-handshake' },
      { title: 'Taarof as game theory', href: '/blog/taarof-game-theory' },
      { title: 'Qanats as decentralized infrastructure', href: '/blog/qanats-decentralized-grid' },
      { title: 'Shahnameh as civilizational memory', href: '/blog/shahnameh-civilizational-hard-drive' },
      { title: 'Simurgh as swarm intelligence', href: '/blog/simurgh-swarm-intelligence' },
    ],
    faqTitle: 'FAQ',
    faqs,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const alternates = getStaticPageAlternates('start');
  const copy = getCopy(lang);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: alternates[lang] || alternates.en,
      languages: alternates,
    },
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

export default async function StartHerePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const basePath = getLangBasePath(lang);
  const copy = getCopy(lang);

  const faqSchema = schemaFAQ(copy.faqs.map((f) => ({ question: f.question, answer: f.answer })));

  return (
    <>
      <SchemaScript data={faqSchema} />
      <PageShell withReadingMode={false} articleClassName="shabrang-content-full">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="mb-10">
            <p className="font-display text-xs uppercase tracking-[0.35em] text-shabrang-teal mb-4">
              {copy.eyebrow}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-shabrang-gold uppercase tracking-widest leading-[1.1]">
              {copy.headline}
            </h1>
            <p className="mt-6 text-shabrang-parchment/80 text-lg leading-relaxed max-w-3xl">
              {copy.subhead}
            </p>
          </div>

          <div className="border-2 border-shabrang-gold bg-shabrang-parchment-dark/10 p-8 sm:p-10 mb-12">
            <h2 className="font-display text-xl text-shabrang-gold uppercase tracking-widest mb-4">
              {copy.oneLinerTitle}
            </h2>
            <p className="text-shabrang-parchment/85 leading-relaxed text-base sm:text-lg">
              {copy.oneLiner}
            </p>
          </div>

          <div className="mb-14">
            <h2 className="font-display text-2xl text-shabrang-gold uppercase tracking-widest mb-6">
              {copy.pathsTitle}
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {copy.paths.map((p) => (
                <div
                  key={p.href}
                  className="border border-shabrang-teal/40 bg-shabrang-parchment-dark/5 p-6 hover:border-shabrang-gold transition-colors"
                >
                  <h3 className="font-display text-sm uppercase tracking-widest text-shabrang-parchment mb-3">
                    {p.title}
                  </h3>
                  <p className="text-shabrang-parchment/75 text-sm leading-relaxed mb-5">
                    {p.desc}
                  </p>
                  <Link
                    href={`${basePath}${p.href}`}
                    className="inline-block px-5 py-3 bg-shabrang-gold text-shabrang-ink font-display text-xs uppercase tracking-widest hover:bg-shabrang-parchment transition-all"
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-14">
            <h2 className="font-display text-2xl text-shabrang-gold uppercase tracking-widest mb-6">
              {copy.themesTitle}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {copy.themes.map((t) => (
                <Link
                  key={t.href}
                  href={`${basePath}${t.href}`}
                  className="border border-shabrang-teal/30 bg-shabrang-parchment-dark/5 px-5 py-4 hover:border-shabrang-gold transition-colors"
                >
                  <span className="text-shabrang-parchment/85 text-sm leading-relaxed">
                    {t.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-shabrang-teal/30 pt-12">
            <h2 className="font-display text-2xl text-shabrang-gold uppercase tracking-widest mb-6">
              {copy.faqTitle}
            </h2>
            <div className="space-y-6">
              {copy.faqs.map((f) => (
                <div key={f.question} className="border border-shabrang-teal/25 bg-shabrang-parchment-dark/5 p-6">
                  <h3 className="font-display text-sm uppercase tracking-widest text-shabrang-parchment mb-3">
                    {f.question}
                  </h3>
                  <p className="text-shabrang-parchment/75 text-sm leading-relaxed">
                    {f.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={`${basePath}/books/liquid-fortress`}
                className="inline-block px-6 py-3 border-2 border-shabrang-gold text-shabrang-gold font-display text-xs uppercase tracking-widest hover:bg-shabrang-gold hover:text-shabrang-ink transition-all"
              >
                {lang === 'fa' ? 'شروع مطالعهٔ کتاب' : 'Start the Book'}
              </Link>
              <Link
                href={`${basePath}/blog`}
                className="inline-block px-6 py-3 border border-shabrang-teal text-shabrang-parchment/80 font-display text-xs uppercase tracking-widest hover:border-shabrang-gold transition-all"
              >
                {lang === 'fa' ? 'مطالعهٔ ضروری' : 'Essential Reading'}
              </Link>
              <Link
                href={`${basePath}/about`}
                className="inline-block px-6 py-3 border border-shabrang-teal text-shabrang-parchment/80 font-display text-xs uppercase tracking-widest hover:border-shabrang-gold transition-all"
              >
                {lang === 'fa' ? 'دربارهٔ شبرنگ' : 'About Shabrang'}
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
}

