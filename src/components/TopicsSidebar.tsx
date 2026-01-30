import Link from 'next/link';
import { getTopics, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

interface TopicsSidebarProps {
  lang: string;
  currentId?: string;
  basePath?: string;
  view?: PerspectiveView;
  variant?: 'desktop' | 'mobile';
}

export function TopicsSidebar({ lang, currentId, basePath, view, variant = 'desktop' }: TopicsSidebarProps) {
  const topics = getTopics(lang)
    .filter((t) => (view ? matchesPerspectiveView(t.frontmatter.perspective, view) : true))
    .sort((a, b) => (a.frontmatter.title || '').localeCompare(b.frontmatter.title || ''));

  // Group by mu-level
  const levels = ['mu1', 'mu2', 'mu3', 'mu4', 'mu5', 'mu6', 'mu7', 'general'];
  const grouped = topics.reduce((acc, t) => {
    const fm = t.frontmatter as unknown as Record<string, unknown>;
    const level = (fm.level as string) || 'general';
    if (!acc[level]) acc[level] = [];
    acc[level].push(t);
    return acc;
  }, {} as Record<string, typeof topics>);

  const levelLabels: Record<string, string> = {
    mu1: 'μ1 Roots',
    mu2: 'μ2 Rhythm',
    mu3: 'μ3 Fire',
    mu4: 'μ4 Map',
    mu5: 'μ5 Garden',
    mu6: 'μ6 Story',
    mu7: 'μ7 Sky',
    general: 'Foundations',
  };

  const base = basePath || `/${lang}`;
  const isMobile = variant === 'mobile';

  return (
    <aside
      data-sidebar
      className={
        isMobile
          ? 'w-full border-b border-shabrang-teal/30 block lg:hidden'
          : 'w-60 xl:w-72 shrink-0 border-r border-shabrang-teal/30 hidden lg:block'
      }
    >
      <details open={!isMobile}>
        {isMobile && (
          <summary className="px-4 py-3 text-sm text-shabrang-ink cursor-pointer select-none">
            <span className="text-xs uppercase tracking-wider text-shabrang-ink-dim">Browse topics</span>
          </summary>
        )}
        <nav className={isMobile ? 'py-3 px-4 text-sm' : 'py-6 px-4 text-sm sticky top-0'}>
          {levels.map((level) => {
            const items = grouped[level];
            if (!items || items.length === 0) return null;

            return (
              <div key={level} className="mb-6">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-shabrang-gold/60 mb-2 px-2 border-b border-shabrang-gold/10 pb-1">
                  {levelLabels[level]}
                </h3>
                <ul className="space-y-0.5">
                  {items.map((t) => (
                    <li key={t.frontmatter.id}>
                      <Link
                        href={`${base}/topics/${t.frontmatter.id}`}
                        className={`block px-2 py-1 rounded transition-colors truncate ${
                          currentId === t.frontmatter.id
                            ? 'text-shabrang-gold bg-shabrang-teal/20 border-l-2 border-shabrang-gold'
                            : 'text-shabrang-ink-dim hover:text-shabrang-ink hover:bg-shabrang-teal/10'
                        }`}
                        title={t.frontmatter.title}
                      >
                        {t.frontmatter.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="mt-6 pt-4 border-t border-shabrang-teal/20">
            <Link href={`${base}/books`} className="block px-2 py-1 text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
              Books
            </Link>
            <Link href={`${base}/art`} className="block px-2 py-1 text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
              Art Gallery
            </Link>
            <Link href={`${base}/blog`} className="block px-2 py-1 text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
              Blog
            </Link>
          </div>
        </nav>
      </details>
    </aside>
  );
}
