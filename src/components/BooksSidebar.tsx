import Link from 'next/link';
import { getBooks, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import type { DerivedChapterMeta } from '@/lib/bookChapters';

interface BooksSidebarProps {
  lang: string;
  currentId?: string;
  chapters?: DerivedChapterMeta[];
  activeChapterSlug?: string;
  basePath?: string;
  view?: PerspectiveView;
  variant?: 'desktop' | 'mobile';
}

export function BooksSidebar({ lang, currentId, chapters, activeChapterSlug, basePath, view, variant = 'desktop' }: BooksSidebarProps) {
  const books = getBooks(lang)
    .filter((b) => (view ? matchesPerspectiveView(b.frontmatter.perspective, view) : true))
    .sort((a, b) => (a.frontmatter.title || '').localeCompare(b.frontmatter.title || ''));

  const base = basePath || `/${lang}`;
  const isMobile = variant === 'mobile';
  const bookPath = currentId ? `${base}/books/${currentId}` : '';
  const showChapters = Boolean(
    currentId &&
    chapters &&
    chapters.length > 0 &&
    !(chapters.length === 1 && chapters[0]?.slug === 'full')
  );

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
            <span className="text-xs uppercase tracking-wider text-shabrang-ink-dim">Browse chapters</span>
          </summary>
        )}
        <nav className={isMobile ? 'py-3 px-4 text-sm' : 'py-6 px-4 text-sm sticky top-0'}>
          {/* Books list - only show if not viewing a specific book */}
          {!currentId && (
            <div className="mb-4">
              <h3 className="text-xs uppercase tracking-wider text-shabrang-ink-dim mb-3 px-2">Books</h3>
              <ul className="space-y-0.5 max-h-[70vh] overflow-y-auto pr-1">
                {books.map((book) => (
                  <li key={book.frontmatter.id}>
                    <Link
                      href={`${base}/books/${book.frontmatter.id}`}
                      className="block px-2 py-1.5 rounded transition-colors text-shabrang-ink-dim hover:text-shabrang-ink hover:bg-shabrang-teal/10"
                      title={book.frontmatter.title}
                    >
                      {book.frontmatter.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Chapters - show when viewing a book */}
          {showChapters && (
            <div>
              <Link
                href={bookPath}
                className="block px-2 py-1 mb-3 text-xs uppercase tracking-wider text-shabrang-gold hover:text-shabrang-crimson transition-colors"
              >
                ← Back to Index
              </Link>
              <h3 className="text-xs uppercase tracking-wider text-shabrang-ink-dim mb-3 px-2">Chapters</h3>
              <ul className="space-y-0.5 max-h-[60vh] overflow-y-auto pr-1">
                {chapters?.map((c, idx) => (
                  <li key={c.anchorId}>
                    <Link
                      href={`${bookPath}/chapter/${c.slug}`}
                      className={`block px-2 py-1.5 rounded transition-colors ${activeChapterSlug === c.slug
                          ? 'text-shabrang-gold bg-shabrang-teal/20 border-l-2 border-shabrang-gold'
                          : 'text-shabrang-ink-dim hover:text-shabrang-ink hover:bg-shabrang-teal/10'
                        }`}
                      title={c.title}
                    >
                      <span className="text-[10px] text-shabrang-gold font-mono mr-2">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="whitespace-normal">{c.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick links */}
          <div className="mt-6 pt-4 border-t border-shabrang-teal/20">
            <Link href={`${base}/art`} className="block px-2 py-1 text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
              Art Gallery
            </Link>
            <Link href={`${base}/topics`} className="block px-2 py-1 text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
              Topics
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
