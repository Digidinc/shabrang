import Link from 'next/link';
import type { Metadata } from 'next';
import { getArticles, getLanguages, getStaticPageAlternates, matchesPerspectiveView } from '@/lib/content';
import { ArticlesSidebar } from '@/components/ArticlesSidebar';
import { getLangBasePath } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const alternates = getStaticPageAlternates('articles');
  return {
    title: 'Articles',
    description: 'Long-form writing and essays in Shabrang.',
    alternates: {
      canonical: alternates[lang] || alternates.en,
      languages: alternates,
    },
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

export default async function ArticlesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const basePath = getLangBasePath(lang);
  const articles = getArticles(lang).filter((a) => matchesPerspectiveView(a.frontmatter.perspective, 'kasra'));

  return (
    <main className="shabrang-page">
      <div className="shabrang-container">
        <div className="shabrang-layout">
          <ArticlesSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
          <ArticlesSidebar lang={lang} basePath={basePath} view="kasra" />
          <div className="shabrang-content-full">
            <div className="max-w-4xl mx-auto px-6 py-12">
              <header className="mb-12">
                <h1 className="text-3xl font-light text-frc-gold mb-3">Articles</h1>
                <p className="text-frc-text-dim">
                  Longer-form writing, essays, and primers.
                </p>
              </header>

              {articles.length === 0 ? (
                <div className="text-frc-text-dim text-sm border border-frc-blue rounded-lg p-6">
                  No articles published yet.
                </div>
              ) : (
                <ul className="space-y-4">
                  {articles.map((a) => (
                    <li key={a.frontmatter.id}>
                      <Link href={`${basePath}/articles/${a.frontmatter.id}`} className="card block p-6 group">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h2 className="text-frc-text group-hover:text-frc-gold transition-colors font-medium">
                              {a.frontmatter.title}
                            </h2>
                            {a.frontmatter.abstract && (
                              <p className="text-sm text-frc-text-dim mt-2 leading-relaxed line-clamp-3">
                                {a.frontmatter.abstract}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            {a.frontmatter.date ? (
                              <div className="text-xs text-frc-steel">{a.frontmatter.date}</div>
                            ) : null}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

