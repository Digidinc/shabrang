import { getTopics, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import { TopicsGridClient, type TopicsGridItem } from '@/components/pages/TopicsGridClient';

export function TopicsIndex({
  lang,
  basePath,
  view,
  embedded = false,
}: {
  lang: string;
  basePath: string;
  view: PerspectiveView;
  embedded?: boolean;
}) {
  const topics = getTopics(lang)
    .filter((t) => matchesPerspectiveView(t.frontmatter.perspective, view))
    .sort((a, b) => (b.frontmatter.date || '').localeCompare(a.frontmatter.date || ''));

  const items: TopicsGridItem[] = topics.map((t) => {
    const fm = t.frontmatter;
    const answersCount = Array.isArray(fm.answers) ? fm.answers.length : undefined;
    return {
      id: fm.id,
      title: fm.title,
      question: fm.question,
      shortAnswer: fm.short_answer,
      abstract: fm.abstract,
      date: fm.date,
      href: `${basePath}/topics/${fm.id}`,
      tags: fm.tags || [],
      answersCount,
    };
  });

  const content = (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <header className="mb-12 text-center">
        <div className="inline-block px-4 py-1.5 border-2 border-shabrang-gold text-shabrang-gold text-[10px] uppercase tracking-[0.3em] mb-8">
          Knowledge Garden
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-shabrang-ink mb-6 uppercase tracking-wider">
          Topics
        </h1>
        <p className="text-shabrang-ink-dim text-lg max-w-2xl mx-auto leading-relaxed italic">
          Questions, summaries, and spectrum views: authority citations, Shabrang answers, and multiple perspectives.
        </p>
      </header>

      {topics.length === 0 ? (
        <section className="border-2 border-shabrang-teal/30 p-8 text-center text-shabrang-ink-dim">
          No topics yet.
        </section>
      ) : (
        <TopicsGridClient items={items} />
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
